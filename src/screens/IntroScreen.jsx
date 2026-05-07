import React, { useState } from 'react'
import { getPlayer, savePlayer } from '../utils/storage.js'

export default function IntroScreen({ goTo }) {
  const [name, setName] = useState('')
  const [error, setError] = useState(false)

  // 이미 이름 있으면 바로 씨앗 화면으로
  const player = getPlayer()

  React.useEffect(() => {
    if (player) {
      goTo('home')
    }
  }, [])

  if (player) return null
  const handleStart = () => {
    if (!name.trim()) {
      setError(true)
      setTimeout(() => setError(false), 800)
      return
    }
    savePlayer(name.trim())
    goTo('home')
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(180deg, #87CEEB 60%, #90C97A 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      padding: '40px'
    }}>
      <div style={{ fontSize: '64px' }}>🌱</div>

      <p style={{
        fontSize: '26px',
        fontWeight: 'bold',
        color: '#2d5a1b',
        margin: 0
      }}>Plant Buddy</p>

      <p style={{
        fontSize: '14px',
        color: '#3a7a28',
        margin: 0
      }}>매일 하나의 씨앗을 키워요</p>

      <div style={{ marginTop: '24px', width: '100%', textAlign: 'center' }}>
        <p style={{
          fontSize: '14px',
          color: '#2d5a1b',
          fontWeight: 'bold',
          marginBottom: '12px'
        }}>탐험가 이름을 알려주세요</p>

        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleStart()}
          placeholder="이름 입력..."
          maxLength={10}
          style={{
            width: '200px',
            padding: '10px 16px',
            fontSize: '15px',
            border: `2px solid ${error ? '#ff4444' : '#4A9E5A'}`,
            borderRadius: '20px',
            outline: 'none',
            textAlign: 'center',
            background: 'rgba(255,255,255,0.9)',
            color: '#2d5a1b',
            transition: 'border-color 0.3s'
          }}
        />
      </div>

      <button
        onClick={handleStart}
        style={{
          marginTop: '8px',
          padding: '12px 32px',
          background: '#4A9E5A',
          color: 'white',
          border: 'none',
          borderRadius: '20px',
          fontSize: '15px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        탐험 시작하기 🌿
      </button>
    </div>
  )
}