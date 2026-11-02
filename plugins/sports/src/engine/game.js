import { getCell, findKey, dashSplit } from '../_lib.js'
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
    .replace(/^ *[WLTD]\b\.? */i, '')
    .replace(/\(.*?\)/g, '')
    .trim()
  const arr = txt.split(dashSplit).map((s) => parseInt(s.trim(), 10))
  if (arr.length < 2 || isNaN(arr[0]) || isNaN(arr[1])) {
    return null
  }
  return [arr[0], arr[1]]
}

// 'Rogers Centre (23,987)', 'Bell Centre 21,900' or '19,108' → 19108
const parseAttendance = function (txt = '') {
  let str = String(txt)
  const m = str.match(/\(([0-9, ]+)\)/) || str.match(/([0-9][0-9,]{2,}) *$/)
  if (m && m[1]) {
    str = m[1]
  }
  return parseInt(str.replace(/[, ]/g, ''), 10) || null
}

// '🏴 Chelsea' and 'Chelsea F.C.' both reduce to 'chelsea'
const bareName = function (str = '') {
  return String(str)
    .toLowerCase()
    .replace(/[^\p{L}\p{N} .&'-]/gu, '')
    .replace(/ (a\.?f\.?c\.?|f\.?c\.?)$/, '')
    .trim()
}

// 'Toronto' matches 'Toronto Maple Leafs'
const sameTeam = function (cell = '', team = '') {
  cell = bareName(cell)
  team = bareName(team)
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

// an opponent column marks away-games with '@' or 'at', home-games sometimes with 'vs.'
const opponentCol = function (game, row, ctx, score) {
  // combined headers like 'Opponent / Time' still count as the opponent column
  const key = findKey(row.cells, ['opponent', 'opp', 'team'])
  let opp = key ? row.cells[key] : ''
  if (!opp) {
    return false
  }
  game.home = /^ *(@|at )/i.test(opp) === false
  opp = opp.replace(/^ *(@|at |vs\.? ) */i, '').trim()
  opp = opp.replace(/ *\(\d{4}[^)]*\)$/, '') //a '(2002–03)' season-link suffix
  opp = opp.replace(/ \d{1,2}:\d{2} ?[ap]\.?m.*$/i, '') //a '6:05pm (ESPN)' suffix
  const oppLink = row.links[key]
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

const months = {
  jan: 'January',
  feb: 'February',
  mar: 'March',
  apr: 'April',
  may: 'May',
  jun: 'June',
  jul: 'July',
  aug: 'August',
  sep: 'September',
  sept: 'September',
  oct: 'October',
  nov: 'November',
  dec: 'December',
  january: 'January',
  february: 'February',
  march: 'March',
  april: 'April',
  june: 'June',
  july: 'July',
  august: 'August',
  september: 'September',
  october: 'October',
  november: 'November',
  december: 'December',
}

// some logs name the date column after the month, with day-of-month cells like '14' or '1*'
const findDate = function (cells) {
  // prefix-match, for combined headings like 'Date / Time (ET)'
  const key = findKey(cells, ['date'])
  if (key && cells[key]) {
    return cells[key]
  }
  const month = Object.keys(cells).find((k) => months[k] !== undefined)
  if (month && cells[month]) {
    const day = String(cells[month])
      .trim()
      .match(/^(\d{1,2})\*?$/)
    if (day) {
      return `${months[month]} ${day[1]}`
    }
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
  // bye-weeks have a week number, but no game
  if (/\bbye\b/i.test(date)) {
    return null
  }
  // 'result f-a' is the soccer for–against column, always our-score-first
  const scoreText = getCell(cells, ['score', 'result', 'box score', 'result f-a', 'score f-a'])
  const score = parseScore(scoreText)
  const game = {
    date: ctx.dateYear ? ctx.dateYear(date, ctx.year) : date,
    opponent: '',
    home: null,
    outcome: outcomeOf(attrs, scoreText, ctx.draws === true),
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
  // an 'H/A' or venue letter-column beats the opponent-prefix guess
  const ha = String(getCell(cells, ['h/a', 'home/away', 'venue', 'ground'])).trim()
  if (/^h$/i.test(ha)) {
    game.home = true
  } else if (/^a$/i.test(ha)) {
    game.home = false
  } else if (/^n$/i.test(ha)) {
    game.home = null //neutral ground
  }
  // the ot/so flag is its own column, or tacked onto the score: '2–2 OT', '109–113 (OT)'
  const ot = getCell(cells, ['ot', 'overtime']) || String(scoreText)
  game.overtime = /\b([0-9]?ot|so)\b/i.test(ot)
  if (/\bso\b/i.test(ot)) {
    game.shootout = true
  }
  game.record = parseRecord(getCell(cells, ['record', 'series']), ctx.record)
  game.attendance = parseAttendance(getCell(cells, ['attendance', 'location (attendance)', 'location attendance']))
  if (ctx.extras) {
    ctx.extras(game, row)
  }
  // all-star breaks and broadcast notes have a date, but nothing else
  if (game.game === undefined && !score && !game.record && game.outcome === null) {
    return null
  }
  return game
}

export default buildGame
export { parseScore, fromSeasonPage, sameTeam, parseAttendance }
