import addWinner from './win-loss.js'
const dashSplit = /([–\-−]|&ndash;)/
import parseRecord from './_record.js'
import { withChildren, findSection, getCell } from '../../_lib.js'

const parseScore = function (score = '') {
  const arr = score.split(dashSplit)
  if (!arr[0] && !arr[2]) {
    return {}
  }
  return {
    win: Number(arr[0]),
    loss: Number(arr[2]),
  }
}

const parseDate = function (row, title) {
  const year = title.year
  let date = getCell(row, ['date', 'Date'])
  if (!date) {
    return ''
  }
  //the next year, add one to the year
  if (/^(jan|feb|mar|apr)/i.test(date)) {
    date += ' ' + (year + 1)
  } else {
    date += ' ' + year
  }
  return date
}

const doSection = function (doc, section) {
  // Include the section's own tables and all subsections.
  const sections = withChildren(doc, section)
  const tables = sections.flatMap((s) => s.tables())
  if (tables.length > 0) {
    return tables.flatMap((t) => t.rows())
  }
  //try to find a game log template
  const names = ['game log section', 'game log month']
  const templates = sections.flatMap((s) => names.flatMap((n) => s.templates(n)))
  return templates.flatMap((m) => m.json().data?.rows || [])
}

const parseGame = function (row, meta) {
  const attendance = Number(String(getCell(row, ['attendance', 'Attendance'])).replace(/,/g, '')) || null
  const res = {
    game: Number(getCell(row, ['#', 'game', 'Game'])),
    date: parseDate(row, meta),
    opponent: getCell(row, ['opponent', 'Opponent']),
    result: parseScore(getCell(row, ['score', 'Score'])),
    overtime: /^(ot|so)$/i.test(String(getCell(row, ['ot', 'OT'])).trim()),
    record: parseRecord(getCell(row, ['record', 'Record'])),
    attendance: attendance,
    points: Number(getCell(row, ['pts', 'Pts', 'PTS', 'points', 'Points'])) || 0,
  }
  res.location = getCell(row, ['location', 'Location']) || undefined
  res.home = getCell(row, ['home', 'Home']) || undefined
  res.visitor = getCell(row, ['visitor', 'Visitor']) || undefined
  if (!res.opponent && res.home && res.visitor) {
    res.opponent = meta.team.includes(res.home) ? res.visitor : res.home
  }
  res.opponent ||= ''
  res.opponent = res.opponent.replace(/^ *@ */, '').trim()
  return res
}

//
const parseGames = function (doc, meta) {
  let games = []
  let s = findSection(doc, ['schedule and results', 'schedule', 'regular season'])
  if (!s) {
    return games
  }
  // support nested headers
  const nested = withChildren(doc, s).find((c) => c.title().trim().toLowerCase() === 'regular season')
  if (nested) {
    s = nested
  }
  //do all subsections, too
  const rows = doSection(doc, s)
  rows.forEach((row) => {
    games.push(parseGame(row, meta))
  })
  games = games.filter((g) => g && g.date)
  games = addWinner(games)
  // games = isFuture(games)
  return games
}
export default parseGames
