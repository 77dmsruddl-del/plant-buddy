import React from 'react'
import { PLANTS } from '../data/plants.js'

export default function ResultScreen({ goTo, data }) {
    const { plant, plantName, love, stage, totalActions, elapsed, fullyGrown } = data || {}

    const m = Math.floor(elapsed / 60)
    const s = elapsed % 60
    const timeStr = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0')

    const stageName = plant?.stages?.[stage] || '씨앗'

    const getEnding = () => {
        if (fullyGrown) return { emoji: '🎉', msg: '완전히 다 자랐어요! 오늘 정말 잘 돌봐줬어요.' }
        if (stage >= 4) return { emoji: '🌸', msg: '꽃봉오리까지 자랐네요. 내일도 와줄 거죠?' }
        if (stage >= 3) return { emoji: '🌿', msg: '줄기까지 자랐어요. 조금 더 관심을 줬으면 좋았을 텐데.' }
        if (stage >= 2) return { emoji: '🌱', msg: '새싹이 됐어요. 오늘은 바빴나요? 괜찮아요.' }
        return { emoji: '🌰', msg: '씨앗인 채로 하루가 끝났어요. 내일은 더 놀아줄 수 있을까요?' }
    }

    const ending = getEnding()

    return (
        <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(180deg, #87CEEB 60%, #90C97A 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px 24px',
            gap: '16px'
        }}>
            <div style={{ fontSize: '56px' }}>{ending.emoji}</div>

            <p style={{
                fontSize: '20px', fontWeight: 'bold',
                color: '#2d5a1b', margin: 0
            }}>
                퇴근 시간이에요!
            </p>

            <p style={{
                fontSize: '14px', color: '#3a7a28',
                textAlign: 'center', lineHeight: 1.6, margin: 0
            }}>
                {ending.msg}
            </p>

            {/* 결과 카드 */}
            <div style={{
                width: '100%',
                background: 'rgba(255,255,255,0.88)',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}>
                <Row label="식물" value={`${plantName} (${plant?.name})`} />
                <Row label="최종 단계" value={stageName} />
                <Row label="관심도" value={`${Math.round(love)}%`} />
                <Row label="총 행동 횟수" value={`${totalActions}회`} />
                <Row label="근무 시간" value={timeStr} />
                {fullyGrown && (
                    <div style={{
                        background: 'rgba(74,158,90,0.15)',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        fontSize: '13px',
                        color: '#2d5a1b',
                        textAlign: 'center'
                    }}>
                        🌿 도감에 등록됐어요!
                    </div>
                )}
            </div>

            <button
                onClick={() => goTo('home')}
                style={{
                    padding: '12px 36px',
                    background: '#4A9E5A',
                    color: 'white',
                    border: 'none',
                    borderRadius: '20px',
                    fontSize: '15px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginTop: '8px'
                }}
            >
                🌱 내일도 심기
            </button>
        </div>
    )
}

function Row({ label, value }) {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '13px',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            paddingBottom: '8px'
        }}>
            <span style={{ color: '#888' }}>{label}</span>
            <span style={{ color: '#2d5a1b', fontWeight: 'bold' }}>{value}</span>
        </div>
    )
}