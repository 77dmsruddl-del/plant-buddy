import React, { useState } from 'react'
import IntroScreen from './screens/IntroScreen.jsx'
import HomeScreen from './screens/HomeScreen.jsx'
import SeedScreen from './screens/SeedScreen.jsx'
import GameScreen from './screens/GameScreen.jsx'
import ResultScreen from './screens/ResultScreen.jsx'
import DexScreen from './screens/DexScreen.jsx'
import GardenScreen from './screens/GardenScreen.jsx'
import SeedsScreen from './screens/SeedBagScreen.jsx'
import { clearAll } from './utils/storage.js'

export default function App() {
  const [screen, setScreen] = useState('intro')
  const [prevScreen, setPrevScreen] = useState('home')
  const [gameData, setGameData] = useState(null)

  const goTo = (screenName, data = null) => {
    setPrevScreen(screen)
    if (data) setGameData(data)
    setScreen(screenName)
  }

  const goBack = () => {
    setScreen(prevScreen)
  }

  const handleReset = () => {
    clearAll()
    setGameData(null)
    setScreen('intro')
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#1a2e1a'
    }}>
      <div style={{
        width: '360px',
        height: '640px',
        background: '#87CEEB',
        borderRadius: '16px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {screen === 'intro' && <IntroScreen goTo={goTo} />}
        {screen === 'home' && <HomeScreen goTo={goTo} />}
        {screen === 'seed' && <SeedScreen goTo={goTo} />}
        {screen === 'game' && <GameScreen goTo={goTo} data={gameData} />}
        {screen === 'result' && <ResultScreen goTo={goTo} data={gameData} />}
        {screen === 'dex' && <DexScreen goTo={goTo} goBack={goBack} />}
        {screen === 'garden' && <GardenScreen goTo={goTo} goBack={goBack} />}
        {screen === 'seeds' && <SeedsScreen goTo={goTo} goBack={goBack} />}
      </div>

      {/* ── 개발용 버튼 패널 ── */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        alignItems: 'flex-end',
      }}>
        {/* 결과 화면 바로보기 (verdict별) */}
        {['complete', 'good', 'partial', 'fail'].map(verdict => (
          <button
            key={verdict}
            onClick={() => {
              setGameData({
                plantId: 'sunflower',
                plantName: '테스트꽃',
                finalLove: { complete: 150, good: 120, partial: 80, fail: 20 }[verdict],
                actionCounts: { water: 3, sun: 5, pet: 2, talk: 3 },
                verdict,
              })
              setScreen('result')
            }}
            style={{
              padding: '5px 12px',
              background: {
                complete: 'rgba(74,158,90,0.85)',
                good:     'rgba(74,144,217,0.85)',
                partial:  'rgba(255,184,48,0.85)',
                fail:     'rgba(255,107,107,0.85)',
              }[verdict],
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              fontSize: '11px',
              cursor: 'pointer',
            }}
          >
            결과: {verdict}
          </button>
        ))}

        {/* 리셋 */}
        <button
          onClick={handleReset}
          style={{
            padding: '8px 16px',
            background: 'rgba(255,100,100,0.8)',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            fontSize: '12px',
            cursor: 'pointer',
            marginTop: '4px',
          }}
        >
          🔄 리셋 (개발용)
        </button>
      </div>
    </div>
  )
}