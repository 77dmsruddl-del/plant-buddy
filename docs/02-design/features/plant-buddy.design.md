# Plant Buddy — Game Mechanics Design

> **Feature**: game-mechanics
> **Phase**: Design
> **Date**: 2026-05-11
> **Architecture**: Option C — 커스텀 훅 분리 (Pragmatic Balance)
> **Plan Reference**: `docs/01-plan/features/plant-buddy.plan.md`

---

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | 1일 1식물 루틴 게임의 핵심 재미는 "오늘 이 식물을 어떻게 키울까"라는 전략적 선택. 지금은 그 선택이 없다. |
| **WHO** | 25~40세 한국 사무직 직장인 — 9시간 근무 중 4~5번 앱을 켜는 사람 |
| **RISK** | 밸런스 너무 어려우면 포기 / 식물별 프로파일이 직관적이지 않으면 학습 못 함 |
| **SUCCESS** | 식물마다 다른 전략 필요 인지 / 퇴근 결과 완성 비율 60% 이상 |
| **SCOPE** | 액션 시스템 + useGameEngine 훅 + TodoPanel + PlantPopup + 미완성 처리. 정원 그래픽 교체는 별도 세션. |

---

## 1. 아키텍처 개요 (Option C)

### 1.1 선택 근거

현재 GameScreen.jsx는 게임 로직과 UI가 완전히 섞여 있다. 동물 친구·계절 이벤트 등 엔드 콘텐츠를 추가할 때를 고려해, 게임 로직을 `useGameEngine` React hook으로 분리한다. GameScreen은 hook을 사용하는 얇은 UI 레이어로 남긴다.

### 1.2 파일 구조 변화

```
src/
├── hooks/
│   └── useGameEngine.js        ← NEW: 모든 게임 로직
├── components/
│   ├── TodoPanel.jsx           ← NEW: 슬라이드업 TODO 패널
│   └── PlantPopup.jsx          ← NEW: 식물 클릭 팝업
├── data/
│   └── plants.js               ← MODIFY: actionProfile 추가
├── utils/
│   └── storage.js              ← MODIFY: 새 키 3개 추가
└── screens/
    ├── GameScreen.jsx          ← MODIFY: hook 사용, UI만 남김
    ├── SeedScreen.jsx          ← MODIFY: TODO 초기 입력 + 유연근무 시간 입력
    ├── ResultScreen.jsx        ← MODIFY: 4단계 판정 + 씨앗 부스러기
    ├── GardenScreen.jsx        ← MODIFY: 미완성 식물 처리 (그래픽은 별도)
    ├── IntroScreen.jsx         ← MODIFY: 근무 유형 + 시간 설정 단계 추가
    └── HomeScreen.jsx          ← MODIFY: 근무 상태 카드 + 투두 탭 추가
```

### 1.3 데이터 흐름

```
SeedScreen
  │ TODO 초기 설정 → saveTodos()
  ↓
GameScreen
  │ useGameEngine(plant, plantName, personalityId)
  │   ├── actionCounts, love, stage, penalties
  │   ├── todos, fertilizers
  │   └── doAction(), useFertilizer(), completeTodo()
  │
  ├── <PlantCanvas />        (기존 — 나중에 스프라이트로 교체)
  ├── <PlantPopup />         (식물 클릭 시 상태 팝업)
  ├── <ActionButtons />      (사용횟수 표시 + 상태 색상)
  └── <TodoPanel />          (슬라이드업 — TODO + 비료)
  ↓
ResultScreen
  love 기준 4단계 판정
  씨앗 부스러기 지급 로직
```

---

## 2. useGameEngine 훅 설계

### 2.1 인터페이스

```js
// src/hooks/useGameEngine.js

export function useGameEngine({ plant, plantName, personalityId, goTo }) {
  // ── 상태 (State) ────────────────────────────────────────
  const [love, setLove]               // 현재 love 점수
  const [stage, setStage]             // 성장 단계 0~5
  const [elapsed, setElapsed]         // 경과 시간(초)
  const [message, setMessage]         // 식물 메시지
  const [dialogue, setDialogue]       // 대화 오버레이 데이터
  const [actionCounts, setActionCounts]  // { water:2, sun:4, pet:0, talk:1 }
  const [cooldowns, setCooldowns]     // { water:0, pet:0, sun:120, talk:0 } (초)
  const [todos, setTodos]             // [{ id, text, done }]
  const [fertilizers, setFertilizers] // 0~3
  const [fullyGrown, setFullyGrown]   // 5단계 완성 플래그

  // ── Refs (렌더 사이 유지) ────────────────────────────────
  const loveRef          // 최신 love (타이머 저장용)
  const stageRef         // 최신 stage
  const actionCountsRef  // 최신 actionCounts
  const startTime        // 게임 시작 시각

  // ── 액션 메서드 ──────────────────────────────────────────
  doAction(type)         // 'water'|'sun'|'pet'|'talk'
  useFertilizer()        // 비료 1개 소모 → love +20
  addTodo(text)          // TODO 추가
  completeTodo(id)       // TODO 완료 → fertilizers +1
  deleteTodo(id)         // TODO 삭제
  goHome()              // 퇴근 → ResultScreen

  // ── 계산값 (Computed) ────────────────────────────────────
  getActionStatus(type)  // 'safe'|'warning'|'penalty'|'cooldown'
  lovePercent            // love / 150 (게이지용)
  minWarnings            // 필수 min 미달 액션 목록
}
```

### 2.2 doAction 핵심 로직

```js
function doAction(type) {
  const profile = plant.actionProfile[type]
  const count = actionCountsRef.current[type]
  const newCount = count + 1

  // 쿨타임 체크
  if (cooldowns[type] > 0) return

  // love 계산
  let loveGain = 0
  if (newCount > profile.penaltyHard) {
    // 실제 감소
    const over = newCount - profile.penaltyHard
    loveGain = -(15 + (over - 1) * 5)
    showMessage(PENALTY_MESSAGES[type], 'penalty')
  } else if (newCount > profile.penaltyStart) {
    // 경고만, love 변화 없음
    loveGain = 0
    showMessage(WARNING_MESSAGES[type], 'warning')
  } else {
    // 정상 범위
    loveGain = 10 + (plant.favoriteAction === type ? 5 : 0)
    showMessage(MESSAGES[type][random], 'normal')
  }

  const newLove = Math.max(0, loveRef.current + loveGain)
  loveRef.current = newLove
  setLove(newLove)

  // 단계 업데이트
  const newStage = calcStage(newLove)
  if (newStage > stageRef.current) {
    stageRef.current = newStage
    setStage(newStage)
  }

  // 카운트 & 쿨타임 업데이트
  actionCountsRef.current = { ...actionCountsRef.current, [type]: newCount }
  setActionCounts({ ...actionCountsRef.current })
  setCooldowns(prev => ({ ...prev, [type]: COOLDOWN_SECS }))
}
```

### 2.3 love → 단계 변환

```js
const STAGE_THRESHOLDS = [0, 20, 45, 75, 110, 150]

function calcStage(love) {
  for (let i = STAGE_THRESHOLDS.length - 1; i >= 0; i--) {
    if (love >= STAGE_THRESHOLDS[i]) return i
  }
  return 0
}
```

### 2.4 퇴근 시 min 미달 페널티 정산

```js
function goHome() {
  const profile = plant.actionProfile
  let minPenalty = 0
  Object.entries(profile).forEach(([type, p]) => {
    const count = actionCountsRef.current[type]
    if (count < p.min) {
      minPenalty += (p.min - count) * 10
    }
  })
  const finalLove = Math.max(0, loveRef.current - minPenalty)
  // finalLove를 ResultScreen으로 전달
  goTo('result', { finalLove, actionCounts: actionCountsRef.current, plant, plantName })
}
```

---

## 3. 데이터 모델 변경

### 3.1 plants.js — actionProfile 추가

```js
// 기존 구조 유지 + actionProfile 필드 추가
{
  id: 'cactus',
  favoriteAction: 'sun',  // 기존 (하위 호환 유지)
  actionProfile: {
    water: { min: 0, safeMax: 1, penaltyStart: 2, penaltyHard: 3 },
    sun:   { min: 2, safeMax: Infinity, penaltyStart: Infinity, penaltyHard: Infinity },
    pet:   { min: 0, safeMax: 3, penaltyStart: 4, penaltyHard: 5 },
    talk:  { min: 0, safeMax: 3, penaltyStart: 4, penaltyHard: 5 },
  }
}
```

6종 식물 전체 프로파일 → Plan §2.2 참조

### 3.2 storage.js — 새 키 3개

```js
const KEY = {
  // 기존 키 유지
  player: 'pb_player',
  dex: 'pb_dex',
  today: 'pb_today',
  seeds: 'pb_seeds',
  garden: 'pb_garden',
  gamestate: 'pb_gamestate',
  // 신규 (게임 메카닉)
  fertilizers: 'pb_fertilizers',   // Number: 0~3
  todos: 'pb_todos',               // Array: [{ id, text, done, date }]
  unfinished: 'pb_unfinished',     // Array: [{ plantId, date, finalStage, finalLove, note }]
}

// pb_player 구조 확장 (출퇴근 시스템)
{
  name: '탐험가',
  createdAt: 1234567890000,
  workType: 'fixed' | 'flexible',  // ← 신규
  commuteStart: '09:00',           // ← 신규 (HH:MM 문자열)
  commuteEnd:   '18:00',           // ← 신규
}

// pb_today 구조 확장 (출퇴근 시스템)
{
  plantId, plantName, date, personalityId,  // 기존
  todayStart:   '09:30',   // ← 신규 (실제 오늘 출근 시각, 지각 반영)
  todayEnd:     '18:00',   // ← 신규
  isOvertime:   false,     // ← 신규
  overtimeEnd:  null,      // ← 신규 ('20:00' 등, 야근 선택 시)
}
```

신규 함수:
```js
getFertilizers()              // → Number
setFertilizers(n)             // 저장
getTodos(date)                // 오늘 할일만
saveTodo(todo)                // 추가/업데이트
completeTodoItem(id)          // done: true + 비료 +1
getUnfinished()               // 미완성 도감
addUnfinished(record)         // 기록 추가
```

### 3.3 gamestate 확장

```js
// pb_gamestate에 actionCounts 추가
saveGameState({
  love, stage, totalActions, startTime,
  actionCounts: { water, sun, pet, talk }  // ← 신규
})
```

---

## 4. UI 와이어프레임

### 4.1 GameScreen — 메인 뷰

```
┌─────────────────────────┐  360×640px
│  🌱 초록이 (해바라기)    │  상단 info bar
│  ████████████░░░  💧    │  love 게이지 (탭→숫자 표시)
├─────────────────────────┤
│                         │
│      [식물 그래픽]       │  ← 탭하면 PlantPopup 열림
│        (탭가능)          │
│                         │
│  ⏱ 02:34:15             │  경과 시간
├─────────────────────────┤
│  ⚠️ 대화 아직 0회        │  min 미달 경고 (해당 식물만)
├─────────────────────────┤
│  [💧 물주기]  [☀️ 햇빛]  │
│   2/3  ✓      4/∞  ✓   │
│  [🤲 쓰다듬] [💬 대화]   │
│   1/3  ·      0/3  ·   │
├─────────────────────────┤
│    ↑  할일 (2/3완료)  ↑  │  ← 슬라이드업 핸들
└─────────────────────────┘
```

**액션 버튼 상태:**

```
정상 (safe):    [ 💧 물주기  2/3 ]  초록 배경
경고 (warning): [⚠️ 물주기  2/1 ]  노란 테두리
페널티 (hard):  [❌ 물주기  3/1 ]  빨간 테두리
쿨타임:         [ 💧 1:45   2/3 ]  회색 + 남은시간
```

**love 게이지:**
```
평소:  [████████░░░░░░] 
탭 후: [████████░░░░░░] 127 / 150  (1.5초 후 숫자 사라짐)
```

### 4.2 PlantPopup — 식물 탭 시

```
┌─────────────────────────┐
│  초록이의 오늘 상태      │
│  ─────────────────────  │
│  love  [████████░░] 127 │  숫자 항상 표시 (팝업 안에서만)
│  단계  ●●●●○○  4/5     │
│  ─────────────────────  │
│  오늘 액션 현황          │
│  💧 물주기  2 / 3       │  ✅ safe
│  ☀️ 햇빛    4 / ∞      │  ✅ favorite
│  🤲 쓰다듬  1 / 3       │  ✅ safe
│  💬 대화    0 / 3  ⚠️   │  min 2 미달 경고
│  ─────────────────────  │
│         [닫기]           │
└─────────────────────────┘
```

### 4.3 TodoPanel — 슬라이드업

```
┌─────────────────────────┐
│  오늘의 할일             │  드래그 다운으로 닫힘
│  ─────────────────────  │
│  🌿 비료  ██  x2        │  [사용하기] 버튼 (0개면 회색)
│  ─────────────────────  │
│  ☑ 주간 보고서 작성  ✓  │  완료 → 취소선 + 비료 토스트
│  ☐ 팀 미팅 자료 준비    │
│  ☐ 점심 약속 확인       │
│  ─────────────────────  │
│  + 할일 추가...          │  인라인 텍스트 입력
└─────────────────────────┘

비료 획득 토스트:  🌿 비료 +1 획득!  (하단에서 올라왔다 사라짐)
```

### 4.4 SeedScreen — TODO 입력 추가

```
기존 씨앗 카드 + 이름 짓기 아래에 추가:

┌─────────────────────────┐
│  오늘 할일을 미리 적어볼까요?          │
│  할일을 마칠 때마다 비료를 드려요 🌿   │
│                         │
│  1. [________________]  │  텍스트 입력
│  2. [________________]  │
│  3. [________________]  │
│                         │
│  [건너뛰기]   [시작하기] │
└─────────────────────────┘

최대 5개, 최소 0개 (강제 없음)
```

### 4.5 ResultScreen — 4단계 판정

```
love ≥ 150:  완성 ★★★
┌─────────────────────────┐
│   🎉 완성!               │
│  [식물 5단계 그래픽]      │
│  초록이가 활짝 피었어요!  │
│                         │
│  love: 148 / 150        │
│  할일 완료: 2/3          │
│  비료 사용: 1회          │
│                         │
│  [정원에 심기]  [도감]    │
└─────────────────────────┘

love 110~149: 아쉬운 성공 ★★☆
  → "조금만 더였는데..."
  → 4단계 상태로 정원 입성

love 60~109: 부분 성장 ★☆☆
  → "오늘은 힘들었구나. 씨앗 부스러기를 드릴게요"
  → 3단계 상태 정원 입성 + 씨앗 부스러기 +1

love < 60: 거의 실패
  → 식물 대사 (마지막 편지)
  → 씨앗 부스러기 +1 (모이면 씨앗으로)
  → 미완성 도감에 기록
```

---

## 5. 컴포넌트 상세 스펙

### 5.1 TodoPanel.jsx

```
Props:
  todos: [{ id, text, done }]
  fertilizers: Number
  onComplete: (id) => void
  onAdd: (text) => void
  onDelete: (id) => void
  onUseFertilizer: () => void
  isOpen: Boolean
  onClose: () => void

동작:
  - 슬라이드업/다운 CSS 트랜지션 (transform: translateY)
  - 배경 탭 시 닫힘
  - TODO 완료 체크 시 즉시 UI 업데이트 + 비료 토스트
  - 비료 버튼: fertilizers > 0일 때만 활성
```

### 5.2 PlantPopup.jsx

```
Props:
  plant: Plant object
  plantName: String
  love: Number
  stage: Number
  actionCounts: { water, sun, pet, talk }
  onClose: () => void

표시 내용:
  - love 게이지 + 숫자 (항상 표시)
  - 단계 도트 인디케이터 (●●●●○○)
  - 각 액션 현황: 아이콘 + 횟수 + 상태 이모지
  - min 미달 액션 경고색 강조
```

### 5.3 ActionButton (GameScreen 내 inline)

별도 컴포넌트 파일 미생성. GameScreen 내 renderActionButton 함수로 처리:

```js
function renderActionButton(type, label, emoji) {
  const status = getActionStatus(type)   // hook에서 반환
  const count = actionCounts[type]
  const profile = plant.actionProfile[type]
  const cd = cooldowns[type]

  return (
    <button
      onClick={() => doAction(type)}
      disabled={cd > 0}
      style={{ borderColor: STATUS_COLORS[status], ... }}
    >
      {emoji} {label}
      <span>{count}/{profile.safeMax === Infinity ? '∞' : profile.safeMax}</span>
      {cd > 0 && <span>{formatTime(cd)}</span>}
      {status === 'warning' && <span>⚠️</span>}
      {status === 'penalty' && <span>❌</span>}
    </button>
  )
}
```

---

## 6. 미완성 식물 처리 흐름

```
ResultScreen 진입 시:

1. finalLove 계산 (goHome에서 전달)
2. 판정:
   if finalLove >= 150 → verdict = 'complete'
   if finalLove >= 110 → verdict = 'good'
   if finalLove >= 60  → verdict = 'partial'
   else               → verdict = 'fail'

3. verdict별 처리:
   'complete' → addToGarden({ ...plant, stage: 5, verdict })
              → addToDex(plantId, plantName, Date.now())
   'good'     → addToGarden({ ...plant, stage: 4, verdict })
              → addToDex(plantId, plantName, Date.now())  // 미완성 표시
   'partial'  → addToGarden({ ...plant, stage: 3, verdict })
              → addSeedFragment(plantId)   // 부스러기 +1
              → addUnfinished({ plantId, finalStage: 3, finalLove })
   'fail'     → addSeedFragment(plantId)
              → addUnfinished({ plantId, finalStage: calcStage(finalLove), finalLove })
              // 정원 입성 없음

4. 씨앗 부스러기: 2개 → 1개 씨앗 자동 변환
   getSeedFragments(plantId) >= 2 → addSeed(plantId); resetFragments(plantId)
```

---

## 7. 씨앗 부스러기 (Seed Fragment) 시스템

```js
// storage.js 추가
const KEY.fragments = 'pb_fragments'
// 구조: { sunflower: 1, cactus: 0, ... }

getFragments()              // 전체 반환
addSeedFragment(plantId)    // +1, 2개면 씨앗으로 자동 변환
getFragmentCount(plantId)   // 특정 식물 부스러기 수
```

**UI 표시** (SeedBagScreen 확장):
```
해바라기     🌻 x2  (씨앗)
선인장       🌵 x0
벚나무       🌸 x1  🍂 x1  ← 부스러기 1개
```

---

## 8. 성공 기준 매핑

| Plan SC | 구현 위치 |
|---------|----------|
| SC-1: 선인장 물 2번→경고, 3번→감소 | useGameEngine.doAction() + actionProfile |
| SC-2: 분재 한 가지만 몰빵 불가 | STAGE_THRESHOLDS + min 정산 |
| SC-3: 비료 TODO 완료 시 지급 | completeTodo() → setFertilizers |
| SC-4: love<60 씨앗 부스러기 + 미완성 도감 | ResultScreen 판정 로직 |
| SC-5: 버튼에 사용횟수 + 색상 상태 | renderActionButton + getActionStatus |
| SC-6: 완성/미완성/부분성장 다른 모습 | GardenScreen + stage 기반 렌더 |

---

## 9. 기술 고려 사항

### 9.1 타이머 리셋 버그 (기존 미해결)

현재 App.jsx의 조건부 렌더링으로 GameScreen이 언마운트/리마운트됨:
```jsx
{screen === 'game' && <GameScreen />}  // 매번 새로 마운트
```

`useGameEngine`에서 `_sessionStartTime` 모듈 변수 방식 유지 (기존 수정 그대로). 근본 해결(CSS display:none 방식)은 추후 별도 작업.

### 9.2 쿨타임 단위

현재 COOLDOWNS는 초 단위 (개발 테스트용으로 짧게). 실서비스는 분 단위:
```js
// dev
const COOLDOWN_SECS = { water: 30, sun: 25, pet: 20, talk: 15 }
// prod
const COOLDOWN_SECS = { water: 120, sun: 120, pet: 120, talk: 120 }  // 2시간 = 7200
```
환경변수 또는 상수 플래그로 전환.

### 9.3 PlantCanvas → 스프라이트 교체 준비

PlantCanvas 컴포넌트는 현재 기능을 유지하되, props 인터페이스를 스프라이트 교체 시 변경 최소화되도록:
```jsx
// 현재
<PlantCanvas stage={stage} color={plant.color} />

// 스프라이트 교체 시 (같은 props)
<PlantSprite stage={stage} plantId={plant.id} />
```
교체 시 PlantCanvas → PlantSprite 파일만 교체, 사용처 변경 없음.

---

## 10. 구현 가이드

### 10.1 Module Map

| 모듈 | 작업 | 신규 파일 | 수정 파일 |
|------|------|---------|---------|
| **M1** | 데이터 기반 | — | plants.js, storage.js |
| **M2** | useGameEngine 훅 | hooks/useGameEngine.js | — |
| **M3** | GameScreen 리팩터 | — | GameScreen.jsx |
| **M4** | TodoPanel + 비료 | components/TodoPanel.jsx | GameScreen.jsx, SeedScreen.jsx |
| **M5** | PlantPopup + min 경고 | components/PlantPopup.jsx | GameScreen.jsx |
| **M6** | ResultScreen 재설계 | — | ResultScreen.jsx |
| **M7** | 정원 미완성 처리 | — | GardenScreen.jsx, DexScreen.jsx |

### 10.2 Session Guide (추천 세션 분리)

```
Session 1: M1 + M2  (데이터 + 게임 로직 핵심)
  → plants.js actionProfile 추가
  → storage.js 신규 키/함수
  → useGameEngine.js 전체 구현
  → 단위 테스트: doAction(), calcStage(), goHome() 콘솔 검증

Session 2: M3 + M4  (게임 화면 UI)
  → GameScreen을 useGameEngine 훅으로 교체
  → TodoPanel 컴포넌트
  → SeedScreen TODO 입력 추가

Session 3: M5 + M6 + M7  (팝업 + 결과 + 정원)
  → PlantPopup 컴포넌트
  → ResultScreen 4단계 판정
  → GardenScreen 미완성 처리
  → DexScreen 미완성 탭

구현 순서 원칙:
  1. 데이터 모델 먼저 (M1) — 나머지 모두 의존
  2. 훅 다음 (M2) — 화면보다 먼저 완성해야 연결 가능
  3. 화면은 훅에 연결만 (M3+) — 로직 없이 UI만
```

### 10.3 구현 시작 체크리스트

```
□ plants.js — 6종 식물 actionProfile 추가 완료
□ storage.js — getFertilizers, saveTodos, addUnfinished 함수 추가
□ useGameEngine.js — doAction, calcStage, goHome, completeTodo 구현
□ GameScreen — useGameEngine 연결 + renderActionButton 교체
□ TodoPanel — 슬라이드업 동작 + 완료 체크 + 비료 토스트
□ SeedScreen — TODO 초기 입력 UI (0개 스킵 가능)
□ PlantPopup — 액션 현황 + min 미달 강조
□ ResultScreen — finalLove 기준 4단계 판정 + 씨앗 부스러기 지급
□ GardenScreen — stage 기반 식물 상태 구분 표시
```

---

## 11. 출퇴근 시스템 설계

> **추가 일자**: 2026-05-12 | **Plan 참조**: §14~16

### 11.1 IntroScreen — 단계 추가 (3단계로 확장)

```
기존: 이름 입력 → 게임 시작
신규: 이름 입력 → 근무 유형 선택 → 시간 설정 → 완료

Step 1: 이름 입력 (기존 유지)
┌─────────────────────────┐
│  탐험가 이름을 알려주세요  │
│  [________________]     │
│       [다음 →]          │
└─────────────────────────┘

Step 2: 근무 유형 선택
┌─────────────────────────┐
│  근무 형태를 선택하세요   │
│                         │
│  ┌───────────────────┐  │
│  │  📅 고정 근무     │  │  ← 매일 같은 시간
│  │  출퇴근이 일정해요  │  │
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │  🕐 유연 근무     │  │  ← 매일 입력
│  │  매일 시간이 달라요 │  │
│  └───────────────────┘  │
└─────────────────────────┘

Step 3: 시간 설정
┌─────────────────────────┐
│  근무 시간을 알려주세요   │
│                         │
│  출근  [09] : [00]      │  ← 시/분 선택
│  퇴근  [18] : [00]      │
│                         │
│  고정근무: "매일 이 시간으로 적용돼요"
│  유연근무: "기본값이에요. 매일 바꿀 수 있어요"
│                         │
│     [시작하기 🌱]        │
└─────────────────────────┘
```

### 11.2 HomeScreen — 근무 상태 카드 + 투두 탭

```
┌─────────────────────────┐
│  안녕하세요, 탐험가님! 🌿  │
│                         │
│  ┌─────────────────────┐│  ← 근무 상태 카드
│  │ ☀️ 근무 중           ││
│  │ 09:30 → 18:00       ││
│  │ 남은 시간: 6시간 12분 ││
│  └─────────────────────┘│
│                         │
│  ┌─────────────────────┐│  ← 투두 빠른보기
│  │ 📋 오늘 할일 1/3 완료 ││
│  │ > 주간 보고서 작성 ✓  ││
│  │ > 팀 미팅 자료 준비   ││
│  └─────────────────────┘│
│                         │
│   [🌱 오늘 씨앗 심기]    │
│   [📖 도감]  [🌳 정원]   │
└─────────────────────────┘

근무 상태별 카드 내용:
  출근 전:  "출근까지 N시간 남았어요 ☀️"
  근무 중:  "남은 근무시간: HH:MM" (실시간)
  야근 중:  "야근 중 🌙 효율 70%  남은시간: HH:MM"
  퇴근 후:  "오늘 수고했어요! 내일 또 만나요 🌿"
```

### 11.3 SeedScreen — 유연근무자 분기

```
유연근무자 첫 접속 시 씨앗 카드 전에 시간 입력 화면 삽입:

┌─────────────────────────┐
│  오늘 근무 시간은?        │
│                         │
│  출근  [09] : [00]      │
│  퇴근  [18] : [00]      │
│                         │
│      [확인 →]           │
└─────────────────────────┘
→ 이후 기존 씨앗 카드 흐름으로 진행
```

### 11.4 GameScreen — 야근 배너

```
퇴근 30분 전 자동 표시:

┌─────────────────────────┐  ← GameScreen 상단 배너 (접기 가능)
│ 🌙 퇴근 30분 남았어요    │
│ [오늘 퇴근] [+1시간] [+2시간] │
└─────────────────────────┘

야근 선택 후:
  - isOvertime = true 저장
  - 배너 → "야근 중 🌙 | 효율 70%" 상태 표시로 변경
  - doAction()에서 loveGain × 0.7 적용
```

### 11.5 useGameEngine — 출퇴근 연동 변경점

```js
// 세션 시작 시각 계산 (지각 시 당겨서 시작)
function calcSessionStart(todayStart) {
  const [h, m] = todayStart.split(':').map(Number)
  const today0 = new Date(); today0.setHours(0, 0, 0, 0)
  const commuteTs = today0.getTime() + (h * 60 + m) * 60000
  return Math.min(Date.now(), commuteTs)
  // 지각이면 출근 시각(commuteTs)이 더 작으므로 그것을 startTime으로 사용
  // → 타이머가 지각 시간만큼 앞서 출발
}

// 야근 여부에 따른 love 배율
const OVERTIME_MULTIPLIER = 0.7

function getLoveGain(base, isOvertime) {
  return isOvertime ? Math.round(base * OVERTIME_MULTIPLIER) : base
}

// doAction 내 적용
const rawGain = 10 + (plant.favoriteAction === type ? 5 : 0)
const loveGain = getLoveGain(rawGain, isOvertime)
```

### 11.6 storage.js — 출퇴근 함수 추가

```js
// player 저장/로드 (workType, commuteStart, commuteEnd 포함)
export function savePlayer(name, workType, commuteStart, commuteEnd)
export function getPlayer()  // 기존 함수, 반환값에 필드 추가됨

// 오늘 출퇴근 시각 (유연근무자 / 야근 처리)
export function saveTodaySchedule({ todayStart, todayEnd })
export function getTodaySchedule()   // { todayStart, todayEnd, isOvertime, overtimeEnd }
export function setOvertime(endTime) // isOvertime=true, overtimeEnd 갱신
```

---

## 12. 구현 가이드 (업데이트)

### 12.1 Module Map (M8 추가)

| 모듈 | 작업 | 신규 파일 | 수정 파일 |
|------|------|---------|---------|
| **M1** | 데이터 기반 | — | plants.js, storage.js |
| **M2** | useGameEngine 훅 | hooks/useGameEngine.js | — |
| **M3** | GameScreen 리팩터 | — | GameScreen.jsx |
| **M4** | TodoPanel + 비료 | components/TodoPanel.jsx | GameScreen.jsx, SeedScreen.jsx |
| **M5** | PlantPopup + min 경고 | components/PlantPopup.jsx | GameScreen.jsx |
| **M6** | ResultScreen 재설계 | — | ResultScreen.jsx |
| **M7** | 정원 미완성 처리 | — | GardenScreen.jsx, DexScreen.jsx |
| **M8** | 출퇴근 시스템 | — | IntroScreen.jsx, HomeScreen.jsx, SeedScreen.jsx, storage.js, useGameEngine.js |

### 12.2 Session Guide (업데이트)

```
Session 1: M1 + M2  (데이터 + 게임 로직 핵심)          ✅ 완료
Session 2: M3 + M4  (게임 화면 UI)                     ✅ 완료
Session 3: M5 + M6 + M7  (팝업 + 결과 + 정원)          🔄 진행 중
Session 4: M8  (출퇴근 시스템)                          ⬜ 예정
  1. storage.js — savePlayer 확장, saveTodaySchedule, setOvertime
  2. IntroScreen — 3단계 온보딩 (이름→근무유형→시간)
  3. HomeScreen — 근무 상태 카드 + 투두 탭
  4. SeedScreen — 유연근무자 시간 입력 분기
  5. useGameEngine — calcSessionStart + 야근 효율 0.7 적용
  6. GameScreen — 야근 배너 (퇴근 30분 전 자동 표시)
```

---

> **다음 단계**: `/pdca do plant-buddy`
> Session 3 (M5+M6+M7) 이후 Session 4 (M8 출퇴근 시스템) 진행.
> Session 4 시작: `/pdca do plant-buddy --scope M8`
