// OPIc 실전 서베이 주제 및 3콤보 / 롤플레이 / 돌발 문제 데이터베이스
window.OPIC_DATA = {
  surveyTopics: [
    { id: 'intro', category: '필수', name: '자기소개 (1번 고정)', icon: '👋', defaultChecked: true },
    { id: 'house', category: '거주/일상', name: '집 / 거주지 & 집안일', icon: '🏠', defaultChecked: true },
    { id: 'vacation_home', category: '여가/휴가', name: '집에서 보내는 휴가', icon: '🛋️', defaultChecked: true },
    { id: 'park', category: '여가/취미', name: '공원 가기 / 산책', icon: '🌳', defaultChecked: true },
    { id: 'movie', category: '여가/취미', name: '영화 관람', icon: '🎬', defaultChecked: true },
    { id: 'music', category: '여가/취미', name: '음악 감상', icon: '🎧', defaultChecked: true },
    { id: 'cafe', category: '여가/취미', name: '카페 / 커피전문점 가기', icon: '☕', defaultChecked: true },
    { id: 'shopping', category: '여가/취미', name: '쇼핑하기', icon: '🛍️', defaultChecked: true },
    { id: 'workout', category: '운동', name: '헬스 / 조깅 / 걷기', icon: '🏃', defaultChecked: true },
    { id: 'travel', category: '휴가/출장', name: '국내 / 해외 여행', icon: '✈️', defaultChecked: true },
    { id: 'roleplay', category: '필수유형', name: '롤플레이 (11~13번 세트)', icon: '🎭', defaultChecked: true },
    { id: 'unexpected', category: '돌발/이슈', name: '돌발 주제 & 14~15번 (AL 대비)', icon: '⚡', defaultChecked: true }
  ],

  fillerGuides: [
    { phrase: "Well, let me see...", meaning: "음, 어디 보자... (생각할 시간 벌기)" },
    { phrase: "You know what I mean?", meaning: "내 말이 무슨 뜻인지 알지? (자연스러운 추임새)" },
    { phrase: "To be honest with you,", meaning: "솔직히 말씀드리면," },
    { phrase: "What I really love about it is that...", meaning: "제가 여기서 진짜 좋아하는 점은 바로 ~입니다 (강조 구문)" },
    { phrase: "Speaking of which,", meaning: "그 얘기가 나와서 말인데," },
    { phrase: "At that time, I was totally freaked out!", meaning: "그때 저 진짜 완전 당황했잖아요! (감정 표현 - AL 핵심)" },
    { phrase: "All in all, it was a memorable experience.", meaning: "전반적으로 정말 기억에 남는 경험이었습니다. (마무리 만능)" }
  ],

  comboSets: [
    {
      id: 'set_intro',
      topicId: 'intro',
      title: '1번 필수: 자기소개',
      type: 'single',
      questions: [
        {
          qNum: 1,
          badge: '자기소개',
          promptEn: "Let's start the interview now. Tell me something about yourself.",
          promptKo: "이제 인터뷰를 시작하겠습니다. 본인에 대해 간단히 소개해 주세요.",
          targetSec: 60,
          tips: "너무 길게 외운 티를 내기보다 이름/별명, 현재 하는 일, 요즘 관심사나 성격을 자연스럽게 1분 내외로 말하세요.",
          sampleIH: "Hi Eva! Nice to meet you. My name is Min-su, and I'm currently working as an office worker in Seoul. Well, to tell you a little bit about my personality, I'm quite outgoing and love trying new things. In my free time, I usually hang out with my friends at cozy cafes or go for a walk in the park to relieve stress. Nowadays, I'm really into improving my English skills, which is why I'm taking this test today. Anyway, that's pretty much about me!",
          keyExpressions: [
            { en: "relieve stress", ko: "스트레스를 풀다" },
            { en: "be really into ~", ko: "~에 푹 빠져 있다" },
            { en: "That's pretty much about me", ko: "제 소개는 이 정도입니다 (자연스러운 마무리)" }
          ]
        }
      ]
    },
    {
      id: 'set_park',
      topicId: 'park',
      title: '공원 가기 3콤보 (묘사 → 루틴 → 과거 사건)',
      type: 'combo3',
      questions: [
        {
          qNum: 2,
          badge: '콤보 1 · 장소 묘사',
          promptEn: "You indicated in the survey that you like going to parks. Tell me about a park you often go to. Where is it located, and what does it look like?",
          promptKo: "설문에서 공원에 가는 것을 좋아한다고 답하셨습니다. 자주 가는 공원에 대해 말해주세요. 어디에 있고 어떻게 생겼나요?",
          targetSec: 75,
          tips: "위치(집 근처 도보 10분), 시각적 묘사(산책로, 나무, 벤치), 분위기(평화롭고 상쾌함) + 내 감정으로 마무리하세요.",
          sampleIH: "Well, let me tell you about my favorite park near my house. It's a huge neighborhood park located just a 10-minute walk from my apartment. What I really like about this park is that it has a well-maintained walking trail surrounded by tall green trees. Also, there's a small artificial lake right in the middle, so the view is absolutely breathtaking, especially at sunset. Whenever I feel stressed out from work, going there really helps me clear my head.",
          keyExpressions: [
            { en: "just a 10-minute walk from ~", ko: "~에서 걸어서 딱 10분 거리인" },
            { en: "well-maintained walking trail", ko: "관리가 잘 된 산책로" },
            { en: "clear my head", ko: "머리를 식히다 / 생각을 정리하다" }
          ]
        },
        {
          qNum: 3,
          badge: '콤보 2 · 평소 루틴',
          promptEn: "What do you usually do when you go to the park? Tell me about your typical routine from the moment you arrive until you leave.",
          promptKo: "공원에 갈 때 주로 무엇을 하나요? 공원에 도착해서 떠날 때까지의 평소 루틴을 말해 주세요.",
          targetSec: 80,
          tips: "시간 순서(First -> After that -> Before going home)를 활용해 이어폰 끼고 산책하기, 커피 마시기 등을 자연스럽게 연결하세요.",
          sampleIH: "Actually, I have my own little routine whenever I visit the park. First of all, on my way there, I always grab an iced Americano from a local cafe. Once I get to the park, I put on my wireless earbuds and listen to my favorite pop music while walking along the track for about an hour. After working up a light sweat, I usually sit on a bench, watch people walking their dogs, and just zone out for a bit before heading back home.",
          keyExpressions: [
            { en: "grab an iced Americano", ko: "아이스 아메리카노를 한 잔 사서 챙기다" },
            { en: "work up a light sweat", ko: "가볍게 땀을 흘리다" },
            { en: "zone out for a bit", ko: "잠시 멍을 때리다" }
          ]
        },
        {
          qNum: 4,
          badge: '콤보 3 · 기억에 남는 사건 (과거시제)',
          promptEn: "Tell me about a memorable experience that happened at a park. What happened, and why was it so memorable to you?",
          promptKo: "공원에서 있었던 기억에 남는 경험에 대해 말해주세요. 무슨 일이 있었고 왜 그렇게 기억에 남나요?",
          targetSec: 90,
          tips: "IH/AL의 핵심은 '과거 시제(went, saw, started, was)' 정확도와 돌발 상황(갑작스러운 소나기, 잃어버린 물건, 귀여운 강아지 등)에 대한 감정 표현입니다!",
          sampleIH: "Oh, speaking of a memorable experience at the park, something funny happened about two months ago. At that time, the weather was super nice, so I went to the park without checking the weather forecast. While I was walking around the lake, out of nowhere, dark clouds rolled in and it started pouring like crazy! I didn't have an umbrella with me, so I got completely soaked from head to toe. Luckily, a kind stranger shared their umbrella with me until we reached a bus stop. It was embarrassing at first, but looking back, it's a really warm memory.",
          keyExpressions: [
            { en: "out of nowhere", ko: "갑자기 / 느닷없이" },
            { en: "pour like crazy", ko: "비가 미친 듯이 쏟아지다" },
            { en: "get soaked from head to toe", ko: "머리부터 발끝까지 흠뻑 젖다" }
          ]
        }
      ]
    },
    {
      id: 'set_movie',
      topicId: 'movie',
      title: '영화 관람 3콤보 (선호 장르 → 전후 루틴 → 최근 본 영화)',
      type: 'combo3',
      questions: [
        {
          qNum: 5,
          badge: '콤보 1 · 취향 묘사',
          promptEn: "You indicated that you go to the movies. What kind of movies do you like to watch, and why do you prefer that genre?",
          promptKo: "영화를 보러 간다고 하셨는데요. 어떤 장르의 영화를 좋아하며, 왜 그 장르를 선호하시나요?",
          targetSec: 75,
          tips: "액션/SF나 로맨틱 코미디 등 말하기 쉬운 장르를 고르고, 시각 효과/음향이나 스트레스 해소와 연결하세요.",
          sampleIH: "Well, I'm a huge fan of action and sci-fi movies! You know, after a long and exhausting week, watching blockbuster movies with amazing CGI and thrilling sound effects really blows my stress away. Unlike dramas that require a lot of deep thinking, action movies allow me to just sit back, relax, and immerse myself in the story. Plus, watching them on a massive IMAX screen is totally worth the money!",
          keyExpressions: [
            { en: "blow my stress away", ko: "스트레스를 확 날려버리다" },
            { en: "sit back and relax", ko: "편안히 앉아 쉬다" },
            { en: "immerse myself in ~", ko: "~에 푹 몰입하다" }
          ]
        },
        {
          qNum: 6,
          badge: '콤보 2 · 영화관 루틴',
          promptEn: "What do you usually do before and after watching a movie at a theater? Describe your typical routine.",
          promptKo: "영화관에서 영화를 보기 전과 후에 주로 무엇을 하나요? 본인의 평소 루틴을 설명해 주세요.",
          targetSec: 80,
          tips: "스마트폰 앱으로 예매하기 -> 팝콘/콜라 사기 -> 영화 본 후 식당이나 카페에서 영화 이야기 나누기 패턴이 만능입니다.",
          sampleIH: "Before going to the theater, I always book my tickets in advance using a mobile app so I can get the best seats in the middle row. When I arrive at the cinema about 20 minutes early, buying caramel popcorn and a large soda is a must for me! Then, after the movie ends, I usually grab dinner or a cup of coffee with my friends near the theater, and we chat about our favorite scenes and the actors' performances.",
          keyExpressions: [
            { en: "book tickets in advance", ko: "미리 티켓을 예매하다" },
            { en: "~ is a must for me", ko: "나에게 ~는 필수다" },
            { en: "chat about our favorite scenes", ko: "가장 좋았던 장면에 대해 수다를 떨다" }
          ]
        },
        {
          qNum: 7,
          badge: '콤보 3 · 최근 관람 경험',
          promptEn: "Tell me about the last movie you watched. Who did you go with, what was the movie about, and how did you like it?",
          promptKo: "가장 최근에 본 영화에 대해 말해주세요. 누구와 갔고, 어떤 내용이었으며, 소감은 어땠나요?",
          targetSec: 90,
          tips: "실제 영화 줄거리를 복잡하게 설명하려다 막히지 말고, 분위기·주인공·반전·내 감상 위주로 쉽게 풀어가세요!",
          sampleIH: "Just last weekend, I went to a movie theater with my best friend to watch a famous action movie that had been going viral on social media. Basically, the plot was about a retired detective trying to save his family from villains. Honestly, I didn't have high expectations at first, but the storyline was super engaging and full of plot twists! The lead actor's acting was phenomenal, so I was on the edge of my seat the whole time.",
          keyExpressions: [
            { en: "go viral on social media", ko: "SNS에서 입소문이 나다 / 화제가 되다" },
            { en: "full of plot twists", ko: "반전이 가득한" },
            { en: "be on the edge of my seat", ko: "손에 땀을 쥐고(긴장하며) 보다" }
          ]
        }
      ]
    },
    {
      id: 'set_cafe',
      topicId: 'cafe',
      title: '카페/커피전문점 3콤보 (자주 가는 카페 → 첫 방문 → 에피소드)',
      type: 'combo3',
      questions: [
        {
          qNum: 8,
          badge: '콤보 1 · 단골 카페 묘사',
          promptEn: "Tell me about your favorite cafe. Where is it, what does it look like, and why do you like going there?",
          promptKo: "가장 좋아하는 카페에 대해 말해주세요. 어디에 있고, 어떻게 생겼으며, 왜 그곳에 가는 것을 좋아하나요?",
          targetSec: 75,
          tips: "집/회사 근처, 인테리어(우드톤, 채광, 통창), 커피 맛과 디저트, 편안한 의자 등 만능 묘사 템플릿을 쓰세요.",
          sampleIH: "My go-to cafe is a lovely independent coffee shop right across the street from my house. It has huge floor-to-ceiling windows, so plenty of natural sunlight comes in during the day. The interior is decorated in warm wooden tones with lots of plants, giving it a very cozy vibe. Not only do they serve top-notch roasted coffee, but they also have plenty of power outlets, making it the perfect spot to get some work done.",
          keyExpressions: [
            { en: "my go-to cafe", ko: "내가 자주 가는 단골 카페" },
            { en: "floor-to-ceiling windows", ko: "통유리창" },
            { en: "cozy vibe", ko: "아늑한 분위기" }
          ]
        },
        {
          qNum: 9,
          badge: '콤보 2 · 계기/변화',
          promptEn: "How did you first start going to cafes? Has your preference for drinks or cafes changed over time?",
          promptKo: "처음에 어떻게 카페에 다니기 시작했나요? 시간이 지나면서 음료나 카페 취향이 어떻게 바뀌었나요?",
          targetSec: 80,
          tips: "과거(대학생 때 달달한 음료 & 프랜차이즈) vs 현재(직장인이 된 후 아이스 아메리카노 & 조용한 개인 카페) 비교가 가장 말하기 쉽습니다.",
          sampleIH: "When I first started going to cafes back in my college days, I couldn't drink bitter coffee at all. Back then, I used to order super sweet drinks like caramel macchiatos or smoothies at big franchise cafes where I did group projects. However, ever since I started working full-time, my taste has completely changed! Now I basically live on iced Americanos for the caffeine boost, and I much prefer quiet local cafes over crowded chains.",
          keyExpressions: [
            { en: "back in my college days", ko: "내 대학 시절에는" },
            { en: "live on iced Americanos", ko: "아이스 아메리카노를 달고 살다" },
            { en: "caffeine boost", ko: "카페인 충전" }
          ]
        },
        {
          qNum: 10,
          badge: '콤보 3 · 기억에 남는 사건',
          promptEn: "Tell me about an unforgettable incident that happened at a cafe. What happened and how did you deal with it?",
          promptKo: "카페에서 있었던 잊지 못할 사건에 대해 말해주세요. 무슨 일이 있었고 어떻게 대처했나요?",
          targetSec: 90,
          tips: "음료를 쏟았거나, 노트북 충전기를 두고 왔는데 직원이 친절하게 도와줬다는 스토리는 카페·식당·도서관 어디에나 쓸 수 있는 만능 스토리입니다!",
          sampleIH: "A couple of months ago, I had a pretty nerve-wracking experience at a cafe. I was working on my laptop and accidentally knocked over my cup of iced coffee! Fortunately, it missed my laptop by an inch, which was a huge relief, but the table and floor were a total mess. I felt so sorry and embarrassed, so I immediately ran to the counter to apologize. Surprisingly, the staff members were super sweet. They helped me clean it up and even gave me a free refill! Since then, I've become a loyal regular there.",
          keyExpressions: [
            { en: "knock over ~", ko: "~을 쳐서 엎지르다" },
            { en: "miss ~ by an inch", ko: "간발의 차이로 ~을 비껴가다" },
            { en: "become a loyal regular", ko: "충성 단골손님이 되다" }
          ]
        }
      ]
    },
    {
      id: 'set_roleplay_ticket',
      topicId: 'roleplay',
      title: '롤플레이 11~13번: 공연/영화 티켓 예약 & 취소 대안 제시',
      type: 'roleplay',
      questions: [
        {
          qNum: 11,
          badge: '11번 · 질문하기 롤플레이',
          promptEn: "I'd like to give you a situation and ask you to act it out. You want to go to a concert or a movie this weekend with your friend. Call the box office and ask three or four questions to get the information you need.",
          promptKo: "상황을 드릴 테니 연기해 보세요. 이번 주말에 친구와 콘서트나 영화를 보러 가려고 합니다. 매표소에 전화를 걸어 필요한 정보를 얻기 위해 3~4가지 질문을 해보세요.",
          targetSec: 65,
          tips: "인사 -> 전화 목적 -> 질문 3~4개(시간표, 가격/할인, 잔여 좌석, 주차/환불 규정) -> 감사 인사로 깔끔하게 구성하세요.",
          sampleIH: "Hello! How's it going? I'm calling because I'm planning to watch the new concert at your venue with my friend this Saturday, and I have a few questions. First of all, could you tell me what time the evening show starts, and are there still two seats available next to each other? Also, how much are the tickets, and do you offer any credit card discounts? Lastly, I'm thinking of driving there, so is free parking available for visitors? Thank you so much for your help!",
          keyExpressions: [
            { en: "I'm calling because ~", ko: "~ 때문에 전화드렸습니다" },
            { en: "Are there still seats available?", ko: "아직 남아있는 좌석이 있나요?" },
            { en: "Do you offer any discounts?", ko: "제공하는 할인이 있나요?" }
          ]
        },
        {
          qNum: 12,
          badge: '12번 · 문제 해결 / 대안 제시',
          promptEn: "I'm sorry, there's a problem you need to resolve. You bought two tickets for a show tonight with your friend, but you suddenly came down with a bad cold and can't go. Call your friend, explain the situation, and offer two or three alternatives.",
          promptKo: "해결해야 할 문제가 생겼습니다. 오늘 밤 친구와 보기로 한 공연 티켓 두 장을 샀는데, 갑자기 심한 감기에 걸려 갈 수 없게 되었습니다. 친구에게 전화해 상황을 설명하고 2~3가지 대안을 제시하세요.",
          targetSec: 85,
          tips: "미안함 표현 -> 이유 설명(갑작스러운 고열/몸살) -> 대안 1(다음 주말로 일정 변경) -> 대안 2(다른 친구랑 다녀오라고 티켓 양도 + 다음에 내가 밥 사기)로 말하면 완벽합니다.",
          sampleIH: "Hey Chris, it's me! Listen, I feel terrible saying this at the last minute, but I don't think I can make it to the show tonight. Actually, I woke up with a high fever and a terrible sore throat this morning, and the doctor told me to stay in bed. I'm so sorry for ruining our plans! Why don't we reschedule our tickets for next weekend instead? I'll cover the cancellation fee, of course. Or, if you really want to see it tonight, I can send both mobile tickets to you so you can go with another friend. Once I get better next week, dinner is on me! Let me know what works best for you.",
          keyExpressions: [
            { en: "at the last minute", ko: "막판에 / 직전에" },
            { en: "make it to ~", ko: "~에 시간 맞춰 가다/참석하다" },
            { en: "Dinner is on me!", ko: "저녁은 내가 쏠게!" }
          ]
        },
        {
          qNum: 13,
          badge: '13번 · 유사 경험 (과거 사건)',
          promptEn: "That's too bad. Have you ever had to cancel an appointment or a plan at the last minute because of an unexpected situation? Tell me what happened and how it turned out.",
          promptKo: "안됐군요. 예상치 못한 상황 때문에 약속이나 계획을 직전에 취소해야 했던 적이 있나요? 무슨 일이 있었고 어떻게 해결되었는지 말해주세요.",
          targetSec: 90,
          tips: "12번과 비슷하지만 이번엔 '과거의 내 실제 경험'으로 시제를 과거형으로 바꿔 말해야 합니다! (야근/비상 업무 또는 급체/감기 스토리)",
          sampleIH: "Yes, actually, a similar thing happened to me a few months ago. I had promised to go on a weekend trip to Busan with my college friends, and we had already booked our train tickets and hotel. However, the night before the trip, an urgent issue came up at work, and my boss asked me to come into the office on Saturday morning. I was so frustrated and felt really guilty, so I called my friends right away to apologize. Thankfully, they totally understood my situation. Instead of canceling the whole trip, I joined them later that Saturday evening after finishing my work, and I bought them a nice seafood dinner to make it up to them!",
          keyExpressions: [
            { en: "an urgent issue came up", ko: "급한 문제/일이 생겼다" },
            { en: "feel really guilty", ko: "정말 미안하고 죄책감을 느끼다" },
            { en: "make it up to them", ko: "그들에게 만회하다 / 보상하다" }
          ]
        }
      ]
    },
    {
      id: 'set_unexpected_tech',
      topicId: 'unexpected',
      title: '14~15번 고난도 (AL 결정타): 기술/스마트폰 변화 비교 & 사회 이슈',
      type: 'combo2',
      questions: [
        {
          qNum: 14,
          badge: '14번 · 과거 vs 현재 비교',
          promptEn: "How has technology or smartphones changed the way people live compared to the past? Tell me about the biggest differences between the past and today.",
          promptKo: "과거와 비교해 기술이나 스마트폰이 사람들의 생활 방식을 어떻게 바꾸었나요? 과거와 현재의 가장 큰 차이점에 대해 말해주세요.",
          targetSec: 90,
          tips: "14번은 과거(10년 전 현금/직접 방문)와 현재(스마트폰 하나로 금융·쇼핑·배달 해결)의 극적인 대비(Compared to the past, Nowadays)를 쓰면 AL 점수가 크게 올라갑니다.",
          sampleIH: "Well, technology—especially smartphones—has completely revolutionized our daily lives compared to ten or twenty years ago. Back in the past, people had to carry physical wallets with cash and visit banks or stores in person to get things done. However, nowadays, we can do literally everything with just a few taps on our smartphones, from mobile banking and grocery shopping to ordering food delivery at midnight. It has saved us a tremendous amount of time and made our lives way more convenient than ever before.",
          keyExpressions: [
            { en: "completely revolutionize ~", ko: "~을 완전히 혁신하다/바꾸다" },
            { en: "with just a few taps on our smartphones", ko: "스마트폰을 몇 번 터치하는 것만으로" },
            { en: "way more convenient than ever before", ko: "예전보다 훨씬 더 편리한" }
          ]
        },
        {
          qNum: 15,
          badge: '15번 · 사회 이슈 & 내 의견',
          promptEn: "Despite the convenience of smartphones and technology, what are some problems or side effects people face today? What do you think we should do to solve them?",
          promptKo: "스마트폰과 기술의 편리함에도 불구하고, 오늘날 사람들이 겪는 문제점이나 부작용은 무엇인가요? 이를 해결하려면 어떻게 해야 한다고 생각하나요?",
          targetSec: 95,
          tips: "부작용 2가지(스마트폰 중독/대면 소통 감소, 개인정보 유출) + 해결책(디지털 디톡스)을 논리적으로 제시하세요.",
          sampleIH: "That's a really interesting question. While smartphones are super convenient, there are definitely some serious side effects. First of all, too many people are addicted to their screens, which reduces face-to-face communication even when families or friends are sitting at the same table. Secondly, privacy issues and cybercrimes have become a major concern. To tackle these problems, I think individuals should practice 'digital detox' by setting screen time limits, and we should make a conscious effort to put our phones down when spending quality time with loved ones.",
          keyExpressions: [
            { en: "face-to-face communication", ko: "대면 소통" },
            { en: "practice 'digital detox'", ko: "디지털 디톡스를 실천하다" },
            { en: "spend quality time with ~", ko: "~와 알차고 소중한 시간을 보내다" }
          ]
        }
      ]
    },
    {
      id: 'set_house',
      topicId: 'house',
      title: '집/거주지 3콤보 (집 묘사 → 좋아하는 공간 → 집수리/변화 경험)',
      type: 'combo3',
      questions: [
        {
          qNum: 2,
          badge: '콤보 1 · 집/방 묘사',
          promptEn: "Tell me about the place where you live. What does your house or apartment look like, and what is your favorite room?",
          promptKo: "현재 살고 있는 곳에 대해 말해주세요. 집이나 아파트가 어떻게 생겼으며, 가장 좋아하는 공간은 어디인가요?",
          targetSec: 75,
          tips: "아파트/원룸 외관보다는 '내 침실(bedroom)'이나 '거실(living room)' 하나로 좁혀서 아늑한 조명, 침대, 책상 위주로 묘사하세요.",
          sampleIH: "Currently, I live in a cozy apartment located in a quiet residential area. Among all the rooms, my absolute favorite space is definitely my bedroom. I decorated it with warm mood lighting and soft beige curtains, which gives it a very relaxing atmosphere. Right next to my bed, there's a big window where I can enjoy the city view at night. After a long day at work, lying on my bed and watching YouTube is the happiest moment of my day.",
          keyExpressions: [
            { en: "quiet residential area", ko: "조용한 주거 지역" },
            { en: "warm mood lighting", ko: "따뜻한 무드등 조명" },
            { en: "relaxing atmosphere", ko: "편안하고 휴식이 되는 분위기" }
          ]
        },
        {
          qNum: 3,
          badge: '콤보 2 · 집안일 루틴',
          promptEn: "What kind of household chores do you usually do at home? How do you keep your place clean?",
          promptKo: "집에서 주로 어떤 집안일을 하나요? 집을 깨끗하게 유지하기 위해 평소 어떻게 하나요?",
          targetSec: 75,
          tips: "평일에는 바빠서 로봇청소기나 간단한 설거지만 하고, 주말 아침에 몰아서 빨래·환기·청소기를 돌린다고 말하면 자연스럽습니다.",
          sampleIH: "To be honest, since I'm pretty busy on weekdays, I only do simple chores like doing the dishes or taking out the trash. Instead, Sunday morning is my official cleaning day! First, I open all the windows to air out the rooms and put a load of laundry in the washing machine. While the laundry is running, I vacuum the floor and wipe down the desk. Cleaning can be tiring, but seeing my room spotless makes me feel super refreshed.",
          keyExpressions: [
            { en: "air out the rooms", ko: "방을 환기시키다" },
            { en: "put a load of laundry", ko: "빨래를 한 판 돌리다" },
            { en: "spotless", ko: "티끌 하나 없이 깨끗한" }
          ]
        },
        {
          qNum: 4,
          badge: '콤보 3 · 집 구조 변경 / 가구 구입 경험',
          promptEn: "Tell me about a change you recently made to your home, or a problem you had with an appliance at home. What happened?",
          promptKo: "최근 집에서 바꾼 것이나 가전제품 고장 등 집에서 겪었던 문제에 대해 말해주세요.",
          targetSec: 85,
          tips: "보일러/에어컨 고장이나 새 의자·조명 구매 스토리를 쓰면 문제 해결 과정까지 풍성하게 말할 수 있습니다.",
          sampleIH: "Last summer, something terrible happened at my place. Right in the middle of a heatwave, my air conditioner suddenly stopped blowing cold air! It was boiling hot inside, and I couldn't even sleep at night. So the next morning, I called the customer service center right away to request a repair. Thankfully, a technician came over that afternoon and fixed the cooling gas issue in just 30 minutes. I realized how grateful I should be for modern appliances!",
          keyExpressions: [
            { en: "right in the middle of a heatwave", ko: "폭염 한가운데에" },
            { en: "boiling hot", ko: "찜통처럼 푹푹 찌게 더운" },
            { en: "request a repair", ko: "수리를 요청하다" }
          ]
        }
      ]
    },
    {
      id: 'set_vacation_home',
      topicId: 'vacation_home',
      title: '집에서 보내는 휴가(스테이케이션) 3콤보',
      type: 'combo3',
      questions: [
        {
          qNum: 5,
          badge: '콤보 1 · 집콕 휴가 루틴',
          promptEn: "You indicated that you spend your vacations at home. What do you usually do when you take a staycation at home?",
          promptKo: "휴가를 집에서 보낸다고 하셨는데요. 집에서 휴가(스테이케이션)를 보낼 때 주로 무엇을 하나요?",
          targetSec: 75,
          tips: "알람 끄고 늦잠 자기(sleep in), 배달 음식 시켜 먹기, 넷플릭스 정주행(binge-watch) 세 가지를 엮으면 완벽합니다.",
          sampleIH: "Whenever I get a few days off, I love taking a 'staycation' right at home instead of dealing with crowded tourist spots. First of all, I turn off all my morning alarms and sleep in until noon! When I wake up, I order some delicious delivery food like fried chicken or tteokbokki, and I binge-watch Netflix series on my couch all day long. It's the ultimate way for me to recharge my batteries without spending a fortune.",
          keyExpressions: [
            { en: "sleep in until noon", ko: "정오까지 늦잠을 자다" },
            { en: "binge-watch Netflix series", ko: "넷플릭스 시리즈를 몰아보다(정주행하다)" },
            { en: "recharge my batteries", ko: "에너지를 재충전하다" }
          ]
        },
        {
          qNum: 6,
          badge: '콤보 2 · 최근 집에서 보낸 휴가',
          promptEn: "Tell me about the last vacation you spent at home. What did you do, and why did you decide to stay home?",
          promptKo: "가장 최근에 집에서 보낸 휴가에 대해 말해주세요. 무엇을 했고 왜 집에 있기로 결정했나요?",
          targetSec: 80,
          tips: "업무 프로젝트 때문에 너무 피곤해서 여행 대신 집에서 푹 쉬기로 했다는 배경 설명을 넣으세요.",
          sampleIH: "During my last summer vacation, I decided to just stay home for three days because I was completely burned out from a big project at work. If I had gone on a trip, driving in heavy traffic would have made me even more exhausted. So during that vacation, I stayed in my air-conditioned room, read a book I had been putting off, and played video games with my friends online. By the end of the break, I felt completely refreshed!",
          keyExpressions: [
            { en: "completely burned out", ko: "완전히 번아웃이 온 / 기진맥진한" },
            { en: "heavy traffic", ko: "심한 교통 체증" },
            { en: "put off ~", ko: "~을 미루다" }
          ]
        },
        {
          qNum: 7,
          badge: '콤보 3 · 집콕 휴가 중 특별한 사건',
          promptEn: "Did anything unexpected or memorable happen while you were spending your vacation at home? Tell me all the details.",
          promptKo: "집에서 휴가를 보내는 동안 예상치 못했거나 기억에 남는 일이 있었나요? 자세히 말해주세요.",
          targetSec: 85,
          tips: "집에서 쉬는데 친구가 깜짝 방문했거나, 정전/단수 또는 요리 도전 에피소드를 활용해보세요.",
          sampleIH: "Actually, during my last staycation, I tried cooking a fancy steak pasta by following a famous YouTube recipe. At first, everything seemed to go smoothly, but while I was answering a phone call, I accidentally burned the garlic and set off the smoke alarm! The alarm was beeping so loudly that I panicked and opened all the windows in a hurry. Although the kitchen was smoky, the pasta itself turned out surprisingly tasty, so I had a good laugh about it.",
          keyExpressions: [
            { en: "go smoothly", ko: "순조롭게 진행되다" },
            { en: "set off the smoke alarm", ko: "화재경보기를 울리게 하다" },
            { en: "turn out surprisingly tasty", ko: "결과적으로 의외로 맛있게 되다" }
          ]
        }
      ]
    },
    {
      id: 'set_workout',
      topicId: 'workout',
      title: '운동(헬스/조깅) 3콤보 (종류/장소 → 시작 계기 → 부상/극복 경험)',
      type: 'combo3',
      questions: [
        {
          qNum: 8,
          badge: '콤보 1 · 운동 루틴 & 장소',
          promptEn: "You indicated in the survey that you work out or jog. Where do you usually exercise, and what is your workout routine?",
          promptKo: "설문에서 운동이나 조깅을 한다고 하셨습니다. 주로 어디서 운동하며 평소 운동 루틴은 어떤가요?",
          targetSec: 75,
          tips: "스트레칭 -> 유산소(러닝머신 20분) -> 근력운동 -> 단백질 쉐이크 마시기 순서로 말하면 막힘없이 술술 나옵니다.",
          sampleIH: "I try to work out at a local gym near my house at least three times a week to stay in shape. When I get to the gym, I always start with 10 minutes of light stretching so I don't get injured. Then, I do some weight training for about 40 minutes and finish up by running on the treadmill while watching YouTube. After a good workout, drinking a cold protein shake makes me feel like I accomplished something great!",
          keyExpressions: [
            { en: "stay in shape", ko: "건강/몸매를 유지하다" },
            { en: "run on the treadmill", ko: "러닝머신에서 뛰다" },
            { en: "feel like I accomplished something", ko: "무언가 성취한 기분이 들다" }
          ]
        },
        {
          qNum: 9,
          badge: '콤보 2 · 운동을 시작한 계기 & 변화',
          promptEn: "How did you first get interested in working out? What changes have you experienced since you started exercising regularly?",
          promptKo: "처음에 어떻게 운동에 관심을 갖게 되었나요? 규칙적으로 운동을 시작한 이후 어떤 변화를 겪었나요?",
          targetSec: 80,
          tips: "오래 앉아 일하다 보니 체력이 떨어지고 허리가 아파서 시작했고, 이제는 활력이 생기고 숙면을 취한다는 흐름이 좋습니다.",
          sampleIH: "Actually, I wasn't a big fan of exercising in the past. However, a couple of years ago, because I sat in front of a computer all day long, I gained a lot of weight and constantly felt fatigued. That was a huge wake-up call for me! So I signed up for a gym membership right away. Ever since I made working out a habit, not only have I lost some weight, but my stamina and sleep quality have improved dramatically.",
          keyExpressions: [
            { en: "constantly feel fatigued", ko: "늘 피로감을 느끼다" },
            { en: "a huge wake-up call", ko: "큰 경각심을 주는 계기 / 충격요법" },
            { en: "make ~ a habit", ko: "~을 습관으로 만들다" }
          ]
        },
        {
          qNum: 10,
          badge: '콤보 3 · 운동 중 기억에 남는 사건',
          promptEn: "Tell me about a memorable event or a small problem you experienced while exercising or jogging.",
          promptKo: "운동이나 조깅을 하다가 겪었던 기억에 남는 일이나 작은 문제에 대해 말해주세요.",
          targetSec: 85,
          tips: "준비운동 없이 무리하다가 근육통(muscle soreness)이 심하게 왔던 경험이나, 야외 조깅 중 소나기를 만난 스토리가 만능입니다.",
          sampleIH: "A few months ago, I was overly ambitious at the gym and tried lifting much heavier weights than usual without warming up properly. At that moment, I felt fine, but the very next morning, my legs and arms were so sore that I could barely get out of bed! Walking down the stairs at the subway station was pure torture for three days. Through that experience, I learned the hard way that warming up and knowing my limits are super important.",
          keyExpressions: [
            { en: "without warming up properly", ko: "제대로 준비운동을 하지 않고" },
            { en: "so sore that I could barely ~", ko: "너무 근육통이 심해서 간신히 ~하다" },
            { en: "learn the hard way", ko: "직접 고생하며 교훈을 얻다" }
          ]
        }
      ]
    },
    {
      id: 'set_travel',
      topicId: 'travel',
      title: '국내/해외여행 3콤보 (짐 싸기 루틴 → 기억에 남는 여행지 → 여행 중 돌발사건)',
      type: 'combo3',
      questions: [
        {
          qNum: 5,
          badge: '콤보 1 · 여행 준비 & 짐 싸기',
          promptEn: "What do you usually pack or prepare before going on a domestic or international trip?",
          promptKo: "국내나 해외여행을 가기 전에 주로 무엇을 챙기거나 준비하나요?",
          targetSec: 75,
          tips: "맛집/숙소 검색 -> 체크리스트 작성 -> 보조배터리·상비약·편한 신발 챙기기로 연결하세요.",
          sampleIH: "Whenever I prepare for a trip, making a packing checklist on my phone is the very first thing I do so I don't leave anything behind. Besides basic clothes and toiletries, there are three must-have items I always pack: a portable charger because I take tons of photos, a pair of comfortable sneakers for walking all day, and some basic medicine like painkillers just in case. Also, I love looking up famous local restaurants on Instagram beforehand!",
          keyExpressions: [
            { en: "leave anything behind", ko: "무언가를 두고 가다 / 빠뜨리다" },
            { en: "must-have items", ko: "필수 아이템들" },
            { en: "portable charger", ko: "보조배터리" }
          ]
        },
        {
          qNum: 6,
          badge: '콤보 2 · 기억에 남는 여행지',
          promptEn: "Tell me about a memorable trip you took recently. Where did you go, who did you go with, and what did you do there?",
          promptKo: "최근에 다녀온 기억에 남는 여행에 대해 말해주세요. 어디에 누구와 갔고, 그곳에서 무엇을 했나요?",
          targetSec: 85,
          tips: "제주도, 부산, 도쿄/오사카 등 해변과 맛집이 있는 곳으로 설정하면 자연경관 묘사 + 먹방 묘사를 동시에 할 수 있습니다.",
          sampleIH: "One of the most unforgettable trips I've ever taken was my trip to Jeju Island with my close friends last spring. The weather was absolutely gorgeous the whole time. During the trip, we rented a car and drove along the coastal road while listening to upbeat music. The emerald ocean view was out of this world! In the evening, we ate grilled black pork and fresh seafood, which literally melted in my mouth. Everything about that trip was just perfect.",
          keyExpressions: [
            { en: "drive along the coastal road", ko: "해안도로를 따라 드라이브하다" },
            { en: "out of this world", ko: "이 세상 것이 아닌 것처럼 환상적인" },
            { en: "literally melt in my mouth", ko: "말 그대로 입에서 살살 녹다" }
          ]
        },
        {
          qNum: 7,
          badge: '콤보 3 · 여행 중 겪은 난감한 사건',
          promptEn: "Sometimes things don't go as planned when traveling. Tell me about an unexpected problem or difficulty you faced during a trip.",
          promptKo: "여행을 하다 보면 계획대로 되지 않을 때가 있습니다. 여행 중 겪었던 예상치 못한 문제나 어려움에 대해 말해주세요.",
          targetSec: 90,
          tips: "유명 맛집에 갔는데 임시 휴무(closed)였거나, 길을 잃었는데 우연히 들어간 동네 식당이 대박이었다는 '전화위복' 스토리가 최고입니다!",
          sampleIH: "When I traveled to Busan last year, things didn't go as planned on the first day. My friend and I took a taxi for 40 minutes to visit a famous soup restaurant we saw on YouTube. However, when we arrived, there was a sign on the door saying they were closed for renovation! We were starving and super disappointed. Having no choice, we just walked into a random small restaurant nearby. Surprisingly, the food there was a hidden gem and tasted amazing! It turned out to be a blessing in disguise.",
          keyExpressions: [
            { en: "closed for renovation", ko: "리모델링/내부 수리로 휴무인" },
            { en: "a hidden gem", ko: "숨은 보석 같은 맛집/장소" },
            { en: "a blessing in disguise", ko: "전화위복 (불행인 줄 알았는데 오히려 다행인 일)" }
          ]
        }
      ]
    },
    {
      id: 'set_music',
      topicId: 'music',
      title: '음악 감상 3콤보 (선호 장르/가수 → 듣는 상황 → 라이브/취향 변화)',
      type: 'combo3',
      questions: [
        {
          qNum: 2,
          badge: '콤보 1 · 좋아하는 음악 & 이유',
          promptEn: "You indicated in the survey that you enjoy listening to music. What kind of music do you like, and who is your favorite singer or musician?",
          promptKo: "설문에서 음악 감상을 즐긴다고 하셨습니다. 어떤 장르의 음악을 좋아하며, 가장 좋아하는 가수는 누구인가요?",
          targetSec: 75,
          tips: "K-pop이나 팝송(신나는 비트 -> 기분 전환, 잔잔한 발라드 -> 자기 전 힐링) 두 가지를 묶어 말하면 분량 채우기가 아주 쉽습니다.",
          sampleIH: "Well, I'm a big fan of upbeat pop music and K-pop! Whenever I feel down or exhausted, listening to songs with catchy melodies and energetic beats instantly lifts my mood. My all-time favorite artist is IU because her voice is so soothing and her lyrics are really relatable. Whether I'm commuting to work or working out at the gym, her playlist is always on repeat on my phone.",
          keyExpressions: [
            { en: "catchy melodies", ko: "귀에 쏙 들어오는(중독성 있는) 멜로디" },
            { en: "instantly lift my mood", ko: "즉시 내 기분을 업시켜 주다" },
            { en: "always on repeat", ko: "항상 무한 반복 재생 중이다" }
          ]
        },
        {
          qNum: 3,
          badge: '콤보 2 · 음악 듣는 기기 & 평소 습관',
          promptEn: "When and where do you usually listen to music? What device or app do you use to listen to music?",
          promptKo: "주로 언제, 어디서 음악을 듣나요? 음악을 들을 때 어떤 기기나 앱을 사용하나요?",
          targetSec: 75,
          tips: "출퇴근길(지하철/버스)에 노이즈 캔슬링 이어폰 + 유튜브 뮤직/스포티파이 조합은 현대인 만능 답변입니다.",
          sampleIH: "I pretty much listen to music every single day, especially during my morning and evening commute. As soon as I leave home, I put on my noise-canceling wireless earbuds and stream music through YouTube Music on my smartphone. The noise-canceling feature blocks out all the subway noise, creating my own peaceful little world. Also, I like playing soft lo-fi music in the background when I'm reading or working at home.",
          keyExpressions: [
            { en: "during my morning commute", ko: "아침 출근길 동안에" },
            { en: "noise-canceling wireless earbuds", ko: "노이즈 캔슬링 무선 이어폰" },
            { en: "block out all the noise", ko: "모든 소음을 차단하다" }
          ]
        },
        {
          qNum: 4,
          badge: '콤보 3 · 콘서트 관람 또는 음악 취향 변화',
          promptEn: "How has your taste in music changed from when you were young to now? Or tell me about a memorable live performance you watched.",
          promptKo: "어렸을 때와 지금을 비교했을 때 음악 취향이 어떻게 변했나요? 또는 기억에 남는 라이브 공연 경험을 말해주세요.",
          targetSec: 85,
          tips: "학창 시절엔 빠르고 시끄러운 힙합/댄스곡만 들었는데, 나이 들면서 가사가 좋은 어쿠스틱/팝송도 좋아하게 되었다는 흐름이 자연스럽습니다.",
          sampleIH: "Looking back, my taste in music has broadened quite a bit over the years. When I was a teenager, I was only into fast-paced dance music and hip-hop because my friends and I loved singing them at karaoke. However, as I got older, I started appreciating acoustic ballads and jazz music as well. Especially after a hectic day at work, calm instrumental music helps me unwind way better than loud songs.",
          keyExpressions: [
            { en: "broaden quite a bit", ko: "(폭이) 꽤 많이 넓어지다" },
            { en: "a hectic day at work", ko: "직장에서의 정신없이 바쁜 하루" },
            { en: "help me unwind", ko: "긴장을 풀고 쉬는 데 도움이 되다" }
          ]
        }
      ]
    },
    {
      id: 'set_shopping',
      topicId: 'shopping',
      title: '쇼핑하기 3콤보 (선호 쇼핑 방식 → 온라인 vs 오프라인 → 쇼핑 실패/환불 경험)',
      type: 'combo3',
      questions: [
        {
          qNum: 5,
          badge: '콤보 1 · 평소 쇼핑 습관',
          promptEn: "You indicated that you enjoy shopping. Where do you usually go shopping, and what do you like to buy?",
          promptKo: "쇼핑을 즐긴다고 답하셨는데요. 주로 어디서 쇼핑을 하며, 무엇을 사는 것을 좋아하나요?",
          targetSec: 75,
          tips: "평소 생필품/음식은 새벽배송(온라인)으로 사고, 옷이나 신발은 주말에 복합쇼핑몰(오프라인)에 가서 직접 입어보고 산다고 말해보세요.",
          sampleIH: "Well, it depends on what I'm buying! For groceries and daily necessities, I almost always shop online using mobile apps because overnight delivery is insanely convenient in Korea. On the other hand, when it comes to buying clothes or shoes, I prefer visiting a huge shopping mall on weekends. Trying things on in person and checking the fabric quality is half the fun of shopping!",
          keyExpressions: [
            { en: "daily necessities", ko: "생필품" },
            { en: "overnight delivery", ko: "새벽 배송 / 익일 배송" },
            { en: "try things on in person", ko: "직접 입어보다/착용해 보다" }
          ]
        },
        {
          qNum: 6,
          badge: '콤보 2 · 좋아하는 쇼핑몰 묘사',
          promptEn: "Tell me about your favorite department store or shopping mall. What does it look like, and why do you like going there?",
          promptKo: "가장 좋아하는 백화점이나 쇼핑몰에 대해 말해주세요. 어떻게 생겼고 왜 그곳에 가는 걸 좋아하나요?",
          targetSec: 80,
          tips: "실내 복합 쇼핑몰(COEX, 더현대 등)은 날씨 상관없이 쇼핑·영화·맛집을 한곳에서 해결(one-stop place)할 수 있다는 점이 핵심 포인트입니다.",
          sampleIH: "My favorite shopping spot is a massive indoor shopping mall located downtown. What's great about this place is that it's a one-stop complex where I can shop, eat, and watch movies all under one roof, regardless of the weather outside. Even if I don't buy anything, just window-shopping and checking out trendy pop-up stores there on the weekend is super entertaining.",
          keyExpressions: [
            { en: "all under one roof", ko: "한 지붕 아래(한곳)에서 모두" },
            { en: "regardless of the weather", ko: "날씨에 상관없이" },
            { en: "window-shopping", ko: "아이쇼핑(구경만 하는 쇼핑)" }
          ]
        },
        {
          qNum: 7,
          badge: '콤보 3 · 쇼핑 중 겪은 문제 (사이즈/환불 에피소드)',
          promptEn: "Tell me about a time when you had a problem while shopping, such as buying a defective item or getting the wrong size. How did you resolve it?",
          promptKo: "불량품을 샀거나 사이즈가 맞지 않는 등 쇼핑 중 문제를 겪었던 경험에 대해 말해주세요. 어떻게 해결하셨나요?",
          targetSec: 90,
          tips: "온라인으로 재킷/신발을 샀는데 사진과 색상이 다르거나 사이즈가 작아서 교환(exchange) 신청을 했다는 스토리는 쇼핑·패션·인터넷 어디에나 쓸 수 있습니다!",
          sampleIH: "Last month, I bought a winter jacket from an online shopping mall because it was on a big sale. However, when the package arrived and I tried it on, I was so bummed out! Not only was the size way smaller than I expected, but there was also a small stain on the sleeve. So I immediately took photos of the defect and requested an exchange through the customer service app. Thankfully, the courier picked it up the next day, and they sent me a brand-new one in a larger size within three days.",
          keyExpressions: [
            { en: "on a big sale", ko: "대폭 할인 중인" },
            { en: "be so bummed out", ko: "너무 실망하다 / 속상하다" },
            { en: "request an exchange", ko: "교환을 요청하다" }
          ]
        }
      ]
    }
  ]
};


