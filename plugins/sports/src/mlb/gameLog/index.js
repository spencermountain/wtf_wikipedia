import parseGame from './parseGame.js'
import addWinner from './winner.js'

const doTable = function (rows = []) {
  let games = []
  //is it a legend/junk table?
  if (rows[1] && rows[1].Legend) {
    return games
  }
  rows.forEach(row => {
    games.push(parseGame(row))
  })
  //remove empty weird ones
  games = games.filter((g) => g.team && g.date) //&& g.result.winner !== undefined
  return games
}

const doSection = function (section) {
  let tables = section.tables()
  //do all subsections, too
  section.children().forEach(s => {
    tables = tables.concat(s.tables())
  })
  //try to find a game log template
  if (tables.length === 0) {
    tables = section.templates('mlb game log section') || section.templates('mlb game log month')
    tables = tables.map((m) => m.data) //make it look like a table
  } else {
    tables = tables.map((t) => t.keyValue())
  }
  return tables
}

//get games of regular season
const gameLog = function (doc) {
  let games = []
  // grab the generated section called 'Game Log'
  let section = doc.sections('game log') || doc.sections('game log and schedule') || doc.sections('regular season') || doc.sections('season')
  section = section[0]
  if (!section) {
    console.warn('no game log section for: \'' + doc.title() + '\'')
    return games
  }
  let tables = doSection(section)
  tables.forEach((table) => {
    let arr = doTable(table.data)
    games = games.concat(arr)
  })
  games = addWinner(games)
  return games
}

const postSeason = function (doc) {
  let series = []
  //ok, try postseason, too
  let section = doc.sections('postseason game log') || doc.sections('postseason') || doc.sections('playoffs') || doc.sections('playoff')
  section = section[0]
  if (!section) {
    return series
  }
  let tables = doSection(section)
  tables.forEach((table) => {
    let arr = doTable(table)
    series.push(arr)
  })
  //tag them as postseason
  // games.forEach((g) => g.postSeason = true)
  series.forEach((games) => addWinner(games))
  return series
}
export const season = gameLog
export const postseason = postSeason
