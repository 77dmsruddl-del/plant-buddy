import React from 'react'
import { getPlayer, getDex, getSeeds, getGarden } from '../utils/storage.js'
import { PLANTS } from '../data/plants.js'

export default function HomeScreen({ goTo }) {
  const player = getPlayer()
  const dex = getDex()
  const seeds = getSeeds()
  const garden = getGarden()

  const dexCount = Object.keys(dex).length
  const seedCount = Object.values(seeds).reduce((a, b) => a + b, 0)
  const gardenCount = garden.length

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(180deg, #87CEEB 60%, #90C97A 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '28px 20px',
      gap: '14px'
    }}>
      {/* 인사 */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: '#2d5a1b', margin: '0 0 4px' }}>
          안녕하세요, <strong>{player?.name}</strong>님 🌿
        </p>
        <p style={{ fontSize: '11px', color: '#3a7a28', margin: 0 }}>
          오늘도 식물을 돌봐줄 시간이에요
        </p>
      </div>

      {/* 통계 카드 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '8px',
        width: '100%'
      }}>
        <StatCard emoji="📖" label="도감" value={`${dexCount}종`} />
        <StatCard emoji="🌿" label="정원" value={`${gardenCount}개`} />
        <StatCard emoji="🌰" label="씨앗" value={`${seedCount}개`} />
      </div>

      {/* 메인 버튼 — 오늘의 씨앗 */}
      <button
        onClick={() => goTo('seed')}
        style={{
          width: '100%',
          padding: '20px',
          background: '#4A9E5A',
          color: 'white',
          border: 'none',
          borderRadius: '16px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <span style={{ fontSize: '36px' }}>🌱</span>
        오늘의 씨앗 심기
        <span style={{ fontSize: '12px', opacity: 0.85, fontWeight: 'normal' }}>
          매일 새로운 씨앗이 기다려요
        </span>
      </button>

      {/* 메뉴 버튼들 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        width: '100%'
      }}>
        <MenuBtn emoji="📖" label="도감" sub={`${dexCount}/${PLANTS.length}종 발견`} color="#4A90D9" onClick={() => goTo('dex')} />
        <MenuBtn emoji="🌳" label="정원" sub={`다 큰 식물 ${gardenCount}개`} color="#90C97A" onClick={() => goTo('garden')} />
        <MenuBtn emoji="🌰" label="씨앗 봉투" sub={`${seedCount}개 보유`} color="#FFB830" onClick={() => goTo('seeds')} />
        <MenuBtn emoji="⚙️" label="설정" sub="이름 변경 등" color="#888" onClick={() => goTo('settings')} />
      </div>

      {/* 오늘 날짜 */}
      <p style={{ fontSize: '11px', color: '#3a7a28', margin: 0 }}>
        {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
      </p>
    </div>
  )
}

function StatCard({ emoji, label, value }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.8)',
      borderRadius: '12px',
      padding: '10px 6px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '20px' }}>{emoji}</div>
      <div style={{ fontSize: '11px', color: '#888', margin: '2px 0' }}>{label}</div>
      <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#2d5a1b' }}>{value}</div>
    </div>
  )
}

function MenuBtn({ emoji, label, sub, color, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '14px 10px',
        background: 'rgba(255,255,255,0.85)',
        border: `2px solid ${color}`,
        borderRadius: '14px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px'
      }}
    >
      <span style={{ fontSize: '26px' }}>{emoji}</span>
      <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#2d5a1b' }}>{label}</span>
      <span style={{ fontSize: '10px', color: '#888' }}>{sub}</span>
    </button>
  )
}