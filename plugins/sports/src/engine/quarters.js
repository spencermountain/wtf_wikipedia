import { getCell, withChildren } from '../_lib.js'
import { findSections } from './games.js'
import { fromTable } from './rows.js'
import { sameTeam } from './game.js'

// older cfl pages record each playoff game as a two-row quarter-score box:
//   ! Team !! Q1 !! Q2 !! Q3 !! Q4 !! Total
const buildQuarterGame = function (rows, ctx, round) {
  if (rows.length !== 2) {
    return null
  }
  const names = rows.map((r) => String(getCell(r.cells, ['team', 'teams'])).trim())
  const totals = rows.map((r) => parseInt(String(getCell(r.cells, ['total', 'final'])).replace(/[^0-9]/g, ''), 10))
  if (!names[0] || !names[1] || isNaN(totals[0]) || isNaN(totals[1])) {
    return null
  }
  const us = rows.findIndex((r, i) => sameTeam(names[i], ctx.team))
  if (us === -1) {
    return null
  }
  const them = us === 0 ? 1 : 0
  const game = {
    date: '', //quarter boxes carry no date
    opponent: ctx.fullName ? ctx.fullName(names[them]) : names[them],
    home: null,
    outcome: totals[us] > totals[them] ? 'win' : 'loss',
    result: { us: totals[us], them: totals[them] },
    overtime: false,
  }
  if (totals[us] === totals[them]) {
    game.outcome = 'tie'
  }
  game.win = game.outcome === 'win'
  if (round) {
    game.round = round
  }
  return game
}

// one game per quarter-box under the section, titled by its subsection
const findQuarterGames = function (doc, ctx, titles) {
  for (const section of findSections(doc, titles)) {
    const games = []
    withChildren(doc, section).forEach((s) => {
      const round = s.index() === section.index() ? '' : s.title()
      s.tables().forEach((t) => {
        const game = buildQuarterGame(fromTable(t), ctx, round)
        if (game !== null) {
          games.push(game)
        }
      })
    })
    if (games.length > 0) {
      return games
    }
  }
  return []
}

export default findQuarterGames
