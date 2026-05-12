import React from 'react'
import { getGarden } from '../utils/storage.js'
import { PLANTS } from '../data/plants.js'

const TYPE_EMOJI = { '꽃': '🌸', '나무': '🌳', '과일': '🍓', '다육': '🌵' }

function formatDate(ts) {
  const d = new Date(ts)
  return `${d.getMonth() + 1}월 ${d.getDate()}일`
}

export default function GardenScreen({ goTo, goBack }) {
  const garden = getGarden()

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(180deg, #87CEEB 60%, #90C97A 100%)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* 상단 바 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px 16px 8px',
        gap: '10px'
      }}>
        <button
          onClick={() => goBack()}
          style={{
            background: 'rgba(255,255,255,0.7)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          ←
        </button>
        <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#2d5a1b', margin: 0 }}>
          나의 정원
        </p>
        <span style={{ fontSize: '12px', color: '#3a7a28', marginLeft: 'auto' }}>
          {garden.length}개
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px 16px' }}>
        {garden.length === 0 ? (
          // 비어있을 때
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: '12px',
            opacity: 0.6
          }}>
            <span style={{ fontSize: '48px' }}>🌱</span>
            <p style={{ fontSize: '14px', color: '#2d5a1b', textAlign: 'center', margin: 0 }}>
              아직 다 자란 식물이 없어요.<br />식물을 끝까지 키워보세요!
            </p>
          </div>
        ) : (
          // 정원 그리드
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px'
          }}>
            {garden.map((g, i) => {
              const plant = PLANTS.find(p => p.id === g.plantId)
              return (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.9)',
                  borderRadius: '14px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '36px' }}>
                    {TYPE_EMOJI[plant?.type] || '🌱'}
                  </span>
                  <p style={{
                    fontSize: '13px',
                    fontWeight: 'bold',
                    color: '#2d5a1b',
                    margin: 0
                  }}>
                    {g.plantName}
                  </p>
                  <p style={{
                    fontSize: '11px',
                    color: '#888',
                    margin: 0
                  }}>
                    {plant?.name}
                  </p>
                  <div style={{
                    background: 'rgba(74,158,90,0.12)',
                    borderRadius: '99px',
                    padding: '3px 10px',
                    fontSize: '10px',
                    color: '#3a7a28'
                  }}>
                    {formatDate(g.grownAt)}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}