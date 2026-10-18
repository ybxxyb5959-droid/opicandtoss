// 말문 AI 중계 서버 — Google Gemini를 내 키 하나로 호출하고, 하루 사용 횟수를 KV로 센다.
// 엔드포인트
//   GET  /quota                 오늘 남은 횟수
//   POST /coach                 답변 첨삭 (등급·교정·업그레이드 답변·팁)
//   POST /followup              꼬리 질문 1개
//   POST /draft                 내 이야기로 답변 초안
//   POST /diagnose              레벨테스트 3문항 종합 진단
// 요청 공통: { deviceId, inviteCode? }  응답 공통: { ..., remainingToday }
// 모델: MODELS 순서대로 시도(429/5xx면 다음). 모두 실패하면 { error } 로 알려 앱이 내장 코치로 전환한다.

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const MAX_TRANSCRIPT = 4000;

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin, env);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (!cors['Access-Control-Allow-Origin']) return json({ error: 'origin_not_allowed' }, 403, cors);

    const url = new URL(request.url);
    try {
      if (request.method === 'GET' && url.pathname === '/quota') {
        const who = identify({ deviceId: url.searchParams.get('deviceId'), inviteCode: url.searchParams.get('inviteCode') }, env);
        const used = await getUsed(env, who);
        return json({ remainingToday: Math.max(0, who.limit - used), limit: who.limit, member: who.member }, 200, cors);
      }
      if (request.method !== 'POST') return json({ error: 'not_found' }, 404, cors);

      const body = await request.json().catch(() => null);
      if (!body) return json({ error: 'bad_json' }, 400, cors);
      const who = identify(body, env);
      const used = await getUsed(env, who);
      if (used >= who.limit) {
        return json({ error: 'quota_exceeded', remainingToday: 0, limit: who.limit, member: who.member }, 429, cors);
      }

      let task;
      if (url.pathname === '/coach') task = buildCoach(body);
      else if (url.pathname === '/followup') task = buildFollowup(body);
      else if (url.pathname === '/draft') task = buildDraft(body);
      else if (url.pathname === '/diagnose') task = buildDiagnose(body);
      else return json({ error: 'not_found' }, 404, cors);
      if (task.error) return json({ error: task.error }, 400, cors);

      const result = await callGemini(env, task);
      if (result.error) return json({ error: result.error, detail: result.detail }, 502, cors);

      const remaining = Math.max(0, who.limit - (await bumpUsed(env, who)));
      return json(Object.assign({}, result.data, { remainingToday: remaining, model: result.model }), 200, cors);
    } catch (e) {
      return json({ error: 'server_error', detail: String(e && e.message || e) }, 500, cors);
    }
  }
};

/* ---------------- CORS ---------------- */
function corsHeaders(origin, env) {
  const allowed = String(env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  const ok = allowed.includes(origin);
  const h = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
  if (ok) h['Access-Control-Allow-Origin'] = origin;
  return h;
}

function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: Object.assign({ 'Content-Type': 'application/json; charset=utf-8' }, headers)
  });
}

/* ---------------- 사용자 식별 & 한도 ---------------- */
function identify(body, env) {
  const codes = String(env.INVITE_CODES || '').split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
  const code = String(body.inviteCode || '').trim().toUpperCase();
  const member = !!code && codes.includes(code);
  const deviceId = String(body.deviceId || 'anon').slice(0, 64).replace(/[^a-zA-Z0-9_-]/g, '');
  return {
    member,
    key: member ? `code:${code}` : `dev:${deviceId}`,
    limit: member ? Number(env.MEMBER_DAILY_LIMIT || 50) : Number(env.GUEST_DAILY_LIMIT || 3)
  };
}

// 한국 시간 기준 날짜 (사용자 체감에 맞춤)
function kstDate() {
  const d = new Date(Date.now() + 9 * 3600 * 1000);
  return d.toISOString().slice(0, 10);
}

async function getUsed(env, who) {
  if (!env.QUOTA) return 0;
  const v = await env.QUOTA.get(`q:${kstDate()}:${who.key}`);
  return v ? Number(v) || 0 : 0;
}

async function bumpUsed(env, who) {
  if (!env.QUOTA) return 0;
  const k = `q:${kstDate()}:${who.key}`;
  const used = (await getUsed(env, who)) + 1;
  await env.QUOTA.put(k, String(used), { expirationTtl: 60 * 60 * 48 });
  return used;
}

/* ---------------- Gemini 호출 ---------------- */
async function callGemini(env, task) {
  if (!env.GEMINI_API_KEY) return { error: 'no_api_key' };
  const models = String(env.MODELS || 'gemini-3.5-flash-lite,gemini-3.1-flash-lite').split(',').map(s => s.trim()).filter(Boolean);
  let lastDetail = '';
  for (const model of models) {
    try {
      const res = await fetch(`${GEMINI_BASE}/${model}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: task.system }] },
          contents: [{ role: 'user', parts: [{ text: task.user }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 1400,
            responseMimeType: 'application/json',
            responseSchema: task.schema
          }
        })
      });
      if (res.status === 429 || res.status >= 500) {
        lastDetail = `${model}: HTTP ${res.status}`;
        continue; // 다음 모델로
      }
      if (!res.ok) {
        const t = await res.text();
        return { error: 'gemini_error', detail: `${model}: HTTP ${res.status} ${t.slice(0, 200)}` };
      }
      const data = await res.json();
      const text = (((data.candidates || [])[0] || {}).content || {}).parts?.map(p => p.text || '').join('') || '';
      let parsed;
      try { parsed = JSON.parse(text); } catch (_) {
        lastDetail = `${model}: bad_json`;
        continue;
      }
      return { data: parsed, model };
    } catch (e) {
      lastDetail = `${model}: ${String(e && e.message || e)}`;
    }
  }
  return { error: 'all_models_failed', detail: lastDetail };
}

/* ---------------- 작업별 프롬프트 & 스키마 ---------------- */
const GRADE_ENUM = ['IL', 'IM1', 'IM2', 'IM3', 'IH', 'AL'];
const RUBRIC = `You are a certified OPIc (ACTFL) rater and a friendly Korean English speaking coach.
OPIc levels: IL < IM1 < IM2 < IM3 < IH < AL.
Rate by: task completion, sentence structure/grammar accuracy, vocabulary range, fluency/length, connectors and discourse, and (for past-experience prompts) correct past tense.
Rough length guide for one answer: IM2 ~45+ words, IM3 ~70+ words with connectors, IH ~95+ words with past tense and emotions, AL 120+ words with native-like fillers and complex sentences.
The transcript comes from speech recognition, so ignore missing punctuation and capitalization; judge grammar and content only.
Write all Korean text (fields ending in Ko) in warm, simple Korean (해요체), short sentences, no jargon.`;

function clean(s, max) { return String(s || '').replace(/\s+/g, ' ').trim().slice(0, max); }

function buildCoach(b) {
  const transcript = clean(b.transcript, MAX_TRANSCRIPT);
  if (transcript.split(' ').length < 3) return { error: 'transcript_too_short' };
  const target = GRADE_ENUM.includes(b.targetGrade) ? b.targetGrade : 'IM3';
  return {
    system: RUBRIC,
    user: `Question (OPIc): ${clean(b.promptEn, 600)}
Learner's spoken answer (${Number(b.durationSec) || '?'} seconds): """${transcript}"""
Learner's target level: ${target}

Tasks:
1. grade: the OPIc level this single answer shows.
2. gradeReasonKo: 2-3 short sentences in Korean explaining why (mention concrete things from the answer).
3. corrections: up to 5 of the most important grammar/word-choice fixes. Each: original (the learner's exact phrase), corrected, reasonKo (one short sentence). Skip trivial ones. Empty array if nothing significant.
4. upgradedAnswer: rewrite the learner's own answer in natural spoken English at ${target === 'AL' ? 'AL' : target === 'IH' ? 'IH' : 'IH'} level, keeping the learner's content and personal details, 90-130 words, with 2-3 natural connectors and, if the question asks about the past, correct past tense.
5. tipsKo: 2-3 very specific next-step tips in Korean for this learner to reach ${target} (what to add or change next time).`,
    schema: {
      type: 'OBJECT',
      properties: {
        grade: { type: 'STRING', enum: GRADE_ENUM },
        gradeReasonKo: { type: 'STRING' },
        corrections: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: { original: { type: 'STRING' }, corrected: { type: 'STRING' }, reasonKo: { type: 'STRING' } },
            required: ['original', 'corrected', 'reasonKo']
          }
        },
        upgradedAnswer: { type: 'STRING' },
        tipsKo: { type: 'ARRAY', items: { type: 'STRING' } }
      },
      required: ['grade', 'gradeReasonKo', 'corrections', 'upgradedAnswer', 'tipsKo']
    }
  };
}

function buildFollowup(b) {
  const transcript = clean(b.transcript, MAX_TRANSCRIPT);
  if (transcript.split(' ').length < 3) return { error: 'transcript_too_short' };
  return {
    system: `You are Eva, the OPIc interviewer. You ask one natural follow-up question based on what the learner just said, like a real OPIc interviewer would. Keep it one sentence, conversational, and answerable in 40-60 seconds. Also give a Korean translation.`,
    user: `Original question: ${clean(b.promptEn, 600)}
Learner's answer: """${transcript}"""
Ask ONE follow-up question that digs into a detail the learner mentioned (why, how, an example, or a comparison).`,
    schema: {
      type: 'OBJECT',
      properties: { questionEn: { type: 'STRING' }, questionKo: { type: 'STRING' } },
      required: ['questionEn', 'questionKo']
    }
  };
}

function buildDraft(b) {
  const s = b.story || {};
  if (!clean(s.what, 1200)) return { error: 'story_missing' };
  const target = GRADE_ENUM.includes(b.targetGrade) ? b.targetGrade : 'IM3';
  return {
    system: RUBRIC + `\nYou write first-person spoken answers for the learner to practice aloud. Use only the learner's story facts; do not invent major events.`,
    user: `OPIc question: ${clean(b.promptEn, 600)}
Learner's real story (may be in Korean):
- Title: ${clean(s.title, 120)}
- When: ${clean(s.when, 120)}
- Where: ${clean(s.where, 120)}
- What happened: ${clean(s.what, 1200)}
- Feeling / result: ${clean(s.feeling, 400)}
Target level: ${target}

Write draftEn: a natural spoken answer to the question using this story, ${target === 'IM2' ? '55-75' : target === 'IM3' ? '75-95' : '100-130'} words, simple enough for the learner to say aloud, with 2-3 connectors (Well, Actually, To be honest, Looking back) and correct past tense where the story is in the past.
Write draftKo: a Korean translation of draftEn.
Write keyPhrases: 3 useful phrases from draftEn with Korean meanings.`,
    schema: {
      type: 'OBJECT',
      properties: {
        draftEn: { type: 'STRING' },
        draftKo: { type: 'STRING' },
        keyPhrases: { type: 'ARRAY', items: { type: 'OBJECT', properties: { en: { type: 'STRING' }, ko: { type: 'STRING' } }, required: ['en', 'ko'] } }
      },
      required: ['draftEn', 'draftKo', 'keyPhrases']
    }
  };
}

function buildDiagnose(b) {
  const answers = Array.isArray(b.answers) ? b.answers.slice(0, 5) : [];
  const usable = answers.filter(a => clean(a.transcript, 10).split(' ').length >= 3);
  if (!usable.length) return { error: 'no_answers' };
  const target = GRADE_ENUM.includes(b.targetGrade) ? b.targetGrade : 'IM3';
  return {
    system: RUBRIC,
    user: `This is a 3-question placement test. Rate the learner's overall OPIc level from all answers together.
${usable.map((a, i) => `Q${i + 1}: ${clean(a.promptEn, 400)}\nA${i + 1} (${Number(a.durationSec) || '?'}s): """${clean(a.transcript, MAX_TRANSCRIPT)}"""`).join('\n\n')}
Target level: ${target}

Return: grade (overall), reasonKo (3 short sentences), strengthsKo (2 items), weaknessesKo (2-3 items, concrete), nextStepKo (one sentence: the single most effective thing to practice this week).`,
    schema: {
      type: 'OBJECT',
      properties: {
        grade: { type: 'STRING', enum: GRADE_ENUM },
        reasonKo: { type: 'STRING' },
        strengthsKo: { type: 'ARRAY', items: { type: 'STRING' } },
        weaknessesKo: { type: 'ARRAY', items: { type: 'STRING' } },
        nextStepKo: { type: 'STRING' }
      },
      required: ['grade', 'reasonKo', 'strengthsKo', 'weaknessesKo', 'nextStepKo']
    }
  };
}
