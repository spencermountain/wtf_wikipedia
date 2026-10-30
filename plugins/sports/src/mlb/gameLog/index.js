import parseGame from './parseGame.js'
import addWinner from './winner.js'
import { withChildren, findSection } from '../../_lib.js'

const doTable = function (rows = []) {
  if (!Array.isArray(rows)) {
    return []
  }
  //is it a legend/junk table?
  if (rows[1] && (rows[1].Legend || rows[1].legend)) {
    return []
  }
  let games = rows.map((row) => parseGame(row))
  //remove empty weird ones
  games = games.filter((g) => g && g.team && g.date)
  return games
}

// one array of rows per table, from the section and its subsections
const doSection = function (doc, section) {
  const sections = withChildren(doc, section)
  let tables = sections.flatMap((s) => s.tables())
  if (tables.length > 0) {
    return tables.map((t) => t.rows())
  }
  //try to find a game log template
  const names = ['mlb game log section', 'mlb game log month', 'game log section']
  const templates = sections.flatMap((s) => names.flatMap((n) => s.templates(n)))
  return templates.map((m) => m.json().data?.rows || [])
}

//get games of regular season
const gameLog = function (doc) {
  const section = findSection(doc, [
    'game log',
    'regular season',
    'schedule',
    'schedule and results',
    'season game log',
  ])
  if (!section) {
    return []
  }
  let games = doSection(doc, section).flatMap((rows) => doTable(rows))
  games = addWinner(games)
  return games
}

const postSeason = function (doc) {
  const section = findSection(doc, ['postseason game log', 'postseason', 'playoffs', 'playoff'])
  if (!section) {
    return []
  }
  const series = doSection(doc, section).map((rows) => doTable(rows))
  series.forEach((games) => addWinner(games))
  return series.filter((games) => games.length > 0)
}
export const season = gameLog
export const postseason = postSeason
