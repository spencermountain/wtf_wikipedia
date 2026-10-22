/* eslint-disable no-console */
import parseGame from './parseGame.js'
import addWinner from './winner.js'

const isArray = function (arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
}

const doTable = function (rows = []) {
  let games = []
  //is it a legend/junk table?
  if ((rows[1] && rows[1].Legend) || !isArray(rows)) {
    return games
  }
  rows.forEach((row) => {
    games.push(parseGame(row))
  })
  //remove empty weird ones
  games = games.filter((g) => g.team && g.date) //&& g.result.winner !== undefined
  return games
}

const doSection = function (section) {
  // Include the section's own tables and all subsections.
  let tables = [section, ...section.children()].flatMap((s) => s.tables())
  //try to find a game log template
  if (tables.length === 0) {
    tables =
      section.templates('mlb game log section') ||
      section.templates('mlb game log month') ||
      section.templates('game log section')
    tables = tables.map((m) => m.json().data) //make it look like a table
  } else {
    tables = tables.map((t) => t.keyValue())
  }
  return tables
}

//get games of regular season
const gameLog = function (doc) {
  games = addWinner(games)
  return games
}

const postSeason = function (doc) {
  const series = []
  //ok, try postseason, too
  const section =
    doc.section('postseason game log') || doc.section('postseason') || doc.section('playoffs') || doc.section('playoff')
  if (!section) {
    return series
  }
  const tables = doSection(section)
  tables.forEach((table) => {
    const arr = doTable(table)
    series.push(arr)
  })
  //tag them as postseason
  // games.forEach((g) => g.postSeason = true)
  series.forEach((games) => addWinner(games))
  return series
}
export const season = gameLog
export const postseason = postSeason
