const KEY = {
  player: 'pb_player',
  dex: 'pb_dex',
  today: 'pb_today',
  seeds: 'pb_seeds',
  garden: 'pb_garden',
  gamestate: 'pb_gamestate',
}

function safeParse(data, fallback) {
  try { return data ? JSON.parse(data) : fallback } catch { return fallback }
}

export function getPlayer() {
  return safeParse(localStorage.getItem(KEY.player), null)
}

export function savePlayer(name) {
  localStorage.setItem(KEY.player, JSON.stringify({ name, createdAt: Date.now() }))
}

export function getTodaySeed() {
  return safeParse(localStorage.getItem(KEY.today), null)
}

export function saveTodaySeed(plantId, plantName) {
  const today = getToday()
  localStorage.setItem(KEY.today, JSON.stringify({ plantId, plantName, date: today }))
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