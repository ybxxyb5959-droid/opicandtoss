// 말문 추가 문제 데이터 (P1-7 문제 확충)
// questions-data.js 뒤에 로드되어 window.OPIC_DATA.comboSets에 세트를 추가한다.
// 형식은 questions-data.js와 동일: { id, topicId, topicIds?, title, type, questions:[{ qNum, badge, promptEn, promptKo, targetSec, tips, sampleIH, keyExpressions }] }
(function () {
  const D = window.OPIC_DATA;
  if (!D || !Array.isArray(D.comboSets)) return;

  const RP = (setId, title, q11, q12, q13, topicIds) => ({
    id: setId, topicId: 'roleplay', topicIds, title, type: 'roleplay',
    questions: [
      Object.assign({ qNum: 11, badge: '11번 · 질문하기 롤플레이', targetSec: 65 }, q11),
      Object.assign({ qNum: 12, badge: '12번 · 문제 해결 / 대안 제시', targetSec: 85 }, q12),
      Object.assign({ qNum: 13, badge: '13번 · 유사 경험 (과거 사건)', targetSec: 90 }, q13)
    ]
  });
  const ADV = (setId, title, q14, q15) => ({
    id: setId, topicId: 'unexpected', title, type: 'combo2',
    questions: [
      Object.assign({ qNum: 14, badge: '14번 · 과거 vs 현재 비교', targetSec: 95 }, q14),
      Object.assign({ qNum: 15, badge: '15번 · 사회 이슈 / 우려', targetSec: 100 }, q15)
    ]
  });
  const C3 = (setId, topicId, title, q1, q2, q3, extra) => Object.assign({
    id: setId, topicId, title, type: 'combo3',
    questions: [
      Object.assign({ qNum: 2, badge: '콤보 1 · 묘사', targetSec: 75 }, q1),
      Object.assign({ qNum: 3, badge: '콤보 2 · 루틴 / 활동', targetSec: 80 }, q2),
      Object.assign({ qNum: 4, badge: '콤보 3 · 과거 경험', targetSec: 90 }, q3)
    ]
  }, extra || {});

  const extra = [
    /* ==================== 롤플레이 11~13번 ==================== */
    RP('set_roleplay_travel', '롤플레이 11~13번: 여행사 문의 & 항공편 취소 대처',
      {
        promptEn: "I'd like to give you a situation to act out. You are planning a trip abroad and want to book a package tour. Call a travel agency and ask three or four questions about the tour.",
        promptKo: "상황을 드릴게요. 해외여행을 계획 중이고 패키지 상품을 예약하려 합니다. 여행사에 전화해 상품에 대해 3~4가지 질문을 하세요.",
        tips: "출발 날짜·기간 → 가격에 포함된 것(호텔·식사·항공) → 일정/자유시간 → 취소 규정 순으로 물어보세요.",
        sampleIH: "Hi, good afternoon. I'm calling because I saw your five-day Osaka package on your website, and I'm thinking of booking it for next month. First, could you tell me which dates are still available in early May? Also, does the price include the flight, hotel, and breakfast, or is it just the hotel? One more thing, how much free time do we get each day? I'd love to explore some local cafes on my own. And lastly, what's your cancellation policy if something comes up? Thanks a lot!",
        keyExpressions: [
          { en: "I'm thinking of booking it for ~", ko: "~에 예약할까 생각 중이에요" },
          { en: "Does the price include ~?", ko: "가격에 ~가 포함되나요?" },
          { en: "if something comes up", ko: "혹시 무슨 일이 생기면" }
        ]
      },
      {
        promptEn: "There is a problem you need to resolve. You arrived at the airport, but your flight was suddenly canceled because of bad weather. Talk to the airline staff, explain your situation, and suggest two or three solutions.",
        promptKo: "문제가 생겼습니다. 공항에 도착했는데 악천후로 항공편이 갑자기 취소됐어요. 항공사 직원에게 상황을 설명하고 2~3가지 해결책을 제안하세요.",
        tips: "차분하게 상황 설명 → 대안 1(오늘 밤 다른 항공편) → 대안 2(내일 첫 비행기 + 호텔 제공) → 대안 3(전액 환불). 공손한 표현(Would it be possible to ~?)을 쓰세요.",
        sampleIH: "Excuse me, I just found out that my flight to Jeju has been canceled because of the storm, and I really need to get there tonight for my friend's wedding tomorrow morning. I understand it's not your fault, but could you help me find a solution? First, would it be possible to put me on another flight tonight, even with a different airline? If that's not an option, could you book me on the first flight tomorrow morning and provide a hotel voucher for tonight? Otherwise, I'd like a full refund so I can take the KTX and a ferry instead. Which option would work best?",
        keyExpressions: [
          { en: "I just found out that ~", ko: "방금 ~라는 걸 알게 됐어요" },
          { en: "Would it be possible to ~?", ko: "~하는 게 가능할까요?" },
          { en: "If that's not an option,", ko: "그게 안 된다면," }
        ]
      },
      {
        promptEn: "That's a tough situation. Have you ever experienced a problem while traveling, such as a delay, a lost item, or a booking mistake? Tell me what happened and how you handled it.",
        promptKo: "힘든 상황이네요. 여행 중에 지연, 분실, 예약 실수 같은 문제를 겪은 적이 있나요? 무슨 일이었고 어떻게 해결했는지 말해주세요.",
        tips: "언제·어디서 → 무슨 문제 → 그때 감정 → 어떻게 해결 → 배운 점. 과거형 동사와 감정 표현을 꼭 넣으세요.",
        sampleIH: "Yes, actually, something like that happened to me two years ago in Bangkok. On the last day of the trip, I realized that I had left my passport in the hotel safe, and I was already at the airport! I was totally freaked out because my flight was leaving in two hours. I immediately called the hotel, and luckily, the staff were super kind and sent the passport by taxi right away. It arrived just thirty minutes before boarding. Looking back, it was the most stressful moment of my life, but it taught me to double-check everything before leaving a hotel.",
        keyExpressions: [
          { en: "I realized that I had left ~", ko: "~를 두고 왔다는 걸 깨달았어요" },
          { en: "totally freaked out", ko: "완전히 당황한" },
          { en: "it taught me to ~", ko: "그 일로 ~하는 법을 배웠어요" }
        ]
      }, ['travel_domestic', 'travel_abroad']),

    RP('set_roleplay_gym', '롤플레이 11~13번: 헬스장 등록 문의 & 멤버십 문제',
      {
        promptEn: "I'd like to give you a situation to act out. You want to join a gym near your office. Call the gym and ask three or four questions about membership.",
        promptKo: "상황을 드릴게요. 회사 근처 헬스장에 등록하려고 합니다. 헬스장에 전화해 멤버십에 대해 3~4가지 질문을 하세요.",
        tips: "운영 시간 → 월 회비·할인 → 시설(샤워실·PT·수업) → 체험 가능 여부 순서로 물어보세요.",
        sampleIH: "Hi, I'm calling because I work right across the street and I'm interested in signing up for a membership. Could you tell me what time you open and close on weekdays? I usually finish work around seven. Also, how much is a monthly membership, and is there a discount if I pay for six months at once? One more question, do you have shower rooms and lockers, and are group classes like yoga included in the price? Oh, and is it possible to get a free trial day before I decide? Thank you!",
        keyExpressions: [
          { en: "sign up for a membership", ko: "회원 등록을 하다" },
          { en: "Is there a discount if ~?", ko: "~하면 할인이 있나요?" },
          { en: "a free trial day", ko: "무료 체험일" }
        ]
      },
      {
        promptEn: "There is a problem you need to resolve. You paid for a six-month membership, but you have to move to another city next month for work. Call the gym, explain the situation, and suggest two or three alternatives.",
        promptKo: "문제가 생겼습니다. 6개월 멤버십을 결제했는데 다음 달 일 때문에 다른 도시로 이사하게 됐어요. 헬스장에 전화해 상황을 설명하고 2~3가지 대안을 제시하세요.",
        tips: "사정 설명(갑작스러운 발령) → 대안 1(남은 기간 환불) → 대안 2(지점 이전) → 대안 3(친구에게 양도) 순으로 정중하게.",
        sampleIH: "Hello, this is Min-ji, a member since March. I'm really sorry to bother you, but I have a situation. My company suddenly transferred me to Daejeon starting next month, so I won't be able to use the gym anymore. I paid for six months, and there are still four months left. Would it be possible to get a refund for the remaining months? If a refund isn't possible, could I transfer my membership to your Daejeon branch instead? Or, as a last option, I could hand over the rest of my membership to my coworker who wants to join. Please let me know what works for you. I really appreciate your help.",
        keyExpressions: [
          { en: "I'm sorry to bother you, but ~", ko: "번거롭게 해드려 죄송하지만 ~" },
          { en: "the remaining months", ko: "남은 개월" },
          { en: "hand over ~ to ~", ko: "~를 ~에게 넘기다 / 양도하다" }
        ]
      },
      {
        promptEn: "That's unfortunate. Have you ever had a problem with a membership, a subscription, or a reservation? Tell me what happened and how you solved it.",
        promptKo: "안타깝네요. 멤버십, 구독, 예약 등에서 문제를 겪은 적이 있나요? 무슨 일이 있었고 어떻게 해결했는지 말해주세요.",
        tips: "12번과 비슷한 소재를 '실제 과거 경험'으로. 돈이 걸린 문제는 '어떻게 해결했는지'와 '느낀 점'이 핵심이에요.",
        sampleIH: "Yes, I had a frustrating experience last year with a yoga studio. I signed up for a three-month class, but after two weeks, I hurt my back and my doctor told me to stop exercising for a while. When I asked for a refund, the studio said it was against their policy. I was pretty upset at first, but instead of arguing, I calmly showed them my doctor's note and asked if I could pause my membership. Thankfully, the manager understood and extended my membership for two months. Looking back, I learned that staying calm and explaining the situation clearly works much better than getting angry.",
        keyExpressions: [
          { en: "it was against their policy", ko: "그건 규정에 어긋난다고 했어요" },
          { en: "pause my membership", ko: "멤버십을 일시 정지하다" },
          { en: "works much better than ~", ko: "~보다 훨씬 효과가 있다" }
        ]
      }, ['gym', 'fitness_class', 'yoga']),

    RP('set_roleplay_restaurant', '롤플레이 11~13번: 식당 예약 문의 & 예약 변경',
      {
        promptEn: "I'd like to give you a situation to act out. You want to have dinner with your family at a new restaurant this Friday. Call the restaurant and ask three or four questions to make a reservation.",
        promptKo: "상황을 드릴게요. 이번 금요일에 가족과 새로 생긴 식당에서 저녁을 먹으려고 합니다. 식당에 전화해 예약을 위해 3~4가지 질문을 하세요.",
        tips: "인원·시간 가능 여부 → 메뉴(코스/채식/아이 메뉴) → 주차 → 예약금/취소 규정. 질문마다 '왜 묻는지' 한 마디 붙이면 자연스러워요.",
        sampleIH: "Hello, I'd like to make a reservation for this Friday evening. Do you have a table for five people around seven o'clock? It's my mom's birthday, so I'm hoping for a quiet table if possible. Also, could you tell me a little about your menu? My dad doesn't eat seafood, so I want to make sure there are some meat or vegetarian options. Another thing, is there parking available near the restaurant? And finally, do I need to pay a deposit for the reservation? Thank you so much!",
        keyExpressions: [
          { en: "make a reservation for ~", ko: "~로 예약하다" },
          { en: "if possible", ko: "가능하다면" },
          { en: "Do I need to pay a deposit?", ko: "예약금을 내야 하나요?" }
        ]
      },
      {
        promptEn: "There is a problem you need to resolve. You reserved a table for five, but two more relatives decided to join at the last minute, and you're also running 20 minutes late. Call the restaurant, explain, and offer two or three solutions.",
        promptKo: "문제가 생겼습니다. 5명으로 예약했는데 친척 2명이 갑자기 더 오기로 했고, 20분 정도 늦을 것 같아요. 식당에 전화해 상황을 설명하고 2~3가지 해결책을 제안하세요.",
        tips: "사과 → 두 가지 변경 사항을 명확히 → 대안(테이블 합치기 / 시간 늦추기 / 두 팀으로 나눠 앉기) → 안 되면 예약 취소도 감수한다는 태도.",
        sampleIH: "Hi, this is Ji-ho. I have a reservation for five at seven tonight, and I'm so sorry, but I need to make two changes. First, two more relatives decided to join us, so we'll be seven people instead of five. Second, we're stuck in traffic, so we'll probably arrive around seven twenty. Is there any way you could put two tables together for us? If that's difficult, we could move our reservation to eight o'clock so you have time to prepare. Or, if it's easier for you, we don't mind sitting at two separate tables. Again, I apologize for the short notice, and thank you for understanding.",
        keyExpressions: [
          { en: "Is there any way you could ~?", ko: "혹시 ~해 주실 방법이 있을까요?" },
          { en: "we're stuck in traffic", ko: "차가 막혀서 꼼짝 못 하고 있어요" },
          { en: "I apologize for the short notice", ko: "급하게 말씀드려 죄송해요" }
        ]
      },
      {
        promptEn: "I see. Have you ever had a problem at a restaurant, such as a wrong order, a long wait, or a reservation mix-up? Tell me about it in detail.",
        promptKo: "그렇군요. 식당에서 주문 실수, 긴 대기, 예약 착오 같은 문제를 겪은 적이 있나요? 자세히 말해주세요.",
        tips: "상황 → 문제 → 내 대응(직원에게 어떻게 말했는지) → 결과 → 그 식당을 다시 갔는지로 마무리하면 길이가 쉽게 나와요.",
        sampleIH: "Sure. Last winter, I took my parents to a famous Italian restaurant for their anniversary. I had booked a table a week in advance, but when we arrived, the staff said they couldn't find my reservation. I was really embarrassed in front of my parents, and the restaurant was completely full. Luckily, I still had the confirmation text on my phone, so I showed it to the manager. He apologized sincerely and set up a table for us within ten minutes, and he even gave us a free dessert. In the end, my parents had a wonderful time, and honestly, the way they handled it made me like the place even more.",
        keyExpressions: [
          { en: "a week in advance", ko: "일주일 전에 미리" },
          { en: "couldn't find my reservation", ko: "제 예약을 찾을 수 없었어요" },
          { en: "the way they handled it", ko: "그들이 대처한 방식" }
        ]
      }, ['cafe', 'bar']),

    RP('set_roleplay_rental', '롤플레이 11~13번: 집 임대 문의 & 집 고장 해결',
      {
        promptEn: "I'd like to give you a situation to act out. You are looking for a new apartment to rent. Call a real estate agent and ask three or four questions about an apartment you saw online.",
        promptKo: "상황을 드릴게요. 임대할 새 아파트를 찾고 있습니다. 온라인에서 본 아파트에 대해 부동산 중개인에게 전화해 3~4가지 질문을 하세요.",
        tips: "월세·보증금·관리비 → 위치(역까지 거리) → 옵션(가전·주차) → 입주 가능일·방문 시간 순으로.",
        sampleIH: "Hello, I'm calling about the one-bedroom apartment near Hongdae Station that I saw on your website this morning. Is it still available? If so, could you tell me the monthly rent and the deposit, and whether the maintenance fee is included? Also, how far is it from the subway station on foot? I commute every day, so that's really important to me. Does the apartment come with appliances like a washing machine and a refrigerator? And lastly, when can I move in, and would it be possible to visit the place this weekend? Thanks!",
        keyExpressions: [
          { en: "Is it still available?", ko: "아직 가능한가요(남아 있나요)?" },
          { en: "Does it come with ~?", ko: "~가 딸려 있나요?" },
          { en: "When can I move in?", ko: "언제 입주할 수 있나요?" }
        ]
      },
      {
        promptEn: "There is a problem you need to resolve. You moved into the apartment, but the heating system doesn't work and it's getting cold. Call the landlord, explain the problem, and suggest two or three ways to solve it.",
        promptKo: "문제가 생겼습니다. 아파트에 이사 왔는데 난방이 안 되고 점점 추워지고 있어요. 집주인에게 전화해 문제를 설명하고 2~3가지 해결 방법을 제안하세요.",
        tips: "문제를 구체적으로(언제부터, 어떤 증상) → 대안 1(오늘 수리 기사) → 대안 2(수리 전까지 전기 히터 제공/비용 부담) → 대안 3(내가 고치고 월세에서 공제).",
        sampleIH: "Hi Mr. Kim, this is Soo-jin from unit 302. I'm sorry to call you so late, but the heating in the apartment hasn't been working since yesterday, and it's getting really cold at night. I tried restarting the boiler, but nothing happened. Could you send a repair person as soon as possible, ideally tomorrow morning? If that's not possible right away, would you mind if I bought a small electric heater and took the cost off next month's rent? Or, if you prefer, I can call a repair service myself and send you the receipt. I'd really appreciate it if we could fix this quickly. Thank you.",
        keyExpressions: [
          { en: "hasn't been working since ~", ko: "~부터 작동을 안 해요" },
          { en: "as soon as possible", ko: "가능한 한 빨리" },
          { en: "take the cost off next month's rent", ko: "다음 달 월세에서 비용을 빼다" }
        ]
      },
      {
        promptEn: "That sounds stressful. Have you ever had a problem with your house or apartment, such as a broken appliance, a leak, or noisy neighbors? Tell me what happened and how you dealt with it.",
        promptKo: "스트레스받겠네요. 집에서 가전 고장, 누수, 층간소음 같은 문제를 겪은 적이 있나요? 무슨 일이 있었고 어떻게 대처했는지 말해주세요.",
        tips: "층간소음·세탁기 고장·화장실 물 새는 이야기 중 하나를 골라 과거형으로. '그 뒤로 달라진 점'으로 마무리.",
        sampleIH: "Yes, I had a pretty annoying experience last summer. One morning, I woke up and found water dripping from the bathroom ceiling. It turned out the pipe in the apartment upstairs was leaking. I immediately took some photos and contacted the building manager, and then I knocked on my upstairs neighbor's door. At first, I was worried they would be defensive, but they were actually very apologetic and called a plumber the same day. It took about three days to fix everything, and they even paid to repaint my ceiling. Looking back, it was a hassle, but I was relieved that everyone handled it so reasonably.",
        keyExpressions: [
          { en: "It turned out (that) ~", ko: "알고 보니 ~였어요" },
          { en: "it was a hassle", ko: "번거로운 일이었어요" },
          { en: "I was relieved that ~", ko: "~라서 안도했어요" }
        ]
      }, ['live_alone', 'live_friends', 'live_family', 'live_dorm', 'live_barracks']),

    /* ==================== 고난도 14~15번 ==================== */
    ADV('set_advanced_travel', '14~15번 고난도: 여행 방식의 변화 & 여행 산업 이슈',
      {
        promptEn: "Let's talk about how people travel. How did people plan and take trips in the past, and how is it different now? What has caused these changes?",
        promptKo: "사람들이 여행하는 방식에 대해 이야기해 봅시다. 과거에는 여행을 어떻게 계획하고 떠났고, 지금은 어떻게 다른가요? 이런 변화의 원인은 무엇인가요?",
        tips: "과거(여행사·가이드북·패키지) ↔ 현재(스마트폰·앱·자유여행·SNS). 변화의 원인(인터넷·저가항공)을 한 문장으로 짚고, 내 생각으로 마무리.",
        sampleIH: "Well, traveling has changed dramatically over the past twenty years. Back in the day, people mostly relied on travel agencies and package tours. They carried thick guidebooks and paper maps, and booking a hotel meant calling or faxing. These days, it's a completely different story. We book flights and hotels on our phones in minutes, use Google Maps to get around, and find hidden restaurants through Instagram or YouTube. I think the biggest reasons are the internet, smartphones, and budget airlines, which made traveling cheaper and much more independent. Personally, I love the freedom we have now, although I sometimes miss the surprise of discovering a place without seeing it online first.",
        keyExpressions: [
          { en: "has changed dramatically", ko: "극적으로 변했다" },
          { en: "Back in the day,", ko: "예전에는," },
          { en: "it's a completely different story", ko: "완전히 다른 이야기예요 / 상황이 완전히 달라요" }
        ]
      },
      {
        promptEn: "What are some issues or concerns people have about traveling these days, such as overtourism, the environment, or safety? Why are these issues important, and what do you think should be done?",
        promptKo: "요즘 사람들이 여행과 관련해 걱정하는 문제는 무엇인가요? 예를 들어 오버투어리즘, 환경, 안전 등이요. 왜 중요한 문제이고 어떻게 해야 한다고 생각하나요?",
        tips: "이슈 1개를 깊게(오버투어리즘: 주민 피해·물가·쓰레기) → 왜 문제인지 → 해결 방안(관광세·예약제·시민 의식) → 내 의견.",
        sampleIH: "I think one of the biggest issues these days is overtourism. Popular cities like Venice, Kyoto, and even Jeju are getting far more visitors than they can handle. For local residents, this means crowded streets, higher rents, and tons of garbage, and the places themselves slowly lose their charm. It's a serious problem because tourism should benefit local communities, not ruin their daily lives. In my opinion, cities should limit the number of daily visitors to fragile sites and charge a small tourist tax that goes back into the community. At the same time, travelers like us should be more responsible, for example, by visiting less crowded areas and respecting local rules. Honestly, if we don't act now, our kids might not be able to enjoy these places at all.",
        keyExpressions: [
          { en: "far more ~ than they can handle", ko: "감당할 수 있는 것보다 훨씬 많은 ~" },
          { en: "lose their charm", ko: "매력을 잃다" },
          { en: "goes back into the community", ko: "지역 사회로 돌아가다 (환원되다)" }
        ]
      }),

    ADV('set_advanced_health', '14~15번 고난도: 건강 관리의 변화 & 건강 관련 사회 이슈',
      {
        promptEn: "Let's talk about health. How did people take care of their health in the past compared to now? What are the biggest differences, and why do you think these changes happened?",
        promptKo: "건강에 대해 이야기해 봅시다. 과거와 비교해 요즘 사람들은 건강 관리를 어떻게 다르게 하나요? 가장 큰 차이는 무엇이고 왜 그런 변화가 생겼다고 생각하나요?",
        tips: "과거(아프면 병원, 운동은 특별한 사람만) ↔ 현재(예방·헬스장·스마트워치·영양제·건강 앱). 원인: 정보 접근성, 기대수명, SNS 영향.",
        sampleIH: "Health habits have really changed a lot. In the past, I'd say people only thought about their health when they got sick. My grandparents' generation worked long hours, smoked a lot, and rarely exercised for fun. Nowadays, health is almost a lifestyle. People wear smartwatches that count their steps, go to the gym after work, drink protein shakes, and take vitamins every morning. There are even apps that track how well you sleep. I think this change happened mainly because we now have so much information about health, and also because people live longer and want to stay active into their seventies and eighties. Of course, social media plays a role too, since everyone wants to look fit. Overall, I think it's a positive change, as long as people don't become obsessed with it.",
        keyExpressions: [
          { en: "only thought about ~ when ~", ko: "~할 때만 ~를 생각했다" },
          { en: "health is almost a lifestyle", ko: "건강이 거의 생활 방식이 되었다" },
          { en: "as long as ~", ko: "~하는 한" }
        ]
      },
      {
        promptEn: "What health-related issues are people in your country concerned about these days, such as stress, obesity, or an aging population? Why is this a concern, and what can society do about it?",
        promptKo: "요즘 당신 나라 사람들이 걱정하는 건강 관련 문제는 무엇인가요? 예를 들어 스트레스, 비만, 고령화 등이요. 왜 걱정거리이고 사회는 무엇을 할 수 있을까요?",
        tips: "이슈 1개(직장인 스트레스·번아웃) → 원인(장시간 근무·경쟁) → 영향(수면 부족·우울) → 해결(근무 시간 단축·상담 지원·개인 루틴).",
        sampleIH: "In Korea, I think stress and burnout are the biggest health concerns, especially among young office workers. Many people work long hours, deal with heavy competition, and feel pressure to be constantly available on their phones even after work. As a result, a lot of my friends suffer from insomnia, headaches, or even mild depression, but they often ignore it because they're too busy. This is a serious issue because stress leads to much bigger health problems in the long run. I believe companies should respect working hours and offer counseling programs without any stigma. On a personal level, small habits like taking a walk during lunch or turning off notifications at night can make a huge difference. To be honest, I'm trying to do that myself these days.",
        keyExpressions: [
          { en: "feel pressure to be constantly available", ko: "항상 연락 가능해야 한다는 압박을 느끼다" },
          { en: "in the long run", ko: "장기적으로 보면" },
          { en: "make a huge difference", ko: "큰 차이를 만들다" }
        ]
      }),

    ADV('set_advanced_shopping', '14~15번 고난도: 쇼핑 방식의 변화 & 소비 관련 이슈',
      {
        promptEn: "Let's talk about shopping. How did people shop in the past, and how do they shop today? Describe the main changes and what brought them about.",
        promptKo: "쇼핑에 대해 이야기해 봅시다. 과거에는 어떻게 쇼핑했고 지금은 어떻게 하나요? 주요 변화와 그 원인을 설명해 주세요.",
        tips: "과거(시장·백화점, 직접 보고 흥정) ↔ 현재(온라인·새벽 배송·라이브 커머스·리뷰). 원인: 스마트폰·물류. 장단점 한 줄씩.",
        sampleIH: "Shopping is probably one of the things that has changed the most. When I was a kid, my mom took me to the traditional market or a department store every weekend. We touched the products, tried clothes on, and sometimes bargained with the sellers. Now, honestly, I buy almost everything on my phone. I compare prices in a few taps, read hundreds of reviews, and groceries show up at my door before seven the next morning. I think smartphones and super fast delivery systems made all of this possible. It's incredibly convenient, but there's a downside too. I end up buying things I don't really need just because they're on sale, and I kind of miss the fun of wandering around a market with my family.",
        keyExpressions: [
          { en: "in a few taps", ko: "몇 번 터치만으로" },
          { en: "show up at my door", ko: "집 앞에 도착하다" },
          { en: "there's a downside too", ko: "단점도 있어요" }
        ]
      },
      {
        promptEn: "Some people say that online shopping and overconsumption are causing problems for society and the environment. What problems do you see, and what do you think individuals or companies should do?",
        promptKo: "온라인 쇼핑과 과소비가 사회와 환경에 문제를 일으킨다는 의견이 있습니다. 어떤 문제가 있다고 보며, 개인이나 기업은 무엇을 해야 할까요?",
        tips: "문제 2개(포장 쓰레기·충동구매/빚) → 왜 심각한지 → 기업(과대포장 줄이기) + 개인(장바구니 하루 묵히기) 해법 → 내 실천.",
        sampleIH: "I definitely see some serious problems. First of all, the amount of packaging waste is huge. Every small item comes in a box, wrapped in plastic, with ice packs and paper fillers, and most of it goes straight into the trash. Second, online shopping makes overconsumption way too easy. With one click and a discount coupon, people buy clothes they wear once or gadgets they forget about, and some even get into debt. I think companies should use minimal, recyclable packaging and stop pushing so many flash sales. As individuals, a simple trick is to leave items in the cart for a day and buy them only if we still want them. Personally, I've started doing that, and I've saved a surprising amount of money and guilt.",
        keyExpressions: [
          { en: "goes straight into the trash", ko: "곧바로 쓰레기통으로 가다" },
          { en: "way too easy", ko: "너무나 쉬운" },
          { en: "a surprising amount of ~", ko: "놀라울 만큼 많은 ~" }
        ]
      }),

    ADV('set_advanced_housing', '14~15번 고난도: 주거 형태의 변화 & 주거 문제',
      {
        promptEn: "Let's talk about housing. How have homes and the way people live changed over the years in your country? Compare the past and the present and explain the reasons.",
        promptKo: "주거에 대해 이야기해 봅시다. 당신 나라에서 집과 사람들의 생활 방식은 어떻게 변해 왔나요? 과거와 현재를 비교하고 이유를 설명해 주세요.",
        tips: "과거(대가족·단독주택·마당) ↔ 현재(아파트·1인 가구·스마트홈·오피스텔). 원인: 도시화·결혼 감소·편의성. 느낌 한 줄.",
        sampleIH: "Housing in Korea has changed enormously. A few decades ago, most families lived in single houses with a small yard, and three generations often lived together under one roof. Today, the majority of people live in high-rise apartments, and more and more people live alone in small studios or officetels. I think urbanization is the main reason, since everyone moved to big cities for jobs, and land became extremely expensive. Also, people get married later or stay single, so small, convenient homes became popular. These days we even have smart homes where you control the lights and heating with your phone. It's definitely more convenient, but honestly, I sometimes miss the warmth of a house full of family, like my grandmother's place.",
        keyExpressions: [
          { en: "under one roof", ko: "한 지붕 아래" },
          { en: "the majority of people", ko: "대다수 사람들" },
          { en: "more and more people", ko: "점점 더 많은 사람들" }
        ]
      },
      {
        promptEn: "What are some housing-related problems or concerns in your country today, such as high prices or housing for young people? Why do these problems exist, and what do you think could be done?",
        promptKo: "오늘날 당신 나라의 주거 관련 문제나 걱정은 무엇인가요? 예를 들어 높은 집값, 청년 주거 문제 등이요. 왜 이런 문제가 생겼고 어떻게 하면 좋을까요?",
        tips: "문제(집값·월세 부담·청년 독립 어려움) → 원인(수도권 집중·투자 수요) → 영향(결혼·출산 지연) → 해법(공공임대·지방 일자리) → 내 상황 한 줄.",
        sampleIH: "The biggest housing issue in Korea is definitely the price. Apartments in Seoul are so expensive that young people like me can hardly imagine buying one, and even monthly rent takes a huge chunk of our salary. I think this happened because jobs, schools, and everything else are concentrated in the Seoul area, and for a long time people treated apartments as an investment rather than a place to live. The result is that many young people delay getting married or having kids, which is a serious problem for the whole country. In my opinion, the government should build more affordable public housing for young people and create good jobs outside Seoul so that people don't have to live in one crowded city. To be honest, this is something my friends and I talk about all the time.",
        keyExpressions: [
          { en: "can hardly imagine ~ing", ko: "~하는 걸 상상조차 하기 어렵다" },
          { en: "takes a huge chunk of ~", ko: "~의 큰 몫을 차지하다" },
          { en: "rather than ~", ko: "~라기보다는" }
        ]
      }),

    /* ==================== 돌발 주제 (3콤보) ==================== */
    C3('set_unexpected_weather', 'unexpected', '돌발: 우리나라 날씨/계절 (묘사 → 계절별 활동 → 날씨 경험)',
      {
        badge: '콤보 1 · 계절/날씨 묘사',
        promptEn: "Tell me about the weather in your country. What are the seasons like, and which season do you like the most? Why?",
        promptKo: "당신 나라의 날씨에 대해 말해주세요. 계절은 어떤가요? 가장 좋아하는 계절은 무엇이고 왜 그런가요?",
        tips: "사계절 한 줄씩(봄 벚꽃, 여름 덥고 습함+장마, 가을 선선·단풍, 겨울 건조하고 추움) → 좋아하는 계절 + 이유 2개.",
        sampleIH: "Korea has four distinct seasons, and each one feels completely different. Spring is mild and beautiful, with cherry blossoms everywhere, but we sometimes get fine dust. Summer is hot and really humid, and there's a rainy season in July that lasts about three weeks. Fall is my favorite season by far. The sky is incredibly clear and blue, the air is crisp, and the mountains turn red and yellow. Winter is cold and dry, and it snows a few times a year. I love fall the most because the weather is perfect for walking outside, and to be honest, I just feel happier and more energetic when it's cool and sunny.",
        keyExpressions: [
          { en: "four distinct seasons", ko: "뚜렷한 사계절" },
          { en: "by far", ko: "단연코 / 훨씬" },
          { en: "the air is crisp", ko: "공기가 상쾌하다" }
        ]
      },
      {
        badge: '콤보 2 · 날씨에 따른 활동',
        promptEn: "What do you usually do in different kinds of weather? For example, what do you do on a hot summer day or on a rainy day?",
        promptKo: "날씨에 따라 주로 무엇을 하나요? 예를 들어 더운 여름날이나 비 오는 날에는 무엇을 하나요?",
        tips: "날씨 3종류(더운 날·비 오는 날·맑은 가을날)에 각각 하는 일 + 이유. 'When it ~, I usually ~' 구조를 반복하면 쉬워요.",
        sampleIH: "It really depends on the weather. On hot summer days, I try to avoid going outside in the afternoon. I usually stay in a cafe with strong air conditioning and drink an iced Americano, or I go swimming in the evening when it's cooler. When it rains, I'm more of a homebody. I love watching a movie on the couch with the sound of rain in the background, and I almost always order some kimchi pancakes, which is a Korean tradition on rainy days. On clear fall days, though, I never want to stay home. I go for a long walk along the Han River or hike a nearby mountain to see the autumn leaves. So basically, the weather decides my weekend for me!",
        keyExpressions: [
          { en: "It really depends on ~", ko: "~에 따라 정말 달라요" },
          { en: "I'm more of a homebody", ko: "저는 집에 있는 걸 더 좋아하는 편이에요" },
          { en: "the weather decides my weekend for me", ko: "날씨가 내 주말을 정해 줘요" }
        ]
      },
      {
        badge: '콤보 3 · 날씨 관련 경험',
        promptEn: "Tell me about a memorable experience you had because of the weather. Maybe a heavy rain, a snowstorm, or extreme heat. What happened, and how did it affect your plans?",
        promptKo: "날씨 때문에 겪은 기억에 남는 경험을 말해주세요. 폭우, 폭설, 폭염 등이요. 무슨 일이 있었고 계획에 어떤 영향을 미쳤나요?",
        tips: "언제·어디 → 갑작스러운 날씨 → 계획이 어떻게 틀어졌나 → 대처 → 결과/느낌. 'Out of nowhere' 같은 표현이 잘 어울려요.",
        sampleIH: "I'll never forget a trip to Gangwon-do two winters ago. My friends and I drove there for a ski trip, and on the way back, out of nowhere, it started snowing really heavily. Within an hour, the highway was completely covered, and cars were barely moving. We were stuck in traffic for almost six hours, and we ran out of snacks and even phone battery. At first, we were pretty frustrated, but we ended up playing word games and singing songs to kill time. We finally got home at two in the morning, totally exhausted. Looking back, it was actually one of the funniest nights we've had together, and now we always check the forecast before a winter trip.",
        keyExpressions: [
          { en: "out of nowhere", ko: "갑자기 / 난데없이" },
          { en: "ran out of ~", ko: "~가 다 떨어졌다" },
          { en: "to kill time", ko: "시간을 때우려고" }
        ]
      }),

    C3('set_unexpected_transport', 'unexpected', '돌발: 교통수단 (묘사 → 출퇴근 → 교통 문제 경험)',
      {
        badge: '콤보 1 · 교통수단 묘사',
        promptEn: "Tell me about the transportation in your country. What kinds of public transportation do people use, and which one do you use the most?",
        promptKo: "당신 나라의 교통수단에 대해 말해주세요. 사람들은 어떤 대중교통을 이용하고, 당신은 무엇을 가장 많이 이용하나요?",
        tips: "지하철(깨끗·정확·와이파이) → 버스(환승 할인) → 택시/KTX → 내가 주로 쓰는 것 + 이유(빠르고 저렴).",
        sampleIH: "Public transportation in Korea is honestly one of the best things about living here. The subway is clean, fast, and almost always on time, and there's free Wi-Fi in every car. Buses go everywhere the subway doesn't, and you can transfer between them for free with a single transportation card. For longer trips, we have the KTX, which takes you from Seoul to Busan in about two and a half hours. Personally, I take the subway the most because my office is right next to a station. It takes about thirty minutes, and I usually listen to podcasts or catch up on the news on the way. Taxis are also cheap compared to other countries, so I take one when I'm running late.",
        keyExpressions: [
          { en: "almost always on time", ko: "거의 항상 정시에" },
          { en: "transfer between them for free", ko: "무료로 환승하다" },
          { en: "catch up on the news", ko: "밀린 뉴스를 보다" }
        ]
      },
      {
        badge: '콤보 2 · 출퇴근 / 이동 루틴',
        promptEn: "Describe your typical commute or a regular trip you take. How do you get there, how long does it take, and what do you do on the way?",
        promptKo: "평소 출퇴근이나 자주 하는 이동에 대해 묘사해 주세요. 어떻게 가고, 얼마나 걸리고, 가는 동안 무엇을 하나요?",
        tips: "집에서 나오는 시간 → 도보/버스 → 지하철 환승 → 도착. 중간에 하는 일(음악·영어 공부·SNS)과 느낌(붐빔·지루함)을 넣으세요.",
        sampleIH: "My commute is pretty standard for Seoul. I leave home around eight, walk about ten minutes to the subway station, and take Line 2 for seven stops. Then I transfer to a bus for the last ten minutes, so door to door it takes about forty-five minutes. The subway is super crowded during rush hour, so I can't really sit down, but I've gotten used to it. On the way, I usually listen to English podcasts or review some vocabulary on my phone, which is actually how I started studying for this test. On the way home, I'm usually too tired, so I just watch YouTube or text my friends. It's not the most exciting part of my day, but it's a good time to clear my head.",
        keyExpressions: [
          { en: "door to door", ko: "집에서 목적지까지 (문에서 문까지)" },
          { en: "during rush hour", ko: "출퇴근 혼잡 시간에" },
          { en: "I've gotten used to it", ko: "이제 익숙해졌어요" }
        ]
      },
      {
        badge: '콤보 3 · 교통 문제 경험',
        promptEn: "Have you ever had a problem while using transportation, like missing a train, getting lost, or being stuck in traffic? Tell me what happened from beginning to end.",
        promptKo: "교통수단을 이용하다 문제를 겪은 적이 있나요? 기차를 놓치거나, 길을 잃거나, 차가 막혔던 일 등이요. 처음부터 끝까지 말해주세요.",
        tips: "중요한 약속 전 → 문제 발생(막차·반대 방향) → 당황 → 해결(택시·전화로 사과) → 결과·교훈. 감정 표현 필수.",
        sampleIH: "Yes, I had a really embarrassing experience last year. I had a job interview at ten in the morning, and I was so nervous that I got on the subway going in the wrong direction. I didn't notice for about fifteen minutes because I was busy reviewing my notes. When I finally realized, I totally panicked. I jumped off at the next station, ran outside, and grabbed a taxi, but of course, we got stuck in traffic. I called the company to apologize and explain, and luckily, they were understanding and let me come in thirty minutes late. I got the job in the end, but since then, I always double-check the direction and leave home way earlier for anything important.",
        keyExpressions: [
          { en: "going in the wrong direction", ko: "반대 방향으로 가는" },
          { en: "I totally panicked", ko: "완전히 패닉에 빠졌어요" },
          { en: "since then, I always ~", ko: "그 이후로 항상 ~해요" }
        ]
      }),

    C3('set_unexpected_recycling', 'unexpected', '돌발: 재활용 (방식 묘사 → 루틴 → 변화/경험)',
      {
        badge: '콤보 1 · 재활용 방식 묘사',
        promptEn: "Tell me about recycling in your country. How do people recycle, and what kinds of things are recycled?",
        promptKo: "당신 나라의 재활용에 대해 말해주세요. 사람들은 어떻게 재활용하고, 어떤 것들을 재활용하나요?",
        tips: "분리 종류(종이·플라스틱·캔·유리·음식물) → 종량제 봉투 → 아파트 분리수거 요일 → 엄격하다는 점 + 내 생각.",
        sampleIH: "Recycling is taken very seriously in Korea, and honestly, the system is pretty strict. We separate our waste into several categories: paper, plastic, cans, glass, and food waste, and each one goes into a different bin. Regular trash has to go into special government-approved bags that we buy at convenience stores, so the more trash you make, the more you pay. In most apartment complexes, there's a specific recycling day, usually once or twice a week, when everyone brings their sorted items down to the collection area. Food waste even has its own container, and in some buildings, you pay by weight. It was a bit complicated when I first moved out on my own, but now it's just a normal part of life, and I think it's a good system overall.",
        keyExpressions: [
          { en: "is taken very seriously", ko: "매우 진지하게 여겨진다" },
          { en: "the more ~, the more ~", ko: "~할수록 더 ~하다" },
          { en: "a normal part of life", ko: "일상의 평범한 일부" }
        ]
      },
      {
        badge: '콤보 2 · 재활용 루틴',
        promptEn: "What do you personally do to recycle at home? Describe your routine step by step, from sorting trash to taking it out.",
        promptKo: "집에서 재활용을 위해 개인적으로 무엇을 하나요? 쓰레기를 분류하는 것부터 내놓는 것까지 루틴을 단계별로 묘사해 주세요.",
        tips: "주방에 통 여러 개 → 플라스틱은 헹구고 라벨 떼기 → 박스는 테이프 제거 → 목요일 저녁에 들고 내려감. 순서 연결어(First, Then, After that) 활용.",
        sampleIH: "I have a pretty fixed routine. In my kitchen, I keep three small bins: one for plastic, one for paper, and one for cans and glass. Whenever I finish a plastic bottle, I rinse it, peel off the label, and crush it before throwing it in. For cardboard boxes, I remove the tape and flatten them so they don't take up space. Food scraps go into a small sealed container in the fridge so they don't smell. Then, every Thursday evening, which is recycling day in my building, I carry everything down to the collection area and sort it into the big bins. It takes about ten minutes, and to be honest, I kind of enjoy it because the kitchen feels so clean afterward.",
        keyExpressions: [
          { en: "peel off the label", ko: "라벨을 떼어내다" },
          { en: "take up space", ko: "자리를 차지하다" },
          { en: "sort it into ~", ko: "~로 분류해 넣다" }
        ]
      },
      {
        badge: '콤보 3 · 재활용 관련 변화/경험',
        promptEn: "How has recycling changed since you were young, or have you had any memorable experience related to recycling? Tell me about it.",
        promptKo: "어릴 때와 비교해 재활용은 어떻게 달라졌나요? 또는 재활용과 관련해 기억에 남는 경험이 있다면 말해주세요.",
        tips: "어릴 땐 대충 버림 → 지금은 세분화·종량제 → 변화 이유(환경 의식) + 나만의 에피소드(이웃에게 지적받은 일 등).",
        sampleIH: "Recycling has changed a lot since I was a kid. Back then, my family just threw most things into one bag, and nobody really cared about separating plastic from paper. Now, the rules are much stricter and people actually follow them. I remember a funny but slightly embarrassing experience from when I first lived alone. I put a pizza box in the paper bin without cleaning it, and the next morning, there was a note on my door from the building manager explaining that greasy boxes aren't recyclable. I was so embarrassed, but it really taught me how detailed the system is. Since then, I've become one of those people who rinses every yogurt cup. I think this change happened because people finally realized how serious the plastic waste problem is.",
        keyExpressions: [
          { en: "nobody really cared about ~", ko: "아무도 ~에 신경 쓰지 않았다" },
          { en: "one of those people who ~", ko: "~하는 부류의 사람" },
          { en: "finally realized how serious ~ is", ko: "~가 얼마나 심각한지 마침내 깨달았다" }
        ]
      }),

    C3('set_unexpected_holiday', 'unexpected', '돌발: 명절/휴일 (묘사 → 명절에 하는 일 → 기억에 남는 명절)',
      {
        badge: '콤보 1 · 명절 묘사',
        promptEn: "Tell me about a major holiday in your country. When is it, what is it about, and how do people celebrate it?",
        promptKo: "당신 나라의 큰 명절에 대해 말해주세요. 언제이고, 어떤 의미이며, 사람들은 어떻게 기념하나요?",
        tips: "추석 또는 설날 하나 고르기: 시기 → 의미(수확 감사/새해) → 하는 일(고향 방문·차례·음식·세배) → 분위기.",
        sampleIH: "The biggest holiday in Korea is Chuseok, which is kind of like Korean Thanksgiving. It falls in September or October, depending on the lunar calendar, and it's a three-day holiday. It's a time to thank our ancestors for the harvest and to gather with family. Most people travel back to their hometowns, so the highways are famously packed. On the morning of Chuseok, families hold a memorial ceremony with special food, and then everyone shares a big meal together. The most iconic food is songpyeon, which is a small rice cake filled with sesame or beans. Afterward, people visit their ancestors' graves or just relax, play games, and eat way too much. It's exhausting but also really warm and nostalgic.",
        keyExpressions: [
          { en: "kind of like ~", ko: "~와 비슷한" },
          { en: "the highways are famously packed", ko: "고속도로가 악명 높게 붐빈다" },
          { en: "eat way too much", ko: "너무 많이 먹다" }
        ]
      },
      {
        badge: '콤보 2 · 명절에 하는 일',
        promptEn: "What do you usually do during that holiday? Describe what a typical holiday looks like for you and your family from start to finish.",
        promptKo: "그 명절 동안 주로 무엇을 하나요? 당신과 가족의 전형적인 명절을 처음부터 끝까지 묘사해 주세요.",
        tips: "전날(귀성·음식 준비) → 당일 아침(차례·식사) → 오후(친척·윷놀이·성묘) → 저녁(TV·귀경). 내 역할(전 부치기 담당 등) 넣기.",
        sampleIH: "For my family, the holiday usually starts the day before. We drive down to my grandmother's house in Daegu, which normally takes three hours but takes six on holidays! That evening, all the women and, these days, the men too, gather in the kitchen to make jeon, which are Korean pancakes. I'm in charge of frying them, and I always end up eating half of them. On the morning of Chuseok, we hold the memorial ceremony, and then we have a huge breakfast together. In the afternoon, we play yut, a traditional board game, and the losers have to do the dishes. In the evening, we watch holiday specials on TV and talk until late. Then on the last day, we drive back to Seoul with tons of leftovers from my grandmother.",
        keyExpressions: [
          { en: "I'm in charge of ~ing", ko: "제가 ~를 담당해요" },
          { en: "end up ~ing", ko: "결국 ~하게 되다" },
          { en: "tons of leftovers", ko: "엄청난 양의 남은 음식" }
        ]
      },
      {
        badge: '콤보 3 · 기억에 남는 명절',
        promptEn: "Tell me about a particularly memorable holiday you had. What made it special or different from other years?",
        promptKo: "특별히 기억에 남는 명절에 대해 말해주세요. 무엇 때문에 특별했거나 다른 해와 달랐나요?",
        tips: "어떤 해 → 평소와 다른 점(해외여행·첫 세뱃돈 주기·할머니 마지막 명절) → 그날의 장면 → 감정 → 왜 기억에 남는지.",
        sampleIH: "The most memorable holiday for me was Chuseok three years ago. That year, my grandmother turned eighty, so instead of the usual ceremony, the whole family decided to celebrate her birthday together on Chuseok day. My cousins and I secretly prepared a slideshow with old photos from her life, and when we played it after dinner, she started crying, and then everyone was crying. Even my uncle, who never shows his emotions, had tears in his eyes. After that, we all took a family photo together for the first time in about ten years. It was so touching because it reminded all of us how lucky we are to still have her. Honestly, no holiday since then has felt as special.",
        keyExpressions: [
          { en: "instead of the usual ~", ko: "평소의 ~ 대신" },
          { en: "had tears in his eyes", ko: "눈에 눈물이 고였다" },
          { en: "for the first time in about ten years", ko: "약 10년 만에 처음으로" }
        ]
      }),

    C3('set_unexpected_bank', 'unexpected', '돌발: 은행 (묘사 → 은행 업무 → 은행 관련 경험)',
      {
        badge: '콤보 1 · 은행 묘사',
        promptEn: "Tell me about the banks in your country. What do they look like, and what services do they usually offer?",
        promptKo: "당신 나라의 은행에 대해 말해주세요. 어떻게 생겼고, 보통 어떤 서비스를 제공하나요?",
        tips: "위치(역 근처 1층) → 내부(번호표·창구·ATM 코너) → 서비스(계좌·대출·환전) → 요즘은 앱으로 대체되는 추세.",
        sampleIH: "Banks in Korea are usually located on the first floor of office buildings near subway stations, and they all look pretty similar. When you walk in, there's a machine where you take a number, and you wait in comfortable chairs until your number appears on the screen. The tellers sit behind glass counters, and there's always an ATM corner by the entrance that's open 24 hours. Banks offer the usual services like opening accounts, loans, exchanging currency, and credit cards. To be honest, though, I rarely go to a physical bank anymore. Almost everything can be done on the banking app, from transferring money to applying for a loan, so most branches are much quieter than they used to be.",
        keyExpressions: [
          { en: "take a number", ko: "번호표를 뽑다" },
          { en: "open 24 hours", ko: "24시간 운영하는" },
          { en: "much quieter than they used to be", ko: "예전보다 훨씬 한산한" }
        ]
      },
      {
        badge: '콤보 2 · 은행 업무 루틴',
        promptEn: "What do you usually do at the bank or with your banking app? Describe what you typically do and how often you do it.",
        promptKo: "은행이나 은행 앱으로 주로 무엇을 하나요? 보통 무엇을 하고 얼마나 자주 하는지 묘사해 주세요.",
        tips: "월급날 루틴(자동이체·적금·용돈 보내기) → 앱으로 하는 일 → 은행에 직접 가는 경우(환전·대출 상담) → 느낌(편하지만 돈 쓰기 쉬움).",
        sampleIH: "These days, I do almost all my banking on my phone. On payday, I open the app and move part of my salary into a savings account, pay my credit card bill, and send some money to my parents. I also check my spending at the end of every week, which usually makes me feel a little guilty about all the coffee. I only visit an actual branch maybe once or twice a year, for example, when I need to exchange money before a trip or when I talked to a staff member about a loan for my apartment deposit. The app is incredibly convenient, but it also makes spending money a bit too easy, so I've set a weekly budget alert to keep myself in check.",
        keyExpressions: [
          { en: "On payday,", ko: "월급날에," },
          { en: "once or twice a year", ko: "일 년에 한두 번" },
          { en: "keep myself in check", ko: "스스로를 통제하다" }
        ]
      },
      {
        badge: '콤보 3 · 은행 관련 경험',
        promptEn: "Tell me about a memorable or difficult experience you had with a bank. For example, a long wait, a lost card, or a mistake with a transfer. What happened and how was it resolved?",
        promptKo: "은행과 관련해 기억에 남거나 힘들었던 경험을 말해주세요. 긴 대기, 카드 분실, 송금 실수 등이요. 무슨 일이 있었고 어떻게 해결됐나요?",
        tips: "송금 실수·카드 분실 스토리 → 당황 → 고객센터/지점 방문 → 해결 과정 → 교훈. 돈 액수와 시간 같은 구체 숫자가 있으면 생생해요.",
        sampleIH: "I had a scary experience about a year ago. I was sending my friend some money for a concert ticket, and I accidentally typed one wrong digit in the account number. I sent about three hundred dollars to a complete stranger! I was totally freaked out, so I called the bank's customer service right away. They explained that they couldn't just take the money back, but they could contact the other person's bank and ask them to return it. For three days, I checked my app every hour. Luckily, the stranger turned out to be an honest person and sent the money back with a short note saying 'Be careful next time.' I was so relieved, and now I always double-check the account number before I hit send.",
        keyExpressions: [
          { en: "accidentally typed one wrong digit", ko: "실수로 숫자 하나를 잘못 입력했다" },
          { en: "a complete stranger", ko: "생판 모르는 사람" },
          { en: "before I hit send", ko: "보내기 버튼을 누르기 전에" }
        ]
      }),

    /* ==================== 서베이 주제 3콤보 ==================== */
    C3('set_cooking', 'cooking', '요리하기 3콤보 (좋아하는 요리 → 요리 과정 → 요리 실패/성공 경험)',
      {
        badge: '콤보 1 · 좋아하는 요리 묘사',
        promptEn: "You indicated that you like cooking. What kind of food do you usually cook, and what is your favorite dish to make? Why do you like it?",
        promptKo: "요리를 좋아한다고 하셨네요. 주로 어떤 음식을 만들고, 가장 좋아하는 요리는 무엇인가요? 왜 좋아하나요?",
        tips: "요리 종류(한식·파스타) → 대표 메뉴 1개 → 좋아하는 이유(간단·건강·사람들 반응) → 언제 만드는지.",
        sampleIH: "I really enjoy cooking, especially simple home-style food. My go-to dish is kimchi fried rice, because it's quick, cheap, and almost impossible to mess up. I also love making pasta on weekends, like a creamy mushroom pasta, when I have more time. What I like most about cooking is that it helps me relax after a stressful day. Chopping vegetables and hearing the sizzle in the pan is strangely calming. Another reason is that my friends always get excited when I cook for them, and seeing their reactions makes me feel proud. Honestly, cooking at home also saves me a lot of money compared to eating out all the time.",
        keyExpressions: [
          { en: "my go-to dish", ko: "내가 늘 찾는 메뉴" },
          { en: "almost impossible to mess up", ko: "망치기가 거의 불가능한" },
          { en: "strangely calming", ko: "이상하게 마음이 편안해지는" }
        ]
      },
      {
        badge: '콤보 2 · 요리 과정 / 루틴',
        promptEn: "Describe how you make your favorite dish. Walk me through the steps from preparing the ingredients to serving it.",
        promptKo: "좋아하는 요리를 어떻게 만드는지 묘사해 주세요. 재료 준비부터 내놓기까지 단계별로 설명해 주세요.",
        tips: "재료 나열 → First/Then/After that로 과정 3~4단계 → 나만의 팁(계란 반숙·참기름) → 먹을 때 느낌.",
        sampleIH: "Let me walk you through my kimchi fried rice. First, I chop some old, sour kimchi and a bit of onion, and I dice a few slices of ham or bacon. Then I heat some oil in a pan, fry the ham until it's crispy, and add the kimchi and a spoonful of gochujang. After stirring that for a couple of minutes, I add a bowl of cold rice from the fridge, which actually works better than fresh rice, and mix everything well. My secret tip is to add a little sesame oil and butter at the end for a richer flavor. Finally, I top it with a fried egg with a runny yolk and some crushed seaweed. The whole thing takes about fifteen minutes, and it tastes amazing every single time.",
        keyExpressions: [
          { en: "Let me walk you through ~", ko: "~를 차근차근 설명해 드릴게요" },
          { en: "my secret tip is to ~", ko: "제 비법은 ~하는 거예요" },
          { en: "every single time", ko: "매번 어김없이" }
        ]
      },
      {
        badge: '콤보 3 · 요리 실패/성공 경험',
        promptEn: "Tell me about a memorable experience you had while cooking. It could be a big success or a total disaster. What happened, and how did it end?",
        promptKo: "요리하면서 겪은 기억에 남는 경험을 말해주세요. 큰 성공이든 완전한 실패든 좋습니다. 무슨 일이 있었고 어떻게 끝났나요?",
        tips: "특별한 날(부모님 생신·친구 초대) → 야심찬 메뉴 → 사고(태움·소금 대신 설탕) → 수습 → 웃음/교훈.",
        sampleIH: "I'll never forget the first time I cooked for my girlfriend's parents. I wanted to impress them, so I decided to make a Korean beef stew, which I had never made before. Everything was going fine until I got distracted by my phone and the bottom of the pot burned completely. The whole apartment smelled like smoke, and they were arriving in thirty minutes! I totally panicked, threw everything away, and ran to the supermarket. In the end, I made a simple pasta instead, and I honestly told them what happened. Luckily, they laughed so hard and said the pasta was delicious. Looking back, it was a disaster, but it actually broke the ice, and her dad still teases me about it.",
        keyExpressions: [
          { en: "I wanted to impress them", ko: "그분들께 좋은 인상을 주고 싶었어요" },
          { en: "got distracted by ~", ko: "~에 정신이 팔렸다" },
          { en: "it broke the ice", ko: "어색한 분위기를 깼어요" }
        ]
      }),

    C3('set_pets', 'pets', '애완동물 3콤보 (반려동물 묘사 → 돌보는 루틴 → 반려동물과의 경험)',
      {
        badge: '콤보 1 · 반려동물 묘사',
        promptEn: "You indicated that you have a pet. Tell me about your pet. What does it look like, and what is its personality like?",
        promptKo: "반려동물을 기른다고 하셨네요. 반려동물에 대해 말해주세요. 어떻게 생겼고 성격은 어떤가요?",
        tips: "종류·이름·나이 → 외모(색·크기·특징) → 성격(활발/겁많음) + 귀여운 습관 1개 → 나에게 어떤 존재인지.",
        sampleIH: "I have a four-year-old dog named Mango. She's a small Maltese mix with fluffy white fur and big round eyes that make her look like a stuffed animal. Personality-wise, she's extremely friendly and a little bit clingy. She follows me from room to room, and whenever I sit on the couch, she jumps up and lies on my lap within seconds. She's also surprisingly smart. She knows exactly when it's time for her walk and brings me her leash. The funniest thing is that she snores really loudly when she sleeps. Honestly, she's not just a pet to me; she's like a family member, and coming home to her wagging tail is the best part of my day.",
        keyExpressions: [
          { en: "Personality-wise,", ko: "성격으로 말하자면," },
          { en: "a little bit clingy", ko: "약간 껌딱지 같은 / 붙어 있으려는" },
          { en: "the best part of my day", ko: "하루 중 가장 좋은 순간" }
        ]
      },
      {
        badge: '콤보 2 · 돌보는 루틴',
        promptEn: "What do you do to take care of your pet on a typical day? Describe your routine, including feeding, walking, and playing.",
        promptKo: "평소 반려동물을 돌보기 위해 무엇을 하나요? 먹이 주기, 산책, 놀아주기 등 루틴을 묘사해 주세요.",
        tips: "아침(밥·짧은 산책) → 낮(혼자 있을 때 장난감·카메라) → 저녁(긴 산책·놀이) → 주말(목욕·병원). 시간 순서로.",
        sampleIH: "My day pretty much starts and ends with Mango. Every morning at seven, she wakes me up by licking my face, and I feed her and take her out for a quick ten-minute walk. While I'm at work, I leave some toys and turn on a pet camera so I can check on her and even talk to her from my phone. In the evening, we go for a longer walk in the park for about thirty minutes, which is good exercise for me too. After dinner, we play fetch in the living room until she gets tired. On weekends, I give her a bath and brush her fur, and once a month, we visit the vet for a checkup. It takes a lot of effort, but I never see it as a chore.",
        keyExpressions: [
          { en: "check on her", ko: "그 애가 잘 있는지 확인하다" },
          { en: "play fetch", ko: "공 던지고 물어오기 놀이를 하다" },
          { en: "I never see it as a chore", ko: "그걸 귀찮은 일로 여긴 적이 없어요" }
        ]
      },
      {
        badge: '콤보 3 · 반려동물과의 경험',
        promptEn: "Tell me about a memorable experience with your pet. Maybe the day you first got it, a time it got sick, or something funny it did. What happened?",
        promptKo: "반려동물과 관련해 기억에 남는 경험을 말해주세요. 처음 데려온 날, 아팠던 때, 웃긴 사건 등이요. 무슨 일이 있었나요?",
        tips: "처음 만난 날 또는 잃어버릴 뻔한 일 → 장면 묘사 → 감정 변화(걱정→안도) → 그 후 달라진 점.",
        sampleIH: "The scariest and most memorable moment was when Mango got lost last spring. We were at a park, and a loud motorcycle scared her so much that she slipped out of her harness and ran away. I searched for her for almost two hours, calling her name and showing her photo to everyone. I was crying and completely exhausted. Then, out of nowhere, a little girl came up to me holding Mango in her arms. She had found her hiding under a bench near the playground. I was so relieved that I hugged the girl and almost cried again. Since that day, I bought a GPS tag for Mango's collar, and I hold her leash much more tightly whenever we're outside.",
        keyExpressions: [
          { en: "slipped out of her harness", ko: "하네스에서 빠져나갔다" },
          { en: "came up to me", ko: "나에게 다가왔다" },
          { en: "Since that day,", ko: "그날 이후로," }
        ]
      }),

    C3('set_hiking', 'hiking', '하이킹/등산 3콤보 (자주 가는 산 → 등산 루틴 → 등산 경험)',
      {
        badge: '콤보 1 · 자주 가는 산 묘사',
        promptEn: "You indicated that you enjoy hiking. Tell me about a mountain or trail you like to go to. Where is it, and what does it look like?",
        promptKo: "하이킹을 즐긴다고 하셨네요. 자주 가는 산이나 코스에 대해 말해주세요. 어디에 있고 어떤 모습인가요?",
        tips: "산 이름·위치(집에서 얼마나) → 코스 특징(길이·난이도·정상 뷰) → 계절별 모습 → 좋아하는 이유.",
        sampleIH: "My favorite place to hike is Gwanaksan, which is in the southern part of Seoul, about forty minutes from my house by subway. It's not a huge mountain, around 630 meters, but the trail is rocky and steep enough to give you a good workout. The path starts in a quiet forest with a small stream, and as you go up, it becomes more rugged with big granite rocks you sometimes have to climb with your hands. The best part is the view from the top. You can see the whole city, the Han River, and on a clear day, even the mountains in the north. In the fall, the trail is covered in red and yellow leaves, which is absolutely breathtaking. I love it because it's close to the city but feels like a completely different world.",
        keyExpressions: [
          { en: "steep enough to give you a good workout", ko: "운동이 될 만큼 가파른" },
          { en: "as you go up,", ko: "올라갈수록," },
          { en: "feels like a completely different world", ko: "완전히 다른 세상처럼 느껴져요" }
        ]
      },
      {
        badge: '콤보 2 · 등산 루틴',
        promptEn: "What do you usually do when you go hiking? Describe your typical hiking day from preparing in the morning to coming back home.",
        promptKo: "하이킹을 갈 때 주로 무엇을 하나요? 아침 준비부터 집에 돌아올 때까지 전형적인 하루를 묘사해 주세요.",
        tips: "전날 짐(물·김밥·등산화) → 이른 출발 → 올라가며 사진·쉬기 → 정상에서 도시락 → 하산 후 막걸리/파전 → 집에서 꿀잠.",
        sampleIH: "On a hiking day, I wake up around six, which is really early for me. I pack a backpack with water, some kimbap, a few energy bars, and a light jacket, and I put on my hiking boots. I usually go with two friends, and we meet at the trail entrance around eight to avoid the crowds. We hike at a relaxed pace, stopping every thirty minutes or so to take photos and catch our breath. When we reach the top, we sit on the rocks, eat our kimbap, and just enjoy the view for a while. Coming down takes about an hour, and then comes my favorite part: we go to a small restaurant near the entrance for makgeolli and green onion pancakes. By the time I get home, I'm exhausted, but I sleep like a baby that night.",
        keyExpressions: [
          { en: "to avoid the crowds", ko: "사람 많은 걸 피하려고" },
          { en: "catch our breath", ko: "숨을 고르다" },
          { en: "sleep like a baby", ko: "아기처럼 푹 자다" }
        ]
      },
      {
        badge: '콤보 3 · 등산 경험',
        promptEn: "Tell me about a memorable hiking experience. Perhaps a time you got lost, faced bad weather, or reached a difficult summit. What happened?",
        promptKo: "기억에 남는 하이킹 경험을 말해주세요. 길을 잃었거나, 날씨가 나빴거나, 힘든 정상에 올랐던 일 등이요. 무슨 일이 있었나요?",
        tips: "큰 산(한라산·지리산) 도전 → 힘들었던 구간 → 포기하고 싶었던 순간 → 정상에서의 감정 → 배운 점.",
        sampleIH: "The hike I'll never forget is Hallasan on Jeju Island, which is the highest mountain in Korea. My friend and I started at five in the morning in complete darkness with headlamps. The first few hours were fine, but after about four hours, my legs were shaking and I seriously wanted to give up. Then, out of nowhere, it started to rain, and the wind at the top was so strong I could barely stand. But when we finally reached the crater lake at the summit, the clouds suddenly opened up for just a few minutes, and the view was absolutely unreal. I actually got a little emotional. It took us nine hours in total, and I couldn't walk properly for three days, but it taught me that I'm much stronger than I think.",
        keyExpressions: [
          { en: "my legs were shaking", ko: "다리가 후들거렸다" },
          { en: "the clouds suddenly opened up", ko: "구름이 갑자기 걷혔다" },
          { en: "much stronger than I think", ko: "내가 생각하는 것보다 훨씬 강한" }
        ]
      }),

    C3('set_tv', 'tv', 'TV 보기 3콤보 (좋아하는 프로그램 → 시청 루틴 → 기억에 남는 프로그램)',
      {
        badge: '콤보 1 · 좋아하는 프로그램 묘사',
        promptEn: "You indicated that you like watching TV. What kinds of programs do you like to watch, and what is your favorite show these days? Tell me about it.",
        promptKo: "TV 보기를 좋아한다고 하셨네요. 어떤 종류의 프로그램을 즐겨 보고, 요즘 가장 좋아하는 프로그램은 무엇인가요? 설명해 주세요.",
        tips: "장르(예능·드라마·다큐) → 요즘 최애 1개 소개(내용·출연자·분위기) → 좋아하는 이유 2개.",
        sampleIH: "I mostly watch variety shows and dramas, and I'm also a big fan of travel documentaries. These days, my favorite show is a cooking variety program where celebrities travel to small towns and cook with local ingredients. What I love about it is that it's funny and relaxing at the same time. The hosts have great chemistry, and the scenery of the countryside is really beautiful, so it feels like a mini vacation after a long day. I also pick up cooking tips from it. Another reason I like it is that my whole family enjoys it, so on Friday nights, we all sit together on the couch and watch it while eating fried chicken. It's become a little family tradition.",
        keyExpressions: [
          { en: "I'm a big fan of ~", ko: "저는 ~의 열렬한 팬이에요" },
          { en: "have great chemistry", ko: "호흡이 잘 맞다" },
          { en: "pick up tips", ko: "팁을 얻다" }
        ]
      },
      {
        badge: '콤보 2 · 시청 루틴',
        promptEn: "When and how do you usually watch TV? Describe your typical TV-watching routine, including where you watch and what you do while watching.",
        promptKo: "보통 언제, 어떻게 TV를 보나요? 어디서 보고 보면서 무엇을 하는지 등 전형적인 시청 루틴을 묘사해 주세요.",
        tips: "평일(저녁 먹으며 뉴스 → 자기 전 넷플릭스 한 편) ↔ 주말(몰아보기) → 기기(TV·태블릿) → 같이 하는 일(간식·스트레칭).",
        sampleIH: "On weekdays, I don't have much time, so I usually watch TV while having dinner around eight. I catch the news for about thirty minutes and then switch to a drama episode on Netflix before bed. I watch on the TV in the living room, but if my roommate is using it, I just watch on my tablet in bed. On weekends, it's a different story. I love binge-watching a whole season on Saturday afternoon with snacks and a blanket, which my friends call my lazy mode. I also do some stretching while watching so I don't feel too guilty. One rule I have is no TV after midnight, because otherwise I just keep clicking the next episode and ruin my sleep.",
        keyExpressions: [
          { en: "catch the news", ko: "뉴스를 챙겨 보다" },
          { en: "binge-watch a whole season", ko: "한 시즌을 몰아 보다" },
          { en: "keep clicking the next episode", ko: "계속 다음 화를 누르다" }
        ]
      },
      {
        badge: '콤보 3 · 기억에 남는 프로그램',
        promptEn: "Tell me about a TV program that left a strong impression on you. What was it about, when did you watch it, and why was it so memorable?",
        promptKo: "강한 인상을 남긴 TV 프로그램에 대해 말해주세요. 어떤 내용이었고, 언제 봤으며, 왜 그렇게 기억에 남나요?",
        tips: "프로그램 이름·장르 → 언제·누구와 → 줄거리 한두 문장 → 인상 깊었던 장면/감정 → 내 생각이나 행동이 어떻게 바뀌었는지.",
        sampleIH: "A show that really stuck with me is a documentary about the ocean that I watched with my dad a couple of years ago. It followed a team of divers cleaning up plastic waste from the sea, and there was one scene where they rescued a sea turtle tangled in a fishing net. I was honestly shocked, because I had never realized how much damage our everyday plastic causes. My dad and I didn't say much while watching, but afterward, we talked about it for almost an hour. Since then, I've stopped using plastic straws and started carrying a tumbler everywhere. It sounds like a small thing, but that show genuinely changed my habits, and I think that's the most powerful thing a TV program can do.",
        keyExpressions: [
          { en: "really stuck with me", ko: "정말 기억에 오래 남았다" },
          { en: "I had never realized how ~", ko: "얼마나 ~한지 전혀 몰랐었다" },
          { en: "genuinely changed my habits", ko: "진짜로 내 습관을 바꿨다" }
        ]
      })
  ];

  extra.forEach(set => {
    if (!D.comboSets.some(s => s.id === set.id)) D.comboSets.push(set);
  });
})();
