import React, { useState } from 'react'
import IntroScreen from './screens/IntroScreen.jsx'
import HomeScreen from './screens/HomeScreen.jsx'
import SeedScreen from './screens/SeedScreen.jsx'
import GameScreen from './screens/GameScreen.jsx'
import ResultScreen from './screens/ResultScreen.jsx'
import DexScreen from './screens/DexScreen.jsx'
import GardenScreen from './screens/GardenScreen.jsx'
import SeedsScreen from './screens/SeedsScreen.jsx'
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

      <button
        onClick={handleReset}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '8px 16px',
          background: 'rgba(255,100,100,0.8)',
          color: 'white',
          border: 'none',
          borderRadius: '20px',
          fontSize: '12px',
          cursor: 'pointer'
        }}
      >
        🔄 리셋 (개발용)
      </button>
    </div>
  )
}