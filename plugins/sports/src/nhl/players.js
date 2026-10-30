import { findSection, getCell, stripNotes, withChildren } from '../_lib.js'

const asNum = (val) => Number(String(val).replace(/[−–]/, '-')) || 0

const playerName = function (row) {
  let name = getCell(row, ['player', 'name'])
  return stripNotes(name)
}

const notTotal = (p) => p.name && /^totals?$/i.test(p.name) === false

// the 'Skaters' table - games, goals, assists, points
const parseSkaters = function (doc) {
  const s = findSection(doc, ['skaters', 'roster', 'player statistics', 'player stats'])
  if (!s) {
    return []
  }
  const tables = withChildren(doc, s).flatMap((c) => c.tables())
  if (!tables[0]) {
    return []
  }
  const players = tables[0].rows().map((row) => {
    return {
      name: playerName(row),
      games: asNum(getCell(row, ['gp'])),
      goals: asNum(getCell(row, ['g', 'goals'])),
      assists: asNum(getCell(row, ['a', 'assists'])),
      points: asNum(getCell(row, ['pts', 'points'])),
      plusMinus: asNum(getCell(row, ['+/−', '+/-'])),
    }
  })
  return players.filter(notTotal)
}

// the 'Goaltenders' table - wins, losses, save-percentage
const parseGoalies = function (doc) {
  const s = findSection(doc, ['goaltenders', 'goalies', 'goaltending'])
  if (!s) {
    return []
  }
  const table = s.tables()[0]
  if (!table) {
    return []
  }
  const players = table.rows().map((row) => {
    return {
      name: playerName(row),
      games: asNum(getCell(row, ['gp', 'games'])),
      wins: asNum(getCell(row, ['w', 'wins'])),
      losses: asNum(getCell(row, ['l', 'losses'])),
      otLosses: asNum(getCell(row, ['ot', 'otl'])),
      goalsAgainstAvg: asNum(getCell(row, ['gaa'])),
      savePct: asNum(getCell(row, ['sv%', 'sv', 'save %'])),
      shutouts: asNum(getCell(row, ['so'])),
    }
  })
  return players.filter(notTotal)
}

export { parseSkaters, parseGoalies }
