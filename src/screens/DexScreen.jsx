import React, { useState } from 'react'
import { getDex } from '../utils/storage.js'
import { PLANTS } from '../data/plants.js'

const TYPE_EMOJI = { '꽃': '🌸', '나무': '🌳', '과일': '🍓', '다육': '🌵' }

export default function DexScreen({ goTo, goBack }) {
    const dex = getDex()
    const [selected, setSelected] = useState(null)

    const plant = selected ? PLANTS.find(p => p.id === selected) : null
    const records = selected ? (dex[selected] || []) : []

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
                    onClick={() => selected ? setSelected(null) : goBack()}
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
                    {selected ? plant?.name : '도감'}
                </p>
                {!selected && (
                    <span style={{ fontSize: '12px', color: '#3a7a28', marginLeft: 'auto' }}>
                        {Object.keys(dex).length}/{PLANTS.length}종 발견
                    </span>
                )}
            </div>

            {/* 목록 or 상세 */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px 16px' }}>
                {!selected ? (
                    // 식물 목록
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {PLANTS.map(p => {
                            const found = !!dex[p.id]
                            return (
                                <button
                                    key={p.id}
                                    onClick={() => found && setSelected(p.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px 14px',
                                        background: found ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        cursor: found ? 'pointer' : 'default',
                                        textAlign: 'left',
                                        filter: found ? 'none' : 'grayscale(1)',
                                        opacity: found ? 1 : 0.6
                                    }}
                                >
                                    <span style={{ fontSize: '32px' }}>
                                        {found ? (TYPE_EMOJI[p.type] || '🌱') : '❓'}
                                    </span>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#2d5a1b', margin: '0 0 2px' }}>
                                            {found ? p.name : '???'}
                                        </p>
                                        <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>
                                            {found ? p.scientificName : '아직 발견하지 못했어요'}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontSize: '11px', color: '#888', margin: '0 0 2px' }}>{p.type}</p>
                                        <p style={{ fontSize: '11px', color: '#FFB830', margin: 0 }}>
                                            {'⭐'.repeat(p.difficulty || 1)}
                                        </p>
                                        {found && (
                                            <p style={{ fontSize: '10px', color: '#4A9E5A', margin: '2px 0 0' }}>
                                                {dex[p.id].length}회 재배
                                            </p>
                                        )}
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                ) : (
                    // 식물 상세
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{
                            background: 'rgba(255,255,255,0.9)',
                            borderRadius: '16px',
                            padding: '20px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '52px' }}>{TYPE_EMOJI[plant.type] || '🌱'}</div>
                            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#2d5a1b', margin: '8px 0 4px' }}>
                                {plant.name}
                            </p>
                            <p style={{ fontSize: '12px', color: '#888', fontStyle: 'italic', margin: '0 0 12px' }}>
                                {plant.scientificName}
                            </p>
                            <p style={{ fontSize: '13px', color: '#3a7a28', lineHeight: 1.6, margin: '0 0 12px' }}>
                                {plant.description}
                            </p>
                            <div style={{
                                background: 'rgba(74,158,90,0.1)',
                                borderRadius: '8px',
                                padding: '8px 12px',
                                fontSize: '12px',
                                color: '#2d5a1b',
                                marginBottom: '8px'
                            }}>
                                💡 {plant.tip}
                            </div>
                            <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>
                                좋아하는 행동: {
                                    { water: '💧 물주기', pet: '🤲 쓰다듬기', sun: '☀️ 햇빛', talk: '💬 말걸기' }[plant.favoriteAction]
                                }
                            </p>
                        </div>

                        {/* 성장 단계 */}
                        <div style={{
                            background: 'rgba(255,255,255,0.9)',
                            borderRadius: '16px',
                            padding: '16px'
                        }}>
                            <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#2d5a1b', margin: '0 0 10px' }}>
                                성장 단계
                            </p>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {plant.stages.map((s, i) => (
                                    <span key={i} style={{
                                        padding: '4px 10px',
                                        background: 'rgba(74,158,90,0.15)',
                                        borderRadius: '99px',
                                        fontSize: '11px',
                                        color: '#2d5a1b'
                                    }}>
                                        {i + 1}. {s}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* 키운 기록 */}
                        <div style={{
                            background: 'rgba(255,255,255,0.9)',
                            borderRadius: '16px',
                            padding: '16px'
                        }}>
                            <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#2d5a1b', margin: '0 0 10px' }}>
                                키운 기록 ({records.length}회)
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {records.map((r, i) => (
                                    <div key={i} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: '12px',
                                        color: '#3a7a28',
                                        padding: '6px 0',
                                        borderBottom: '1px solid rgba(0,0,0,0.06)'
                                    }}>
                                        <span>🌱 {r.plantName}</span>
                                        <span style={{ color: '#888' }}>{r.grownAt}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}