var test = require('tape')
var wtf = require('./_lib')
var teams = require('../src/teams')

const doTeam = function (i, t, cb) {
  let team = teams[i]
  wtf
    .teamHistory(team, 1988, 2018)
    .catch(console.log)
    .then((seasons) => {
      seasons = seasons.sort((a, b) => (a.year < b.year ? -1 : 1))
      t.equal(seasons.length, 31, team + ' -found all seasons')
      seasons.forEach((season) => {
        t.ok(
          season.games.length > 110,
          `${season.year}-${team}  - found ${season.games.length} games`
        )
        t.ok(
          season.roster.length > 40,
          `${season.year}-${team}  - found ${season.roster.length} players`
        )
      })
      i += 1
      if (teams[i]) {
        doTeam(i, t, cb)
      } else {
        cb()
      }
    })
}

test('past 7 years', (t) => {
  doTeam(0, t, () => {
    t.end()
  })
})
