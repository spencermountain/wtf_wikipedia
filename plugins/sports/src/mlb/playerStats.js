
//
const playerStats = function (doc) {
  let players = []
  let s = doc.sections('player stats') || doc.sections('player statistics') || doc.sections('statistics')
  s = s[0]
  if (!s) {
    return players
  }

  s.children().forEach((c) => {
    c.tables().forEach((t) => {
      players = players.concat(t.keyValue())
    })
  })
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
