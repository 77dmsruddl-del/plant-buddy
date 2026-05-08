import React, { useState, useEffect, useRef } from 'react'
import { getPlayer, addToDex, addToGarden, addSeed, getPersonalityId, saveGameState, getGameState, clearGameState } from '../utils/storage.js'
import { PLANTS } from '../data/plants.js'
import { getScenario, getMonologue } from '../data/dialogues.js'
import DialogueOverlay from './DialogueOverlay.jsx'

const MESSAGES = {
    water: ['시원해요! 💧', '물이 딱 좋아요!', '촉촉해요 🌿'],
    pet: ['기분 좋아요~ 🤲', '따뜻해요!', '행복해요 💚'],
    sun: ['햇빛 최고! ☀️', '광합성 중이에요!', '에너지 충전!'],
    talk: ['말 걸어줘서 기뻐요!', '혼자가 아니에요 💬', '오늘도 잘 부탁해요!'],
}

const COOLDOWNS = { water: 30, pet: 20, talk: 15, sun: 25 }
const LOVE_GAIN = { water: 8, pet: 5, talk: 4, sun: 6 }

function PlantCanvas({ stage, color }) {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, 200, 260)

        const cx = 100
        const base = 220

        const c = '#' + color.toString(16).padStart(6, '0')

        if (stage === 0) {
            ctx.fillStyle = '#4A3700'
            ctx.beginPath()
            ctx.ellipse(cx, base - 10, 10, 7, 0, 0, Math.PI * 2)
            ctx.fill()

        } else if (stage === 1) {
            ctx.fillStyle = '#3A6B44'
            ctx.fillRect(cx - 3, base - 50, 6, 40)
            ctx.fillStyle = '#5CAD6B'
            ctx.save(); ctx.translate(cx - 14, base - 38); ctx.rotate(-0.35)
            ctx.beginPath(); ctx.ellipse(0, 0, 16, 9, 0, 0, Math.PI * 2); ctx.fill()
            ctx.restore()
            ctx.fillStyle = '#4A9E5A'
            ctx.save(); ctx.translate(cx + 14, base - 42); ctx.rotate(0.35)
            ctx.beginPath(); ctx.ellipse(0, 0, 16, 9, 0, 0, Math.PI * 2); ctx.fill()
            ctx.restore()

        } else if (stage === 2) {
            ctx.fillStyle = '#3A6B44'
            ctx.fillRect(cx - 4, base - 80, 8, 70)
            ctx.fillStyle = '#5CAD6B'
            ctx.save(); ctx.translate(cx - 22, base - 55); ctx.rotate(-0.44)
            ctx.beginPath(); ctx.ellipse(0, 0, 20, 10, 0, 0, Math.PI * 2); ctx.fill()
            ctx.restore()
            ctx.fillStyle = '#4A9E5A'
            ctx.save(); ctx.translate(cx + 22, base - 65); ctx.rotate(0.44)
            ctx.beginPath(); ctx.ellipse(0, 0, 20, 10, 0, 0, Math.PI * 2); ctx.fill()
            ctx.restore()
            ctx.fillStyle = '#6CBF7B'
            ctx.beginPath(); ctx.ellipse(cx, base - 88, 18, 10, 0, 0, Math.PI * 2); ctx.fill()

        } else if (stage === 3) {
            ctx.fillStyle = '#3A6B44'
            ctx.fillRect(cx - 4, base - 110, 8, 100)
            ctx.fillStyle = '#5CAD6B'
            ctx.save(); ctx.translate(cx - 25, base - 65); ctx.rotate(-0.44)
            ctx.beginPath(); ctx.ellipse(0, 0, 22, 11, 0, 0, Math.PI * 2); ctx.fill()
            ctx.restore()
            ctx.fillStyle = '#4A9E5A'
            ctx.save(); ctx.translate(cx + 25, base - 78); ctx.rotate(0.44)
            ctx.beginPath(); ctx.ellipse(0, 0, 22, 11, 0, 0, Math.PI * 2); ctx.fill()
            ctx.restore()
            ctx.fillStyle = '#6CBF7B'
            ctx.beginPath(); ctx.ellipse(cx, base - 100, 18, 10, 0, 0, Math.PI * 2); ctx.fill()
            ctx.globalAlpha = 0.7
            ctx.fillStyle = c
            ctx.beginPath(); ctx.ellipse(cx, base - 122, 10, 14, 0, 0, Math.PI * 2); ctx.fill()
            ctx.globalAlpha = 1

        } else if (stage === 4) {
            ctx.fillStyle = '#3A6B44'
            ctx.fillRect(cx - 4, base - 120, 8, 110)
            ctx.fillStyle = '#5CAD6B'
            ctx.save(); ctx.translate(cx - 28, base - 72); ctx.rotate(-0.49)
            ctx.beginPath(); ctx.ellipse(0, 0, 24, 11, 0, 0, Math.PI * 2); ctx.fill()
            ctx.restore()
            ctx.fillStyle = '#4A9E5A'
            ctx.save(); ctx.translate(cx + 28, base - 85); ctx.rotate(0.49)
            ctx.beginPath(); ctx.ellipse(0, 0, 24, 11, 0, 0, Math.PI * 2); ctx.fill()
            ctx.restore()
            ctx.fillStyle = '#6CBF7B'
            ctx.beginPath(); ctx.ellipse(cx, base - 105, 20, 11, 0, 0, Math.PI * 2); ctx.fill()
            const petalAngles = [0, -0.8, 0.8, -1.6, 1.6]
            petalAngles.forEach(angle => {
                ctx.fillStyle = c
                ctx.save(); ctx.translate(cx, base - 128); ctx.rotate(angle)
                ctx.beginPath(); ctx.ellipse(0, -14, 9, 16, 0, 0, Math.PI * 2); ctx.fill()
                ctx.restore()
            })
            ctx.fillStyle = '#FFEE55'
            ctx.beginPath(); ctx.arc(cx, base - 128, 10, 0, Math.PI * 2); ctx.fill()

        } else if (stage === 5) {
            ctx.fillStyle = '#3A6B44'
            ctx.fillRect(cx - 4, base - 120, 8, 110)
            ctx.fillStyle = '#5CAD6B'
            ctx.save(); ctx.translate(cx - 28, base - 72); ctx.rotate(-0.49)
            ctx.beginPath(); ctx.ellipse(0, 0, 24, 11, 0, 0, Math.PI * 2); ctx.fill()
            ctx.restore()
            ctx.fillStyle = '#4A9E5A'
            ctx.save(); ctx.translate(cx + 28, base - 85); ctx.rotate(0.49)
            ctx.beginPath(); ctx.ellipse(0, 0, 24, 11, 0, 0, Math.PI * 2); ctx.fill()
            ctx.restore()
            ctx.fillStyle = '#6CBF7B'
            ctx.beginPath(); ctx.ellipse(cx, base - 105, 20, 11, 0, 0, Math.PI * 2); ctx.fill()
            ctx.fillStyle = c
            ctx.beginPath(); ctx.arc(cx, base - 135, 22, 0, Math.PI * 2); ctx.fill()
            ctx.fillStyle = '#3A6B44'
            ctx.fillRect(cx - 3, base - 160, 5, 12)
            ctx.fillStyle = '#4A9E5A'
            ctx.save(); ctx.translate(cx + 6, base - 158); ctx.rotate(0.5)
            ctx.beginPath(); ctx.ellipse(0, 0, 9, 5, 0, 0, Math.PI * 2); ctx.fill()
            ctx.restore()
        }

        // 화분
        ctx.fillStyle = '#7B5A0A'
        ctx.fillRect(cx - 30, base - 5, 60, 8)
        ctx.fillStyle = '#8B6914'
        ctx.fillRect(cx - 26, base + 3, 52, 40)

    }, [stage, color])

    return (
        <canvas
            ref={canvasRef}
            width={200}
            height={260}
            style={{ display: 'block', margin: '0 auto' }}
        />
    )
}

// 모듈 레벨 — 언마운트/리마운트 사이에서도 유지됨
let _sessionStartTime = null

export default function GameScreen({ goTo, data }) {
    const player = getPlayer()
    const plant = PLANTS.find(p => p.id === data?.plantId) || PLANTS[0]
    const plantName = data?.plantName || plant.name
    const personalityId = data?.personalityId || getPersonalityId() || 'sunny'

    const saved = getGameState()

    // 최초 1회만 설정: 모듈 변수 → localStorage 저장값 → 현재 시각 순으로 폴백
    if (!_sessionStartTime) {
        _sessionStartTime = saved?.startTime || Date.now()
    }

    const [love, setLove] = useState(saved?.love ?? 0)
    const [stage, setStage] = useState(saved?.stage ?? 0)
    const [message, setMessage] = useState(`안녕! 나는 ${plantName}이에요 🌱`)
    const [totalActions, setTotalActions] = useState(saved?.totalActions ?? 0)
    const [elapsed, setElapsed] = useState(
        Math.floor((Date.now() - _sessionStartTime) / 1000)
    )
    const [fullyGrown, setFullyGrown] = useState(false)
    const [cooldowns, setCooldowns] = useState({ water: 0, pet: 0, sun: 0, talk: 0 })
    const [dialogue, setDialogue] = useState(null)
    const [talkCount, setTalkCount] = useState(0)

    const startTime = useRef(_sessionStartTime)
    const loveRef = useRef(saved?.love ?? 0)
    const stageRef = useRef(saved?.stage ?? 0)
    const totalActionsRef = useRef(saved?.totalActions ?? 0)
    const lastActionRef = useRef({ water: 0, pet: 0, sun: 0, talk: 0 })
    const msgTimer = useRef(null)
    const grownTimers = useRef([])

    // 마운트 즉시 startTime 저장 — 첫 tick 전에 이동해도 복원 가능
    useEffect(() => {
        saveGameState({
            love: loveRef.current,
            stage: stageRef.current,
            totalActions: totalActionsRef.current,
            startTime: startTime.current,
        })
    }, [])

    // 타이머
    useEffect(() => {
        const timer = setInterval(() => {
            setElapsed(Math.floor((Date.now() - startTime.current) / 1000))
            saveGameState({
                love: loveRef.current,
                stage: stageRef.current,
                totalActions: totalActionsRef.current,
                startTime: startTime.current,
            })

            const now = Date.now() / 1000
            setCooldowns(() => {
                const next = {}
                Object.keys(COOLDOWNS).forEach(t => {
                    next[t] = Math.max(0, Math.ceil(COOLDOWNS[t] - (now - (lastActionRef.current[t] || 0))))
                })
                return next
            })
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        const monologueTimer = setInterval(() => {
            const defaultMonologues = [
                '...🌱',
                '오늘도 여기 있어요',
                '햇빛이 따뜻해요...',
                '물 냄새가 좋아요 💧',
            ]
            const monologue = getMonologue(plant.id, personalityId)
                || defaultMonologues[Math.floor(Math.random() * defaultMonologues.length)]
            showMessage(monologue)
        }, 20000)
        return () => clearInterval(monologueTimer)
    }, [plant.id, personalityId])

    // 언마운트 시 타이머 정리
    useEffect(() => {
        return () => {
            if (msgTimer.current) clearTimeout(msgTimer.current)
            grownTimers.current.forEach(t => clearTimeout(t))
        }
    }, [])

    const showMessage = (text) => {
        setMessage(text)
        if (msgTimer.current) clearTimeout(msgTimer.current)
        msgTimer.current = setTimeout(() => setMessage(''), 5000)
    }

    const doAction = (type) => {
        if (fullyGrown) return
        const now = Date.now() / 1000
        const last = lastActionRef.current[type] || 0
        const onCooldown = now - last < COOLDOWNS[type]

        if (onCooldown) {
            const tooMuch = {
                water: ['물 충분해요 💧', '배불러요...', '조금 있다가요!'],
                pet: ['간지러워요 🤲', '잠깐만요~', '조금 쉬고 싶어요!'],
                sun: ['눈부셔요 ☀️', '잠깐 그늘 주세요!', '너무 뜨거워요!'],
                talk: ['잠깐 생각 중이에요 💬', '조금 있다가 얘기해요!', '말 많다고요 ㅎ'],
            }
            const list = tooMuch[type]
            showMessage(list[Math.floor(Math.random() * list.length)])
            return
        }

        const bonus = plant.favoriteAction === type ? 1.5 : 1
        const gain = LOVE_GAIN[type] * bonus
        setLove(prevLove => {
            const newLove = Math.min(100, prevLove + gain)
            loveRef.current = newLove
            checkStage(newLove)
            return newLove
        })
        setTotalActions(n => {
            totalActionsRef.current = n + 1
            return n + 1
        })
        lastActionRef.current = { ...lastActionRef.current, [type]: now }

        if (type === 'talk') {
            openDialogue()
        } else {
            const list = MESSAGES[type]
            showMessage(list[Math.floor(Math.random() * list.length)])
        }
    }

    const openDialogue = () => {
        const scenario = getScenario(plant.id, personalityId, stage)

        if (!scenario) {
            showMessage('....')
            return
        }

        if (talkCount >= 3) {
            const tired = [
                '오늘 할 말은 다 한 것 같아요... 🌿',
                '잠깐 햇빛 좀 쬐고 올게요 ☀️',
                '조용히 있고 싶은 날도 있어요...',
            ]
            showMessage(tired[Math.floor(Math.random() * tired.length)])
            return
        }

        setTalkCount(n => n + 1)
        setDialogue(scenario)
    }

    const checkStage = (newLove) => {
        const stageCount = plant.stages.length
        const lovePerStage = 100 / (stageCount - 1)
        const newStage = Math.min(Math.floor(newLove / lovePerStage), stageCount - 1)

        setStage(prev => {
            if (newStage > prev) {
                stageRef.current = newStage
                showMessage(plant.stages[newStage] + ' 단계가 됐어요! 🎉')
                if (newStage === stageCount - 1) {
                    const t = setTimeout(() => onFullyGrown(), 500)
                    grownTimers.current.push(t)
                }
            }
            return newStage
        })
    }

    const onFullyGrown = () => {
        _sessionStartTime = null
        setFullyGrown(true)
        const grownAt = new Date().toLocaleDateString('ko-KR')
        addToDex(plant.id, plantName, grownAt)
        addToGarden({ plantId: plant.id, plantName, grownAt })
        showMessage(`${plantName} 완전히 자랐어요! 🎉`)
        const t = setTimeout(() => {
            showMessage('씨앗을 남겨줄게요... 내일 또 만나요 🌿')
            addSeed(plant.id)
        }, 3000)
        grownTimers.current.push(t)
    }

    const goHome = () => {
        _sessionStartTime = null
        clearGameState()
        const currentElapsed = Math.floor((Date.now() - startTime.current) / 1000)
        goTo('result', {
            plant,
            plantName,
            love: loveRef.current,
            stage: stageRef.current,
            totalActions: totalActionsRef.current,
            elapsed: currentElapsed,
            fullyGrown,
        })
    }

    const m = Math.floor(elapsed / 60)
    const s = elapsed % 60
    const timeStr = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0')

    const colorHex = plant.color || 0x5CAD6B

    return (
        <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(180deg, #87CEEB 60%, #90C97A 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '12px 16px',
            gap: '6px',
            overflow: 'hidden'
        }}>
            {/* 상단 바 */}
            <div style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <button
                    onClick={() => goTo('home')}
                    style={{
                        background: 'rgba(255,255,255,0.7)',
                        border: 'none',
                        borderRadius: '99px',
                        padding: '4px 10px',
                        fontSize: '12px',
                        color: '#2d5a1b',
                        cursor: 'pointer'
                    }}
                >
                    🏠 홈
                </button>

                <span style={{ fontSize: '12px', color: '#2d5a1b' }}>⏰ {timeStr}</span>

                <button
                    onClick={() => goTo('dex')}
                    style={{
                        background: 'rgba(255,255,255,0.7)',
                        border: 'none',
                        borderRadius: '99px',
                        padding: '4px 10px',
                        fontSize: '12px',
                        color: '#2d5a1b',
                        cursor: 'pointer'
                    }}
                >
                    📖 도감
                </button>
            </div>

            {/* 식물 이름 + 단계 */}
            <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '15px', fontWeight: 'bold', color: '#2d5a1b', margin: 0 }}>
                    {plantName} <span style={{ fontWeight: 'normal', fontSize: '13px' }}>({plant.name})</span>
                </p>
                <p style={{ fontSize: '12px', color: '#3a7a28', margin: '2px 0 0' }}>
                    🌱 {plant.stages[stage]}
                </p>
            </div>

            {/* 관심도 바 */}
            <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#2d5a1b' }}>💚 관심도</span>
                    <span style={{ fontSize: '11px', color: '#2d5a1b' }}>{Math.round(love)}%</span>
                </div>
                <div style={{
                    width: '100%', height: '8px',
                    background: 'rgba(255,255,255,0.4)',
                    borderRadius: '99px', overflow: 'hidden'
                }}>
                    <div style={{
                        width: `${love}%`, height: '100%',
                        background: 'linear-gradient(90deg, #ff85a1, #ffb3c6)',
                        borderRadius: '99px',
                        transition: 'width 0.4s ease'
                    }} />
                </div>
            </div>

            {/* 말풍선 */}
            <div style={{
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
            }}>
                {message && (
                    <div style={{
                        background: 'rgba(255,255,255,0.88)',
                        borderRadius: '12px',
                        padding: '8px 16px',
                        fontSize: '13px',
                        color: '#3C3489',
                        textAlign: 'center',
                        width: '100%',
                    }}>
                        {message}
                    </div>
                )}
            </div>

            {/* 식물 캔버스 */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <PlantCanvas stage={stage} color={colorHex} />
            </div>

            {/* 버튼 */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                width: '100%'
            }}>
                {[
                    { type: 'water', label: '💧 물주기', color: '#4A90D9' },
                    { type: 'pet', label: '🤲 쓰다듬기', color: '#E8A0BF' },
                    { type: 'sun', label: '☀️ 햇빛', color: '#FFB830' },
                    { type: 'talk', label: '💬 말걸기', color: '#90C97A' },
                ].map(({ type, label, color }) => (
                    <button
                        key={type}
                        onClick={() => doAction(type)}
                        disabled={fullyGrown}
                        style={{
                            padding: '10px',
                            background: color,
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '13px',
                            fontWeight: 'bold',
                            cursor: fullyGrown ? 'not-allowed' : 'pointer',
                            opacity: fullyGrown ? 0.5 : 1,
                            position: 'relative'
                        }}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* 퇴근 버튼 */}
            <button
                onClick={goHome}
                style={{
                    padding: '8px 24px',
                    background: 'rgba(100,100,100,0.5)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '20px',
                    fontSize: '12px',
                    cursor: 'pointer'
                }}
            >
                🏠 퇴근하기
            </button>

            {dialogue && (
                <DialogueOverlay
                    scenario={dialogue}
                    plantName={plantName}
                    onClose={() => {
                        setDialogue(null)
                        showMessage('고마워요 💚')
                    }}
                />
            )}
        </div>
    )
}
