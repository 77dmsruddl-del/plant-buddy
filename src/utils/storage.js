const KEY = {
  player: 'pb_player',
  dex: 'pb_dex',
  today: 'pb_today',
  seeds: 'pb_seeds',
  garden: 'pb_garden',
  gamestate: 'pb_gamestate',
  fertilizers: 'pb_fertilizers',
  todos: 'pb_todos',
  unfinished: 'pb_unfinished',
  fragments: 'pb_fragments',
}

function safeParse(data, fallback) {
  try { return data ? JSON.parse(data) : fallback } catch { return fallback }
}

export function getPlayer() {
  return safeParse(localStorage.getItem(KEY.player), null)
}

export function savePlayer(name, workType = 'fixed', commuteStart = '09:00', commuteEnd = '18:00') {
  const existing = getPlayer() || {}
  localStorage.setItem(KEY.player, JSON.stringify({
    ...existing,
    name,
    createdAt: existing.createdAt || Date.now(),
    workType,
    commuteStart,
    commuteEnd,
  }))
}

export function getTodaySeed() {
  return safeParse(localStorage.getItem(KEY.today), null)
}

export function saveTodaySeed(plantId, plantName) {
  const existing = getTodaySeed() || {}
  const today = getToday()
  localStorage.setItem(KEY.today, JSON.stringify({ ...existing, plantId, plantName, date: today }))
}

// ── 출퇴근 스케줄 ─────────────────────────────────────────────────

// 오늘 출퇴근 시간 저장 (유연근무자는 매일 갱신, 고정근무자는 씨앗 심을 때 복사)
export function saveTodaySchedule({ todayStart, todayEnd }) {
  const existing = getTodaySeed() || {}
  localStorage.setItem(KEY.today, JSON.stringify({ ...existing, todayStart, todayEnd }))
}

export function getTodaySchedule() {
  const today = getTodaySeed() || {}
  // 저장된 값 없으면 player의 기본값으로 폴백
  if (!today.todayStart) {
    const player = getPlayer()
    return {
      todayStart:  player?.commuteStart || '09:00',
      todayEnd:    player?.commuteEnd   || '18:00',
      isOvertime:  false,
      overtimeEnd: null,
    }
  }
  return {
    todayStart:  today.todayStart,
    todayEnd:    today.todayEnd,
    isOvertime:  today.isOvertime  || false,
    overtimeEnd: today.overtimeEnd || null,
  }
}

// 야근 선언: 종료 시각 갱신 + isOvertime 플래그
export function setOvertime(overtimeEnd) {
  const existing = getTodaySeed() || {}
  localStorage.setItem(KEY.today, JSON.stringify({
    ...existing,
    isOvertime: true,
    overtimeEnd,
  }))
}

export function getDex() {
  return safeParse(localStorage.getItem(KEY.dex), {})
}

export function addToDex(plantId, plantName, grownAt) {
  const dex = getDex()
  if (!dex[plantId]) dex[plantId] = []
  dex[plantId].push({ plantName, grownAt })
  localStorage.setItem(KEY.dex, JSON.stringify(dex))
}

export function getGarden() {
  return safeParse(localStorage.getItem(KEY.garden), [])
}

export function addToGarden(plant) {
  const garden = getGarden()
  garden.push(plant)
  localStorage.setItem(KEY.garden, JSON.stringify(garden))
}

export function getSeeds() {
  return safeParse(localStorage.getItem(KEY.seeds), {})
}

export function addSeed(plantId) {
  const seeds = getSeeds()
  seeds[plantId] = (seeds[plantId] || 0) + 1
  localStorage.setItem(KEY.seeds, JSON.stringify(seeds))
}

export function getToday() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function clearAll() {
  Object.values(KEY).forEach(k => localStorage.removeItem(k))
}

export function savePersonality(personalityId) {
  const data = safeParse(localStorage.getItem(KEY.today), {})
  data.personalityId = personalityId
  localStorage.setItem(KEY.today, JSON.stringify(data))
}

export function getPersonalityId() {
  return safeParse(localStorage.getItem(KEY.today), {}).personalityId ?? null
}

export function saveGameState(state) {
  localStorage.setItem(KEY.gamestate, JSON.stringify({ ...state, date: getToday() }))
}

export function getGameState() {
  const state = safeParse(localStorage.getItem(KEY.gamestate), null)
  if (!state) return null
  // 날짜를 숫자로 비교해서 포맷 차이(2026-5-8 vs 2026-05-08) 무관하게 처리
  const [sy, sm, sd] = state.date.split('-').map(Number)
  const now = new Date()
  if (sy !== now.getFullYear() || sm !== now.getMonth() + 1 || sd !== now.getDate()) return null
  return state
}

export function clearGameState() {
  localStorage.removeItem(KEY.gamestate)
}

// ── 비료 ────────────────────────────────────────────────────
export function getFertilizers() {
  return safeParse(localStorage.getItem(KEY.fertilizers), 0)
}

export function setFertilizers(n) {
  localStorage.setItem(KEY.fertilizers, JSON.stringify(Math.min(3, Math.max(0, n))))
}

export function addFertilizer() {
  const current = getFertilizers()
  if (current < 3) setFertilizers(current + 1)
  return Math.min(3, current + 1)
}

export function useFertilizerItem() {
  const current = getFertilizers()
  if (current <= 0) return false
  setFertilizers(current - 1)
  return true
}

// ── TODO ────────────────────────────────────────────────────
export function getTodos() {
  const all = safeParse(localStorage.getItem(KEY.todos), [])
  const today = getToday()
  return all.filter(t => t.date === today)
}

export function saveTodos(todos) {
  const all = safeParse(localStorage.getItem(KEY.todos), [])
  const today = getToday()
  const others = all.filter(t => t.date !== today)
  localStorage.setItem(KEY.todos, JSON.stringify([...others, ...todos]))
}

export function addTodoItem(text) {
  const todos = getTodos()
  const newTodo = { id: Date.now(), text, done: false, date: getToday() }
  saveTodos([...todos, newTodo])
  return newTodo
}

export function completeTodoItem(id) {
  const todos = getTodos()
  const updated = todos.map(t => t.id === id ? { ...t, done: true } : t)
  saveTodos(updated)
  return addFertilizer()
}

export function deleteTodoItem(id) {
  const todos = getTodos()
  saveTodos(todos.filter(t => t.id !== id))
}

// ── 미완성 도감 ──────────────────────────────────────────────
export function getUnfinished() {
  return safeParse(localStorage.getItem(KEY.unfinished), [])
}

export function addUnfinished(record) {
  const list = getUnfinished()
  list.push({ ...record, date: getToday() })
  localStorage.setItem(KEY.unfinished, JSON.stringify(list))
}

// ── 씨앗 부스러기 ────────────────────────────────────────────
export function getFragments() {
  return safeParse(localStorage.getItem(KEY.fragments), {})
}

export function addSeedFragment(plantId) {
  const fragments = getFragments()
  const next = (fragments[plantId] || 0) + 1
  if (next >= 2) {
    // 부스러기 2개 → 씨앗 1개로 자동 변환
    fragments[plantId] = 0
    localStorage.setItem(KEY.fragments, JSON.stringify(fragments))
    addSeed(plantId)
    return { converted: true }
  }
  fragments[plantId] = next
  localStorage.setItem(KEY.fragments, JSON.stringify(fragments))
  return { converted: false, count: next }
}