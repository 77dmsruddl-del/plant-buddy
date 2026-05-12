/**
 * ResultScreen — 퇴근(or 완성) 후 결과 화면
 *
 * useGameEngine이 goTo('result', { plantId, plantName, finalLove, actionCounts, verdict })
 * 형식으로 데이터를 보내므로 그에 맞게 처리한다.
 *
 * verdict 값:
 *   'complete' — love 150 달성 (완성)
 *   'good'     — finalLove 110~149
 *   'partial'  — finalLove 60~109
 *   'fail'     — finalLove < 60
 */
import React, { useEffect, useRef } from 'react'
import { PLANTS } from '../data/plants.js'
import { addToDex, addToGarden, addUnfinished, addSeedFragment } from '../utils/storage.js'

// love 수치 → 단계 변환 (useGameEngine과 동일한 기준)
const STAGE_THRESHOLDS = [0, 20, 45, 75, 110, 150]
function calcStage(love) {
  for (let i = STAGE_THRESHOLDS.length - 1; i >= 0; i--) {
    if (love >= STAGE_THRESHOLDS[i]) return i
  }
  return 0
}

// verdict별 표시 설정
const VERDICT_CONFIG = {
  complete: {
    emoji: '🎉',
    title: '완성!',
    msg: '완전히 다 자랐어요! 오늘 정말 잘 돌봐줬어요.',
    badgeColor: '#4A9E5A',
  },
  good: {
    emoji: '🌸',
    title: '훌륭해요',
    msg: '꽃봉오리까지 자랐네요. 내일도 와줄 거죠?',
    badgeColor: '#4A90D9',
  },
  partial: {
    emoji: '🌿',
    title: '아쉬워요',
    msg: '어느 정도 자랐지만 조금 더 관심을 줬으면 좋았을 텐데.',
    badgeColor: '#FFB830',
  },
  fail: {
    emoji: '🌰',
    title: '힘들었나요',
    msg: '씨앗인 채로 하루가 끝났어요. 내일은 더 놀아줄 수 있을까요?',
    badgeColor: '#FF6B6B',
  },
}

export default function ResultScreen({ goTo, data }) {
  const {
    plantId,
    plantName,
    finalLove    = 0,
    actionCounts = {},
    verdict      = 'fail',
  } = data || {}

  // plantId로 식물 정보 복원
  const plant     = PLANTS.find(p => p.id === plantId) || PLANTS[0]
  const stage     = calcStage(finalLove)
  const stageName = plant.stages?.[stage] || '씨앗'

  // 총 액션 횟수
  const totalActions = Object.values(actionCounts).reduce((sum, v) => sum + v, 0)

  const config = VERDICT_CONFIG[verdict] || VERDICT_CONFIG.fail

  // ── 결과별 부작용 처리 (마운트 시 1회) ─────────────────────────
  const processed = useRef(false)
  useEffect(() => {
    if (processed.current || !plantId) return
    processed.current = true

    if (verdict === 'complete') {
      // 완성 → 도감 + 정원 등록
      addToDex(plantId, plantName, Date.now())
      addToGarden({ plantId, plantName, stage, finalLove, grownAt: Date.now() })
    } else if (verdict === 'good') {
      // 거의 다 자람 → 정원에 부분 성장으로 보관
      addToGarden({ plantId, plantName, stage, finalLove, grownAt: Date.now() })
    } else {
      // partial / fail → 미완성 도감 + 씨앗 부스러기 누적
      addUnfinished({ plantId, plantName, finalLove, stage, verdict })
      addSeedFragment(plantId) // 부스러기 2개 쌓이면 씨앗 1개로 자동 전환
    }
  }, [])

  return (
    <div style={styles.screen}>
      {/* ── 이모지 + 타이틀 ── */}
      <div style={{ fontSize: '56px' }}>{config.emoji}</div>

      <p style={styles.title}>퇴근 시간이에요!</p>

      {/* verdict 배지 */}
      <span style={{ ...styles.badge, background: config.badgeColor }}>
        {config.title}
      </span>

      <p style={styles.msg}>{config.msg}</p>

      {/* ── 결과 카드 ── */}
      <div style={styles.card}>
        <Row label="식물"       value={`${plantName} (${plant.name})`} />
        <Row label="최종 단계"  value={stageName} />
        <Row label="관심도"     value={`${finalLove} / 150`} />
        <Row label="총 행동"    value={`${totalActions}회`} />
        <Row label="물주기"     value={`${actionCounts.water ?? 0}회`} />
        <Row label="햇빛"       value={`${actionCounts.sun   ?? 0}회`} />
        <Row label="쓰다듬기"   value={`${actionCounts.pet   ?? 0}회`} />
        <Row label="말걸기"     value={`${actionCounts.talk  ?? 0}회`} />

        {/* 완성 시 도감 등록 알림 */}
        {verdict === 'complete' && (
          <div style={styles.notice}>
            🌿 도감에 등록됐어요!
          </div>
        )}

        {/* 실패/부분 성장 시 씨앗 부스러기 안내 */}
        {(verdict === 'partial' || verdict === 'fail') && (
          <div style={{ ...styles.notice, background: 'rgba(255,184,48,0.15)', color: '#7A4A00' }}>
            🌰 씨앗 부스러기를 얻었어요. 2개 모이면 씨앗이 돼요!
          </div>
        )}
      </div>

      {/* ── 버튼 영역 ── */}
      <div style={styles.btnRow}>
        {verdict === 'complete' && (
          <button onClick={() => goTo('dex')} style={styles.dexBtn}>
            📖 도감 보러가기
          </button>
        )}
        <button onClick={() => goTo('home')} style={styles.homeBtn}>
          🌱 내일도 심기
        </button>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div style={styles.row}>
      <span style={{ color: '#888' }}>{label}</span>
      <span style={{ color: '#2d5a1b', fontWeight: 'bold' }}>{value}</span>
    </div>
  )
}

// ── 스타일 ────────────────────────────────────────────────────────
const styles = {
  screen: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(180deg, #87CEEB 60%, #90C97A 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px 20px',
    gap: '10px',
    overflowY: 'auto',
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#2d5a1b',
    margin: 0,
  },
  badge: {
    color: 'white',
    fontSize: '13px',
    fontWeight: 'bold',
    borderRadius: '99px',
    padding: '4px 14px',
  },
  msg: {
    fontSize: '13px',
    color: '#3a7a28',
    textAlign: 'center',
    lineHeight: 1.6,
    margin: 0,
  },
  card: {
    width: '100%',
    background: 'rgba(255,255,255,0.88)',
    borderRadius: '16px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '13px',
    borderBottom: '1px solid rgba(0,0,0,0.06)',
    paddingBottom: '8px',
  },
  notice: {
    background: 'rgba(74,158,90,0.15)',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '12px',
    color: '#2d5a1b',
    textAlign: 'center',
    marginTop: '4px',
  },
  btnRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%',
    marginTop: '4px',
  },
  dexBtn: {
    width: '100%',
    padding: '12px',
    background: '#4A90D9',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  homeBtn: {
    width: '100%',
    padding: '12px',
    background: '#4A9E5A',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
}
