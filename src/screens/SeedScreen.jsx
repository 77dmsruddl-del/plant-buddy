import React, { useState, useEffect } from 'react'
import { getPlayer, getTodaySeed, saveTodaySeed, getToday, savePersonality } from '../utils/storage.js'
import { PLANTS } from '../data/plants.js'
import { DIALOGUES } from '../data/dialogues.js'

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
  const player = getPlayer()
  const todaySeed = getTodaySeed()
  const plant = pickTodayPlant()

  useEffect(() => {
    if (todaySeed && todaySeed.date === getToday()) {
      goTo('game', { plantId: todaySeed.plantId, plantName: todaySeed.plantName })
    }
  }, [])

  if (todaySeed && todaySeed.date === getToday()) return null

  const typeEmoji = { '꽃': '🌸', '나무': '🌳', '과일': '🍓', '다육': '🌵' }

const handlePlant = () => {
  const name = plantName.trim() || plant.name

  // 성격 랜덤 뽑기
  const personalities = DIALOGUES[plant.id]?.personalities || []
  const randomPersonality = personalities.length
    ? personalities[Math.floor(Math.random() * personalities.length)]
    : { id: 'default' }

  savePersonality(randomPersonality.id)
  saveTodaySeed(plant.id, name)
  goTo('game', { plantId: plant.id, plantName: name, personalityId: randomPersonality.id })
}

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(180deg, #87CEEB 60%, #90C97A 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '28px 24px',
      gap: '12px',
      overflowY: 'auto'
    }}>
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
        border: '2px solid #4A9E5A'
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
          color: '#2d5a1b'
        }}>
          💡 {plant.tip}
        </div>

        {/* 발견 난이도 */}
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
        onKeyDown={e => e.key === 'Enter' && handlePlant()}
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
          color: '#2d5a1b'
        }}
      />

      <button
        onClick={handlePlant}
        style={{
          padding: '12px 36px',
          background: '#4A9E5A',
          color: 'white',
          border: 'none',
          borderRadius: '20px',
          fontSize: '15px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        씨앗 심기 🌱
      </button>
    </div>
  )
}