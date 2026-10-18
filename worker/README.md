# 블루 오픽 AI 중계 서버 (Cloudflare Worker)

친구들이 각자 키 없이 Gemini 첨삭을 쓰도록, 내 Gemini 키 하나를 이 서버에 숨겨 둡니다.
하루 사용 횟수는 Cloudflare KV에 "날짜+초대코드(또는 기기)" 키로 셉니다.

| 구분 | 값 |
|---|---|
| 모델 순서 | gemini-3.5-flash-lite → (429/5xx면) gemini-3.1-flash-lite → 둘 다 실패하면 앱의 내장 코치 |
| 하루 한도 | 초대 코드 멤버 50회, 코드 없는 기기 3회 (한국 시간 자정 리셋) |
| 허용 주소 | GitHub Pages 주소 + localhost:4180/4181 (wrangler.toml의 ALLOWED_ORIGINS) |
| 비밀 값 | GEMINI_API_KEY, INVITE_CODES (쉼표 구분) — 저장소에 넣지 않음 |

## 배포 순서 (한 번만)

```bash
cd worker
npx wrangler login                       # 브라우저로 Cloudflare 로그인
npx wrangler kv namespace create QUOTA   # 출력된 id를 wrangler.toml의 id 자리에 붙여넣기
npx wrangler secret put GEMINI_API_KEY   # Google AI Studio에서 만든 키 붙여넣기
npx wrangler secret put INVITE_CODES     # 예: MALMUN01,MALMUN02,MALMUN03
npx wrangler deploy                      # 끝나면 https://blueopic-coach.<계정>.workers.dev 주소가 나옴
```

그 주소를 앱의 `app.js` 맨 위 `COACH_API_BASE` 에 넣고 커밋·푸시하면 연결됩니다.

## 확인

```bash
curl "https://blueopic-coach.<계정>.workers.dev/quota?deviceId=test" -H "Origin: http://localhost:4180"
```
`{"remainingToday":3,"limit":3,"member":false}` 가 나오면 정상.

## 엔드포인트

| 메서드 | 경로 | 하는 일 |
|---|---|---|
| GET | /quota | 오늘 남은 횟수 |
| POST | /coach | 답변 첨삭: grade, gradeReasonKo, corrections[], upgradedAnswer, tipsKo[] |
| POST | /followup | 에바 꼬리 질문 1개: questionEn, questionKo |
| POST | /draft | 내 이야기로 답변 초안: draftEn, draftKo, keyPhrases[] |
| POST | /diagnose | 레벨테스트 종합 진단: grade, reasonKo, strengthsKo[], weaknessesKo[], nextStepKo |

모든 POST 요청 본문에 `deviceId`(앱이 자동 생성)와 선택적으로 `inviteCode`를 넣습니다. 응답에는 항상 `remainingToday`가 포함됩니다.
