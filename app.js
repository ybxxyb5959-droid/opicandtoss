// 말문 (오픽 말하기 연습) - 메인 애플리케이션 로직
(function () {
  const DATA = window.OPIC_DATA;

  // 티어(왕초보/초보/중수/고수) 프리셋 정의
  const TIER_PRESETS = {
    beginner0: {
      id: 'beginner0',
      icon: 'sprout',
      name: '왕초보',
      desc: '단어 위주로 겨우 대답해요',
      tone: 'tone-emerald',
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
      desc: '짧은 문장은 되지만 40초 넘기기 힘들어요',
      tone: 'tone-sky',
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
      desc: '일상 주제는 OK, 롤플레이·1분 구성이 고민',
      tone: 'tone-indigo',
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
      desc: '필러·감정 표현·14~15번으로 AL 도전',
      tone: 'tone-amber',
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
  // 서베이와 관계없이 항상 출제되는 유형(세트의 topicId 기준)
  const ALWAYS_TOPICS = ['intro', 'roleplay', 'unexpected'];
  // 예전 버전 서베이 ID → 실전 서베이 ID
  const SURVEY_MIGRATE = {
    house: ['live_family'],
    workout: ['gym', 'jogging', 'walking'],
    travel: ['travel_domestic', 'travel_abroad']
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
  const TARGET_GRADES = [
    { id: 'IM2', desc: '왕초보 탈출 · 기본 문장으로 끝까지 답하기', icon: 'sig1', tone: 'tone-emerald' },
    { id: 'IM3', desc: '기업 기본 가점 안정권', icon: 'sig2', tone: 'tone-sky' },
    { id: 'IH', desc: '가장 많이 목표로 하는 고득점', icon: 'sig3', tone: 'tone-indigo' },
    { id: 'AL', desc: '최고 등급 · 원어민처럼 자연스럽게', icon: 'crown', tone: 'tone-amber' }
  ];
  const OB_STEP_COUNT = 5;
  const TAKE_DB_NAME = 'malmun';
  const TAKE_STORE = 'takes';
  const TAKE_LIMIT = 100;
  const PREP_RING_LEN = 339.3;

  const readJSON = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch (_) { return fallback; }
  };

  // 서베이 선택값 정리: 모르는 ID 제거, 옛 ID 이관, 하나만 고르는 파트는 정확히 1개 보장
  function normalizeSurveyIds(ids) {
    const valid = new Set(DATA.surveyTopics.map(t => t.id));
    const withSets = new Set(DATA.comboSets.flatMap(set => set.topicIds || [set.topicId]));
    const multi = new Set(DATA.surveySections.filter(sec => !sec.single).map(sec => sec.id));
    const byId = Object.fromEntries(DATA.surveyTopics.map(t => [t.id, t]));
    let out = [];
    if (!Array.isArray(ids)) {
      out = DATA.surveyTopics.filter(t => t.defaultChecked).map(t => t.id);
    } else {
      ids.forEach(id => {
        if (valid.has(id)) out.push(id);
        else if (SURVEY_MIGRATE[id]) out.push(...SURVEY_MIGRATE[id]);
      });
    }
    // 여가·취미·운동·휴가는 연습 문제가 있는 항목만 유지
    out = [...new Set(out)].filter(id => !multi.has(byId[id].section) || withSets.has(id));
    DATA.surveySections.filter(sec => sec.single).forEach(sec => {
      const items = DATA.surveyTopics.filter(t => t.section === sec.id);
      const chosen = items.filter(t => out.includes(t.id));
      if (chosen.length === 0) out.push((items.find(t => t.defaultChecked) || items[0]).id);
      else if (chosen.length > 1) chosen.slice(1).forEach(t => { out = out.filter(id => id !== t.id); });
    });
    return out;
  }

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
    selectedSurveyIds: normalizeSurveyIds(readJSON('opic_survey_ids', null)),
    levelTested: localStorage.getItem('opic_level_tested') === '1',
    studioMode: 'practice', // 'practice' | 'leveltest'
    levelTestAnswers: [],
    lastSetId: localStorage.getItem('opic_last_set') || null,
    settings: readJSON('opic_settings', null) || {
      targetGrade: 'IM3',
      speechRate: '0.95',
      prepSeconds: '5'
    },
    takeIds: new Set(),
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
    gradeCard: $('gradeCard'),
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
    btnStartLevelTest: $('btnStartLevelTest'),
    ltSheet: $('ltSheet'),
    ltSheetBody: $('ltSheetBody'),

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
    takeCountChip: $('takeCountChip'),
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
    btnRedoOnboarding: $('btnRedoOnboarding'),
    saveSettingsBtn: $('saveSettingsBtn'),

    // 온보딩
    obProgress: $('obProgress'),
    obSteps: document.querySelectorAll('#view-onboarding .ob-step'),
    obBackBtn: $('obBackBtn'),
    obNextBtn: $('obNextBtn'),
    obHomeBtn: $('obHomeBtn'),
    obTierList: $('obTierList'),
    obTargetList: $('obTargetList'),
    obSurveyContainer: $('obSurveyContainer'),
    obSurveyCount: $('obSurveyCount'),
    obSummary: $('obSummary'),
    pwaInstallBtn: $('pwaInstallBtn'),
    toastMsg: $('toastMsg')
  };

  // --- 초기화 ---
  function init() {
    // 예전 버전에 남아 있던 가짜 AI 설정 칸 값 정리
    delete state.settings.aiProvider;
    delete state.settings.apiKey;
    // 옛 버전 서베이 ID를 실전 서베이 ID로 바꾼 결과를 저장
    localStorage.setItem('opic_survey_ids', JSON.stringify(state.selectedSurveyIds));
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
    registerServiceWorker();
    loadTakeIds();
    els.homeDateLabel.textContent = new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' });
    if (!localStorage.getItem('opic_onboarded')) startOnboarding();
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
    const t = DATA.surveyTopics.find(x => x.id === topicId);
    const [ic, tone] = t && t.icon ? [t.icon, t.tone || 'tone-primary'] : (TOPIC_ICONS[topicId] || ['book', 'tone-primary']);
    return `<span class="icon-tile ${size} ${tone}">${icon(ic, 'ic')}</span>`;
  }

  function setTopicIds(set) {
    return set.topicIds || [set.topicId];
  }

  // 이 세트가 내 서베이(또는 항상 출제 유형)에 해당하는지
  function setMatchesSurvey(set) {
    if (ALWAYS_TOPICS.includes(set.topicId)) return true;
    return setTopicIds(set).some(id => state.selectedSurveyIds.includes(id));
  }

  const multiSections = () => DATA.surveySections.filter(sec => !sec.single).map(sec => sec.id);
  // 여가·취미·운동·휴가에서 고른 개수 (실제 시험 기준 12개 이상)
  function multiSurveyCount() {
    const multi = multiSections();
    return state.selectedSurveyIds.filter(id => {
      const t = DATA.surveyTopics.find(x => x.id === id);
      return t && multi.includes(t.section);
    }).length;
  }

  // 연습 세트가 있는 서베이 항목
  const topicsWithSets = new Set(DATA.comboSets.flatMap(setTopicIds));

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
    if (state.currentView === 'studio' && viewId !== 'studio') { closeLevelTestSheet(); leaveLevelTestMode(); }
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
    if (state.studioMode === 'leveltest') return;
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
  function selectUserTier(tierKey, { silent = false } = {}) {
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
    if (!silent) showToast(`${preset.name} 맞춤 설정 완료 · 목표 ${preset.targetGrade}`);
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

    els.heroTargetGrade.textContent = target;
    els.heroSurveySummary.textContent = `서베이 ${multiSurveyCount()}개 · 난이도 ${state.difficulty}단계`;
    els.gradeCard.classList.toggle('is-locked', !state.levelTested);
    if (state.levelTested) {
      els.heroCurrentGrade.textContent = state.currentGrade;
      els.heroProgressLabel.textContent = `${target}까지 ${pct}%`;
      els.heroGaugeFill.style.width = `${pct}%`;
      els.heroRoadmapCoach.innerHTML = `<div class="coach-title">${icon('bulb')}${target}까지 가려면</div>${preset.coachGuide}`;
    } else {
      // 레벨테스트 전에는 예상 등급을 보여주지 않는다
      els.heroCurrentGrade.textContent = '?';
      els.heroProgressLabel.textContent = '레벨테스트 후 표시돼요';
      els.heroGaugeFill.style.width = '0%';
      els.heroRoadmapCoach.innerHTML = `
        <div class="coach-title">${icon('target')}지금 내 등급부터 확인해요</div>
        1분만 말해보면 예상 등급과 <strong>${target}까지 남은 거리</strong>를 보여드려요.
        <button class="btn btn-primary btn-sm lock-cta" data-go="leveltest">${icon('mic')}레벨테스트 하기 (3분)</button>`;
    }

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
    const n = multiSurveyCount();
    els.surveyCountBadge.textContent = `${n}개 선택`;
    els.surveyCountBadge.classList.toggle('chip-warn', n < 12);
    if (els.obSurveyCount) {
      els.obSurveyCount.textContent = `${n}개`;
      els.obSurveyCount.classList.toggle('chip-warn', n < 12);
    }
    renderSurveyChips(els.surveyCategoriesContainer);
    if (els.obSurveyContainer) renderSurveyChips(els.obSurveyContainer);
    renderDifficultyCards();
  }

  const SURVEY_MIN = 12; // 실제 시험: Part 4~7에서 12개 이상
  const openSurveyParts = new Set();

  function applyRecommendedSurvey() {
    state.selectedSurveyIds = normalizeSurveyIds(null);
    localStorage.setItem('opic_survey_ids', JSON.stringify(state.selectedSurveyIds));
    renderSurveyScreen();
    renderUserTierAndRoadmap();
    renderPracticeList();
    showToast(`추천 조합 ${multiSurveyCount()}개로 맞췄어요`);
  }

  function surveyShortName(t) {
    return t.name.replace(/\s*\(.*\)$/, '').split(' / ')[0];
  }

  function renderSurveyChips(container) {
    container.innerHTML = '';
    const n = multiSurveyCount();
    const ok = n >= SURVEY_MIN;

    // 12개 규칙 진행 표시
    const progress = document.createElement('div');
    progress.className = `survey-progress ${ok ? 'ok' : ''}`;
    progress.innerHTML = `
      <div class="survey-progress-row">
        <span class="survey-progress-title">${icon(ok ? 'check' : 'target')}Part 4~7에서 ${SURVEY_MIN}개 이상</span>
        <span class="survey-progress-count">지금 <strong>${n}</strong>개${ok ? '' : ` · ${SURVEY_MIN - n}개 더`}</span>
      </div>
      <div class="survey-progress-track"><div class="survey-progress-fill" style="width:${Math.min(100, (n / SURVEY_MIN) * 100)}%"></div></div>
      <div class="survey-progress-foot">
        <span>자기소개 · 롤플레이 · 돌발은 항상 나와요 · <span class="dot-legend"></span> 추천(선택 가능) · 흐린 항목은 준비 중</span>
        <button type="button" class="link-btn" data-action="survey-recommend">${icon('sparkles')}추천 12개로 맞추기</button>
      </div>`;
    container.appendChild(progress);

    DATA.surveySections.forEach(sec => {
      const items = DATA.surveyTopics.filter(t => t.section === sec.id);
      const chosen = items.filter(t => state.selectedSurveyIds.includes(t.id));
      const preview = chosen.length
        ? chosen.slice(0, 3).map(surveyShortName).join(', ') + (chosen.length > 3 ? ` 외 ${chosen.length - 3}개` : '')
        : '아직 안 골랐어요';

      const part = document.createElement('details');
      part.className = 'survey-part';
      part.open = openSurveyParts.has(sec.id);
      part.innerHTML = `
        <summary class="survey-part-head">
          <span class="survey-part-body">
            <span class="survey-part-name">${esc(sec.name)}<span class="survey-hint">${sec.single ? '하나만' : '여러 개'}</span></span>
            <span class="survey-part-preview">${esc(preview)}</span>
          </span>
          <span class="survey-part-count ${!sec.single && chosen.length ? 'on' : ''}">${sec.single ? '' : chosen.length + '개'}</span>
          ${icon('down', 'ic ic-sm survey-part-chev')}
        </summary>`;
      part.addEventListener('toggle', () => {
        if (part.open) openSurveyParts.add(sec.id); else openSurveyParts.delete(sec.id);
      });

      const grid = document.createElement('div');
      grid.className = 'survey-chip-grid';
      items.forEach(topic => {
        const isSel = state.selectedSurveyIds.includes(topic.id);
        const soon = !sec.single && !topicsWithSets.has(topic.id);
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = `survey-chip ${isSel ? 'selected' : ''} ${topicsWithSets.has(topic.id) ? 'has-q' : ''} ${soon ? 'soon' : ''}`;
        chip.setAttribute('aria-pressed', isSel);
        if (soon) { chip.disabled = true; chip.title = '연습 문제 준비 중'; }
        chip.innerHTML = `${topicTile(topic.id, 'xs')}<span>${esc(topic.name)}</span><span class="chip-check">${icon('check')}</span>`;
        chip.onclick = () => {
          if (sec.single) {
            if (isSel) return;
            const sectionIds = items.map(t => t.id);
            state.selectedSurveyIds = state.selectedSurveyIds.filter(id => !sectionIds.includes(id));
            state.selectedSurveyIds.push(topic.id);
          } else if (isSel) {
            if (multiSurveyCount() <= 1) {
              showToast('Part 4~7에서 1개 이상은 골라주세요');
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
      part.appendChild(grid);
      container.appendChild(part);
    });
  }

  function renderDifficultyCards() {
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
    state.studioMode = 'practice';
    document.body.classList.remove('is-leveltest');
    let filtered = DATA.comboSets.filter(setMatchesSurvey);
    if (filtered.length === 0) filtered = [...DATA.comboSets];
    state.activeSets = filtered;
    state.currentSetIndex = 0;
    state.currentQIndex = 0;
  }

  // 라이브러리에서 고른 세트는 서베이와 무관하게 전체 세트 기준으로 연습
  function useAllSets() {
    state.studioMode = 'practice';
    document.body.classList.remove('is-leveltest');
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
    const mine = setMatchesSurvey(set);
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
      (!state.mySurveyOnly || setMatchesSurvey(s))
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
    if (mode === 'studio') beginPendingTake();

    try {
      state.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (mode === 'studio') setupAudioRecorderAndVisualizer(state.mediaStream);
    } catch (_) {
      showToast('마이크 권한을 허용해 주세요');
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const targetTextarea = els.liveTranscriptInput;

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
        els.sttInterimPreview.textContent = interim ? `“${interim}…”` : '';
        updateLiveMetrics();
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
      if (state.studioMode === 'leveltest') {
        recordLevelTestAnswer();
      } else if (els.liveTranscriptInput.value.trim().length > 0) {
        runAiCoaching();
        setTimeout(() => els.btnRunAiCoach.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
      }
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
  // 브라우저가 지원하는 녹음 형식 고르기 (Chrome/Edge: webm, iPhone Safari: mp4)
  function pickRecordingMime() {
    if (!window.MediaRecorder || typeof MediaRecorder.isTypeSupported !== 'function') return '';
    return ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus', 'audio/mpeg']
      .find(t => MediaRecorder.isTypeSupported(t)) || '';
  }

  function audioExt(mime) {
    if (/mp4|aac|m4a/.test(mime)) return 'm4a';
    if (/ogg/.test(mime)) return 'ogg';
    if (/mpeg/.test(mime)) return 'mp3';
    return 'webm';
  }

  let lastRecordingUrl = null;

  function setupAudioRecorderAndVisualizer(stream) {
    state.audioChunks = [];
    try {
      const mime = pickRecordingMime();
      state.mediaRecorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      const actualMime = state.mediaRecorder.mimeType || mime || 'audio/webm';
      state.mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) state.audioChunks.push(e.data);
      };
      state.mediaRecorder.onstop = () => {
        if (state.audioChunks.length > 0) {
          const blob = new Blob(state.audioChunks, { type: actualMime });
          if (lastRecordingUrl) URL.revokeObjectURL(lastRecordingUrl);
          lastRecordingUrl = URL.createObjectURL(blob);
          els.recordedAudioPlayer.src = lastRecordingUrl;
          els.downloadAudioLink.href = lastRecordingUrl;
          els.downloadAudioLink.download = `malmun-answer.${audioExt(actualMime)}`;
          els.audioPlaybackBar.style.display = 'flex';
          if (pendingTake) {
            pendingTake.blob = blob;
            pendingTake.mimeType = actualMime;
            commitPendingTake();
          }
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

  // --- 테이크 저장소 (IndexedDB "malmun" / "takes") ---
  // 테이크 = 답변 1회의 녹음 파일 + 스크립트 + 지표. 기록(opic_history)의 takeId와 연결된다.
  let takeDbPromise = null;
  function openTakeDb() {
    if (takeDbPromise) return takeDbPromise;
    takeDbPromise = new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) { reject(new Error('IndexedDB 미지원')); return; }
      const req = indexedDB.open(TAKE_DB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(TAKE_STORE)) {
          const store = db.createObjectStore(TAKE_STORE, { keyPath: 'id' });
          store.createIndex('createdAt', 'createdAt');
          store.createIndex('questionKey', 'questionKey');
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    takeDbPromise.catch(() => { takeDbPromise = null; });
    return takeDbPromise;
  }

  function takeTx(mode, run) {
    return openTakeDb().then(db => new Promise((resolve, reject) => {
      const tx = db.transaction(TAKE_STORE, mode);
      let req;
      try { req = run(tx.objectStore(TAKE_STORE)); } catch (e) { reject(e); return; }
      tx.oncomplete = () => resolve(req && 'result' in req ? req.result : undefined);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    }));
  }

  const takes = {
    put: (take) => takeTx('readwrite', s => s.put(take)),
    get: (id) => takeTx('readonly', s => s.get(id)),
    remove: (id) => takeTx('readwrite', s => s.delete(id)),
    keys: () => takeTx('readonly', s => s.getAllKeys()),
    clear: () => takeTx('readwrite', s => s.clear()),
    // 오래된 테이크부터 지워 최근 TAKE_LIMIT개만 보관
    prune: () => openTakeDb().then(db => new Promise(resolve => {
      const tx = db.transaction(TAKE_STORE, 'readwrite');
      const index = tx.objectStore(TAKE_STORE).index('createdAt');
      const countReq = index.count();
      countReq.onsuccess = () => {
        let extra = countReq.result - TAKE_LIMIT;
        if (extra <= 0) return;
        index.openCursor().onsuccess = (e) => {
          const cur = e.target.result;
          if (!cur || extra <= 0) return;
          state.takeIds.delete(cur.primaryKey);
          cur.delete();
          extra -= 1;
          cur.continue();
        };
      };
      tx.oncomplete = resolve;
      tx.onerror = resolve;
      tx.onabort = resolve;
    }))
  };

  function loadTakeIds() {
    takes.keys().then(keys => {
      state.takeIds = new Set(keys || []);
      renderHistory();
    }).catch(() => {});
  }

  // 녹음 파일(onstop)과 기록 항목(savePracticeHistoryItem)은 완료 시점이 달라서
  // 둘 다 모이면 그때 저장한다.
  let pendingTake = null;
  function beginPendingTake() {
    pendingTake = {
      id: 'take_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      blob: null,
      mimeType: '',
      meta: null
    };
    return pendingTake;
  }

  function commitPendingTake() {
    const p = pendingTake;
    if (!p || !p.blob || !p.meta) return;
    pendingTake = null;
    const take = Object.assign({ id: p.id }, p.meta, { audio: p.blob, mimeType: p.mimeType });
    takes.put(take)
      .then(() => { state.takeIds.add(take.id); return takes.prune(); })
      .then(() => renderHistory())
      .catch(() => showToast('녹음 파일을 저장하지 못했어요 (스크립트는 기록에 남아요)'));
  }

  function questionKeyOf(set, qIndex) {
    return `${set.id}#${qIndex}`;
  }

  const takeUrls = new Map();
  async function toggleTakePlayer(takeId, btn) {
    const card = btn.closest('.history-card');
    if (!card) return;
    const slot = card.querySelector('.take-player');
    if (!slot.hidden) {
      slot.hidden = true;
      slot.innerHTML = '';
      return;
    }
    try {
      let url = takeUrls.get(takeId);
      if (!url) {
        const take = await takes.get(takeId);
        if (!take || !take.audio) { showToast('녹음 파일을 찾을 수 없어요'); return; }
        url = URL.createObjectURL(take.audio);
        takeUrls.set(takeId, url);
      }
      slot.innerHTML = `${icon('volume')}<audio controls src="${url}"></audio>`;
      slot.hidden = false;
      slot.querySelector('audio').play().catch(() => {});
    } catch (_) {
      showToast('녹음을 불러오지 못했어요');
    }
  }

  function deleteHistoryItem(id) {
    const item = state.history.find(h => h.id === id);
    if (!item) return;
    state.history = state.history.filter(h => h.id !== id);
    localStorage.setItem('opic_history', JSON.stringify(state.history));
    if (item.takeId) {
      state.takeIds.delete(item.takeId);
      takes.remove(item.takeId).catch(() => {});
    }
    renderHistory();
    renderHomeSummary();
    showToast('기록을 삭제했어요');
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

  // --- 레벨테스트: 스튜디오를 '레벨테스트 모드'로 돌린다 (3문항) ---
  function startLevelTest() {
    state.studioMode = 'leveltest';
    state.levelTestAnswers = [];
    state.activeSets = [DATA.levelTestSet];
    document.body.classList.add('is-leveltest');
    openStudio({ setIndex: 0, autoPlay: true });
  }

  function leaveLevelTestMode() {
    if (state.studioMode !== 'leveltest') return;
    state.studioMode = 'practice';
    document.body.classList.remove('is-leveltest');
    filterActiveSetsBySurvey();
    restoreLastSet();
  }

  // 답변 하나 끝날 때마다 저장. 마지막 문항이면 바로 진단
  function recordLevelTestAnswer() {
    const text = els.liveTranscriptInput.value.trim();
    const seconds = state.recordingSeconds || 0;
    const q = getCurrentQuestion();
    const total = getCurrentSet().questions.length;
    state.levelTestAnswers[state.currentQIndex] = text
      ? { badge: q.badge, text, seconds, m: analyzeTranscriptMetrics(text, seconds || 45) }
      : null;
    if (state.currentQIndex >= total - 1) {
      finishLevelTest();
    } else {
      const done = state.levelTestAnswers.filter(Boolean).length;
      els.evaStatusPill.textContent = text
        ? `${done}/${total} 저장했어요. "다음 문제"를 눌러 이어가세요`
        : '인식된 문장이 없어요. 다시 답변하거나 다음 문제로 넘어가세요';
    }
  }

  function tierForGrade(grade) {
    if (grade === 'IL') return 'beginner0';
    if (grade === 'IM1' || grade === 'IM2') return 'beginner';
    if (grade === 'IM3') return 'intermediate';
    return 'advanced';
  }

  const LT_LOADING_STEPS = ['답변 길이를 재고 있어요', '연결어와 과거 시제를 확인하고 있어요', '등급을 계산하고 있어요'];
  let ltLoadingTimer = null;

  function openLevelTestSheet(html, { loading = false } = {}) {
    els.ltSheet.classList.toggle('is-loading', loading);
    els.ltSheetBody.innerHTML = html;
    els.ltSheet.hidden = false;
    els.ltSheet.scrollTop = 0;
    document.body.classList.add('is-lt-sheet');
  }

  function closeLevelTestSheet() {
    clearInterval(ltLoadingTimer);
    els.ltSheet.hidden = true;
    document.body.classList.remove('is-lt-sheet');
  }

  function finishLevelTest() {
    const answers = state.levelTestAnswers.filter(Boolean);
    if (answers.length === 0) {
      showToast('답변이 하나도 없어요. 다시 답변해 주세요');
      return;
    }
    els.evaStatusPill.textContent = '등급을 확인하고 있어요…';

    // 1) 로딩 연출
    openLevelTestSheet(`
      <div class="lt-loading">
        <div class="lt-spinner"><span class="eva-art"><svg viewBox="0 0 104 104"><use href="#i-eva"/></svg></span></div>
        <h2 class="h2">등급을 확인하고 있어요</h2>
        <p class="sub" id="ltLoadingStep">${LT_LOADING_STEPS[0]}</p>
        <div class="lt-dots"><span></span><span></span><span></span></div>
      </div>`, { loading: true });
    let i = 0;
    clearInterval(ltLoadingTimer);
    ltLoadingTimer = setInterval(() => {
      i += 1;
      const el = document.getElementById('ltLoadingStep');
      if (el && LT_LOADING_STEPS[i]) el.textContent = LT_LOADING_STEPS[i];
      const dots = document.querySelectorAll('.lt-dots span');
      dots.forEach((d, k) => d.classList.toggle('on', k <= i));
      if (i >= LT_LOADING_STEPS.length - 1) {
        clearInterval(ltLoadingTimer);
        setTimeout(renderLevelTestResult, 700);
      }
    }, 850);
  }

  function renderLevelTestResult() {
    const answers = state.levelTestAnswers.filter(Boolean);
    const total = getCurrentSet().questions.length;

    // 문항별 등급의 평균 → 과거 시제 문항에서 과거형 동사가 없으면 IM2 이하로 제한
    const ranks = answers.map(x => Math.max(0, gradeRank(x.m.estGrade)));
    let rank = Math.round(ranks.reduce((s, r) => s + r, 0) / ranks.length);
    const pastAnswer = state.levelTestAnswers[total - 1];
    const noPast = !!pastAnswer && pastAnswer.m.pastVerbCount === 0;
    if (noPast) rank = Math.min(rank, gradeRank('IM2'));
    const grade = GRADE_ORDER[rank];

    const avgWords = Math.round(answers.reduce((s, x) => s + x.m.wordCount, 0) / answers.length);
    const avgWpm = Math.round(answers.reduce((s, x) => s + x.m.wpm, 0) / answers.length);
    const fillers = answers.reduce((s, x) => s + x.m.fillerCount, 0);
    const pastVerbs = answers.reduce((s, x) => s + x.m.pastVerbCount, 0);
    const longest = answers.reduce((b, x) => (x.m.wordCount > b.m.wordCount ? x : b), answers[0]);
    const agg = { wordCount: avgWords, wpm: avgWpm, fillerCount: fillers, pastVerbCount: pastVerbs, roadmapToIM3: longest.m.roadmapToIM3 };

    const tier = tierForGrade(grade);
    state.userTier = tier;
    state.currentGrade = grade;
    state.levelTested = true;
    localStorage.setItem('opic_user_tier', tier);
    localStorage.setItem('opic_current_grade', grade);
    localStorage.setItem('opic_level_tested', '1');
    renderUserTierAndRoadmap();

    const notes = [];
    if (avgWords < 65) notes.push(`답변이 평균 <strong>${avgWords}단어</strong>예요. 문항당 70단어(약 50초)를 목표로 한 문장씩 더 붙여보세요.`);
    if (fillers < 2) notes.push('연결어가 거의 없어요. <code>Actually</code> <code>To be honest</code> <code>First of all</code>을 문장 앞에 붙여보세요.');
    if (noPast) notes.push('과거 경험 문항에 <strong>과거형 동사</strong>가 없었어요. <code>went</code> <code>had</code> <code>felt</code>처럼 과거형으로 말해야 IM3 이상이 돼요.');
    else if (pastVerbs < 3) notes.push('과거형 동사를 조금 더 자주 쓰면 과거 경험 문항 점수가 올라가요.');
    if (avgWpm >= 90 && avgWords >= 65) notes.push('말하기 속도와 길이가 좋아요. 감정 표현(I was so relieved)을 섞으면 IH가 보여요.');
    if (answers.length < total) notes.push(`${total - answers.length}문항은 답변이 없어 진단에서 뺐어요.`);

    const rows = getCurrentSet().questions.map((q, i) => {
      const x = state.levelTestAnswers[i];
      return `
        <div class="lt-row">
          <span class="lt-row-q">Q${i + 1}</span>
          <span class="li-body">
            <span class="li-title">${esc(q.badge)}</span>
            <span class="li-sub">${x ? `${x.m.wordCount}단어 · ${formatTime(x.seconds)} · 연결어 ${x.m.fillerCount} · 과거동사 ${x.m.pastVerbCount}` : '답변 없음'}</span>
          </span>
          <span class="grade-pill ${x ? '' : 'muted'}">${x ? esc(x.m.estGrade) : '-'}</span>
        </div>`;
    }).join('');

    const p = TIER_PRESETS[tier];
    const target = state.settings.targetGrade || p.targetGrade;
    const cur = Math.max(0, gradeRank(grade));
    const tgt = Math.max(1, gradeRank(target));
    const pct = Math.min(100, Math.round(((cur + 1) / (tgt + 1)) * 100));
    openLevelTestSheet(`
      <div class="lt-result-hero">
        <span class="chip chip-indigo">레벨테스트 결과</span>
        <div class="lt-result-grade">${esc(grade)}</div>
        <p class="lt-result-cap">지금 예상 등급</p>
        <div class="lt-result-track"><div class="lt-result-fill" style="width:${pct}%"></div></div>
        <p class="lt-result-sub">목표 <strong>${esc(target)}</strong>까지 ${pct}% · 평균 ${avgWords}단어 · ${avgWpm} WPM · 연결어 ${fillers} · 과거동사 ${pastVerbs}</p>
      </div>
      <div class="coach-note">${agg.roadmapToIM3}</div>
      <div class="result-section card-flat">
        <div class="result-section-title"><span>문항별 결과</span></div>
        <div class="lt-rows">${rows}</div>
      </div>
      ${notes.length ? `<div class="result-section"><div class="result-section-title"><span>이렇게 하면 올라가요</span></div><ul class="lt-notes">${notes.map(n => `<li>${n}</li>`).join('')}</ul></div>` : ''}
      <p class="sub" style="margin-top:0.9rem;">홈 로드맵을 <strong>${p.name} 코스(난이도 ${p.difficulty}단계)</strong>에 맞췄어요. 간이 진단이라 실제 등급과 다를 수 있어요.</p>
      <div class="result-actions lt-result-actions">
        <button class="btn btn-ghost btn-lg" data-action="go-home">홈으로</button>
        <button class="btn btn-primary btn-lg" data-action="go-setup">서베이 고르기</button>
      </div>
      <button class="btn btn-ghost btn-block" data-action="lt-close">${icon('replay')}답변 다시 보기 · 다시 답변하기</button>`);
    els.evaStatusPill.textContent = '진단 완료! 결과 화면을 확인하세요';
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
    els.studioSetTitle.innerHTML = state.studioMode === 'leveltest'
      ? `<span class="icon-tile xs tone-indigo">${icon('target', 'ic')}</span>레벨테스트 ${state.currentQIndex + 1}/${set.questions.length}`
      : `${topicTile(set.topicId, 'xs')}${esc(splitSetTitle(set.title).main)}`;
    els.studioSetTitleBtn.disabled = state.studioMode === 'leveltest';
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
    const go = e.target.closest('[data-go]');
    if (go && !go.closest('[data-action]')) { navigateTo(go.dataset.go); return; }
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
    else if (action === 'play-take') toggleTakePlayer(id, btn);
    else if (action === 'survey-recommend') applyRecommendedSurvey();
    else if (action === 'delete-history') { if (confirm('이 기록과 녹음을 삭제할까요?')) deleteHistoryItem(id); }
    else if (action === 'ob-tier') { ob.tier = id; ob.target = TIER_PRESETS[id].targetGrade; renderObTiers(); }
    else if (action === 'ob-target') { ob.target = id; renderObTargets(); }
    else if (action === 'toggle-ko') btn.classList.toggle('hidden-ko');
    else if (action === 'go-home') { closeLevelTestSheet(); navigateTo('home'); }
    else if (action === 'go-setup') { closeLevelTestSheet(); navigateTo('setup'); }
    else if (action === 'lt-close') closeLevelTestSheet();
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
    const seconds = state.recordingSeconds || 0;
    // 스크립트가 없어도 3초 이상 녹음했으면 테이크로 남긴다 (음성 인식 미지원 브라우저 대비)
    if (!text && seconds < 3) return;
    const set = getCurrentSet();
    const q = getCurrentQuestion();
    const m = analyzeTranscriptMetrics(text, seconds || 45);
    const now = new Date();
    const takeId = pendingTake ? pendingTake.id : null;
    const item = {
      id: 'h_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      createdAt: now.toISOString(),
      date: now.toLocaleString('ko-KR'),
      dateKey: now.toLocaleDateString('ko-KR'),
      questionKey: questionKeyOf(set, state.currentQIndex),
      setId: set.id,
      qNum: q.qNum,
      badge: q.badge,
      promptEn: q.promptEn,
      transcript: text,
      durationSec: seconds,
      wordCount: m.wordCount,
      wpm: m.wpm,
      estGrade: m.estGrade,
      takeId
    };
    state.history.unshift(item);
    state.history = state.history.slice(0, 50);
    localStorage.setItem('opic_history', JSON.stringify(state.history));
    if (pendingTake) {
      pendingTake.meta = {
        questionKey: item.questionKey,
        setId: set.id,
        qNum: q.qNum,
        badge: q.badge,
        createdAt: item.createdAt,
        durationSec: seconds,
        transcript: text,
        metrics: { wordCount: m.wordCount, wpm: m.wpm, fillerCount: m.fillerCount, estGrade: m.estGrade }
      };
      commitPendingTake();
    }
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
    if (els.takeCountChip) {
      els.takeCountChip.innerHTML = `${icon('mic')}녹음 ${state.takeIds.size}개 저장됨 · 최근 ${TAKE_LIMIT}개까지`;
    }
    renderHistoryChart();
    if (state.history.length === 0) {
      els.historyListContainer.innerHTML = `<div class="empty"><strong>아직 연습 기록이 없어요</strong>인터뷰에서 답변을 마치면 자동으로 저장돼요.</div>`;
      return;
    }
    els.historyListContainer.innerHTML = state.history.map(h => {
      const hasTake = !!(h.takeId && state.takeIds.has(h.takeId));
      const dur = h.durationSec ? ` · ${formatTime(h.durationSec)}` : '';
      return `
      <div class="history-card" data-history-id="${esc(h.id)}">
        <div class="history-top">
          <span class="grade-pill">${esc(h.estGrade)}</span>
          <span class="li-body">
            <span class="li-title">${esc(h.badge)}</span>
            <span class="li-sub">${esc(h.wordCount)}단어 · ${esc(h.wpm)} WPM${dur} · ${esc(h.date)}</span>
          </span>
          <span class="note-actions">
            ${hasTake ? `<button class="icon-only sm" data-action="play-take" data-id="${esc(h.takeId)}" aria-label="다시 듣기">${icon('play')}</button>` : ''}
            <button class="icon-only sm" data-action="delete-history" data-id="${esc(h.id)}" aria-label="삭제">${icon('trash')}</button>
          </span>
        </div>
        <div class="history-q">Q. ${esc(h.promptEn)}</div>
        ${h.transcript ? `<div class="history-a">${esc(h.transcript)}</div>` : `<div class="history-a caption">스크립트 없음 · 녹음만 저장됨</div>`}
        <div class="take-player" hidden></div>
      </div>`;
    }).join('');
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
    document.addEventListener('click', handleDelegatedClick);

    // 시스템 뒤로가기(ESC)로 시트 닫기 / 몰입화면 나가기
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (openDropdown) { closeDropdown(); return; }
      const open = document.querySelector('.modal-overlay.open');
      if (open) open.classList.remove('open');
      else if (state.currentView === 'onboarding') { if (ob.step > 0) obGo(ob.step - 1); }
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
      const n = multiSurveyCount();
      if (n < SURVEY_MIN && !confirm(`실제 시험은 Part 4~7에서 12개 이상 골라요. 지금은 ${n}개인데 이대로 시작할까요?`)) return;
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
    els.btnStartLevelTest.onclick = startLevelTest;

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
      } else if (state.studioMode === 'leveltest') {
        finishLevelTest();
        return;
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
      if (confirm('연습 기록과 저장된 녹음을 모두 삭제할까요?')) {
        state.history = [];
        localStorage.removeItem('opic_history');
        state.takeIds = new Set();
        takes.clear().catch(() => {});
        renderHistory();
        renderHomeSummary();
      }
    };

    // 설정 시트
    els.openSettingsBtn.onclick = () => {
      els.settingTargetGrade.value = state.settings.targetGrade || 'IM3';
      els.settingSpeechRate.value = state.settings.speechRate || '0.95';
      els.settingPrepSeconds.value = state.settings.prepSeconds || '5';
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
        prepSeconds: els.settingPrepSeconds.value
      };
      localStorage.setItem('opic_settings', JSON.stringify(state.settings));
      renderUserTierAndRoadmap();
      closeDropdown();
      els.settingsModal.classList.remove('open');
      showToast('설정을 저장했어요');
    };
    els.btnRedoOnboarding.onclick = () => {
      closeDropdown();
      els.settingsModal.classList.remove('open');
      startOnboarding();
    };

    // 온보딩
    els.obBackBtn.onclick = () => obGo(ob.step - 1);
    els.obNextBtn.onclick = () => {
      if (ob.step === 3) {
        const n = multiSurveyCount();
        if (n === 0) return showToast('Part 4~7에서 1개 이상 골라주세요');
        if (n < SURVEY_MIN && !confirm(`실제 시험은 Part 4~7에서 12개 이상 골라요. 지금은 ${n}개인데 이대로 갈까요?`)) return;
      }
      if (ob.step >= OB_STEP_COUNT - 1) finishOnboarding(true);
      else obGo(ob.step + 1);
    };
    els.obHomeBtn.onclick = () => finishOnboarding(false);
  }

  // --- 첫 실행 온보딩 ---
  let ob = { step: 0, tier: 'beginner', target: 'IM3' };

  function startOnboarding() {
    const tier = TIER_PRESETS[state.userTier] ? state.userTier : 'beginner';
    ob = { step: 0, tier, target: state.settings.targetGrade || TIER_PRESETS[tier].targetGrade };
    navigateTo('onboarding');
    renderOnboarding();
  }

  function obGo(step) {
    ob.step = Math.max(0, Math.min(OB_STEP_COUNT - 1, step));
    renderOnboarding();
  }

  function renderOnboarding() {
    els.obProgress.innerHTML = Array.from({ length: OB_STEP_COUNT }, (_, i) =>
      `<span class="${i < ob.step ? 'done' : i === ob.step ? 'active' : ''}"></span>`).join('');
    els.obSteps.forEach(sec => sec.classList.toggle('active', parseInt(sec.dataset.step, 10) === ob.step));
    els.obBackBtn.style.visibility = ob.step === 0 ? 'hidden' : 'visible';
    els.obHomeBtn.hidden = ob.step !== OB_STEP_COUNT - 1;

    const labels = ['시작하기', '다음', '다음', '다음', '첫 질문 들어보기'];
    els.obNextBtn.innerHTML = ob.step === OB_STEP_COUNT - 1
      ? `${icon('mic', 'ic')}${labels[ob.step]}`
      : `${labels[ob.step]}${icon('right', 'ic')}`;

    if (ob.step === 1) renderObTiers();
    if (ob.step === 2) renderObTargets();
    if (ob.step === 3) renderSurveyScreen();
    if (ob.step === 4) renderObSummary();
    window.scrollTo({ top: 0 });
  }

  function renderObTiers() {
    els.obTierList.innerHTML = Object.values(TIER_PRESETS).map(p => `
      <button class="option-card ${p.id === ob.tier ? 'selected' : ''}" data-action="ob-tier" data-id="${p.id}">
        <span class="icon-tile md ${p.tone}">${icon(p.icon, 'ic')}</span>
        <span class="option-body"><span class="option-title">${esc(p.name)}</span><span class="option-desc">${esc(p.desc)}</span></span>
        <span class="option-tag">${p.currentGrade} → ${p.targetGrade}</span>
      </button>`).join('');
  }

  function renderObTargets() {
    els.obTargetList.innerHTML = TARGET_GRADES.map(g => `
      <button class="option-card ${g.id === ob.target ? 'selected' : ''}" data-action="ob-target" data-id="${g.id}">
        <span class="icon-tile md ${g.tone}">${icon(g.icon, 'ic')}</span>
        <span class="option-body"><span class="option-title">${g.id}</span><span class="option-desc">${esc(g.desc)}</span></span>
        ${g.id === ob.target ? `<span class="option-tag">${icon('check', 'ic ic-sm')}</span>` : ''}
      </button>`).join('');
  }

  function renderObSummary() {
    const p = TIER_PRESETS[ob.tier];
    const multi = multiSections();
    const names = state.selectedSurveyIds
      .map(id => DATA.surveyTopics.find(t => t.id === id))
      .filter(t => t && multi.includes(t.section))
      .map(t => t.name.replace(/\s*\(.*\)$/, ''));
    const preview = names.slice(0, 3).join(', ') + (names.length > 3 ? ` 외 ${names.length - 3}개` : '');
    els.obSummary.innerHTML = `
      <div class="ob-sum-row">
        <span class="icon-tile md ${p.tone}">${icon(p.icon, 'ic')}</span>
        <span class="ob-sum-body"><span class="ob-sum-k">내 레벨</span><span class="ob-sum-v">${esc(p.name)} · 지금 ${p.currentGrade}</span></span>
      </div>
      <div class="ob-sum-row">
        <span class="icon-tile md tone-primary">${icon('target', 'ic')}</span>
        <span class="ob-sum-body"><span class="ob-sum-k">목표 등급</span><span class="ob-sum-v">${esc(ob.target)}</span></span>
      </div>
      <div class="ob-sum-row">
        <span class="icon-tile md tone-emerald">${icon('list', 'ic')}</span>
        <span class="ob-sum-body"><span class="ob-sum-k">서베이 주제 ${names.length}개</span><span class="ob-sum-v">${esc(preview)}</span></span>
      </div>
      <div class="ob-sum-row">
        <span class="icon-tile md tone-amber">${icon('clock', 'ic')}</span>
        <span class="ob-sum-body"><span class="ob-sum-k">에바 속도 · 준비 시간</span><span class="ob-sum-v">${p.speechRate}x · ${p.prepSeconds}초</span></span>
      </div>`;
  }

  function finishOnboarding(goStudio) {
    selectUserTier(ob.tier, { silent: true });
    state.settings.targetGrade = ob.target;
    localStorage.setItem('opic_settings', JSON.stringify(state.settings));
    localStorage.setItem('opic_onboarded', '1');
    renderUserTierAndRoadmap();
    renderPracticeList();
    filterActiveSetsBySurvey();
    if (goStudio) {
      openStudio({ autoPlay: true });
    } else {
      navigateTo('home');
    }
    showToast(`준비 완료 · ${TIER_PRESETS[ob.tier].name} · 목표 ${ob.target}`);
  }

  // --- 서비스워커 (설치·오프라인) ---
  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    const isLocal = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
    if (location.protocol !== 'https:' && !isLocal) return;
    navigator.serviceWorker.register('./sw.js').catch(() => {});
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
