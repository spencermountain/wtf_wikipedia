import { findSection, getCell, stripNotes, withChildren } from '../_lib.js'

const asNum = (val) => Number(String(val).replace(/[*†‡]/g, '')) || 0

const notTotal = (p) => p.name && /^totals?$/i.test(p.name) === false

// {{player2}} and wnba's {{sports roster/entry}} share their field names
const rosterRow = function (data = {}) {
  const num = parseInt(data.num, 10)
  return {
    number: isNaN(num) ? null : num,
    name: [data.first, data.last].filter(Boolean).join(' '),
    position: data.pos || '',
    height: data.ft ? `${data.ft}'${data.in || 0}"` : '',
    weight: parseInt(data.lbs, 10) || null,
    college: data.college || '',
    dob: data.dob || '',
    nation: data.nat || '',
  }
}

// the roster is {{player2}} templates in a 'Roster' section
const parseRoster = function (doc) {
  const s = findSection(doc, ['roster', 'current roster'])
  if (!s) {
    return []
  }
  const players = withChildren(doc, s).flatMap((c) => c.templates('player2'))
  return players.map((tmpl) => rosterRow(tmpl.json().data)).filter((p) => p.name)
}

// per-player averages from the 'Player statistics' tables
const statRow = function (row) {
  return {
    name: stripNotes(getCell(row, ['player', 'name'])),
    games: asNum(getCell(row, ['gp', 'g', 'games'])),
    gamesStarted: asNum(getCell(row, ['gs'])),
    minutesPerGame: asNum(getCell(row, ['mpg', 'mp'])),
    reboundsPerGame: asNum(getCell(row, ['rpg', 'reb'])),
    assistsPerGame: asNum(getCell(row, ['apg', 'ast'])),
    stealsPerGame: asNum(getCell(row, ['spg', 'stl'])),
    blocksPerGame: asNum(getCell(row, ['bpg', 'blk'])),
    pointsPerGame: asNum(getCell(row, ['ppg', 'pts'])),
  }
}

const parsePlayerStats = function (doc) {
  const res = { season: [], playoffs: [] }
  const s = findSection(doc, ['player statistics', 'player stats', 'statistics'])
  if (!s) {
    return res
  }
  withChildren(doc, s).forEach((c) => {
    const kind = /playoff|postseason/i.test(c.title()) ? 'playoffs' : 'season'
    c.tables().forEach((t) => {
      t.rows().forEach((row) => {
        const p = statRow(row)
        if (notTotal(p)) {
          res[kind].push(p)
        }
      })
    })
  })
  return res
}

export { parseRoster, parsePlayerStats, rosterRow }
