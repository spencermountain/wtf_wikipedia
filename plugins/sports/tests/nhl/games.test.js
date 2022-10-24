import test from 'tape'
import wtf from '../_lib.js'

// TODO: Cannot Pass
test.skip('Washington Nationals 2017', (t) => {
  wtf.nhlSeason('Toronto Maple Leafs', 2017).then((res) => {
    let data = res.games
    t.notEqual(data[0].date, null, 'has game-0-date')
    // t.equal(data.length, 170, 'has 162 games') //+ rain outs?
    t.ok(data.length > 70, 'has atleast 70 games') //+ rain outs?
    // t.equal(data[data.length - 1].record.wins, 97, 'got last record wins')
    // t.equal(data[data.length - 1].record.losses, 65, 'got last record losses')
    // t.equal(data[data.length - 1].record.games, 162, 'got last record games')
    // t.equal(data[data.length - 1].attendance, 35652, 'got last attendance')
    // t.equal(data[data.length - 1].date, 'October 1', 'got last date')
    t.end()
  })
})
