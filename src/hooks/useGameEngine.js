import { useState, useEffect, useRef } from 'react'
import {
  getPlayer, saveGameState, getGameState, clearGameState,
  addToDex, addToGarden, addSeed,
  getFertilizers, useFertilizerItem,
  getTodos, addTodoItem, completeTodoItem, deleteTodoItem,
  addUnfinished, addSeedFragment,
  getTodaySchedule, setOvertime,
} from '../utils/storage.js'
import { getScenario, getMonologue } from '../data/dialogues.js'

// ── 상수 ────────────────────────────────────────────────────────────────────

// love 누적량에 따른 단계 경계값 (0~5단계)
const STAGE_THRESHOLDS = [0, 20, 45, 75, 110, 150]

// 각 액션의 쿨타임 (초 단위 — 개발 중엔 짧게, 실서비스는 7200)
const COOLDOWN_SECS = { water: 30, sun: 25, pet: 20, talk: 15 }

// 정상 범위 내 액션 메시지
const ACTION_MESSAGES = {
  water: ['시원해요! 💧', '물이 딱 좋아요!', '촉촉해요 🌿'],
  pet:   ['기분 좋아요~ 🤲', '따뜻해요!', '행복해요 💚'],
  sun:   ['햇빛 최고! ☀️', '광합성 중이에요!', '에너지 충전!'],
  talk:  ['말 걸어줘서 기뻐요!', '혼자가 아니에요 💬', '오늘도 잘 부탁해요!'],
}

// 경고 메시지 (penaltyStart 초과, love 변화 없음)
const WARNING_MESSAGES = {
  water: '잠깐... 좀 많이 주는 것 같지 않아? 🤔',
  sun:   '햇빛이 너무 강해요... 조금만요 ☀️',
  pet:   '너무 많이 만지면 간지러워요 🙈',
  talk:  '잠깐 쉬어도 돼요... 귀가 윙윙해요 😵',
}

// 실제 페널티 메시지 (penaltyHard 초과, love 감소)
const PENALTY_MESSAGES = {
  water: '이러다가 나 힘들어질 것 같아 ㅠ 뿌리가 썩어가요 💦',
  sun:   '너무 뜨거워요!! 잎이 타고 있어요 🔥',
  pet:   '아야... 너무 세게 만지면 아파요 😢',
  talk:  '머리가 너무 아파요... 잠깐 쉬게 해줘요 😭',
}

// 비료 사용 시 식물 반응 (성격과 무관하게 공통)
const FERTILIZER_MESSAGES = [
  '이게 뭐야... 엄청난데?! 🌿',
  '기운이 솟구쳐요! 비료 최고! ✨',
  '와... 갑자기 힘이 펄펄 나요 💪',
]

// ── 유틸 함수 ────────────────────────────────────────────────────────────────

function calcStage(love) {
  for (let i = STAGE_THRESHOLDS.length - 1; i >= 0; i--) {
    if (love >= STAGE_THRESHOLDS[i]) return i
  }
  return 0
}

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// 야근 중 love 획득 효율
const OVERTIME_MULTIPLIER = 0.7

// 'HH:MM' → 오늘 기준 timestamp(ms)
function timeStrToTs(timeStr) {
  const [h, m] = (timeStr || '09:00').split(':').map(Number)
  const d = new Date(); d.setHours(h, m, 0, 0)
  return d.getTime()
}

// 모듈 변수 — GameScreen 언마운트/리마운트 사이에서도 타이머 시작 시각 유지
let _sessionStartTime = null

// ── 훅 본체 ─────────────────────────────────────────────────────────────────

export function useGameEngine({ plant, plantName, personalityId, goTo }) {
  const saved = getGameState()

  // 최초 1회만: 저장된 시작시각 복원 or 지각 반영 시각으로 초기화
  if (!_sessionStartTime) {
    if (saved?.startTime) {
      _sessionStartTime = saved.startTime
    } else {
      // 지각 처리: 출근 시각과 현재 시각 중 더 이른 것을 시작점으로
      const schedule = getTodaySchedule()
      const commuteTs = timeStrToTs(schedule.todayStart)
      _sessionStartTime = Math.min(Date.now(), commuteTs)
    }
  }

  // ── 상태 ──────────────────────────────────────────────────
  const [love, setLove] = useState(saved?.love ?? 0)
  const [stage, setStage] = useState(saved?.stage ?? 0)
  const [elapsed, setElapsed] = useState(
    Math.floor((Date.now() - _sessionStartTime) / 1000)
  )
  const [message, setMessage] = useState(`안녕! 나는 ${plantName}이에요 🌱`)
  const [messageType, setMessageType] = useState('normal') // 'normal'|'warning'|'penalty'|'fertilizer'
  const [dialogue, setDialogue] = useState(null)
  const [actionCounts, setActionCounts] = useState(
    saved?.actionCounts ?? { water: 0, sun: 0, pet: 0, talk: 0 }
  )
  const [cooldowns, setCooldowns] = useState({ water: 0, sun: 0, pet: 0, talk: 0 })
  const [todos, setTodos] = useState(getTodos)
  const [fertilizers, setFertilizers] = useState(getFertilizers)
  const [fullyGrown, setFullyGrown] = useState(false)
  const [talkCount, setTalkCount] = useState(0)
  const [showLoveNumber, setShowLoveNumber] = useState(false)
  const [isOvertime, setIsOvertime] = useState(
    () => getTodaySchedule().isOvertime || false
  )

  // ── Refs (타이머 클로저에서 최신값 읽기 위해) ──────────────
  const loveRef         = useRef(saved?.love ?? 0)
  const stageRef        = useRef(saved?.stage ?? 0)
  const actionCountsRef = useRef(saved?.actionCounts ?? { water: 0, sun: 0, pet: 0, talk: 0 })
  const startTime       = useRef(_sessionStartTime)
  const msgTimer        = useRef(null)
  const loveNumTimer    = useRef(null)
  const grownTimers     = useRef([])

  // ── 마운트 즉시 저장 (도감 갔다 오면 복원 가능하게) ─────────
  useEffect(() => {
    saveGameState({
      love: loveRef.current,
      stage: stageRef.current,
      actionCounts: actionCountsRef.current,
      startTime: startTime.current,
    })
  }, [])

  // ── 타이머: 1초마다 경과 시간 업데이트 + 주기적 저장 ────────
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime.current) / 1000))
      saveGameState({
        love: loveRef.current,
        stage: stageRef.current,
        actionCounts: actionCountsRef.current,
        startTime: startTime.current,
      })

      // 쿨타임 1초씩 감소
      setCooldowns(prev => {
        const next = {}
        for (const k of Object.keys(prev)) next[k] = Math.max(0, prev[k] - 1)
        return next
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // ── 언마운트 정리 ─────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (msgTimer.current) clearTimeout(msgTimer.current)
      if (loveNumTimer.current) clearTimeout(loveNumTimer.current)
      grownTimers.current.forEach(t => clearTimeout(t))
    }
  }, [])

  // ── 내부 헬퍼 ─────────────────────────────────────────────

  function showMessage(text, type = 'normal') {
    if (msgTimer.current) clearTimeout(msgTimer.current)
    setMessage(text)
    setMessageType(type)
    msgTimer.current = setTimeout(() => {
      setMessage('')
      setMessageType('normal')
    }, 2500)
  }

  function updateLove(delta) {
    const newLove = Math.max(0, loveRef.current + delta)
    loveRef.current = newLove
    setLove(newLove)

    const newStage = calcStage(newLove)
    if (newStage > stageRef.current) {
      stageRef.current = newStage
      setStage(newStage)
      if (newStage === 5) {
        setFullyGrown(true)
        showMessage('다 컸어요! 🎉 정말 고마워요!', 'normal')
        const t = setTimeout(() => {
          _sessionStartTime = null
          clearGameState()
          goTo('result', {
            plantId: plant.id,
            plantName,
            finalLove: loveRef.current,
            actionCounts: actionCountsRef.current,
            verdict: 'complete',
          })
        }, 2000)
        grownTimers.current.push(t)
      }
    }
  }

  // ── 공개 액션 ─────────────────────────────────────────────

  function doAction(type) {
    if (cooldowns[type] > 0 || fullyGrown) return

    const profile = plant.actionProfile?.[type]
    const count = actionCountsRef.current[type]
    const newCount = count + 1

    // 카운트 업데이트
    const newCounts = { ...actionCountsRef.current, [type]: newCount }
    actionCountsRef.current = newCounts
    setActionCounts(newCounts)

    // 쿨타임 설정
    setCooldowns(prev => ({ ...prev, [type]: COOLDOWN_SECS[type] }))

    // love 계산
    if (profile && newCount > profile.penaltyHard) {
      const over = newCount - profile.penaltyHard
      const penalty = -(15 + (over - 1) * 5)
      updateLove(penalty)
      showMessage(PENALTY_MESSAGES[type], 'penalty')
    } else if (profile && newCount > profile.penaltyStart) {
      // 경고만, love 변화 없음
      showMessage(WARNING_MESSAGES[type], 'warning')
    } else {
      const base  = 10
      const bonus = plant.favoriteAction === type ? 5 : 0
      const raw   = base + bonus
      // 야근 중이면 70% 효율
      updateLove(isOvertime ? Math.round(raw * OVERTIME_MULTIPLIER) : raw)
      showMessage(randomPick(ACTION_MESSAGES[type]), 'normal')
    }

    // 대화 트리거 (talk 액션)
    if (type === 'talk') {
      const newTalkCount = talkCount + 1
      setTalkCount(newTalkCount)
      const scenario = getScenario(plant.id, personalityId, stageRef.current, newTalkCount)
      if (scenario) {
        const t = setTimeout(() => setDialogue(scenario), 400)
        grownTimers.current.push(t)
      } else {
        const monologue = getMonologue(plant.id, personalityId, stageRef.current)
        if (monologue) showMessage(monologue, 'normal')
      }
    }
  }

  function useFertilizer() {
    if (fertilizers <= 0 || fullyGrown) return
    const ok = useFertilizerItem()
    if (!ok) return
    const newCount = getFertilizers()
    setFertilizers(newCount)
    updateLove(20)
    showMessage(randomPick(FERTILIZER_MESSAGES), 'fertilizer')
  }

  function handleAddTodo(text) {
    const newTodo = addTodoItem(text)
    setTodos(prev => [...prev, newTodo])
  }

  function handleCompleteTodo(id) {
    completeTodoItem(id)
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: true } : t))
    setFertilizers(getFertilizers())
  }

  function handleDeleteTodo(id) {
    deleteTodoItem(id)
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  function handleDialogueChoice(choice) {
    setDialogue(null)
    if (choice?.reply) showMessage(choice.reply, 'normal')
  }

  function tapLoveGauge() {
    setShowLoveNumber(true)
    if (loveNumTimer.current) clearTimeout(loveNumTimer.current)
    loveNumTimer.current = setTimeout(() => setShowLoveNumber(false), 1500)
  }

  // 야근 선언 (GameScreen 배너에서 호출)
  function declareOvertime(extraHours) {
    const schedule = getTodaySchedule()
    const [h, m] = (schedule.todayEnd || '18:00').split(':').map(Number)
    const newH = h + extraHours
    const overtimeEnd = `${String(newH).padStart(2, '0')}:${String(m).padStart(2, '0')}`
    setOvertime(overtimeEnd)
    setIsOvertime(true)
    showMessage(`야근 시작! 오늘도 고생이에요 🌙 (효율 70%)`, 'normal')
  }

  // 퇴근 버튼
  function goHome() {
    // min 미달 페널티 정산
    let minPenalty = 0
    if (plant.actionProfile) {
      Object.entries(plant.actionProfile).forEach(([type, p]) => {
        const count = actionCountsRef.current[type]
        if (count < p.min) {
          minPenalty += (p.min - count) * 10
        }
      })
    }
    const finalLove = Math.max(0, loveRef.current - minPenalty)

    // 결과 판정
    let verdict
    if (finalLove >= 150) verdict = 'complete'
    else if (finalLove >= 110) verdict = 'good'
    else if (finalLove >= 60) verdict = 'partial'
    else verdict = 'fail'

    _sessionStartTime = null
    clearGameState()
    goTo('result', {
      plantId: plant.id,
      plantName,
      finalLove,
      actionCounts: actionCountsRef.current,
      verdict,
    })
  }

  // ── 계산값 ─────────────────────────────────────────────────

  // 액션 버튼 상태: 'safe' | 'warning' | 'penalty' | 'cooldown'
  function getActionStatus(type) {
    if (cooldowns[type] > 0) return 'cooldown'
    const profile = plant.actionProfile?.[type]
    if (!profile) return 'safe'
    const count = actionCounts[type]
    if (count >= profile.penaltyHard) return 'penalty'
    if (count >= profile.penaltyStart) return 'warning'
    return 'safe'
  }

  // min 미달 중인 액션 목록 (경고 인디케이터용)
  const minWarnings = plant.actionProfile
    ? Object.entries(plant.actionProfile)
        .filter(([type, p]) => p.min > 0 && actionCounts[type] < p.min)
        .map(([type]) => type)
    : []

  const lovePercent = Math.min(100, Math.round((love / 150) * 100))

  return {
    // 상태
    love, stage, elapsed, message, messageType, dialogue,
    actionCounts, cooldowns, todos, fertilizers, fullyGrown,
    showLoveNumber, lovePercent, minWarnings,
    // 액션
    doAction, useFertilizer,
    addTodo: handleAddTodo,
    completeTodo: handleCompleteTodo,
    deleteTodo: handleDeleteTodo,
    closeDialogue: handleDialogueChoice,
    tapLoveGauge,
    goHome,
    declareOvertime,
    // 계산
    getActionStatus,
    isOvertime,
  }
}
