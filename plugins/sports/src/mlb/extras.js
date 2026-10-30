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
  const seen = new Set()
  const sections = []
  const addTree = function (section) {
    withChildren(doc, section).forEach((c) => {
      if (seen.has(c.index()) === false) {
        seen.add(c.index())
        sections.push(c)
      }
    })
  }
  let main = findSection(doc, ['statistics', 'player stats', 'player statistics'])
  // looser fallback - 'Final Regular Season Statistics' and friends
  main = main || doc.sections().find((s) => /\b(statistics|stats)\b/i.test(s.title())) || null
  if (main) {
    addTree(main)
  }
  // 'Batting' and 'Pitching' sometimes stand alone, outside any stats section
  doc.sections().forEach((s) => {
    if (/^(batting|pitching)$/i.test(s.title().trim()) && seen.has(s.index()) === false) {
      addTree(s)
    }
  })
  sections.forEach((c) => {
    // the section title usually says which kind of table this is -
    // pitching tables also have hr/rbi columns, so titles beat the key-check
    let kind = null
    if (/pitch/i.test(c.title())) {
      kind = 'pitchers'
    } else if (/bat|hit/i.test(c.title())) {
      kind = 'batters'
    }
    const rows = c.tables().flatMap((t) => t.rows())
    rows.forEach((p) => {
      if (kind) {
        res[kind].push(p)
      } else if (p.rbi !== undefined || p.hr !== undefined || p.RBI !== undefined || p.HR !== undefined) {
        res.batters.push(p)
      } else {
        res.pitchers.push(p)
      }
    })
  })
  return res
}

export { parseRoster, parseDraftPicks, parsePlayerStats }
