import { findSection, withChildren } from '../_lib.js'

// the roster is {{MLBplayer}} templates in a 'Roster' section
const parseRoster = function (doc, year) {
  const s = findSection(doc, ['roster', 'players', `${year} roster`])
  if (!s) {
    return []
  }
  const players = withChildren(doc, s).flatMap((c) => c.templates('mlbplayer'))
  return players.map((tmpl) => ({ ...tmpl.json().data }))
}

// a table in a '2008 draft picks' section
const parseDraftPicks = function (doc) {
  const s = doc.sections().find((sec) => /\bdraft\b/i.test(sec.title()))
  if (!s) {
    return []
  }
  const table = s.tables()[0]
  if (!table) {
    return []
  }
  return table.json()
}

// batting + pitching tables, split by their columns
const parsePlayerStats = function (doc) {
  const res = { batters: [], pitchers: [] }
  const s = findSection(doc, ['statistics', 'player stats', 'player statistics'])
  if (!s) {
    return res
  }
  const rows = withChildren(doc, s).flatMap((c) => c.tables().flatMap((t) => t.rows()))
  rows.forEach((p) => {
    if (p.rbi !== undefined || p.hr !== undefined || p.RBI !== undefined || p.HR !== undefined) {
      res.batters.push(p)
    } else {
      res.pitchers.push(p)
    }
  })
  return res
}

export { parseRoster, parseDraftPicks, parsePlayerStats }
