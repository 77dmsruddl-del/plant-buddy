import React, { useState, useEffect } from 'react'
import { getPlayer, getTodaySeed, saveTodaySeed, saveTodaySchedule, getTodaySchedule, getToday, savePersonality, addTodoItem } from '../utils/storage.js'
import { PLANTS } from '../data/plants.js'
import { DIALOGUES } from '../data/dialogues.js'

const HOURS   = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTES = ['00', '15', '30', '45']

function pickTodayPlant() {
  const today = getToday()
  const saved = getTodaySeed()
  
  // 오늘 이미 뽑은 게 있으면 그거 사용
  if (saved && saved.date === today && saved.plantId) {
    return PLANTS.find(p => p.id === saved.plantId) || PLANTS[0]
  }
  
  // 없으면 랜덤으로 뽑기
  return PLANTS[Math.floor(Math.random() * PLANTS.length)]
}

export default function SeedScreen({ goTo }) {
  const [plantName, setPlantName] = useState('')
  // 유연근무자는 오늘 시간 입력이 먼저 필요
  const player   = getPlayer()
  const schedule = getTodaySchedule()
  const needTimeInput = player?.workType === 'flexible' && !getTodaySeed()?.todayStart

  // 'time': 유연근무 시간입력(최초), 'seed': 씨앗카드+이름, 'todo': 할일입력
  const [step, setStep] = useState(needTimeInput ? 'time' : 'seed')
  const [schedStartH, setSchedStartH] = useState(schedule.todayStart?.split(':')[0] || '09')
  const [schedStartM, setSchedStartM] = useState(schedule.todayStart?.split(':')[1] || '00')
  const [schedEndH,   setSchedEndH]   = useState(schedule.todayEnd?.split(':')[0]   || '18')
  const [schedEndM,   setSchedEndM]   = useState(schedule.todayEnd?.split(':')[1]   || '00')
  const [todoInput, setTodoInput] = useState('')
  const [todayTodos, setTodayTodos] = useState([]) // 이 화면에서 추가한 항목들

  const todaySeed = getTodaySeed()
  const plant = pickTodayPlant()

  // 오늘 이미 씨앗을 심었으면 바로 게임으로
  useEffect(() => {
    if (todaySeed && todaySeed.date === getToday()) {
      goTo('game', { plantId: todaySeed.plantId, plantName: todaySeed.plantName })
    }
  }, [])

  if (todaySeed && todaySeed.date === getToday()) return null

  const typeEmoji = { '꽃': '🌸', '나무': '🌳', '과일': '🍓', '다육': '🌵' }

  // [유연근무] 시간 확정 → saveTodaySchedule → 씨앗 단계로
  function handleTimeDone() {
    saveTodaySchedule({
      todayStart: `${schedStartH}:${schedStartM}`,
      todayEnd:   `${schedEndH}:${schedEndM}`,
    })
    setStep('seed')
  }

  // step 1 완료: 이름 확정 후 할일 입력 단계로 이동
  function handleNameDone() {
    const personalities = DIALOGUES[plant.id]?.personalities || []
    const randomPersonality = personalities.length
      ? personalities[Math.floor(Math.random() * personalities.length)]
      : { id: 'default' }
    savePersonality(randomPersonality.id)
    setStep('todo')
  }

  // step 2: 할일 항목 추가 (localStorage에 바로 저장)
  function handleAddTodo() {
    const text = todoInput.trim()
    if (!text) return
    const newTodo = addTodoItem(text)
    setTodayTodos(prev => [...prev, newTodo])
    setTodoInput('')
  }

  function handleTodoKeyDown(e) {
    if (e.key === 'Enter') handleAddTodo()
  }

  // step 2 완료: 오늘 씨앗 확정 후 게임으로
  function handleStart() {
    const name = plantName.trim() || plant.name
    // 고정근무자는 씨앗 심을 때 오늘 스케줄 복사 저장
    if (player?.workType === 'fixed' || !player?.workType) {
      saveTodaySchedule({
        todayStart: player?.commuteStart || '09:00',
        todayEnd:   player?.commuteEnd   || '18:00',
      })
    }
    saveTodaySeed(plant.id, name)
    goTo('game', { plantId: plant.id, plantName: name })
  }

  const screenStyle = {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(180deg, #87CEEB 60%, #90C97A 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '28px 24px',
    gap: '12px',
    overflowY: 'auto',
  }

  // ── Step 0: 유연근무 오늘 시간 입력 ─────────────────────────────
  if (step === 'time') {
    return (
      <div style={screenStyle}>
        <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#2d5a1b', margin: 0 }}>
          오늘 근무 시간은?
        </p>
        <p style={{ fontSize: '12px', color: '#3a7a28', margin: 0 }}>
          유연근무 — 오늘의 출퇴근 시간을 알려주세요
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
          <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#2d5a1b', width: '30px' }}>출근</span>
          <TimeSelect value={schedStartH} onChange={setSchedStartH} options={HOURS} />
          <span style={{ fontSize: '18px', color: '#2d5a1b', fontWeight: 'bold' }}>:</span>
          <TimeSelect value={schedStartM} onChange={setSchedStartM} options={MINUTES} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
          <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#2d5a1b', width: '30px' }}>퇴근</span>
          <TimeSelect value={schedEndH} onChange={setSchedEndH} options={HOURS} />
          <span style={{ fontSize: '18px', color: '#2d5a1b', fontWeight: 'bold' }}>:</span>
          <TimeSelect value={schedEndM} onChange={setSchedEndM} options={MINUTES} />
        </div>
        <button
          onClick={handleTimeDone}
          style={{
            width: '100%', padding: '13px', background: '#4A9E5A',
            color: 'white', border: 'none', borderRadius: '20px',
            fontSize: '15px', fontWeight: 'bold', cursor: 'pointer',
          }}
        >
          확인 →
        </button>
      </div>
    )
  }

  // ── Step 1: 씨앗 카드 + 이름 짓기 ─────────────────────────────
  if (step === 'seed') {
    return (
      <div style={screenStyle}>
        <p style={{ fontSize: '13px', color: '#2d5a1b', margin: 0 }}>
          안녕하세요, <strong>{player?.name}</strong>님! 🌿
        </p>
        <p style={{ fontSize: '13px', color: '#3a7a28', margin: 0 }}>
          오늘의 씨앗이 도착했어요
        </p>

        {/* 씨앗 카드 */}
        <div style={{
          width: '100%',
          background: 'rgba(255,255,255,0.9)',
          borderRadius: '16px',
          padding: '20px',
          textAlign: 'center',
          border: '2px solid #4A9E5A',
        }}>
          <div style={{ fontSize: '52px' }}>{typeEmoji[plant.type] || '🌱'}</div>
          <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#2d5a1b', margin: '8px 0 4px' }}>
            {plant.name}
          </p>
          <p style={{ fontSize: '12px', color: '#888', fontStyle: 'italic', margin: '0 0 12px' }}>
            {plant.scientificName}
          </p>
          <p style={{ fontSize: '13px', color: '#3a7a28', margin: '0 0 8px', lineHeight: 1.6 }}>
            {plant.description}
          </p>
          <div style={{
            background: 'rgba(74,158,90,0.1)',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '12px',
            color: '#2d5a1b',
          }}>
            💡 {plant.tip}
          </div>
          <p style={{ fontSize: '11px', color: '#888', margin: '10px 0 0' }}>
            발견 난이도: {'⭐'.repeat(plant.difficulty || 1)}
          </p>
        </div>

        {/* 이름 짓기 */}
        <p style={{ fontSize: '13px', color: '#2d5a1b', fontWeight: 'bold', margin: '4px 0 0' }}>
          이 식물에게 이름을 지어주세요
        </p>
        <input
          type="text"
          value={plantName}
          onChange={e => setPlantName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleNameDone()}
          placeholder={plant.name + '...'}
          maxLength={10}
          style={{
            width: '200px',
            padding: '10px 16px',
            fontSize: '14px',
            border: '2px solid #4A9E5A',
            borderRadius: '20px',
            outline: 'none',
            textAlign: 'center',
            background: 'rgba(255,255,255,0.9)',
            color: '#2d5a1b',
          }}
        />
        <button
          onClick={handleNameDone}
          style={{
            padding: '12px 36px',
            background: '#4A9E5A',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            fontSize: '15px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          씨앗 심기 🌱
        </button>
      </div>
    )
  }

  // ── Step 2: 오늘 할일 입력 ────────────────────────────────────
  return (
    <div style={screenStyle}>
      <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#2d5a1b', margin: 0 }}>
        오늘 할 일을 세워볼까요?
      </p>
      <p style={{ fontSize: '12px', color: '#3a7a28', margin: 0, textAlign: 'center' }}>
        완료하면 비료를 얻어요! (최대 3개)<br/>
        나중에 게임 중에도 추가할 수 있어요
      </p>

      {/* 입력 */}
      <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
        <input
          type="text"
          value={todoInput}
          onChange={e => setTodoInput(e.target.value)}
          onKeyDown={handleTodoKeyDown}
          placeholder="예: 물 2L 마시기"
          maxLength={40}
          style={{
            flex: 1,
            padding: '10px 14px',
            fontSize: '13px',
            border: '2px solid #4A9E5A',
            borderRadius: '12px',
            outline: 'none',
            background: 'rgba(255,255,255,0.9)',
            color: '#333',
          }}
        />
        <button
          onClick={handleAddTodo}
          style={{
            padding: '10px 16px',
            background: '#4A90D9',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: 'bold',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          추가
        </button>
      </div>

      {/* 추가된 할일 목록 */}
      <div style={{
        width: '100%',
        background: 'rgba(255,255,255,0.7)',
        borderRadius: '12px',
        padding: '8px',
        minHeight: '80px',
        flex: 1,
      }}>
        {todayTodos.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#aaa', fontSize: '13px', marginTop: '20px' }}>
            아직 없어요. 바로 시작해도 돼요!
          </p>
        ) : (
          todayTodos.map(todo => (
            <div key={todo.id} style={{
              padding: '8px 12px',
              fontSize: '13px',
              color: '#333',
              borderBottom: '1px solid rgba(0,0,0,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{ color: '#4A9E5A' }}>🌿</span>
              {todo.text}
            </div>
          ))
        )}
      </div>

      {/* 시작 버튼 */}
      <button
        onClick={handleStart}
        style={{
          width: '100%',
          padding: '13px',
          background: '#4A9E5A',
          color: 'white',
          border: 'none',
          borderRadius: '20px',
          fontSize: '15px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        {todayTodos.length > 0 ? `${todayTodos.length}개 세우고 시작하기 🌱` : '바로 시작하기 🌱'}
      </button>
    </div>
  )
}

function TimeSelect({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        flex: 1,
        padding: '8px',
        border: '2px solid #4A9E5A',
        borderRadius: '10px',
        fontSize: '16px',
        textAlign: 'center',
        background: 'rgba(255,255,255,0.9)',
        color: '#2d5a1b',
        outline: 'none',
      }}
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}