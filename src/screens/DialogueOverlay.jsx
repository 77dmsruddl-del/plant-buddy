import React, { useState } from 'react'

export default function DialogueOverlay({ scenario, plantName, onClose }) {
  const [step, setStep] = useState('question')
  const [selectedReply, setSelectedReply] = useState('')

  const handleChoice = (choice) => {
    setSelectedReply(choice.reply)
    setStep('reply')
  }

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'rgba(0,0,0,0.4)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      zIndex: 100,
      padding: '16px'
    }}>
      {/* 대화 박스 */}
      <div style={{
        background: 'rgba(255,255,255,0.97)',
        borderRadius: '20px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        {/* 식물 이름 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '20px' }}>🌱</span>
          <span style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#2d5a1b'
          }}>
            {plantName}
          </span>
        </div>

        {/* 식물 대사 */}
        <div style={{
          background: 'rgba(74,158,90,0.08)',
          borderRadius: '12px',
          padding: '12px 16px',
          fontSize: '14px',
          color: '#2d5a1b',
          lineHeight: 1.7
        }}>
          {step === 'question' ? scenario.plant : selectedReply}
        </div>

        {/* 선택지 or 닫기 */}
        {step === 'question' ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {scenario.choices.map((choice, i) => (
              <button
                key={i}
                onClick={() => handleChoice(choice)}
                style={{
                  padding: '10px 16px',
                  background: 'white',
                  border: '1.5px solid #4A9E5A',
                  borderRadius: '12px',
                  fontSize: '13px',
                  color: '#2d5a1b',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s'
                }}
              >
                {choice.text}
              </button>
            ))}
          </div>
        ) : (
          <button
            onClick={onClose}
            style={{
              padding: '10px',
              background: '#4A9E5A',
              border: 'none',
              borderRadius: '12px',
              fontSize: '13px',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            고마워 🌿
          </button>
        )}
      </div>
    </div>
  )
}