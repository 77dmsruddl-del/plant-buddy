const KEY = {
  player: 'pb_player',
  dex: 'pb_dex',
  today: 'pb_today',
  seeds: 'pb_seeds',
  garden: 'pb_garden',
}

export function getPlayer() {
  const data = localStorage.getItem(KEY.player)
  return data ? JSON.parse(data) : null
}

export function savePlayer(name) {
  localStorage.setItem(KEY.player, JSON.stringify({ name, createdAt: Date.now() }))
}

export function getTodaySeed() {
  const data = localStorage.getItem(KEY.today)
  return data ? JSON.parse(data) : null
}

export function saveTodaySeed(plantId, plantName) {
  const today = getToday()
  localStorage.setItem(KEY.today, JSON.stringify({ plantId, plantName, date: today }))
}

export function getDex() {
  const data = localStorage.getItem(KEY.dex)
  return data ? JSON.parse(data) : {}
}

export function addToDex(plantId, plantName, grownAt) {
  const dex = getDex()
  if (!dex[plantId]) dex[plantId] = []
  dex[plantId].push({ plantName, grownAt })
  localStorage.setItem(KEY.dex, JSON.stringify(dex))
}

export function getGarden() {
  const data = localStorage.getItem(KEY.garden)
  return data ? JSON.parse(data) : []
}

export function addToGarden(plant) {
  const garden = getGarden()
  garden.push(plant)
  localStorage.setItem(KEY.garden, JSON.stringify(garden))
}

export function getSeeds() {
  const data = localStorage.getItem(KEY.seeds)
  return data ? JSON.parse(data) : {}
}

export function addSeed(plantId) {
  const seeds = getSeeds()
  seeds[plantId] = (seeds[plantId] || 0) + 1
  localStorage.setItem(KEY.seeds, JSON.stringify(seeds))
}

export function getToday() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

export function clearAll() {
  Object.values(KEY).forEach(k => localStorage.removeItem(k))
}

export function savePersonality(personalityId) {
  const data = JSON.parse(localStorage.getItem(KEY.today) || '{}')
  data.personalityId = personalityId
  localStorage.setItem(KEY.today, JSON.stringify(data))
}

export function getPersonalityId() {
  const data = localStorage.getItem(KEY.today)
  return data ? JSON.parse(data).personalityId : null
}