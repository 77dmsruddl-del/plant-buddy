/**
 * HomeScreen — 메인 허브 화면
 *
 * - 근무 상태 카드: 출근 전 / 근무 중 / 야근 중 / 퇴근 후 실시간 표시
 * - 투두 빠른보기: 오늘 완료 N/M
 * - 기존 통계 카드 + 메뉴 버튼
 */
import React, { useState, useEffect } from 'react'
import { getPlayer, getDex, getSeeds, getGarden, getTodaySchedule, getTodos } from '../utils/storage.js'
import { PLANTS } from '../data/plants.js'

// 'HH:MM' 문자열 → 오늘 기준 timestamp(ms)
function timeStrToTs(timeStr) {
  const [h, m] = (timeStr || '00:00').split(':').map(Number)
  const d = new Date()
  d.setHours(h, m, 0, 0)
  return d.getTime()
}

// ms → 'H시간 MM분' 포맷
function fmtDuration(ms) {
  if (ms <= 0) return '0분'
  const totalMin = Math.floor(ms / 60000)
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  if (h === 0) return `${m}분`
  return `${h}시간 ${String(m).padStart(2, '0')}분`
}

// 현재 근무 상태 계산
function getWorkStatus(schedule) {
  const now = Date.now()
  const startTs = timeStrToTs(schedule.todayStart)
  // 야근 중이면 overtimeEnd, 아니면 todayEnd
  const endStr  = schedule.isOvertime && schedule.overtimeEnd
    ? schedule.overtimeEnd
    : schedule.todayEnd
  const endTs   = timeStrToTs(endStr)

  if (now < startTs) {
    return { status: 'before', remaining: fmtDuration(startTs - now), endStr }
  }
  if (now > endTs) {
    return { status: 'after', remaining: '0분', endStr }
  }
  if (schedule.isOvertime) {
    return { status: 'overtime', remaining: fmtDuration(endTs - now), endStr }
  }
  return { status: 'working', remaining: fmtDuration(endTs - now), endStr }
}

const STATUS_CONFIG = {
  before:   { emoji: '🌅', label: '출근 전',  color: '#4A90D9' },
  working:  { emoji: '☀️',  label: '근무 중',  color: '#4A9E5A' },
  overtime: { emoji: '🌙', label: '야근 중',  color: '#7B5EA7' },
  after:    { emoji: '🌿', label: '퇴근 완료', color: '#888'    },
}

export default function HomeScreen({ goTo }) {
  const player     = getPlayer()
  const dex        = getDex()
  const seeds      = getSeeds()
  const garden     = getGarden()
  const schedule   = getTodaySchedule()
  const todos      = getTodos()

  const dexCount    = Object.keys(dex).length
  const seedCount   = Object.values(seeds).reduce((a, b) => a + b, 0)
  const gardenCount = garden.length
  const doneTodos   = todos.filter(t => t.done).length

  // 근무 상태를 1분마다 갱신
  const [workInfo, setWorkInfo] = useState(() => getWorkStatus(schedule))
  useEffect(() => {
    const id = setInterval(() => setWorkInfo(getWorkStatus(schedule)), 60000)
    return () => clearInterval(id)
  }, [])

  const statusCfg = STATUS_CONFIG[workInfo.status]

  return (
    <div style={styles.screen}>
      {/* ── 인사 ── */}
      <div style={{ textAlign: 'center' }}>
        <p style={styles.greeting}>
          안녕하세요, <strong>{player?.name}</strong>님 🌿
        </p>
        <p style={styles.greetingSub}>오늘도 식물을 돌봐줄 시간이에요</p>
      </div>

      {/* ── 근무 상태 카드 ── */}
      <div style={{ ...styles.workCard, borderColor: statusCfg.color }}>
        <div style={styles.workCardLeft}>
          <span style={{ fontSize: '22px' }}>{statusCfg.emoji}</span>
          <div>
            <p style={{ ...styles.workStatus, color: statusCfg.color }}>
              {statusCfg.label}
              {workInfo.status === 'overtime' && (
                <span style={styles.effBadge}> 효율 70%</span>
              )}
            </p>
            <p style={styles.workTime}>
              {schedule.todayStart} → {workInfo.endStr}
            </p>
          </div>
        </div>
        {(workInfo.status === 'before' || workInfo.status === 'working' || workInfo.status === 'overtime') && (
          <div style={styles.workRemaining}>
            <p style={styles.workRemainingLabel}>
              {workInfo.status === 'before' ? '출근까지' : '남은 시간'}
            </p>
            <p style={{ ...styles.workRemainingValue, color: statusCfg.color }}>
              {workInfo.remaining}
            </p>
          </div>
        )}
      </div>

      {/* ── 투두 빠른보기 ── */}
      {todos.length > 0 && (
        <div style={styles.todoCard}>
          <p style={styles.todoCardTitle}>
            📋 오늘 할일
            <span style={styles.todoCount}> {doneTodos}/{todos.length} 완료</span>
          </p>
          {todos.slice(0, 2).map(t => (
            <p key={t.id} style={{
              ...styles.todoItem,
              textDecoration: t.done ? 'line-through' : 'none',
              color: t.done ? '#aaa' : '#333',
            }}>
              {t.done ? '✓' : '·'} {t.text}
            </p>
          ))}
          {todos.length > 2 && (
            <p style={styles.todoMore}>... 외 {todos.length - 2}개</p>
          )}
        </div>
      )}

      {/* ── 통계 카드 ── */}
      <div style={styles.statGrid}>
        <StatCard emoji="📖" label="도감" value={`${dexCount}종`} />
        <StatCard emoji="🌿" label="정원" value={`${gardenCount}개`} />
        <StatCard emoji="🌰" label="씨앗" value={`${seedCount}개`} />
      </div>

      {/* ── 씨앗 심기 메인 버튼 ── */}
      <button onClick={() => goTo('seed')} style={styles.seedBtn}>
        <span style={{ fontSize: '32px' }}>🌱</span>
        오늘의 씨앗 심기
        <span style={styles.seedBtnSub}>매일 새로운 씨앗이 기다려요</span>
      </button>

      {/* ── 메뉴 ── */}
      <div style={styles.menuGrid}>
        <MenuBtn emoji="📖" label="도감"    sub={`${dexCount}/${PLANTS.length}종`} color="#4A90D9" onClick={() => goTo('dex')} />
        <MenuBtn emoji="🌳" label="정원"    sub={`${gardenCount}개`}               color="#90C97A" onClick={() => goTo('garden')} />
        <MenuBtn emoji="🌰" label="씨앗"    sub={`${seedCount}개`}                 color="#FFB830" onClick={() => goTo('seeds')} />
        <MenuBtn emoji="⚙️" label="설정"    sub="이름 변경 등"                      color="#888"   onClick={() => goTo('settings')} />
      </div>

      <p style={styles.dateStr}>
        {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
      </p>
    </div>
  )
}

function StatCard({ emoji, label, value }) {
  return (
    <div style={styles.statCard}>
      <div style={{ fontSize: '20px' }}>{emoji}</div>
      <div style={{ fontSize: '11px', color: '#888', margin: '2px 0' }}>{label}</div>
      <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#2d5a1b' }}>{value}</div>
    </div>
  )
}

function MenuBtn({ emoji, label, sub, color, onClick }) {
  return (
    <button onClick={onClick} style={{ ...styles.menuBtn, borderColor: color }}>
      <span style={{ fontSize: '26px' }}>{emoji}</span>
      <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#2d5a1b' }}>{label}</span>
      <span style={{ fontSize: '10px', color: '#888' }}>{sub}</span>
    </button>
  )
}

// ── 스타일 ───────────────────────────────────────────────────────
const styles = {
  screen: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(180deg, #87CEEB 60%, #90C97A 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px 16px',
    gap: '10px',
    overflowY: 'auto',
  },
  greeting: {
    fontSize: '13px',
    color: '#2d5a1b',
    margin: '0 0 2px',
  },
  greetingSub: {
    fontSize: '11px',
    color: '#3a7a28',
    margin: 0,
  },
  workCard: {
    width: '100%',
    background: 'rgba(255,255,255,0.88)',
    borderRadius: '14px',
    padding: '12px 14px',
    border: '2px solid',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workCardLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  workStatus: {
    fontSize: '14px',
    fontWeight: 'bold',
    margin: '0 0 2px',
  },
  effBadge: {
    fontSize: '11px',
    background: '#7B5EA7',
    color: 'white',
    borderRadius: '99px',
    padding: '1px 6px',
    marginLeft: '4px',
  },
  workTime: {
    fontSize: '11px',
    color: '#888',
    margin: 0,
  },
  workRemaining: {
    textAlign: 'right',
  },
  workRemainingLabel: {
    fontSize: '10px',
    color: '#888',
    margin: '0 0 2px',
  },
  workRemainingValue: {
    fontSize: '14px',
    fontWeight: 'bold',
    margin: 0,
  },
  todoCard: {
    width: '100%',
    background: 'rgba(255,255,255,0.75)',
    borderRadius: '12px',
    padding: '10px 14px',
  },
  todoCardTitle: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#2d5a1b',
    margin: '0 0 6px',
  },
  todoCount: {
    fontWeight: 'normal',
    color: '#4A9E5A',
  },
  todoItem: {
    fontSize: '12px',
    margin: '3px 0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  todoMore: {
    fontSize: '11px',
    color: '#aaa',
    margin: '3px 0 0',
  },
  statGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '8px',
    width: '100%',
  },
  statCard: {
    background: 'rgba(255,255,255,0.8)',
    borderRadius: '12px',
    padding: '10px 6px',
    textAlign: 'center',
  },
  seedBtn: {
    width: '100%',
    padding: '16px',
    background: '#4A9E5A',
    color: 'white',
    border: 'none',
    borderRadius: '16px',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  seedBtnSub: {
    fontSize: '11px',
    opacity: 0.85,
    fontWeight: 'normal',
  },
  menuGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    width: '100%',
  },
  menuBtn: {
    padding: '12px 8px',
    background: 'rgba(255,255,255,0.85)',
    border: '2px solid',
    borderRadius: '14px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '3px',
  },
  dateStr: {
    fontSize: '11px',
    color: '#3a7a28',
    margin: 0,
  },
}
