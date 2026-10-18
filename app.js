// 오픽 스튜디오 - 메인 애플리케이션 로직
(function () {
  const DATA = window.OPIC_DATA;

  // 티어(왕초보/초보/중수/고수) 프리셋 정의
  const TIER_PRESETS = {
    beginner0: {
      id: 'beginner0',
      icon: 'sprout',
      name: '왕초보',
      currentGrade: 'IL',
      targetGrade: 'IM2',
      difficulty: 3,
      speechRate: '0.88',
      prepSeconds: 8,
      progressPct: 35,
      coachGuide: '단어로만 대답해도 괜찮아요. <strong>주어+동사(I usually go to ~ / I like ~)</strong> 형태로 <strong>4문장(약 45단어)</strong>만 끊기지 않고 말하면 IM2~IM3까지 금방 올라가요.'
    },
    beginner: {
      id: 'beginner',
      icon: 'leaf',
      name: '초보',
      currentGrade: 'IM1',
      targetGrade: 'IM3',
      difficulty: 4,
      speechRate: '0.95',
      prepSeconds: 5,
      progressPct: 55,
      coachGuide: '한 문제당 <strong>3문장(약 70단어, 50초)</strong>을 채우고, <code>Actually</code> · <code>To be honest</code> 같은 연결어 2개와 정확한 과거시제만 쓰면 IM3까지 충분히 가요.'
    },
    intermediate: {
      id: 'intermediate',
      icon: 'trending',
      name: '중수',
      currentGrade: 'IM3',
      targetGrade: 'IH',
      difficulty: 5,
      speechRate: '1.0',
      prepSeconds: 5,
      progressPct: 72,
      coachGuide: '<strong>과거 사건(콤보 3번)과 롤플레이(11~13번)</strong>에서 <strong>95단어 이상 + 감정 표현</strong>(I was so relieved 등)을 넣으면 IH에 안정적으로 도달해요.'
    },
    advanced: {
      id: 'advanced',
      icon: 'crown',
      name: '고수',
      currentGrade: 'IH',
      targetGrade: 'AL',
      difficulty: 6,
      speechRate: '1.08',
      prepSeconds: 4,
      progressPct: 85,
      coachGuide: 'AL의 핵심은 <strong>원어민 필러</strong>(You know, Out of nowhere, Looking back)와 <strong>14~15번에서 125단어 이상</strong> 막힘없이 말하기예요.'
    }
  };

  const GRADE_ORDER = ['IL', 'IM1', 'IM2', 'IM3', 'IH', 'AL'];
  const TOPIC_ICONS = {
    intro: ['user', 'tone-indigo'],
    house: ['home', 'tone-amber'],
    vacation_home: ['sofa', 'tone-violet'],
    park: ['trees', 'tone-emerald'],
    movie: ['film', 'tone-rose'],
    music: ['headphones', 'tone-indigo'],
    cafe: ['coffee', 'tone-amber'],
    shopping: ['bag', 'tone-rose'],
    workout: ['dumbbell', 'tone-emerald'],
    travel: ['plane', 'tone-sky'],
    roleplay: ['chat', 'tone-primary'],
    unexpected: ['zap', 'tone-violet']
  };
  const EVA_ART = '<span class="eva-art"><svg viewBox="0 0 104 104"><use href="#i-eva"/></svg></span>';
  const EVA_MIC = '<svg class="ic eva-mic"><use href="#i-mic"/></svg>';
  const TYPE_LABELS = { single: '자기소개', combo3: '3콤보', roleplay: '롤플레이', combo2: '고난도 14~15' };
  const PRACTICE_FILTERS = [
    { id: 'all', label: '전체' },
    { id: 'combo3', label: '3콤보' },
    { id: 'roleplay', label: '롤플레이' },
    { id: 'combo2', label: '고난도 14~15' },
    { id: 'single', label: '자기소개' }
  ];
  const TAB_VIEWS = ['home', 'practice', 'notebook', 'history'];
  const PREP_RING_LEN = 339.3;

  const readJSON = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch (_) { return fallback; }
  };

  // --- 상태 관리 ---
  let state = {
    currentView: 'home',
    returnView: 'home',
    theme: localStorage.getItem('opic_theme') || 'light',
    userTier: localStorage.getItem('opic_user_tier') || 'beginner',
    currentGrade: localStorage.getItem('opic_current_grade') || 'IM1',
    difficulty: parseInt(localStorage.getItem('opic_difficulty') || '4', 10),

    currentSetIndex: 0,
    currentQIndex: 0,
    activeSets: [...DATA.comboSets],
    practiceFilter: 'all',
    mySurveyOnly: false,
    isQuestionBlurred: false,
    showKo: false,
    hasReplayed: false,
    prepTimerId: null,
    prepSecondsLeft: 0,
    studioPhase: 'idle', // idle | speaking | prep | recording | done
    resultTab: null,

    // 인터뷰 녹음/음성인식 상태
    isRecording: false,
    recordingMode: 'studio', // 'studio' | 'leveltest'
    recordingSeconds: 0,
    recordingTimerId: null,
    recognition: null,
    finalTranscript: '',
    interimTranscript: '',

    // 오디오 스트림 & 파형
    mediaStream: null,
    mediaRecorder: null,
    audioChunks: [],
    audioContext: null,
    analyser: null,
    waveformAnimId: null,

    // 로컬 저장 설정
    selectedSurveyIds: readJSON('opic_survey_ids', null) ||
      DATA.surveyTopics.filter(t => t.defaultChecked).map(t => t.id),
    lastSetId: localStorage.getItem('opic_last_set') || null,
    settings: readJSON('opic_settings', null) || {
      targetGrade: 'IM3',
      speechRate: '0.95',
      prepSeconds: '5',
      aiProvider: 'builtin',
      apiKey: ''
    },
    notebook: readJSON('opic_notebook', null) || [
      {
        id: 'default_1',
        category: '장소묘사 만능 템플릿',
        en: "What I really love about this place is that it has a super cozy atmosphere, so going there really helps me clear my head.",
        ko: "제가 이곳에서 정말 좋아하는 점은 분위기가 아주 아늑해서, 거기 가면 머리를 식히는 데 정말 큰 도움이 된다는 것입니다.",
        createdAt: '추천'
      },
      {
        id: 'default_2',
        category: '과거경험(콤보3) 만능 감정표현',
        en: "Out of nowhere, things didn't go as planned and I was totally freaked out at first, but looking back, it's a really memorable experience.",
        ko: "갑자기 일이 계획대로 되지 않아서 처음엔 완전 당황했지만, 돌이켜보면 정말 기억에 남는 경험입니다.",
        createdAt: '추천'
      },
      {
        id: 'default_3',
        category: '12번 대안제시 롤플레이 만능',
        en: "I feel terrible saying this at the last minute, but why don't we reschedule for next weekend instead? Dinner is on me next time!",
        ko: "막판에 이런 말을 해서 너무 미안하지만, 대신 다음 주말로 일정을 바꾸는 게 어때? 다음엔 내가 저녁 쏠게!",
        createdAt: '추천'
      }
    ],
    history: readJSON('opic_history', [])
  };

  // --- DOM 참조 ---
  const $ = (id) => document.getElementById(id);
  const els = {
    bnavItems: document.querySelectorAll('.bnav-item'),
    bnavFab: $('bnavFab'),
    screenViews: document.querySelectorAll('.screen-view'),
    brandHomeLink: $('brandHomeLink'),
    topUserTierBtn: $('topUserTierBtn'),
    topTierIcon: $('topTierIcon'),
    topTierText: $('topTierText'),

    // 홈
    homeDateLabel: $('homeDateLabel'),
    heroCurrentGrade: $('heroCurrentGrade'),
    heroTargetGrade: $('heroTargetGrade'),
    heroProgressLabel: $('heroProgressLabel'),
    heroSurveySummary: $('heroSurveySummary'),
    heroGaugeFill: $('heroGaugeFill'),
    heroRoadmapCoach: $('heroRoadmapCoach'),
    btnGoSurveyStep: $('btnGoSurveyStep'),
    btnQuickStartStudio: $('btnQuickStartStudio'),
    continueTitle: $('continueTitle'),
    continueSub: $('continueSub'),
    quickNoteDesc: $('quickNoteDesc'),
    quickPracticeDesc: $('quickPracticeDesc'),
    statTotal: $('statTotal'),
    statToday: $('statToday'),
    statAvgWords: $('statAvgWords'),
    statBest: $('statBest'),
    homeRecentList: $('homeRecentList'),

    // 연습 라이브러리
    practiceFilterChips: $('practiceFilterChips'),
    chkMySurveyOnly: $('chkMySurveyOnly'),
    practiceList: $('practiceList'),

    // 레벨테스트
    btnListenLevelTestQ: $('btnListenLevelTestQ'),
    levelTestPromptEn: $('levelTestPromptEn'),
    btnStartLevelTestRec: $('btnStartLevelTestRec'),
    btnStopLevelTestRec: $('btnStopLevelTestRec'),
    levelTestStatusText: $('levelTestStatusText'),
    levelTestTranscript: $('levelTestTranscript'),
    levelTestResultBox: $('levelTestResultBox'),

    // 설정(서베이/난이도/티어)
    tierCards: document.querySelectorAll('#tierCardGrid .tier-card'),
    surveyCountBadge: $('surveyCountBadge'),
    surveyCategoriesContainer: $('surveyCategoriesContainer'),
    difficultyCards: document.querySelectorAll('#difficultyGrid .option-card'),
    btnConfirmSurveyStartInterview: $('btnConfirmSurveyStartInterview'),

    // 스튜디오
    studioSetTitle: $('studioSetTitle'),
    studioSetTitleBtn: $('studioSetTitleBtn'),
    studioLevelLabel: $('studioLevelLabel'),
    comboSetSelect: $('comboSetSelect'),
    questionStepPills: $('questionStepPills'),
    flowBadgeListen: $('flowBadgeListen'),
    flowBadgePrep: $('flowBadgePrep'),
    flowBadgeSpeak: $('flowBadgeSpeak'),
    evaStatusPill: $('evaStatusPill'),
    evaAvatar: $('evaAvatar'),
    evaCenterContent: $('evaCenterContent'),
    prepRingFg: $('prepRingFg'),
    replayCountdownText: $('replayCountdownText'),
    btnReplayQuestion: $('btnReplayQuestion'),
    btnMainAction: $('btnMainAction'),
    mainActionIcon: $('mainActionIcon'),
    mainActionLabel: $('mainActionLabel'),
    chkAutoStartSpeak: $('chkAutoStartSpeak'),

    qBadgeText: $('qBadgeText'),
    btnToggleBlur: $('btnToggleBlur'),
    btnToggleKo: $('btnToggleKo'),
    questionTextEn: $('questionTextEn'),
    questionTextKo: $('questionTextKo'),
    questionTipBanner: $('questionTipBanner'),
    fillerQuickBar: $('fillerQuickBar'),

    recordingTimer: $('recordingTimer'),
    targetTimeLabel: $('targetTimeLabel'),
    timeProgressBar: $('timeProgressBar'),
    btnNextQuestion: $('btnNextQuestion'),

    micLiveBadge: $('micLiveBadge'),
    waveformCanvas: $('waveformCanvas'),
    liveTranscriptInput: $('liveTranscriptInput'),
    sttInterimPreview: $('sttInterimPreview'),
    btnSpeakMyAnswer: $('btnSpeakMyAnswer'),
    btnClearTranscript: $('btnClearTranscript'),

    metricWords: $('metricWords'),
    metricWpm: $('metricWpm'),
    metricFillers: $('metricFillers'),
    metricLiveGrade: $('metricLiveGrade'),

    audioPlaybackBar: $('audioPlaybackBar'),
    recordedAudioPlayer: $('recordedAudioPlayer'),
    downloadAudioLink: $('downloadAudioLink'),

    btnRunAiCoach: $('btnRunAiCoach'),
    btnShowSampleAnswer: $('btnShowSampleAnswer'),
    btnSaveMyScriptToNote: $('btnSaveMyScriptToNote'),
    aiFeedbackContainer: $('aiFeedbackContainer'),
    sampleAnswerContainer: $('sampleAnswerContainer'),

    // 세트 시트
    setSheet: $('setSheet'),
    setSheetList: $('setSheetList'),

    // 노트북 & 히스토리
    notebookCountBadge: $('notebookCountBadge'),
    notebookListContainer: $('notebookListContainer'),
    btnAddCustomNote: $('btnAddCustomNote'),
    btnExportNotebook: $('btnExportNotebook'),
    customNoteFormBox: $('customNoteFormBox'),
    noteCategoryInput: $('noteCategoryInput'),
    noteKoInput: $('noteKoInput'),
    noteEnInput: $('noteEnInput'),
    btnCancelNote: $('btnCancelNote'),
    btnSaveNoteConfirm: $('btnSaveNoteConfirm'),

    historyCountBadge: $('historyCountBadge'),
    historyChart: $('historyChart'),
    historyListContainer: $('historyListContainer'),
    btnClearHistory: $('btnClearHistory'),

    // 모달 & 토스트
    openSettingsBtn: $('openSettingsBtn'),
    closeSettingsBtn: $('closeSettingsBtn'),
    settingsModal: $('settingsModal'),
    settingTargetGrade: $('settingTargetGrade'),
    settingSpeechRate: $('settingSpeechRate'),
    settingPrepSeconds: $('settingPrepSeconds'),
    settingAiProvider: $('settingAiProvider'),
    settingApiKey: $('settingApiKey'),
    saveSettingsBtn: $('saveSettingsBtn'),
    pwaInstallBtn: $('pwaInstallBtn'),
    toastMsg: $('toastMsg')
  };

  // --- 초기화 ---
  function init() {
    applyTheme();
    document.querySelectorAll('select.input').forEach(enhanceSelect);
    filterActiveSetsBySurvey();
    restoreLastSet();
    renderUserTierAndRoadmap();
    renderSurveyScreen();
    renderComboSelector();
    renderCurrentQuestion();
    renderFillerQuickBar();
    renderPracticeFilters();
    renderPracticeList();
    renderNotebook();
    renderHistory();
    renderHomeSummary();
    drawIdleWaveform();
    bindEvents();
    setupPwaInstall();
    els.homeDateLabel.textContent = new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' });
  }

  // --- 유틸 ---
  let toastTimer = null;
  function showToast(msg) {
    els.toastMsg.textContent = msg;
    els.toastMsg.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toastMsg.classList.remove('show'), 2400);
  }

  function formatTime(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  function esc(str) {
    return String(str ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  const icon = (name, cls = 'ic ic-sm') => `<svg class="${cls}"><use href="#i-${name}"/></svg>`;

  function splitSetTitle(title) {
    const m = title.match(/^(.*?)\s*\((.*)\)\s*$/);
    return m ? { main: m[1], sub: m[2] } : { main: title, sub: '' };
  }

  function topicOf(set) {
    return DATA.surveyTopics.find(t => t.id === set.topicId) || { name: '' };
  }

  function topicTile(topicId, size = '') {
    const [ic, tone] = TOPIC_ICONS[topicId] || ['book', 'tone-primary'];
    return `<span class="icon-tile ${size} ${tone}">${icon(ic, 'ic')}</span>`;
  }

  function gradeRank(g) { return GRADE_ORDER.indexOf(g); }

  // 비프음(신호음) - 준비시간 종료 후 자동 녹음 시작 알림용
  function playBeepSound(freq = 880, durationMs = 180) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.value = 0.12;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      setTimeout(() => {
        osc.stop();
        ctx.close();
      }, durationMs);
    } catch (_) {}
  }

  // --- 화면(뷰) 전환 ---
  function navigateTo(viewId) {
    stopAllAudioAndTimers();
    if (TAB_VIEWS.includes(state.currentView)) state.returnView = state.currentView;
    state.currentView = viewId;
    const immersive = !TAB_VIEWS.includes(viewId);
    document.body.classList.toggle('is-immersive', immersive);
    document.body.classList.toggle('is-studio', viewId === 'studio');
    els.bnavItems.forEach(btn => btn.classList.toggle('active', btn.dataset.view === viewId));
    els.screenViews.forEach(sec => sec.classList.toggle('active', sec.id === `view-${viewId}`));
    if (viewId === 'home') renderHomeSummary();
    window.scrollTo({ top: 0 });
  }

  function goBack() {
    navigateTo(TAB_VIEWS.includes(state.returnView) ? state.returnView : 'home');
  }

  function openStudio({ setIndex, autoPlay = false } = {}) {
    if (typeof setIndex === 'number') {
      state.currentSetIndex = setIndex;
      state.currentQIndex = 0;
    }
    resetTranscript();
    renderComboSelector();
    renderCurrentQuestion();
    navigateTo('studio');
    rememberCurrentSet();
    if (autoPlay) setTimeout(() => playQuestionAndStartPrepFlow(false), 450);
  }

  function rememberCurrentSet() {
    state.lastSetId = getCurrentSet().id;
    localStorage.setItem('opic_last_set', state.lastSetId);
    renderHomeSummary();
  }

  function restoreLastSet() {
    if (!state.lastSetId) return;
    const idx = state.activeSets.findIndex(s => s.id === state.lastSetId);
    if (idx >= 0) state.currentSetIndex = idx;
  }

  // --- 홈: 티어 및 등급 로드맵 ---
  function selectUserTier(tierKey) {
    const preset = TIER_PRESETS[tierKey] || TIER_PRESETS.beginner;
    state.userTier = preset.id;
    state.currentGrade = preset.currentGrade;
    state.difficulty = preset.difficulty;
    state.settings.targetGrade = preset.targetGrade;
    state.settings.speechRate = preset.speechRate;
    state.settings.prepSeconds = String(preset.prepSeconds);

    localStorage.setItem('opic_user_tier', state.userTier);
    localStorage.setItem('opic_current_grade', state.currentGrade);
    localStorage.setItem('opic_difficulty', String(state.difficulty));
    localStorage.setItem('opic_settings', JSON.stringify(state.settings));

    renderUserTierAndRoadmap();
    renderSurveyScreen();
    showToast(`${preset.name} 맞춤 설정 완료 · 목표 ${preset.targetGrade}`);
  }

  function renderUserTierAndRoadmap() {
    const preset = TIER_PRESETS[state.userTier] || TIER_PRESETS.beginner;
    const target = state.settings.targetGrade || preset.targetGrade;

    els.topTierIcon.innerHTML = `<use href="#i-${preset.icon}"/>`;
    els.topTierText.textContent = `${preset.name} · ${target}`;

    // 현재 등급 → 목표 등급 거리로 도달률 계산
    const cur = Math.max(0, gradeRank(state.currentGrade));
    const tgt = Math.max(1, gradeRank(target));
    const pct = Math.min(100, Math.round(((cur + 1) / (tgt + 1)) * 100));

    els.heroCurrentGrade.textContent = state.currentGrade;
    els.heroTargetGrade.textContent = target;
    els.heroProgressLabel.textContent = `${target}까지 ${pct}%`;
    els.heroSurveySummary.textContent = `서베이 ${state.selectedSurveyIds.length}개 · 난이도 ${state.difficulty}단계`;
    els.heroGaugeFill.style.width = `${pct}%`;
    els.heroRoadmapCoach.innerHTML = `<div class="coach-title">${icon('bulb')}${target}까지 가려면</div>${preset.coachGuide}`;

    els.tierCards.forEach(card => {
      card.classList.toggle('selected', card.dataset.tier === state.userTier);
    });

    if (els.studioLevelLabel) {
      els.studioLevelLabel.textContent = `${state.difficulty}단계 · ${target}`;
    }
  }

  function renderHomeSummary() {
    // 이어하기 카드
    const lastSet = DATA.comboSets.find(s => s.id === state.lastSetId);
    if (lastSet) {
      const t = splitSetTitle(lastSet.title);
      els.continueTitle.textContent = '이어서 연습하기';
      els.continueSub.textContent = t.main;
    } else {
      els.continueTitle.textContent = '실전 모의 인터뷰 시작';
      els.continueSub.textContent = '내 서베이로 에바가 질문해요 · 듣기 → 준비 → 자동 녹음';
    }

    els.quickNoteDesc.textContent = `저장 ${state.notebook.length}개`;
    els.quickPracticeDesc.textContent = `${DATA.comboSets.length}개 세트`;

    // 통계
    const h = state.history;
    const todayKey = new Date().toLocaleDateString('ko-KR');
    const today = h.filter(x => (x.dateKey || '') === todayKey || (x.date || '').startsWith(todayKey)).length;
    const avg = h.length ? Math.round(h.reduce((a, x) => a + (x.wordCount || 0), 0) / h.length) : 0;
    const best = h.reduce((b, x) => (gradeRank(x.estGrade) > gradeRank(b) ? x.estGrade : b), '-');
    els.statTotal.textContent = h.length;
    els.statToday.textContent = today;
    els.statAvgWords.textContent = avg;
    els.statBest.textContent = best;

    // 최근 기록 3개
    if (h.length === 0) {
      els.homeRecentList.innerHTML = `<div class="empty"><strong>아직 연습 기록이 없어요</strong>첫 답변을 녹음하면 여기에 쌓여요.</div>`;
    } else {
      els.homeRecentList.innerHTML = h.slice(0, 3).map(historyRowHtml).join('');
    }
  }

  function historyRowHtml(x) {
    return `
      <div class="list-item">
        <span class="grade-pill">${esc(x.estGrade)}</span>
        <span class="li-body">
          <span class="li-title">${esc(x.badge)}</span>
          <span class="li-sub">${esc(x.wordCount)}단어 · ${esc(x.wpm)} WPM · ${esc(x.date)}</span>
        </span>
      </div>`;
  }

  // --- 서베이 & 난이도 ---
  function renderSurveyScreen() {
    els.surveyCountBadge.textContent = `${state.selectedSurveyIds.length}개 선택`;

    const grouped = {};
    DATA.surveyTopics.forEach(t => {
      if (!grouped[t.category]) grouped[t.category] = [];
      grouped[t.category].push(t);
    });

    els.surveyCategoriesContainer.innerHTML = '';
    Object.keys(grouped).forEach(cat => {
      const label = document.createElement('div');
      label.className = 'survey-category-label';
      label.textContent = cat;
      els.surveyCategoriesContainer.appendChild(label);

      const grid = document.createElement('div');
      grid.className = 'survey-chip-grid';

      grouped[cat].forEach(topic => {
        const isSel = state.selectedSurveyIds.includes(topic.id);
        const chip = document.createElement('button');
        chip.className = `survey-chip ${isSel ? 'selected' : ''}`;
        chip.setAttribute('aria-pressed', isSel);
        chip.innerHTML = `${topicTile(topic.id, 'xs')}<span>${esc(topic.name)}</span><span class="chip-check">${icon('check')}</span>`;
        chip.onclick = () => {
          if (state.selectedSurveyIds.includes(topic.id)) {
            if (state.selectedSurveyIds.length <= 1) {
              showToast('최소 1개 이상의 주제를 골라주세요');
              return;
            }
            state.selectedSurveyIds = state.selectedSurveyIds.filter(id => id !== topic.id);
          } else {
            state.selectedSurveyIds.push(topic.id);
          }
          localStorage.setItem('opic_survey_ids', JSON.stringify(state.selectedSurveyIds));
          renderSurveyScreen();
          renderUserTierAndRoadmap();
          renderPracticeList();
        };
        grid.appendChild(chip);
      });

      els.surveyCategoriesContainer.appendChild(grid);
    });

    els.difficultyCards.forEach(card => {
      const d = parseInt(card.dataset.diff, 10);
      const isMatch = (d === 3 && state.difficulty <= 3) || (d === 4 && state.difficulty === 4) || (d === 5 && state.difficulty >= 5);
      card.classList.toggle('selected', isMatch);
      card.onclick = () => {
        state.difficulty = d;
        localStorage.setItem('opic_difficulty', String(d));
        if (d === 3) {
          state.settings.targetGrade = 'IM2';
          state.settings.speechRate = '0.88';
        } else if (d === 4) {
          state.settings.targetGrade = 'IM3';
          state.settings.speechRate = '0.95';
        } else {
          state.settings.targetGrade = 'IH';
          state.settings.speechRate = '1.0';
        }
        localStorage.setItem('opic_settings', JSON.stringify(state.settings));
        renderSurveyScreen();
        renderUserTierAndRoadmap();
      };
    });
  }

  function filterActiveSetsBySurvey() {
    let filtered = DATA.comboSets.filter(s => state.selectedSurveyIds.includes(s.topicId));
    if (filtered.length === 0) filtered = [...DATA.comboSets];
    state.activeSets = filtered;
    state.currentSetIndex = 0;
    state.currentQIndex = 0;
  }

  // 라이브러리에서 고른 세트는 서베이와 무관하게 전체 세트 기준으로 연습
  function useAllSets() {
    state.activeSets = [...DATA.comboSets];
  }

  // --- 유형별 연습 라이브러리 ---
  function renderPracticeFilters() {
    els.practiceFilterChips.innerHTML = PRACTICE_FILTERS.map(f =>
      `<button class="filter-chip ${f.id === state.practiceFilter ? 'active' : ''}" data-filter="${f.id}" role="tab">${f.label}</button>`
    ).join('');
  }

  function setCardHtml(set, { current = false } = {}) {
    const topic = topicOf(set);
    const t = splitSetTitle(set.title);
    const mine = state.selectedSurveyIds.includes(set.topicId);
    const practicedCount = state.history.filter(h => set.questions.some(q => q.badge === h.badge)).length;
    return `
      <button class="list-item ${current ? 'current' : ''}" data-set-id="${set.id}">
        ${topicTile(set.topicId)}
        <span class="li-body">
          <span class="li-title">${esc(t.main)}</span>
          ${t.sub ? `<span class="li-sub">${esc(t.sub)}</span>` : ''}
          <span class="li-meta">
            <span class="li-tag">${TYPE_LABELS[set.type] || set.type} · ${set.questions.length}문항</span>
            ${mine ? '<span class="li-tag mine">내 서베이</span>' : ''}
            ${practicedCount ? `<span class="li-tag hot">${practicedCount}회 연습</span>` : ''}
          </span>
        </span>
        ${icon('right', 'ic li-arrow')}
      </button>`;
  }

  function renderPracticeList() {
    const list = DATA.comboSets.filter(s =>
      (state.practiceFilter === 'all' || s.type === state.practiceFilter) &&
      (!state.mySurveyOnly || state.selectedSurveyIds.includes(s.topicId))
    );
    els.practiceList.innerHTML = list.length
      ? list.map(s => setCardHtml(s)).join('')
      : `<div class="empty"><strong>조건에 맞는 세트가 없어요</strong>필터를 바꾸거나 서베이 주제를 추가해 보세요.</div>`;
  }

  function startSetById(setId) {
    useAllSets();
    const idx = state.activeSets.findIndex(s => s.id === setId);
    els.setSheet.classList.remove('open');
    openStudio({ setIndex: Math.max(0, idx) });
  }

  function openSetSheet() {
    const cur = getCurrentSet();
    els.setSheetList.innerHTML = DATA.comboSets.map(s => setCardHtml(s, { current: s.id === cur.id })).join('');
    els.setSheet.classList.add('open');
  }

  // --- TTS 음성 출력 (에바) ---
  // Edge의 'Natural' 신경망 음성(Ava/Jenny/Aria 등)을 자동으로 골라 원어민처럼 읽음
  function voiceScore(v) {
    let score = 0;
    if (/natural/i.test(v.name)) score += 100;
    if (/online/i.test(v.name)) score += 20;
    if (/google us english/i.test(v.name)) score += 40;
    if (/^en[-_]US/i.test(v.lang)) score += 30;
    else if (/^en[-_](GB|CA|AU)/i.test(v.lang)) score += 10;
    if (/(ava|jenny|aria|emma|michelle|samantha)/i.test(v.name)) score += 15;
    if (/(zira|david|mark)/i.test(v.name)) score -= 10;
    return score;
  }

  function getBestEnglishVoice() {
    if (!('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices().filter(v => /^en/i.test(v.lang));
    voices.sort((a, b) => voiceScore(b) - voiceScore(a));
    return voices[0] || null;
  }

  function stopSpeech() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }

  // 긴 문장은 문장 단위로 끊어 읽어야 Chrome에서 중간에 끊기지 않고 호흡도 자연스러움
  function speakWithBrowser(text, done) {
    if (!('speechSynthesis' in window)) {
      showToast('이 브라우저는 음성 읽기를 지원하지 않아요');
      done();
      return;
    }
    const voice = getBestEnglishVoice();
    const rate = parseFloat(state.settings.speechRate || '1.0');
    const sentences = text.match(/[^.!?]+[.!?]*["')\]]*\s*/g) || [text];
    sentences.forEach((sentence, i) => {
      const utter = new SpeechSynthesisUtterance(sentence.trim());
      if (voice) utter.voice = voice;
      utter.lang = voice ? voice.lang : 'en-US';
      utter.rate = rate;
      utter.onerror = done;
      if (i === sentences.length - 1) utter.onend = done;
      window.speechSynthesis.speak(utter);
    });
  }

  function speakEnglishText(text, onEndCallback, { animateEva = false } = {}) {
    stopSpeech();
    let finished = false;
    const done = () => {
      if (finished) return;
      finished = true;
      if (animateEva) els.evaAvatar.classList.remove('speaking');
      if (onEndCallback) onEndCallback();
    };

    if (animateEva) {
      els.evaAvatar.classList.remove('prep-countdown', 'recording-now');
      els.evaAvatar.classList.add('speaking');
      els.evaCenterContent.innerHTML = EVA_ART;
    }

    speakWithBrowser(text, done);
  }

  // --- 스튜디오 메인 버튼 상태 ---
  const PHASE_UI = {
    idle: { icon: 'play', label: '질문 듣기', aria: '질문 듣기' },
    speaking: { icon: 'volume', label: '에바가 질문하는 중…', aria: '질문 재생 중', disabled: true },
    prep: { icon: 'mic', label: '바로 말하기', aria: '준비 건너뛰고 말하기' },
    recording: { icon: 'stop', label: '답변 완료', aria: '답변 완료' },
    done: { icon: 'replay', label: '다시 답변하기', aria: '다시 답변하기' }
  };

  function setStudioPhase(phase) {
    state.studioPhase = phase;
    const ui = PHASE_UI[phase];
    els.btnMainAction.dataset.state = phase === 'idle' ? 'play' : phase;
    els.btnMainAction.disabled = !!ui.disabled;
    els.btnMainAction.setAttribute('aria-label', ui.aria);
    els.mainActionIcon.innerHTML = `<use href="#i-${ui.icon}"/>`;
    els.mainActionLabel.textContent = ui.label;
  }

  function onMainAction() {
    switch (state.studioPhase) {
      case 'idle': playQuestionAndStartPrepFlow(false); break;
      case 'prep': clearInterval(state.prepTimerId); resetPrepRing(); startAnswering('studio'); break;
      case 'recording': stopAnswering(); break;
      case 'done': resetTranscript(); startAnswering('studio'); break;
    }
  }

  function setFlowStepBadge(step) {
    els.flowBadgeListen.classList.toggle('active', step === 'listen');
    els.flowBadgePrep.classList.toggle('active', step === 'prep');
    els.flowBadgeSpeak.classList.toggle('active', step === 'speak');
  }

  function setPrepRing(fraction) {
    els.prepRingFg.style.strokeDashoffset = String(PREP_RING_LEN * (1 - fraction));
  }

  function resetPrepRing() {
    els.prepRingFg.style.transition = 'none';
    setPrepRing(0);
    void els.prepRingFg.getBoundingClientRect();
    els.prepRingFg.style.transition = '';
  }

  let flowToken = 0;

  // --- 실전 인터뷰: ① 질문 듣기 ➔ ② 준비시간 ➔ ③ 자동 말하기 ---
  function playQuestionAndStartPrepFlow(isReplay = false) {
    stopAllAudioAndTimers();
    const q = getCurrentQuestion();

    setFlowStepBadge('listen');
    setStudioPhase('speaking');
    els.evaStatusPill.textContent = isReplay ? '질문을 한 번 더 들려드릴게요' : '에바가 질문하고 있어요. 잘 들어보세요';
    els.replayCountdownText.textContent = '';

    if (isReplay) {
      state.hasReplayed = true;
      els.btnReplayQuestion.disabled = true;
    }

    const token = ++flowToken;
    speakEnglishText(q.promptEn, () => {
      if (token !== flowToken || state.studioPhase !== 'speaking') return;
      const prepTotal = parseInt(state.settings.prepSeconds || '5', 10);
      state.prepSecondsLeft = prepTotal;
      setFlowStepBadge('prep');
      setStudioPhase('prep');

      if (!state.hasReplayed) els.btnReplayQuestion.disabled = false;

      els.evaAvatar.classList.add('prep-countdown');
      resetPrepRing();
      requestAnimationFrame(() => setPrepRing(1 / prepTotal));

      const tick = () => {
        els.evaCenterContent.innerHTML = `<span class="prep-timer-overlay">${state.prepSecondsLeft}</span>`;
        els.evaStatusPill.textContent = els.chkAutoStartSpeak.checked
          ? `${state.prepSecondsLeft}초 뒤 녹음이 자동으로 시작돼요`
          : '생각을 정리하고 말하기 버튼을 눌러주세요';
        els.replayCountdownText.textContent = !state.hasReplayed ? '지금 한 번 다시 들을 수 있어요' : '첫 문장을 떠올려 보세요';
      };
      tick();

      state.prepTimerId = setInterval(() => {
        state.prepSecondsLeft -= 1;
        setPrepRing((prepTotal - state.prepSecondsLeft + 1) / prepTotal);
        if (state.prepSecondsLeft > 0) {
          tick();
        } else {
          clearInterval(state.prepTimerId);
          els.btnReplayQuestion.disabled = true;
          els.evaAvatar.classList.remove('prep-countdown');
          els.replayCountdownText.textContent = '';
          resetPrepRing();

          if (els.chkAutoStartSpeak.checked) {
            playBeepSound(880, 200);
            startAnswering('studio');
          } else {
            els.evaCenterContent.innerHTML = EVA_MIC;
            els.evaStatusPill.textContent = '준비 완료! 말하기 버튼을 눌러 대답해 주세요';
          }
        }
      }, 1000);
    }, { animateEva: true });
  }

  // --- 실시간 음성 인식(STT) + 마이크 녹음 ---
  async function startAnswering(mode = 'studio') {
    if (state.isRecording) return;
    stopSpeech();
    clearInterval(state.prepTimerId);

    state.recordingMode = mode;
    state.isRecording = true;
    state.recordingSeconds = 0;

    try {
      state.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (mode === 'studio') setupAudioRecorderAndVisualizer(state.mediaStream);
    } catch (_) {
      showToast('마이크 권한을 허용해 주세요');
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const targetTextarea = mode === 'leveltest' ? els.levelTestTranscript : els.liveTranscriptInput;

    if (!SpeechRecognition) {
      showToast('실시간 음성 인식은 Chrome·Edge에서만 돼요. 직접 입력해도 분석할 수 있어요');
    } else {
      state.recognition = new SpeechRecognition();
      state.recognition.lang = 'en-US';
      state.recognition.continuous = true;
      state.recognition.interimResults = true;

      state.finalTranscript = targetTextarea.value.trim() ? targetTextarea.value.trim() + ' ' : '';
      state.interimTranscript = '';

      state.recognition.onresult = (event) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const piece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            state.finalTranscript += piece.trim() + ' ';
            targetTextarea.value = state.finalTranscript;
          } else {
            interim += piece;
          }
        }
        state.interimTranscript = interim;
        if (mode === 'studio') {
          els.sttInterimPreview.textContent = interim ? `“${interim}…”` : '';
          updateLiveMetrics();
        } else {
          els.levelTestStatusText.textContent = interim
            ? `인식 중 · “${interim}…”`
            : `녹음 중 · ${state.recordingSeconds}초`;
        }
      };

      state.recognition.onend = () => {
        if (state.isRecording && state.recognition) {
          try { state.recognition.start(); } catch (_) {}
        }
      };

      try { state.recognition.start(); } catch (_) {}
    }

    if (mode === 'studio') {
      setFlowStepBadge('speak');
      setStudioPhase('recording');
      els.evaAvatar.classList.remove('prep-countdown');
      els.evaAvatar.classList.add('recording-now');
      els.evaCenterContent.innerHTML = EVA_MIC;
      els.btnReplayQuestion.disabled = true;
      els.replayCountdownText.textContent = '';
      els.recordingTimer.classList.add('recording');
      els.evaStatusPill.textContent = '듣고 있어요. 편하게 말해보세요';
      els.micLiveBadge.textContent = 'LIVE';
      els.micLiveBadge.classList.add('live');

      const targetSec = getCurrentQuestion().targetSec || 65;
      state.recordingTimerId = setInterval(() => {
        state.recordingSeconds += 1;
        els.recordingTimer.textContent = formatTime(state.recordingSeconds);
        const pct = Math.min(100, Math.round((state.recordingSeconds / targetSec) * 100));
        els.timeProgressBar.style.width = `${pct}%`;
        els.timeProgressBar.classList.toggle('over', pct >= 100);
        updateLiveMetrics();
      }, 1000);
    } else {
      els.btnStartLevelTestRec.disabled = true;
      els.btnStopLevelTestRec.disabled = false;
      els.levelTestStatusText.textContent = '녹음 중 · 30~60초 정도 말해보세요';
      state.recordingTimerId = setInterval(() => {
        state.recordingSeconds += 1;
        if (!state.interimTranscript) {
          els.levelTestStatusText.textContent = `녹음 중 · ${state.recordingSeconds}초 경과`;
        }
      }, 1000);
    }
  }

  function stopAnswering() {
    if (!state.isRecording) return;
    const finishedMode = state.recordingMode;
    state.isRecording = false;
    clearInterval(state.recordingTimerId);

    if (state.recognition) {
      try {
        state.recognition.onend = null;
        state.recognition.stop();
      } catch (_) {}
      state.recognition = null;
    }

    if (state.mediaRecorder && state.mediaRecorder.state !== 'inactive') {
      try { state.mediaRecorder.stop(); } catch (_) {}
    }

    if (state.mediaStream) {
      state.mediaStream.getTracks().forEach(t => t.stop());
      state.mediaStream = null;
    }

    if (state.audioContext) {
      try { state.audioContext.close(); } catch (_) {}
      state.audioContext = null;
    }

    cancelAnimationFrame(state.waveformAnimId);
    drawIdleWaveform();

    if (finishedMode === 'studio') {
      els.evaAvatar.classList.remove('recording-now');
      els.evaCenterContent.innerHTML = EVA_ART;
      setStudioPhase('done');
      els.recordingTimer.classList.remove('recording');
      els.evaStatusPill.textContent = '수고했어요! 아래에서 예상 등급을 확인하세요';
      els.micLiveBadge.textContent = '마이크 대기';
      els.micLiveBadge.classList.remove('live');
      els.sttInterimPreview.textContent = '';
      updateLiveMetrics();
      savePracticeHistoryItem();
      if (els.liveTranscriptInput.value.trim().length > 0) {
        runAiCoaching();
        setTimeout(() => els.btnRunAiCoach.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
      }
    } else {
      els.btnStartLevelTestRec.disabled = false;
      els.btnStopLevelTestRec.disabled = true;
      els.levelTestStatusText.textContent = '분석 완료!';
      evaluateLevelTestResult();
    }
  }

  function stopAllAudioAndTimers() {
    flowToken++;
    stopSpeech();
    clearInterval(state.prepTimerId);
    if (state.isRecording) stopAnswering();
    if (els.evaAvatar) {
      els.evaAvatar.classList.remove('speaking', 'prep-countdown', 'recording-now');
      els.evaCenterContent.innerHTML = EVA_ART;
      resetPrepRing();
    }
    if (state.studioPhase === 'speaking' || state.studioPhase === 'prep') {
      setStudioPhase('idle');
      setFlowStepBadge('listen');
      els.evaStatusPill.textContent = '재생 버튼을 누르면 듣기 → 준비 → 녹음이 자동으로 이어져요';
      els.replayCountdownText.textContent = '';
    }
  }

  // --- 오디오 녹음 & 실시간 파형 ---
  function setupAudioRecorderAndVisualizer(stream) {
    state.audioChunks = [];
    try {
      state.mediaRecorder = new MediaRecorder(stream);
      state.mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) state.audioChunks.push(e.data);
      };
      state.mediaRecorder.onstop = () => {
        if (state.audioChunks.length > 0) {
          const blob = new Blob(state.audioChunks, { type: 'audio/webm' });
          const url = URL.createObjectURL(blob);
          els.recordedAudioPlayer.src = url;
          els.downloadAudioLink.href = url;
          els.audioPlaybackBar.style.display = 'flex';
        }
      };
      state.mediaRecorder.start();
    } catch (_) {}

    try {
      state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const src = state.audioContext.createMediaStreamSource(stream);
      state.analyser = state.audioContext.createAnalyser();
      state.analyser.fftSize = 64;
      src.connect(state.analyser);
      drawLiveWaveform();
    } catch (_) {}
  }

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function drawBars(ctx, canvas, values, color) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const bars = values.length;
    const step = canvas.width / bars;
    const w = Math.max(3, step - 6);
    values.forEach((h, i) => {
      const y = (canvas.height - h) / 2;
      ctx.fillStyle = typeof color === 'function' ? color(i, h) : color;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(i * step + (step - w) / 2, y, w, h, w / 2);
      else ctx.rect(i * step + (step - w) / 2, y, w, h);
      ctx.fill();
    });
  }

  function drawIdleWaveform() {
    const canvas = els.waveformCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    drawBars(ctx, canvas, new Array(40).fill(4), cssVar('--wave-idle') || '#e5e8eb');
  }

  function drawLiveWaveform() {
    if (!state.analyser) return;
    const canvas = els.waveformCanvas;
    const ctx = canvas.getContext('2d');
    const dataArray = new Uint8Array(state.analyser.frequencyBinCount);
    const primary = cssVar('--primary') || '#2357e8';
    const muted = cssVar('--wave-muted') || '#b0b8c1';

    function frame() {
      if (!state.isRecording) {
        drawIdleWaveform();
        return;
      }
      state.waveformAnimId = requestAnimationFrame(frame);
      state.analyser.getByteFrequencyData(dataArray);
      const vals = [];
      for (let i = 0; i < 40; i++) {
        const v = dataArray[Math.abs(20 - i) % dataArray.length] || 0;
        vals.push(Math.max(4, (v / 255) * (canvas.height - 4)));
      }
      drawBars(ctx, canvas, vals, (i, h) => (h > 14 ? primary : muted));
    }
    frame();
  }

  // --- 발화 스크립트 정밀 지표 & 등급 도달 계산기 ---
  function analyzeTranscriptMetrics(text, seconds) {
    const clean = (text || '').trim();
    const words = clean ? clean.split(/\s+/).filter(Boolean) : [];
    const wordCount = words.length;
    const effectiveSec = Math.max(seconds || 35, 15);
    const wpm = wordCount > 0 ? Math.round((wordCount / effectiveSec) * 60) : 0;

    const fillerPatterns = [
      /\bwell\b/gi, /\byou know\b/gi, /\bactually\b/gi, /\bto be honest\b/gi,
      /\bhonestly\b/gi, /\bbasically\b/gi, /\bliterally\b/gi, /\bspeaking of\b/gi,
      /\ball in all\b/gi, /\bfirst of all\b/gi, /\bin fact\b/gi, /\banyway\b/gi,
      /\blooking back\b/gi, /\bout of nowhere\b/gi, /\bfor example\b/gi
    ];
    let fillerCount = 0;
    fillerPatterns.forEach(pat => {
      const m = clean.match(pat);
      if (m) fillerCount += m.length;
    });

    const pastVerbs = clean.match(/\b(went|saw|had|was|were|did|took|bought|ate|felt|got|made|started|happened|decided|tried|realized|turned|watched|visited|played|stayed)\b/gi) || [];
    const richAdjectives = clean.match(/\b(amazing|breathtaking|cozy|memorable|unforgettable|exhausted|relieved|embarrassed|hilarious|phenomenal|convenient|spotless|delicious|refreshing|peaceful)\b/gi) || [];

    let estGrade = 'IL';
    if (wordCount >= 120 && fillerCount >= 3 && (pastVerbs.length >= 3 || richAdjectives.length >= 2)) {
      estGrade = 'AL';
    } else if (wordCount >= 90 && fillerCount >= 2 && pastVerbs.length >= 2) {
      estGrade = 'IH';
    } else if (wordCount >= 65 && fillerCount >= 1) {
      estGrade = 'IM3';
    } else if (wordCount >= 42) {
      estGrade = 'IM2';
    } else if (wordCount >= 20) {
      estGrade = 'IM1';
    } else if (wordCount === 0) {
      estGrade = '-';
    }

    const needForIM3Words = Math.max(0, 70 - wordCount);
    const needForIHWords = Math.max(0, 95 - wordCount);

    let roadmapToIM3 = '';
    if (wordCount < 70) {
      const moreSentences = Math.max(1, Math.ceil(needForIM3Words / 12));
      roadmapToIM3 = `<div class="coach-title">${icon('target')}IM3까지</div>약 <strong>${needForIM3Words}단어(${moreSentences}문장)</strong>만 더 이어서 말하고, <code>Actually</code> · <code>First of all</code> 같은 연결어를 <strong>${Math.max(1, 2 - fillerCount)}번</strong> 더 써보세요.`;
    } else if (wordCount < 95) {
      const moreSentences = Math.max(1, Math.ceil(needForIHWords / 13));
      roadmapToIM3 = `<div class="coach-title">${icon('target')}IM3 달성권! IH까지</div>과거형 동사(<code>went</code> <code>felt</code> <code>was</code>)와 감정 표현으로 <strong>${needForIHWords}단어(${moreSentences}문장)</strong>만 더 늘려보세요.`;
    } else {
      roadmapToIM3 = `<div class="coach-title">${icon('target')}IH~AL 고득점권</div>원어민 필러(<code>Out of nowhere</code> <code>Looking back</code>)를 자연스럽게 섞어 이 페이스를 유지하면 AL까지 충분해요.`;
    }

    return {
      wordCount,
      wpm,
      fillerCount,
      pastVerbCount: pastVerbs.length,
      richAdjCount: richAdjectives.length,
      estGrade,
      roadmapToIM3
    };
  }

  function updateLiveMetrics() {
    const fullText = (els.liveTranscriptInput.value + ' ' + state.interimTranscript).trim();
    const m = analyzeTranscriptMetrics(fullText, state.recordingSeconds || 45);
    els.metricWords.textContent = `${m.wordCount}단어`;
    els.metricWpm.textContent = `${m.wpm}`;
    els.metricFillers.textContent = `${m.fillerCount}회`;
    els.metricLiveGrade.textContent = m.estGrade;
  }

  function resultHeadHtml(grade, caption, m, tone = '') {
    return `
      <div class="result-head">
        <div class="result-grade ${tone}">${esc(grade)}</div>
        <div class="result-meta">
          <span class="cap">${caption}</span>
          <div class="result-stats">
            <span>${m.wordCount}단어</span><span>${m.wpm} WPM</span><span>연결어 ${m.fillerCount}</span><span>과거동사 ${m.pastVerbCount}</span>
          </div>
        </div>
      </div>
      <div class="coach-note">${m.roadmapToIM3}</div>`;
  }

  // --- 1분 레벨 테스트 진단 결과 ---
  function evaluateLevelTestResult() {
    const text = els.levelTestTranscript.value.trim();
    if (!text) {
      showToast('인식된 문장이 없어요. 다시 말하거나 직접 입력해 주세요');
      return;
    }

    const m = analyzeTranscriptMetrics(text, state.recordingSeconds || 45);
    const detectedGrade = m.estGrade === '-' ? 'IL' : m.estGrade;

    let matchedTier = 'beginner';
    if (detectedGrade === 'IL') matchedTier = 'beginner0';
    else if (detectedGrade === 'IM1' || detectedGrade === 'IM2') matchedTier = 'beginner';
    else if (detectedGrade === 'IM3') matchedTier = 'intermediate';
    else if (detectedGrade === 'IH' || detectedGrade === 'AL') matchedTier = 'advanced';

    state.userTier = matchedTier;
    state.currentGrade = detectedGrade;
    localStorage.setItem('opic_user_tier', state.userTier);
    localStorage.setItem('opic_current_grade', state.currentGrade);
    renderUserTierAndRoadmap();

    const p = TIER_PRESETS[matchedTier];
    els.levelTestResultBox.style.display = 'block';
    els.levelTestResultBox.innerHTML = `
      ${resultHeadHtml(detectedGrade, '진단 예상 등급', m, 'indigo')}
      <p class="sub" style="margin-top:0.8rem;">추천 코스: <strong>${p.name} (난이도 ${p.difficulty}단계)</strong> 로 홈 로드맵을 맞췄어요.</p>
      <div class="result-actions">
        <button class="btn btn-ghost" data-action="go-home">홈으로</button>
        <button class="btn btn-primary" data-action="go-setup">서베이 고르기</button>
      </div>`;
    els.levelTestResultBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function startLevelTestListenFlow() {
    stopAllAudioAndTimers();
    const qText = els.levelTestPromptEn.textContent.trim();
    els.levelTestStatusText.textContent = '에바가 진단 질문을 읽고 있어요…';
    speakEnglishText(qText, () => {
      if (state.currentView !== 'leveltest') return;
      let sec = 5;
      els.levelTestStatusText.textContent = `${sec}초 뒤 녹음이 시작돼요`;
      state.prepTimerId = setInterval(() => {
        sec -= 1;
        if (sec > 0) {
          els.levelTestStatusText.textContent = `${sec}초 뒤 녹음이 시작돼요`;
        } else {
          clearInterval(state.prepTimerId);
          playBeepSound(880, 200);
          startAnswering('leveltest');
        }
      }, 1000);
    });
  }

  // --- 콤보 세트 및 질문 렌더링 ---
  function renderComboSelector() {
    els.comboSetSelect.innerHTML = '';
    state.activeSets.forEach((set, idx) => {
      const opt = document.createElement('option');
      opt.value = idx;
      opt.textContent = set.title;
      els.comboSetSelect.appendChild(opt);
    });
    els.comboSetSelect.value = state.currentSetIndex;
  }

  function getCurrentSet() {
    return state.activeSets[state.currentSetIndex] || state.activeSets[0];
  }

  function getCurrentQuestion() {
    const set = getCurrentSet();
    return set.questions[state.currentQIndex] || set.questions[0];
  }

  function renderCurrentQuestion() {
    stopAllAudioAndTimers();
    const set = getCurrentSet();
    const q = getCurrentQuestion();

    els.comboSetSelect.value = state.currentSetIndex;
    els.studioSetTitle.innerHTML = `${topicTile(set.topicId, 'xs')}${esc(splitSetTitle(set.title).main)}`;
    setFlowStepBadge('listen');
    setStudioPhase('idle');
    els.evaStatusPill.textContent = '재생 버튼을 누르면 듣기 → 준비 → 녹음이 자동으로 이어져요';

    els.questionStepPills.innerHTML = '';
    set.questions.forEach((item, idx) => {
      const btn = document.createElement('button');
      const status = idx === state.currentQIndex ? 'active' : idx < state.currentQIndex ? 'done' : '';
      btn.className = `q-step ${status}`;
      btn.innerHTML = `<span class="q-step-bar"></span><span class="q-step-name">Q${idx + 1} · ${esc(item.badge.replace(/^콤보 \d+ · |^\d+번 · /, ''))}</span>`;
      btn.title = item.badge;
      btn.onclick = () => {
        state.currentQIndex = idx;
        resetTranscript();
        renderCurrentQuestion();
      };
      els.questionStepPills.appendChild(btn);
    });

    els.qBadgeText.textContent = `시험 ${q.qNum}번 · ${q.badge}`;
    els.questionTextEn.textContent = q.promptEn;
    els.questionTextKo.textContent = q.promptKo;
    els.questionTextKo.hidden = !state.showKo;
    els.questionTipBanner.textContent = q.tips;
    els.targetTimeLabel.textContent = ` / ${formatTime(q.targetSec || 65)}`;

    applyBlur();

    state.hasReplayed = false;
    els.btnReplayQuestion.disabled = true;
    els.replayCountdownText.textContent = '';
    hideResults();
    els.recordingTimer.textContent = '00:00';
    els.timeProgressBar.style.width = '0%';
    els.timeProgressBar.classList.remove('over');
    els.audioPlaybackBar.style.display = 'none';
  }

  function applyBlur() {
    els.questionTextEn.classList.toggle('blurred-text', state.isQuestionBlurred);
    els.questionTextKo.classList.toggle('blurred-text', state.isQuestionBlurred);
    els.btnToggleBlur.classList.toggle('on', state.isQuestionBlurred);
    els.btnToggleBlur.innerHTML = icon(state.isQuestionBlurred ? 'eye-off' : 'eye');
    els.btnToggleBlur.setAttribute('aria-label', state.isQuestionBlurred ? '질문 보기' : '질문 가리기');
  }

  function resetTranscript() {
    els.liveTranscriptInput.value = '';
    state.finalTranscript = '';
    state.interimTranscript = '';
    els.sttInterimPreview.textContent = '';
    state.recordingSeconds = 0;
    updateLiveMetrics();
  }

  function renderFillerQuickBar() {
    els.fillerQuickBar.innerHTML = '';
    DATA.fillerGuides.forEach(f => {
      const btn = document.createElement('button');
      btn.className = 'filler-chip';
      btn.title = f.meaning;
      btn.innerHTML = `${icon('volume')}${esc(f.phrase)}`;
      btn.onclick = () => speakEnglishText(f.phrase);
      els.fillerQuickBar.appendChild(btn);
    });
  }

  // --- 결과 탭 (AI 코칭 / 모범답안) ---
  function hideResults() {
    state.resultTab = null;
    els.aiFeedbackContainer.style.display = 'none';
    els.sampleAnswerContainer.style.display = 'none';
    els.btnRunAiCoach.classList.remove('active');
    els.btnShowSampleAnswer.classList.remove('active');
  }

  function showResultTab(tab) {
    state.resultTab = tab;
    els.aiFeedbackContainer.style.display = tab === 'coach' ? 'block' : 'none';
    els.sampleAnswerContainer.style.display = tab === 'sample' ? 'block' : 'none';
    els.btnRunAiCoach.classList.toggle('active', tab === 'coach');
    els.btnShowSampleAnswer.classList.toggle('active', tab === 'sample');
  }

  function runAiCoaching() {
    const userText = els.liveTranscriptInput.value.trim();
    const q = getCurrentQuestion();
    if (!userText) {
      showToast('먼저 영어로 답변하거나 스크립트를 입력해 주세요');
      return;
    }

    const m = analyzeTranscriptMetrics(userText, state.recordingSeconds || 50);
    const est = m.estGrade === '-' ? 'IM1' : m.estGrade;

    state.currentGrade = est;
    localStorage.setItem('opic_current_grade', est);
    renderUserTierAndRoadmap();

    const exprHtml = (q.keyExpressions || []).map(ex => `
      <div class="expr-item">
        <div class="expr-body">
          <div class="expr-en">${esc(ex.en)}</div>
          <div class="expr-ko">${esc(ex.ko)}</div>
        </div>
        <button class="icon-only sm" data-action="speak" data-text="${esc(ex.en)}" aria-label="발음 듣기">${icon('volume')}</button>
        <button class="icon-only sm" data-action="save" data-cat="${esc(q.badge)}" data-text="${esc(ex.en)}" data-ko="${esc(ex.ko)}" aria-label="노트에 저장">${icon('star')}</button>
      </div>`).join('');

    els.aiFeedbackContainer.innerHTML = `
      ${resultHeadHtml(est, '이번 답변 예상 등급', m)}
      <div class="result-section">
        <div class="result-section-title">
          <span>IH/AL 업그레이드 스크립트</span>
          <span class="row-gap">
            <button class="icon-only sm" data-action="speak" data-text="${esc(q.sampleIH)}" aria-label="발음 듣기">${icon('volume')}</button>
            <button class="icon-only sm" data-action="save" data-cat="${esc(q.badge)}" data-text="${esc(q.sampleIH)}" data-ko="${esc(q.promptKo)}" aria-label="노트에 저장">${icon('star')}</button>
          </span>
        </div>
        <p class="script-text">${esc(q.sampleIH)}</p>
      </div>
      ${exprHtml ? `
      <div class="result-section">
        <div class="result-section-title"><span>추가하면 등급이 오르는 표현</span></div>
        <div class="expr-grid">${exprHtml}</div>
      </div>` : ''}`;
    showResultTab('coach');
  }

  function renderSampleAnswer() {
    const q = getCurrentQuestion();
    els.sampleAnswerContainer.innerHTML = `
      <div class="result-section-title">
        <span>${esc(q.badge)} 모범답안</span>
        <span class="row-gap">
          <button class="icon-only sm" data-action="speak" data-text="${esc(q.sampleIH)}" aria-label="에바 음성으로 듣기">${icon('volume')}</button>
        </span>
      </div>
      <p class="script-text">${esc(q.sampleIH)}</p>
      <div class="result-actions">
        <button class="btn btn-ghost btn-sm" data-action="copy-sample">${icon('copy')}내 답변창에 불러오기</button>
        <button class="btn btn-tonal btn-sm" data-action="save" data-cat="${esc(q.badge)}" data-text="${esc(q.sampleIH)}" data-ko="${esc(q.promptKo)}">${icon('star')}노트에 저장</button>
      </div>`;
  }

  // 결과 영역·노트·레벨테스트의 동적 버튼 이벤트 위임
  function handleDelegatedClick(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const { action, text, cat, ko, id } = btn.dataset;
    if (action === 'speak') speakEnglishText(text);
    else if (action === 'save') addNoteItem(cat, text, ko);
    else if (action === 'copy-sample') {
      els.liveTranscriptInput.value = getCurrentQuestion().sampleIH;
      updateLiveMetrics();
      els.liveTranscriptInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      showToast('모범답안을 불러왔어요. 소리 내어 읽어보세요');
    } else if (action === 'delete-note') deleteNote(id);
    else if (action === 'toggle-ko') btn.classList.toggle('hidden-ko');
    else if (action === 'go-home') navigateTo('home');
    else if (action === 'go-setup') navigateTo('setup');
  }

  // --- 만능노트 & 히스토리 ---
  function addNoteItem(category, en, ko) {
    if (state.notebook.some(n => n.en === en)) {
      showToast('이미 노트에 있는 문장이에요');
      return;
    }
    state.notebook.unshift({
      id: 'note_' + Date.now(),
      category: category || '나만의 만능 표현',
      en,
      ko: ko || '',
      createdAt: new Date().toLocaleDateString('ko-KR')
    });
    localStorage.setItem('opic_notebook', JSON.stringify(state.notebook));
    renderNotebook();
    showToast('만능노트에 저장했어요');
  }

  function deleteNote(id) {
    state.notebook = state.notebook.filter(n => n.id !== id);
    localStorage.setItem('opic_notebook', JSON.stringify(state.notebook));
    renderNotebook();
    showToast('삭제했어요');
  }

  function renderNotebook() {
    els.notebookCountBadge.textContent = state.notebook.length;
    if (els.quickNoteDesc) els.quickNoteDesc.textContent = `저장 ${state.notebook.length}개`;
    if (state.notebook.length === 0) {
      els.notebookListContainer.innerHTML = `<div class="empty"><strong>저장한 문장이 없어요</strong>연습 중 ☆ 버튼으로 표현을 모아보세요.</div>`;
      return;
    }
    els.notebookListContainer.innerHTML = state.notebook.map(item => `
      <div class="note-card">
        <div class="note-top">
          <span class="note-cat">${esc(item.category)}</span>
          <span class="note-actions">
            <button class="icon-only sm" data-action="speak" data-text="${esc(item.en)}" aria-label="발음 듣기">${icon('volume')}</button>
            <button class="icon-only sm" data-action="delete-note" data-id="${esc(item.id)}" aria-label="삭제">${icon('trash')}</button>
          </span>
        </div>
        <div class="note-en">${esc(item.en)}</div>
        ${item.ko ? `<div class="note-ko">${esc(item.ko)}</div>` : ''}
      </div>`).join('');
  }

  function savePracticeHistoryItem() {
    const text = els.liveTranscriptInput.value.trim();
    if (!text) return;
    const q = getCurrentQuestion();
    const m = analyzeTranscriptMetrics(text, state.recordingSeconds || 45);
    const now = new Date();
    state.history.unshift({
      id: 'h_' + Date.now(),
      date: now.toLocaleString('ko-KR'),
      dateKey: now.toLocaleDateString('ko-KR'),
      badge: q.badge,
      promptEn: q.promptEn,
      transcript: text,
      wordCount: m.wordCount,
      wpm: m.wpm,
      estGrade: m.estGrade
    });
    state.history = state.history.slice(0, 50);
    localStorage.setItem('opic_history', JSON.stringify(state.history));
    renderHistory();
  }

  function renderHistoryChart() {
    const recent = state.history.slice(0, 14).reverse().filter(h => gradeRank(h.estGrade) >= 0);
    if (recent.length < 2) {
      els.historyChart.style.display = 'none';
      return;
    }
    els.historyChart.style.display = '';
    const bars = recent.map(h => {
      const pct = ((gradeRank(h.estGrade) + 1) / GRADE_ORDER.length) * 100;
      return `<div class="trend-bar" style="height:${pct}%" title="${esc(h.estGrade)} · ${esc(h.badge)}"></div>`;
    }).join('');
    els.historyChart.innerHTML = `
      <div class="trend-title">최근 ${recent.length}회 예상 등급</div>
      <div class="trend-bars">${bars}</div>
      <div class="trend-axis"><span>${esc(recent[0].estGrade)}</span><span>최근 ${esc(recent[recent.length - 1].estGrade)}</span></div>`;
  }

  function renderHistory() {
    els.historyCountBadge.textContent = state.history.length;
    renderHistoryChart();
    if (state.history.length === 0) {
      els.historyListContainer.innerHTML = `<div class="empty"><strong>아직 연습 기록이 없어요</strong>인터뷰에서 답변을 마치면 자동으로 저장돼요.</div>`;
      return;
    }
    els.historyListContainer.innerHTML = state.history.map(h => `
      <div class="history-card">
        <div class="history-top">
          <span class="grade-pill">${esc(h.estGrade)}</span>
          <span class="li-body">
            <span class="li-title">${esc(h.badge)}</span>
            <span class="li-sub">${esc(h.wordCount)}단어 · ${esc(h.wpm)} WPM · ${esc(h.date)}</span>
          </span>
        </div>
        <div class="history-q">Q. ${esc(h.promptEn)}</div>
        <div class="history-a">${esc(h.transcript)}</div>
      </div>`).join('');
  }

  // --- 커스텀 드롭다운 (값은 숨긴 네이티브 select에 그대로 저장) ---
  const dropdowns = [];
  let openDropdown = null;

  function optionLabelHtml(text) {
    const [main, ...rest] = text.split(' · ');
    const sub = rest.join(' · ');
    return `<span class="dd-main">${esc(main)}</span>${sub ? `<span class="dd-sub">${esc(sub)}</span>` : ''}`;
  }

  function enhanceSelect(select) {
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'dd-trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.innerHTML = `<span class="dd-value"></span>${icon('down', 'ic ic-sm dd-chevron')}`;
    select.classList.add('visually-hidden');
    select.tabIndex = -1;
    select.setAttribute('aria-hidden', 'true');
    select.before(trigger);

    const dd = {
      select,
      trigger,
      refresh() {
        const opt = select.selectedOptions[0];
        trigger.querySelector('.dd-value').innerHTML = opt ? optionLabelHtml(opt.textContent) : '';
      }
    };
    trigger.onclick = (e) => {
      e.preventDefault();
      if (openDropdown && openDropdown.dd === dd) closeDropdown();
      else openDropdownMenu(dd);
    };
    trigger.onkeydown = (e) => {
      if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && !openDropdown) {
        e.preventDefault();
        openDropdownMenu(dd);
      }
    };
    dd.refresh();
    dropdowns.push(dd);
  }

  function refreshDropdowns() {
    dropdowns.forEach(d => d.refresh());
  }

  function openDropdownMenu(dd) {
    closeDropdown();
    const menu = document.createElement('div');
    menu.className = 'dd-menu';
    menu.setAttribute('role', 'listbox');
    [...dd.select.options].forEach(opt => {
      const selected = opt.value === dd.select.value;
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'dd-option';
      item.setAttribute('role', 'option');
      item.setAttribute('aria-selected', String(selected));
      item.innerHTML = `<span class="dd-text">${optionLabelHtml(opt.textContent)}</span>${selected ? icon('check', 'ic ic-sm dd-check') : ''}`;
      item.onclick = () => {
        dd.select.value = opt.value;
        dd.select.dispatchEvent(new Event('change'));
        dd.refresh();
        closeDropdown();
        dd.trigger.focus();
      };
      menu.appendChild(item);
    });
    menu.onkeydown = (e) => {
      const items = [...menu.children];
      const i = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); items[Math.min(items.length - 1, i + 1)].focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); items[Math.max(0, i - 1)].focus(); }
      else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeDropdown(); dd.trigger.focus(); }
      else if (e.key === 'Tab') closeDropdown();
    };
    document.body.appendChild(menu);

    // 트리거 위치를 따라감 (시트 애니메이션 중이어도 정확히 붙도록). 아래 공간이 부족하면 위로 펼침
    const place = () => {
      if (!openDropdown || openDropdown.menu !== menu) return;
      const r = dd.trigger.getBoundingClientRect();
      const h = menu.offsetHeight;
      const openUp = window.innerHeight - r.bottom - 12 < h && r.top > h + 12;
      menu.style.left = `${r.left}px`;
      menu.style.width = `${r.width}px`;
      menu.style.top = `${openUp ? r.top - h - 6 : r.bottom + 6}px`;
      requestAnimationFrame(place);
    };

    dd.trigger.setAttribute('aria-expanded', 'true');
    dd.trigger.classList.add('open');
    openDropdown = { dd, menu };
    place();
    (menu.querySelector('[aria-selected="true"]') || menu.firstChild).focus({ preventScroll: true });
  }

  function closeDropdown() {
    if (!openDropdown) return;
    const { dd, menu } = openDropdown;
    menu.remove();
    dd.trigger.setAttribute('aria-expanded', 'false');
    dd.trigger.classList.remove('open');
    openDropdown = null;
  }

  document.addEventListener('pointerdown', (e) => {
    if (!openDropdown) return;
    if (openDropdown.menu.contains(e.target) || openDropdown.dd.trigger.contains(e.target)) return;
    closeDropdown();
  });
  document.addEventListener('scroll', (e) => {
    if (openDropdown && !openDropdown.menu.contains(e.target)) closeDropdown();
  }, true);
  window.addEventListener('resize', closeDropdown);

  // --- 이벤트 바인딩 ---
  function bindEvents() {
    els.bnavItems.forEach(btn => {
      btn.onclick = () => navigateTo(btn.dataset.view);
    });
    els.bnavFab.onclick = () => {
      filterActiveSetsBySurvey();
      restoreLastSet();
      openStudio({ autoPlay: true });
    };
    els.brandHomeLink.onclick = () => navigateTo('home');
    els.topUserTierBtn.onclick = () => navigateTo('setup');
    document.querySelectorAll('[data-back]').forEach(b => { b.onclick = goBack; });
    document.querySelectorAll('[data-go]').forEach(b => { b.onclick = () => navigateTo(b.dataset.go); });
    document.addEventListener('click', handleDelegatedClick);

    // 시스템 뒤로가기(ESC)로 시트 닫기 / 몰입화면 나가기
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (openDropdown) { closeDropdown(); return; }
      const open = document.querySelector('.modal-overlay.open');
      if (open) open.classList.remove('open');
      else if (!TAB_VIEWS.includes(state.currentView)) goBack();
    });

    // 홈
    els.btnGoSurveyStep.onclick = () => navigateTo('setup');
    els.btnQuickStartStudio.onclick = () => {
      if (state.lastSetId) {
        startSetById(state.lastSetId);
      } else {
        filterActiveSetsBySurvey();
        openStudio({ autoPlay: true });
      }
    };

    // 설정: 티어 카드
    els.tierCards.forEach(card => {
      card.onclick = () => selectUserTier(card.dataset.tier);
    });

    els.btnConfirmSurveyStartInterview.onclick = () => {
      filterActiveSetsBySurvey();
      openStudio({ autoPlay: true });
      showToast('선택한 서베이와 난이도로 시작할게요');
    };

    // 연습 라이브러리
    els.practiceFilterChips.onclick = (e) => {
      const chip = e.target.closest('[data-filter]');
      if (!chip) return;
      state.practiceFilter = chip.dataset.filter;
      renderPracticeFilters();
      renderPracticeList();
    };
    els.chkMySurveyOnly.onchange = () => {
      state.mySurveyOnly = els.chkMySurveyOnly.checked;
      renderPracticeList();
    };
    els.practiceList.onclick = (e) => {
      const item = e.target.closest('[data-set-id]');
      if (item) startSetById(item.dataset.setId);
    };

    // 레벨테스트
    els.btnListenLevelTestQ.onclick = startLevelTestListenFlow;
    els.btnStartLevelTestRec.onclick = () => startAnswering('leveltest');
    els.btnStopLevelTestRec.onclick = () => stopAnswering();

    // 스튜디오
    els.studioSetTitleBtn.onclick = openSetSheet;
    els.setSheetList.onclick = (e) => {
      const item = e.target.closest('[data-set-id]');
      if (item) startSetById(item.dataset.setId);
    };
    document.querySelectorAll('.modal-overlay').forEach(ov => {
      ov.addEventListener('click', (e) => {
        if (e.target === ov || e.target.closest('[data-close-sheet]')) {
          closeDropdown();
          ov.classList.remove('open');
        }
      });
    });

    els.comboSetSelect.onchange = (e) => {
      state.currentSetIndex = parseInt(e.target.value, 10) || 0;
      state.currentQIndex = 0;
      renderCurrentQuestion();
    };

    els.btnMainAction.onclick = onMainAction;
    els.btnReplayQuestion.onclick = () => playQuestionAndStartPrepFlow(true);

    els.btnToggleBlur.onclick = () => {
      state.isQuestionBlurred = !state.isQuestionBlurred;
      applyBlur();
    };
    els.btnToggleKo.onclick = () => {
      state.showKo = !state.showKo;
      els.questionTextKo.hidden = !state.showKo;
      els.btnToggleKo.classList.toggle('on', state.showKo);
    };

    els.btnNextQuestion.onclick = () => {
      const set = getCurrentSet();
      if (state.currentQIndex + 1 < set.questions.length) {
        state.currentQIndex += 1;
      } else {
        state.currentSetIndex = (state.currentSetIndex + 1) % state.activeSets.length;
        state.currentQIndex = 0;
        rememberCurrentSet();
        showToast(`다음 세트: ${splitSetTitle(getCurrentSet().title).main}`);
      }
      resetTranscript();
      renderCurrentQuestion();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => playQuestionAndStartPrepFlow(false), 350);
    };

    els.liveTranscriptInput.oninput = updateLiveMetrics;

    els.btnSpeakMyAnswer.onclick = () => {
      const txt = els.liveTranscriptInput.value.trim();
      if (!txt) return showToast('읽어줄 답변이 없어요');
      speakEnglishText(txt);
    };

    els.btnClearTranscript.onclick = resetTranscript;

    els.btnRunAiCoach.onclick = () => {
      if (state.resultTab === 'coach') return hideResults();
      runAiCoaching();
    };
    els.btnShowSampleAnswer.onclick = () => {
      if (state.resultTab === 'sample') return hideResults();
      renderSampleAnswer();
      showResultTab('sample');
    };
    els.btnSaveMyScriptToNote.onclick = () => {
      const txt = els.liveTranscriptInput.value.trim();
      if (!txt) return showToast('저장할 스크립트가 비어 있어요');
      const q = getCurrentQuestion();
      addNoteItem(`${q.badge} 내 답변`, txt, q.promptKo);
    };

    // 노트
    els.btnAddCustomNote.onclick = () => {
      const show = els.customNoteFormBox.style.display === 'none';
      els.customNoteFormBox.style.display = show ? 'grid' : 'none';
      if (show) els.noteEnInput.focus();
    };
    els.btnCancelNote.onclick = () => { els.customNoteFormBox.style.display = 'none'; };
    els.btnSaveNoteConfirm.onclick = () => {
      const en = els.noteEnInput.value.trim();
      if (!en) return showToast('영어 문장을 입력해 주세요');
      addNoteItem(els.noteCategoryInput.value.trim(), en, els.noteKoInput.value.trim());
      els.noteCategoryInput.value = '';
      els.noteKoInput.value = '';
      els.noteEnInput.value = '';
      els.customNoteFormBox.style.display = 'none';
    };
    els.btnExportNotebook.onclick = () => {
      const blob = new Blob([JSON.stringify(state.notebook, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'opic-notebook.json';
      a.click();
    };

    els.btnClearHistory.onclick = () => {
      if (confirm('연습 기록을 모두 삭제할까요?')) {
        state.history = [];
        localStorage.removeItem('opic_history');
        renderHistory();
      }
    };

    // 설정 시트
    els.openSettingsBtn.onclick = () => {
      els.settingTargetGrade.value = state.settings.targetGrade || 'IM3';
      els.settingSpeechRate.value = state.settings.speechRate || '0.95';
      els.settingPrepSeconds.value = state.settings.prepSeconds || '5';
      els.settingAiProvider.value = state.settings.aiProvider || 'builtin';
      els.settingApiKey.value = state.settings.apiKey || '';
      renderThemeSeg();
      refreshDropdowns();
      els.settingsModal.classList.add('open');
    };
    document.getElementById('themeSeg').onclick = (e) => {
      const b = e.target.closest('[data-theme-val]');
      if (!b) return;
      state.theme = b.dataset.themeVal;
      localStorage.setItem('opic_theme', state.theme);
      applyTheme();
      renderThemeSeg();
    };
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => {
      if (state.theme === 'system') applyTheme();
    });
    els.closeSettingsBtn.onclick = () => {
      closeDropdown();
      els.settingsModal.classList.remove('open');
    };
    els.saveSettingsBtn.onclick = () => {
      state.settings = {
        targetGrade: els.settingTargetGrade.value,
        speechRate: els.settingSpeechRate.value,
        prepSeconds: els.settingPrepSeconds.value,
        aiProvider: els.settingAiProvider.value,
        apiKey: els.settingApiKey.value
      };
      localStorage.setItem('opic_settings', JSON.stringify(state.settings));
      renderUserTierAndRoadmap();
      closeDropdown();
      els.settingsModal.classList.remove('open');
      showToast('설정을 저장했어요');
    };

  }

  function setupPwaInstall() {
    let deferredPrompt = null;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      els.pwaInstallBtn.style.display = 'inline-grid';
    });
    els.pwaInstallBtn.onclick = async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      els.pwaInstallBtn.style.display = 'none';
    };
  }

  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => getBestEnglishVoice();
  }

  function applyTheme() {
    const pref = state.theme;
    const t = pref === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : pref;
    document.documentElement.setAttribute('data-theme', t);
    const meta = document.getElementById('metaThemeColor');
    if (meta) meta.setAttribute('content', t === 'dark' ? '#101317' : '#f2f4f6');
    drawIdleWaveform();
  }

  function renderThemeSeg() {
    document.querySelectorAll('#themeSeg [data-theme-val]').forEach(b => {
      b.classList.toggle('active', b.dataset.themeVal === state.theme);
    });
  }

  init();
})();
