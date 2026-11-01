import { withChildren } from '../_lib.js'
import { parseScore, sameTeam, parseAttendance } from './game.js'

// soccer seasons record each match as a {{football box}} template, not a table row
const boxNames = ['football box collapsible', 'footballbox collapsible', 'football box', 'footballbox']

// every match-box under a section, with a `skip` regex dropping matching subtrees
const collectBoxes = function (doc, section, skip) {
  const boxes = []
  let skipBelow = null
  withChildren(doc, section).forEach((s, i) => {
    if (i > 0 && skip) {
      if (skipBelow !== null && s.depth() > skipBelow) {
        return
      }
      skipBelow = null
      if (skip.test(s.title())) {
        skipBelow = s.depth()
        return
      }
    }
    boxNames.forEach((name) => {
      s.templates(name).forEach((t) => boxes.push(t.json().data || {}))
    })
  })
  return boxes
}

const outcomes = { w: 'win', l: 'loss', d: 'tie', t: 'tie' }

// one {{football box}} → one game
const buildMatch = function (data, ctx) {
  if (!data.team1 && !data.team2) {
    return null
  }
  const game = {
    date: ctx.dateYear ? ctx.dateYear(data.date || '', ctx.year) : data.date || '',
    opponent: '',
    home: null,
    outcome: outcomes[String(data.result || '').trim().toLowerCase()] || null,
    result: null,
  }
  // team1 is the home side
  if (sameTeam(data.team1, ctx.team)) {
    game.home = true
  } else if (sameTeam(data.team2, ctx.team)) {
    game.home = false
  }
  const opp = game.home === false ? data.team1 : data.team2
  game.opponent = ctx.fullName ? ctx.fullName(String(opp || '').trim()) : String(opp || '').trim()
  const score = parseScore(data.score)
  if (score && game.home !== null) {
    game.result = game.home ? { us: score[0], them: score[1] } : { us: score[1], them: score[0] }
    if (game.outcome === null && score[0] !== score[1]) {
      game.outcome = game.result.us > game.result.them ? 'win' : 'loss'
    }
    if (game.outcome === null && score[0] === score[1]) {
      game.outcome = 'tie'
    }
  }
  game.win = game.outcome === null ? null : game.outcome === 'win'
  if (data.round) {
    game.round = data.round
  }
  if (data.stadium) {
    game.stadium = data.stadium
  }
  if (data.location) {
    game.location = data.location
  }
  game.attendance = parseAttendance(data.attendance || '')
  return game
}

// every match-box on the page, with `skip` dropping matching subtrees
const collectAll = function (doc, skip) {
  const boxes = []
  let skipBelow = null
  doc.sections().forEach((s) => {
    if (skip) {
      if (skipBelow !== null && s.depth() > skipBelow) {
        return
      }
      skipBelow = null
      if (skip.test(s.title())) {
        skipBelow = s.depth()
        return
      }
    }
    boxNames.forEach((name) => {
      s.templates(name).forEach((t) => boxes.push(t.json().data || {}))
    })
  })
  return boxes
}

const build = (boxes, ctx) => boxes.map((data) => buildMatch(data, ctx)).filter((g) => g !== null)

// all matches under the best matching section -
// or anywhere on the page, when sections don't nest the way they read
const findMatches = function (doc, ctx, titles, skip) {
  const all = doc.sections()
  for (const title of titles) {
    const want = title.toLowerCase()
    const sections = all.filter((s) => s.title().trim().toLowerCase() === want)
    for (const section of sections) {
      const games = build(collectBoxes(doc, section, skip), ctx)
      if (games.length > 0) {
        return games
      }
    }
  }
  if (skip) {
    return build(collectAll(doc, skip), ctx)
  }
  return []
}

export { findMatches, buildMatch, collectBoxes }
