import rowGroups from './rows.js'
import buildGame from './game.js'

// candidate sections in title-priority order - pages can have
// a prose 'Regular season' section besides the real schedule one
const findSections = function (doc, titles) {
  const all = doc.sections()
  const found = []
  titles.forEach((title) => {
    const want = title.toLowerCase()
    all.forEach((s) => {
      if (s.title().trim().toLowerCase() === want) {
        found.push(s)
      }
    })
  })
  return found
}

// without row styling, a changing record column still reveals each outcome
const inferFromRecord = function (games) {
  let prev = { wins: 0, losses: 0, ties: 0, otLosses: 0 } //seasons and series start 0–0
  games.forEach((g) => {
    const rec = g.record
    if (g.outcome === null && rec) {
      if (rec.wins > prev.wins) {
        g.outcome = 'win'
      } else if (rec.otLosses !== undefined && rec.otLosses > (prev.otLosses || 0)) {
        g.outcome = 'otl'
      } else if (rec.ties !== undefined && rec.ties > (prev.ties || 0)) {
        g.outcome = 'tie'
      } else if (rec.losses > prev.losses) {
        g.outcome = 'loss'
      }
    }
    prev = rec || prev
  })
  return games
}

// once the outcome is known, un-oriented scores can be fixed-up
const orientScores = function (games) {
  games.forEach((g) => {
    if (g.result && g.outcome) {
      const { us, them } = g.result
      if (g.outcome === 'win' && us < them) {
        g.result = { us: them, them: us }
      }
      if ((g.outcome === 'loss' || g.outcome === 'otl') && us > them) {
        g.result = { us: them, them: us }
      }
    }
    if (g.outcome === null || g.outcome === 'postponed') {
      g.win = null
    } else {
      g.win = g.outcome === 'win'
    }
  })
  return games
}

const buildGroup = function (rows, ctx) {
  const games = rows.map((row) => buildGame(row, ctx))
  return games.filter((g) => g !== null)
}

// infer missing outcomes over a whole run of games, so records carry across tables
const finish = (games) => orientScores(inferFromRecord(games))

// subsections that live under a 'Game log' but are not regular-season games
const notRegularSeason = /postseason|playoff|world series|championship|division series|wild card|detailed record|composite box|month.by.month/i

// all games under the best matching section, in one flat list
const findGames = function (doc, ctx, titles) {
  for (const section of findSections(doc, titles)) {
    const games = rowGroups(doc, section, notRegularSeason).flatMap((rows) => buildGroup(rows, ctx))
    if (games.length > 0) {
      return finish(games)
    }
  }
  return []
}

// keep each table/template separate - a group per playoff series
const findSeries = function (doc, ctx, titles) {
  for (const section of findSections(doc, titles)) {
    const series = rowGroups(doc, section)
      .map((rows) => finish(buildGroup(rows, ctx)))
      .filter((games) => games.length > 0)
    if (series.length > 0) {
      return series
    }
  }
  return []
}

export { findGames, findSeries }
