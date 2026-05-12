/**
 * IntroScreen — 최초 1회 온보딩 (3단계)
 *
 * Step 1: 탐험가 이름 입력
 * Step 2: 근무 유형 선택 (고정 / 유연)
 * Step 3: 출퇴근 시간 설정
 *
 * 완료 후 savePlayer() 호출 → 이후 접속은 HomeScreen으로 바로 이동.
 */
import React, { useState } from 'react'
import { getPlayer, savePlayer } from '../utils/storage.js'

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTES = ['00', '15', '30', '45']

export default function IntroScreen({ goTo }) {
  const player = getPlayer()

  // 이미 등록된 유저면 홈으로
  React.useEffect(() => {
    if (player) goTo('home')
  }, [])
  if (player) return null

  const [step, setStep]               = useState(1)
  const [name, setName]               = useState('')
  const [nameError, setNameError]     = useState(false)
  const [workType, setWorkType]       = useState(null)    // 'fixed' | 'flexible'
  const [startH, setStartH]           = useState('09')
  const [startM, setStartM]           = useState('00')
  const [endH, setEndH]               = useState('18')
  const [endM, setEndM]               = useState('00')

  // Step 1 완료
  function handleNameNext() {
    if (!name.trim()) {
      setNameError(true)
      setTimeout(() => setNameError(false), 800)
      return
    }
    setStep(2)
  }

  // Step 2 완료
  function handleWorkTypeSelect(type) {
    setWorkType(type)
    setStep(3)
  }

  // Step 3 완료 → 저장 후 홈으로
  function handleFinish() {
    savePlayer(
      name.trim(),
      workType,
      `${startH}:${startM}`,
      `${endH}:${endM}`,
    )
    goTo('home')
  }

  return (
    <div style={styles.screen}>
      <div style={{ fontSize: '56px' }}>🌱</div>
      <p style={styles.appTitle}>Plant Buddy</p>
      <p style={styles.appSub}>매일 하나의 씨앗을 키워요</p>

      {/* 단계 인디케이터 */}
      <div style={styles.stepRow}>
        {[1, 2, 3].map(n => (
          <div key={n} style={{
            ...styles.stepDot,
            background: step >= n ? '#4A9E5A' : 'rgba(255,255,255,0.4)',
          }} />
        ))}
      </div>

      {/* ── Step 1: 이름 ── */}
      {step === 1 && (
        <div style={styles.stepBox}>
          <p style={styles.stepTitle}>탐험가 이름을 알려주세요</p>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleNameNext()}
            placeholder="이름 입력..."
            maxLength={10}
            style={{
              ...styles.input,
              borderColor: nameError ? '#ff4444' : '#4A9E5A',
            }}
          />
          <button onClick={handleNameNext} style={styles.primaryBtn}>
            다음 →
          </button>
        </div>
      )}

      {/* ── Step 2: 근무 유형 ── */}
      {step === 2 && (
        <div style={styles.stepBox}>
          <p style={styles.stepTitle}>근무 형태를 선택하세요</p>
          <button
            onClick={() => handleWorkTypeSelect('fixed')}
            style={styles.typeBtn}
          >
            <span style={styles.typeBtnEmoji}>📅</span>
            <div>
              <p style={styles.typeBtnTitle}>고정 근무</p>
              <p style={styles.typeBtnSub}>매일 같은 시간에 출퇴근해요</p>
            </div>
          </button>
          <button
            onClick={() => handleWorkTypeSelect('flexible')}
            style={styles.typeBtn}
          >
            <span style={styles.typeBtnEmoji}>🕐</span>
            <div>
              <p style={styles.typeBtnTitle}>유연 근무</p>
              <p style={styles.typeBtnSub}>매일 출퇴근 시간이 달라요</p>
            </div>
          </button>
        </div>
      )}

      {/* ── Step 3: 시간 설정 ── */}
      {step === 3 && (
        <div style={styles.stepBox}>
          <p style={styles.stepTitle}>근무 시간을 알려주세요</p>
          <p style={styles.stepHint}>
            {workType === 'fixed'
              ? '매일 이 시간으로 적용돼요'
              : '기본값이에요. 매일 바꿀 수 있어요'}
          </p>

          <div style={styles.timeRow}>
            <span style={styles.timeLabel}>출근</span>
            <TimeSelect value={startH} onChange={setStartH} options={HOURS} />
            <span style={styles.timeSep}>:</span>
            <TimeSelect value={startM} onChange={setStartM} options={MINUTES} />
          </div>
          <div style={styles.timeRow}>
            <span style={styles.timeLabel}>퇴근</span>
            <TimeSelect value={endH} onChange={setEndH} options={HOURS} />
            <span style={styles.timeSep}>:</span>
            <TimeSelect value={endM} onChange={setEndM} options={MINUTES} />
          </div>

          <button onClick={handleFinish} style={{ ...styles.primaryBtn, marginTop: '16px' }}>
            시작하기 🌿
          </button>
        </div>
      )}
    </div>
  )
}

function TimeSelect({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={styles.select}
    >
      {options.map(o => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
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
    justifyContent: 'center',
    gap: '10px',
    padding: '32px 24px',
  },
  appTitle: {
    fontSize: '26px',
    fontWeight: 'bold',
    color: '#2d5a1b',
    margin: 0,
  },
  appSub: {
    fontSize: '13px',
    color: '#3a7a28',
    margin: 0,
  },
  stepRow: {
    display: 'flex',
    gap: '8px',
    marginTop: '8px',
  },
  stepDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    transition: 'background 0.3s',
  },
  stepBox: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    marginTop: '8px',
  },
  stepTitle: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#2d5a1b',
    margin: 0,
  },
  stepHint: {
    fontSize: '12px',
    color: '#3a7a28',
    margin: '-6px 0 0',
  },
  input: {
    width: '200px',
    padding: '10px 16px',
    fontSize: '15px',
    border: '2px solid #4A9E5A',
    borderRadius: '20px',
    outline: 'none',
    textAlign: 'center',
    background: 'rgba(255,255,255,0.9)',
    color: '#2d5a1b',
    transition: 'border-color 0.3s',
  },
  primaryBtn: {
    padding: '12px 32px',
    background: '#4A9E5A',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  typeBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '14px 16px',
    background: 'rgba(255,255,255,0.85)',
    border: '2px solid #4A9E5A',
    borderRadius: '14px',
    cursor: 'pointer',
    textAlign: 'left',
  },
  typeBtnEmoji: {
    fontSize: '28px',
    flexShrink: 0,
  },
  typeBtnTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#2d5a1b',
    margin: '0 0 2px',
  },
  typeBtnSub: {
    fontSize: '12px',
    color: '#3a7a28',
    margin: 0,
  },
  timeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
  },
  timeLabel: {
    fontSize: '13px',
    color: '#2d5a1b',
    fontWeight: 'bold',
    width: '30px',
    flexShrink: 0,
  },
  timeSep: {
    fontSize: '18px',
    color: '#2d5a1b',
    fontWeight: 'bold',
  },
  select: {
    flex: 1,
    padding: '8px',
    border: '2px solid #4A9E5A',
    borderRadius: '10px',
    fontSize: '16px',
    textAlign: 'center',
    background: 'rgba(255,255,255,0.9)',
    color: '#2d5a1b',
    outline: 'none',
  },
}
