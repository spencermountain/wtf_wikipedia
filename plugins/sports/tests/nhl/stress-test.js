/* eslint-disable no-console */
import test from 'tape'
import wtf from '../_lib.js'
import teams from '../../src/nhl/teams.js'

const doTeam = async function (i, t, cb) {
  let team = teams[i]
  await wtf.nhlSeason(team, 2017)
    .catch(console.log)
    .then((season) => {
      t.ok(season.games.length > 110, `${season.year}-${team}  - found ${season.games.length} games`)
      t.ok(season.roster.length > 40, `${season.year}-${team}  - found ${season.roster.length} players`)
    })
  i += 1
  if (teams[i]) {
    doTeam(i, t, cb)
  } else {
    cb()
  }
}

test('past 7 years', (t) => {
  doTeam(0, t, () => {
    t.end()
  })
})
