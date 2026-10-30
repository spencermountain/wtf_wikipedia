import { withChildren, findSection } from '../_lib.js'

//
const playerStats = function (doc) {
  let players = []
  const s = findSection(doc, ['player stats', 'player statistics', 'statistics'])
  if (!s) {
    return players
  }
  players = withChildren(doc, s).flatMap((c) => c.tables().flatMap((t) => t.rows()))
  const res = {
    batters: [],
    pitchers: [],
  }
  players.forEach((p) => {
    const rbi = p.RBI || p.rbi
    const hr = p.HR || p.hr
    if (rbi !== undefined || hr !== undefined) {
      res.batters.push(p)
    } else {
      res.pitchers.push(p)
    }
  })
  return res
}
export default playerStats
