import rowGroups from './rows.js'
import buildGame from './game.js'

// candidate sections in title-priority order - pages can have
// a prose 'Regular season' section besides the real schedule one
const findSections = function (doc, titles, exclude) {
  const all = doc.sections()
  const found = []
  const seen = new Set()
  const addMatches = function (want, loose) {
    all.forEach((s) => {
      const title = s.title().trim().toLowerCase()
      const hit = loose ? title.includes(want) : title === want
      if (hit && seen.has(s.index()) === false) {
        if (exclude && exclude.test(title)) {
          return
        }
        seen.add(s.index())
        found.push(s)
      }
    })
  }
  titles.forEach((title) => addMatches(title.toLowerCase(), false))
  // a looser pass - 'Game log and schedule' still counts as 'game log'
  titles.forEach((title) => addMatches(title.toLowerCase(), true))
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

// subsections or log-titles that are not regular-season games
const postseasonish = /postseason|playoff|world series|championship|division series|wild card/i
const notRegularSeason =
  /postseason|playoff|world series|championship|division series|wild card|detailed record|composite box|month.by.month/i

// all games under the best matching section, in one flat list
const findGames = function (doc, ctx, titles) {
  for (const section of findSections(doc, titles, notRegularSeason)) {
    const groups = rowGroups(doc, section, notRegularSeason).filter((g) => notRegularSeason.test(g.title) === false)
    const games = groups.flatMap((g) => buildGroup(g.rows, ctx))
    if (games.length > 0) {
      return finish(games)
    }
  }
  return []
}

// keep each table/template separate - a group per playoff series
const findSeries = function (doc, ctx, titles, gameTitles) {
  for (const section of findSections(doc, titles)) {
    const series = rowGroups(doc, section)
      .map((g) => finish(buildGroup(g.rows, ctx)))
      .filter((games) => games.length > 0)
    if (series.length > 0) {
      return series
    }
  }
  // some pages keep the postseason logs inside the main game-log section
  for (const section of findSections(doc, gameTitles || [])) {
    const groups = rowGroups(doc, section).filter((g) => postseasonish.test(g.title))
    const series = groups.map((g) => finish(buildGroup(g.rows, ctx))).filter((games) => games.length > 0)
    if (series.length > 0) {
      return series
    }
  }
  return []
}

export { findGames, findSeries }
