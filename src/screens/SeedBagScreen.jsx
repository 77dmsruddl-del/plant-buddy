import React from 'react'
import { getSeeds } from '../utils/storage.js'
import { PLANTS } from '../data/plants.js'

const TYPE_EMOJI = { '꽃': '🌸', '나무': '🌳', '과일': '🍓', '다육': '🌵' }

export default function SeedsScreen({ goTo, goBack }) {
  const seeds = getSeeds()
  const totalSeeds = Object.values(seeds).reduce((a, b) => a + b, 0)

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
          씨앗 봉투
        </p>
        <span style={{ fontSize: '12px', color: '#3a7a28', marginLeft: 'auto' }}>
          총 {totalSeeds}개
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px 16px' }}>
        {totalSeeds === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: '12px',
            opacity: 0.6
          }}>
            <span style={{ fontSize: '48px' }}>🌰</span>
            <p style={{ fontSize: '14px', color: '#2d5a1b', textAlign: 'center', margin: 0 }}>
              아직 씨앗이 없어요.<br />식물을 끝까지 키우면 씨앗을 받아요!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* 안내 */}
            <div style={{
              background: 'rgba(255,255,255,0.7)',
              borderRadius: '12px',
              padding: '10px 14px',
              fontSize: '12px',
              color: '#3a7a28',
              lineHeight: 1.6
            }}>
              🌿 씨앗을 모으면 새로운 자생지가 열려요.<br />
              다 키운 식물이 하루 이틀 후 씨앗을 남겨줘요.
            </div>

            {/* 씨앗 목록 */}
            {Object.entries(seeds).map(([plantId, count]) => {
              const plant = PLANTS.find(p => p.id === plantId)
              if (!plant) return null
              return (
                <div key={plantId} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  background: 'rgba(255,255,255,0.9)',
                  borderRadius: '12px',
                }}>
                  <span style={{ fontSize: '32px' }}>
                    {TYPE_EMOJI[plant.type] || '🌱'}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#2d5a1b', margin: '0 0 2px' }}>
                      {plant.name}
                    </p>
                    <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>
                      {plant.scientificName}
                    </p>
                  </div>
                  <div style={{
                    background: 'rgba(255,184,48,0.15)',
                    borderRadius: '99px',
                    padding: '4px 14px',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    color: '#B8860B'
                  }}>
                    🌰 {count}개
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