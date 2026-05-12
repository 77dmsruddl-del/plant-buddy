/**
 * GameScreen — 식물 키우기 메인 화면
 *
 * 게임 로직은 useGameEngine 훅이 담당한다.
 * 이 컴포넌트는 UI 렌더링만 한다.
 */
import React, { useState, useEffect } from 'react'
import { getTodaySchedule } from '../utils/storage.js'
import { PLANTS } from '../data/plants.js'
import { getPersonalityId } from '../utils/storage.js'
import { useGameEngine } from '../hooks/useGameEngine.js'
import PlantCanvas from '../components/PlantCanvas.jsx'
import TodoPanel from '../components/TodoPanel.jsx'
import DialogueOverlay from './DialogueOverlay.jsx'

// 액션 버튼 정의 (타입, 라벨, 기본 색상)
const ACTIONS = [
  { type: 'water', label: '💧 물주기',   color: '#4A90D9' },
  { type: 'sun',   label: '☀️ 햇빛',     color: '#FFB830' },
  { type: 'pet',   label: '🤲 쓰다듬기', color: '#E8A0BF' },
  { type: 'talk',  label: '💬 말걸기',   color: '#90C97A' },
]

// 액션 상태별 테두리 색상
const STATUS_BORDER = {
  safe:     'transparent',
  warning:  '#FFB830',
  penalty:  '#FF4444',
  cooldown: 'transparent',
}

// 메시지 말풍선 색상 (messageType별)
const BUBBLE_COLOR = {
  normal:     '#3C3489',
  warning:    '#A0600A',
  penalty:    '#CC2222',
  fertilizer: '#2A7A2A',
}

export default function GameScreen({ goTo, data }) {
  const plant = PLANTS.find(p => p.id === data?.plantId) || PLANTS[0]
  const plantName = data?.plantName || plant.name
  const personalityId = data?.personalityId || getPersonalityId() || 'sunny'

  const [todoOpen, setTodoOpen] = useState(false)
  const [showOvertimeBanner, setShowOvertimeBanner] = useState(false)

  // 퇴근 30분 전 배너 체크 (1분마다)
  useEffect(() => {
    function check() {
      if (engine.isOvertime || engine.fullyGrown) return
      const schedule = getTodaySchedule()
      const [h, m] = (schedule.todayEnd || '18:00').split(':').map(Number)
      const endTs = new Date(); endTs.setHours(h, m, 0, 0)
      const diff = endTs.getTime() - Date.now()
      setShowOvertimeBanner(diff > 0 && diff <= 30 * 60 * 1000)
    }
    check()
    const id = setInterval(check, 60000)
    return () => clearInterval(id)
  }, [engine.isOvertime, engine.fullyGrown])

  // 모든 게임 로직은 훅에서
  const engine = useGameEngine({ plant, plantName, personalityId, goTo })

  const {
    love, stage, elapsed, message, messageType, dialogue,
    actionCounts, cooldowns, todos, fertilizers, fullyGrown,
    showLoveNumber, lovePercent, minWarnings,
    isOvertime, declareOvertime,
    doAction, useFertilizer,
    addTodo, completeTodo, deleteTodo,
    closeDialogue, tapLoveGauge, goHome,
    getActionStatus,
  } = engine

  // 경과 시간 포맷 (MM:SS)
  const timeStr = [
    String(Math.floor(elapsed / 60)).padStart(2, '0'),
    String(elapsed % 60).padStart(2, '0'),
  ].join(':')

  return (
    <div style={styles.screen}>

      {/* ── 상단 바 ─────────────────────────────────────────── */}
      <div style={styles.topBar}>
        <NavButton onClick={() => goTo('home')}>🏠 홈</NavButton>
        <span style={styles.timer}>⏰ {timeStr}</span>
        <NavButton onClick={() => goTo('dex')}>📖 도감</NavButton>
      </div>

      {/* ── 야근 배너 (퇴근 30분 전 or 야근 중) ────────────────── */}
      {isOvertime && (
        <div style={styles.overtimeBadge}>
          🌙 야근 중 — 효율 70%
        </div>
      )}
      {showOvertimeBanner && !isOvertime && (
        <div style={styles.overtimeBanner}>
          <span style={{ fontSize: '12px', color: '#5A3A7A' }}>🌙 퇴근 30분 전이에요. 연장할까요?</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button style={styles.otBtn} onClick={() => { setShowOvertimeBanner(false); declareOvertime(1) }}>+1시간</button>
            <button style={styles.otBtn} onClick={() => { setShowOvertimeBanner(false); declareOvertime(2) }}>+2시간</button>
            <button style={{ ...styles.otBtn, background: '#ddd', color: '#888' }} onClick={() => setShowOvertimeBanner(false)}>퇴근</button>
          </div>
        </div>
      )}

      {/* ── 식물 이름 + 단계 ─────────────────────────────────── */}
      <div style={{ textAlign: 'center' }}>
        <p style={styles.plantName}>
          {plantName}
          <span style={styles.plantNameSub}> ({plant.name})</span>
        </p>
        <p style={styles.stageName}>🌱 {plant.stages[stage]}</p>
      </div>

      {/* ── Love 게이지 ──────────────────────────────────────── */}
      <div style={styles.gaugeWrap} onClick={tapLoveGauge}>
        <div style={styles.gaugeRow}>
          <span style={styles.gaugeLabel}>💚 관심도</span>
          {/* 탭하면 1.5초간 숫자 표시 */}
          {showLoveNumber && (
            <span style={styles.gaugeLabel}>{love} / 150</span>
          )}
        </div>
        <div style={styles.gaugeTrack}>
          <div style={{ ...styles.gaugeFill, width: `${lovePercent}%` }} />
        </div>
      </div>

      {/* ── Min 미달 경고 인디케이터 ─────────────────────────── */}
      {minWarnings.length > 0 && !fullyGrown && (
        <div style={styles.minWarning}>
          ⚠️ {minWarnings.map(t => ACTION_LABEL[t]).join(', ')} 아직 부족해요
        </div>
      )}

      {/* ── 말풍선 ───────────────────────────────────────────── */}
      <div style={styles.bubbleWrap}>
        {message && (
          <div style={{
            ...styles.bubble,
            color: BUBBLE_COLOR[messageType] || BUBBLE_COLOR.normal,
          }}>
            {message}
          </div>
        )}
      </div>

      {/* ── 식물 캔버스 ──────────────────────────────────────── */}
      <div style={styles.canvasWrap}>
        <PlantCanvas stage={stage} color={plant.color || 0x5CAD6B} />
      </div>

      {/* ── 액션 버튼 4개 ────────────────────────────────────── */}
      <div style={styles.actionGrid}>
        {ACTIONS.map(({ type, label, color }) => {
          const status = getActionStatus(type)
          const count = actionCounts[type]
          const profile = plant.actionProfile?.[type]
          const safeMax = profile?.safeMax === Infinity ? '∞' : profile?.safeMax ?? '∞'
          const cd = cooldowns[type]

          return (
            <button
              key={type}
              onClick={() => doAction(type)}
              disabled={fullyGrown}
              style={{
                ...styles.actionBtn,
                background: status === 'cooldown' ? '#aaa' : color,
                border: `2px solid ${STATUS_BORDER[status]}`,
                cursor: fullyGrown || status === 'cooldown' ? 'not-allowed' : 'pointer',
                opacity: fullyGrown ? 0.5 : 1,
              }}
            >
              {/* 버튼 라벨 */}
              <span style={styles.actionLabel}>{label}</span>

              {/* 상태 표시: 쿨타임 or 사용횟수 */}
              <span style={styles.actionCount}>
                {cd > 0
                  ? `${cd}s`
                  : `${count}/${safeMax}`
                }
                {status === 'warning' && ' ⚠️'}
                {status === 'penalty' && ' ❌'}
              </span>
            </button>
          )
        })}
      </div>

      {/* ── 퇴근 버튼 ────────────────────────────────────────── */}
      <button onClick={goHome} style={styles.goHomeBtn}>
        🚪 퇴근하기
      </button>

      {/* ── TODO 패널 슬라이드업 핸들 ────────────────────────── */}
      <button onClick={() => setTodoOpen(true)} style={styles.todoHandle}>
        ↑ 할일 ({todos.filter(t => t.done).length}/{todos.length}완료)
        {fertilizers > 0 && (
          <span style={styles.fertBadge}>🌿×{fertilizers}</span>
        )}
      </button>

      {/* ── TodoPanel (슬라이드업) ────────────────────────────── */}
      <TodoPanel
        isOpen={todoOpen}
        onClose={() => setTodoOpen(false)}
        todos={todos}
        fertilizers={fertilizers}
        onComplete={completeTodo}
        onAdd={addTodo}
        onDelete={deleteTodo}
        onUseFertilizer={useFertilizer}
      />

      {/* ── 대화 오버레이 ─────────────────────────────────────── */}
      {dialogue && (
        <DialogueOverlay
          scenario={dialogue}
          plantName={plantName}
          onClose={closeDialogue}
        />
      )}
    </div>
  )
}

// ── 서브 컴포넌트 ─────────────────────────────────────────────

function NavButton({ onClick, children }) {
  return (
    <button onClick={onClick} style={styles.navBtn}>
      {children}
    </button>
  )
}

// 액션 타입 → 한글 라벨 (min 경고 표시용)
const ACTION_LABEL = {
  water: '물주기',
  sun:   '햇빛',
  pet:   '쓰다듬기',
  talk:  '대화',
}

// ── 스타일 ────────────────────────────────────────────────────

const styles = {
  screen: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(180deg, #87CEEB 60%, #90C97A 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '12px 16px 0',
    gap: '6px',
    overflow: 'hidden',
    position: 'relative',
  },
  topBar: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navBtn: {
    background: 'rgba(255,255,255,0.7)',
    border: 'none',
    borderRadius: '99px',
    padding: '4px 10px',
    fontSize: '12px',
    color: '#2d5a1b',
    cursor: 'pointer',
  },
  timer: {
    fontSize: '12px',
    color: '#2d5a1b',
  },
  plantName: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#2d5a1b',
    margin: 0,
  },
  plantNameSub: {
    fontWeight: 'normal',
    fontSize: '13px',
  },
  stageName: {
    fontSize: '12px',
    color: '#3a7a28',
    margin: '2px 0 0',
  },
  gaugeWrap: {
    width: '100%',
    cursor: 'pointer',
    userSelect: 'none',
  },
  gaugeRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '4px',
  },
  gaugeLabel: {
    fontSize: '11px',
    color: '#2d5a1b',
  },
  gaugeTrack: {
    width: '100%',
    height: '8px',
    background: 'rgba(255,255,255,0.4)',
    borderRadius: '99px',
    overflow: 'hidden',
  },
  gaugeFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #ff85a1, #ffb3c6)',
    borderRadius: '99px',
    transition: 'width 0.4s ease',
  },
  minWarning: {
    width: '100%',
    background: 'rgba(255,184,48,0.25)',
    border: '1px solid #FFB830',
    borderRadius: '8px',
    padding: '4px 10px',
    fontSize: '11px',
    color: '#7A4A00',
    textAlign: 'center',
  },
  bubbleWrap: {
    height: '44px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    background: 'rgba(255,255,255,0.88)',
    borderRadius: '12px',
    padding: '8px 16px',
    fontSize: '13px',
    textAlign: 'center',
    width: '100%',
  },
  canvasWrap: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    width: '100%',
  },
  actionBtn: {
    padding: '10px 8px',
    color: 'white',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: 'bold',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
  },
  actionLabel: {
    fontSize: '13px',
  },
  actionCount: {
    fontSize: '10px',
    opacity: 0.9,
  },
  goHomeBtn: {
    padding: '7px 24px',
    background: 'rgba(80,80,80,0.45)',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    fontSize: '12px',
    cursor: 'pointer',
    marginTop: '2px',
  },
  todoHandle: {
    width: '100%',
    padding: '8px',
    background: 'rgba(255,255,255,0.6)',
    border: 'none',
    borderTop: '1px solid rgba(0,0,0,0.1)',
    fontSize: '12px',
    color: '#2d5a1b',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: 'auto',
  },
  overtimeBadge: {
    width: '100%',
    background: 'rgba(123,94,167,0.18)',
    border: '1px solid #7B5EA7',
    borderRadius: '8px',
    padding: '4px 10px',
    fontSize: '11px',
    color: '#5A3A7A',
    textAlign: 'center',
  },
  overtimeBanner: {
    width: '100%',
    background: 'rgba(123,94,167,0.12)',
    border: '1px solid #7B5EA7',
    borderRadius: '10px',
    padding: '8px 10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '8px',
  },
  otBtn: {
    padding: '4px 10px',
    background: '#7B5EA7',
    color: 'white',
    border: 'none',
    borderRadius: '99px',
    fontSize: '11px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  fertBadge: {
    background: '#4A9E5A',
    color: 'white',
    borderRadius: '99px',
    padding: '1px 7px',
    fontSize: '11px',
  },
}
