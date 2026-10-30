import { getCell, dashSplit } from '../_lib.js'
import outcomeOf from './outcome.js'
import parseRecord from './record.js'

// '2024–25 Montreal Canadiens season' → 'Montreal Canadiens'
const fromSeasonPage = function (page = '') {
  const m = String(page).match(/^\d{4}(?:[–-]\d{2,4})? (.+?) season$/)
  return m ? m[1] : null
}

// a plain team link: 'Texas Rangers (baseball)' → 'Texas Rangers'
const fromTeamPage = function (page = '') {
  page = String(page)
  if (!page || / season$/.test(page)) {
    return null
  }
  return page.replace(/ \(.*?\)$/, '')
}

// '4–2', 'W 31–7', '2–1 (11)' → [4, 2]
const parseScore = function (txt = '') {
  txt = String(txt)
    .replace(/^ *[WLT]\b\.? */i, '')
    .replace(/\(.*?\)/g, '')
    .trim()
  const arr = txt.split(dashSplit).map((s) => parseInt(s.trim(), 10))
  if (arr.length < 2 || isNaN(arr[0]) || isNaN(arr[1])) {
    return null
  }
  return [arr[0], arr[1]]
}

// 'Rogers Centre (23,987)' or '19,108' → 19108
const parseAttendance = function (txt = '') {
  let str = String(txt)
  const m = str.match(/\(([0-9, ]+)\)/)
  if (m) {
    str = m[1]
  }
  return parseInt(str.replace(/[, ]/g, ''), 10) || null
}

// 'Toronto' matches 'Toronto Maple Leafs'
const sameTeam = function (cell = '', team = '') {
  cell = cell.trim().toLowerCase()
  team = team.trim().toLowerCase()
  if (!cell || !team) {
    return false
  }
  return team.includes(cell) || cell.includes(team)
}

// visitor/home columns carry the score orientation directly
const visitorHome = function (game, row, ctx, score) {
  const visitor = getCell(row.cells, ['visitor', 'away'])
  const home = getCell(row.cells, ['home'])
  if (!visitor || !home) {
    return false
  }
  let isHome = sameTeam(home, ctx.team)
  if (isHome === false && sameTeam(visitor, ctx.team) === false) {
    // neither side matched - our own team is usually the unlinked one
    isHome = row.links.home === undefined
  }
  game.home = isHome
  const opp = isHome ? visitor : home
  const oppLink = isHome ? row.links.visitor : row.links.home
  game.opponent = fromSeasonPage(oppLink) || ctx.fullName(opp.trim())
  if (score) {
    game.result = isHome ? { us: score[1], them: score[0] } : { us: score[0], them: score[1] }
  }
  return true
}

// an opponent column marks away-games with '@' or 'at'
const opponentCol = function (game, row, ctx, score) {
  let opp = getCell(row.cells, ['opponent', 'opp', 'team'])
  if (!opp) {
    return false
  }
  game.home = /^ *(@|at )/i.test(opp) === false
  opp = opp.replace(/^ *(@|at ) */i, '').trim()
  opp = opp.replace(/ *\(\d{4}[^)]*\)$/, '') //a '(2002–03)' season-link suffix
  const oppLink = row.links.opponent || row.links.opp || row.links.team
  game.opponent = fromSeasonPage(oppLink) || fromTeamPage(oppLink) || ctx.fullName(opp)
  // scores here may be ours-first or winner-first - the outcome settles both
  if (score && game.outcome === 'win') {
    game.result = { us: Math.max(...score), them: Math.min(...score) }
  } else if (score && (game.outcome === 'loss' || game.outcome === 'otl')) {
    game.result = { us: Math.min(...score), them: Math.max(...score) }
  } else if (score) {
    game.result = { us: score[0], them: score[1] } //oriented later, from the record
  }
  return true
}

const monthNames = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
]

// some 1980s logs name the date column after the month, with day-of-month cells
const findDate = function (cells) {
  const date = getCell(cells, ['date'])
  if (date) {
    return date
  }
  const key = Object.keys(cells).find((k) => monthNames.includes(k))
  if (key && cells[key] && /^\d{1,2}$/.test(String(cells[key]).trim())) {
    return `${key.charAt(0).toUpperCase()}${key.slice(1)} ${String(cells[key]).trim()}`
  }
  return ''
}

// one normalized row → one game, or null for legend/filler rows
const buildGame = function (row, ctx) {
  const { cells, attrs } = row
  const date = findDate(cells)
  if (!date) {
    return null
  }
  const scoreText = getCell(cells, ['score', 'result', 'box score'])
  const score = parseScore(scoreText)
  const game = {
    date: ctx.dateYear ? ctx.dateYear(date, ctx.year) : date,
    opponent: '',
    home: null,
    outcome: outcomeOf(attrs, scoreText),
    result: null,
  }
  const num = parseInt(getCell(cells, ['#', 'game', 'week']), 10)
  if (isNaN(num) === false) {
    game.game = num
  }
  const found = visitorHome(game, row, ctx, score) || opponentCol(game, row, ctx, score)
  if (found === false) {
    return null
  }
  // the ot/so flag is its own column, or tacked onto the score: '2–2 OT'
  const ot = getCell(cells, ['ot', 'overtime']) || String(scoreText).replace(/\(.*?\)/g, '')
  game.overtime = /\b([0-9]?ot|so)\b/i.test(ot)
  if (/\bso\b/i.test(ot)) {
    game.shootout = true
  }
  game.record = parseRecord(getCell(cells, ['record', 'series']), ctx.record)
  game.attendance = parseAttendance(getCell(cells, ['attendance', 'location (attendance)']))
  if (ctx.extras) {
    ctx.extras(game, row)
  }
  return game
}

export default buildGame
export { parseScore, fromSeasonPage }
