//who knows!
import playerStats from './playerStats.js'
import { season as _season, postseason } from './gameLog/index.js'

function parseTitle (season = '') {
  let num = season.match(/[0-9]+/) || []
  let year = Number(num[0]) || season
  let team = season.replace(/[0-9–]+/, '').replace(/_/g, ' ').replace(' season', '')
  return {
    year: year,
    season: season,
    team: team.trim()
  }
}

//this is just a table in a 'roster' section
function parseRoster (doc, res) {
  let s = doc.sections('roster') || doc.sections('players') || doc.sections(res.year + ' roster')
  s = s[0]
  if (!s) {
    return {}
  }
  let players = s.templates('mlbplayer') || []
  players = players.map(o => {
    delete o.template
    return o
  })
  return players
}

//this is just a table in a '2008 draft picks' section
function draftPicks (doc) {
  let want = /\bdraft\b/i
  let s = doc.sections().find(sec => want.test(sec.title()))
  if (!s) {
    return []
  }
  let table = s.tables()[0]
  if (!table) {
    return []
  }
  return table.json()
}

//grab game-data from a MLB team's wikipedia page:
function parsePage (doc) {
  if (!doc) {
    return {}
  }
  let res = parseTitle(doc.title() || '')
  res.games = _season(doc)
  res.postseason = postseason(doc)
  //grab the roster/draft data
  res.roster = parseRoster(doc, res)
  res.draftPicks = draftPicks(doc)
  //get the per-player statistics
  res.playerStats = playerStats(doc)
  return res
}
export default parsePage
