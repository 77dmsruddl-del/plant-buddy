/**
 * PlantCanvas — 캔버스로 그린 임시 식물 그래픽
 *
 * 나중에 픽셀 아트 스프라이트로 교체 예정.
 * 교체 시 이 파일만 PlantSprite.jsx로 바꾸면 되도록
 * props 인터페이스(stage, color)를 유지한다.
 */
import { useRef, useEffect } from 'react'

export default function PlantCanvas({ stage, color }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, 200, 260)

    const cx = 100
    const base = 220
    const c = '#' + color.toString(16).padStart(6, '0')

    drawPlant(ctx, stage, cx, base, c)
    drawPot(ctx, cx, base)
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

// ── 단계별 식물 그리기 ────────────────────────────────────────

function drawPlant(ctx, stage, cx, base, c) {
  if (stage === 0) drawSeed(ctx, cx, base)
  else if (stage === 1) drawSprout(ctx, cx, base)
  else if (stage === 2) drawSmall(ctx, cx, base)
  else if (stage === 3) drawMedium(ctx, cx, base, c)
  else if (stage === 4) drawLarge(ctx, cx, base, c)
  else if (stage === 5) drawFull(ctx, cx, base, c)
}

function drawSeed(ctx, cx, base) {
  ctx.fillStyle = '#4A3700'
  ctx.beginPath()
  ctx.ellipse(cx, base - 10, 10, 7, 0, 0, Math.PI * 2)
  ctx.fill()
}

function drawSprout(ctx, cx, base) {
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
}

function drawSmall(ctx, cx, base) {
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
}

function drawMedium(ctx, cx, base, c) {
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

  // 꽃봉오리 (반투명)
  ctx.globalAlpha = 0.7
  ctx.fillStyle = c
  ctx.beginPath(); ctx.ellipse(cx, base - 122, 10, 14, 0, 0, Math.PI * 2); ctx.fill()
  ctx.globalAlpha = 1
}

function drawLarge(ctx, cx, base, c) {
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

  // 꽃잎
  const petalAngles = [0, -0.8, 0.8, -1.6, 1.6]
  petalAngles.forEach(angle => {
    ctx.fillStyle = c
    ctx.save(); ctx.translate(cx, base - 128); ctx.rotate(angle)
    ctx.beginPath(); ctx.ellipse(0, -14, 9, 16, 0, 0, Math.PI * 2); ctx.fill()
    ctx.restore()
  })

  ctx.fillStyle = '#FFEE55'
  ctx.beginPath(); ctx.arc(cx, base - 128, 10, 0, Math.PI * 2); ctx.fill()
}

function drawFull(ctx, cx, base, c) {
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

function drawPot(ctx, cx, base) {
  ctx.fillStyle = '#7B5A0A'
  ctx.fillRect(cx - 30, base - 5, 60, 8)
  ctx.fillStyle = '#8B6914'
  ctx.fillRect(cx - 26, base + 3, 52, 40)
}
