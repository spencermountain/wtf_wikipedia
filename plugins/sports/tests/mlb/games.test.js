import test from 'tape'
import wtf from '../_lib.js'

process.setMaxListeners(0);

// TODO: Cannot Pass
test.skip('Washington Nationals 2017', (t) => {
  wtf.mlbSeason('Washington Nationals', 2017)
    .catch(console.log)
    .then((res) => {
      var data = res.games
      t.notEqual(data[0].date, null, 'has game-0-date')
      // t.equal(data.length, 170, 'has 162 games') //+ rain outs?
      t.ok(data.length > 161, 'has atleast 161 games') //+ rain outs?
      t.equal(data[data.length - 1].record.wins, 97, 'got last record wins')
      t.equal(data[data.length - 1].record.losses, 65, 'got last record losses')
      t.equal(data[data.length - 1].record.games, 162, 'got last record games')
      t.equal(data[data.length - 1].attendance, 35652, 'got last attendance')
      t.equal(data[data.length - 1].date, 'October 1', 'got last date')
      t.end()
    })
})

// TODO: Cannot Pass
test.skip('Blue Jays 2016', (t) => {
  wtf.mlbSeason('Blue Jays', 2016)
    .catch(console.log)
    .then((res) => {
      var data = res.games
      t.equal(data[0].date, 'April 3', 'has game-0-date')
      t.equal(data[0].win, true, 'has game-0-win')
      // t.equal(data.length, 170, 'has 162 games') //+ rain outs?
      t.ok(data.length > 161, 'has atleast 161 games') //+ rain outs?
      t.equal(data[data.length - 1].record.wins, 89, 'got last record')
      t.equal(data[data.length - 1].record.losses, 73, 'got last record')
      t.equal(data[data.length - 1].attendance, 36787, 'got last attendance')
      t.equal(data[data.length - 1].date, 'October 2', 'got last date')
      t.end()
    })
})

// TODO: Cannot Pass
test.skip('New York Mets 2017', (t) => {
  wtf.mlbSeason('New York Mets', 2017)
    .catch(console.log)
    .then((res) => {
      var data = res.games
      t.equal(data[0].date, 'April 3', 'has game-0-date')
      t.equal(data[0].win, true, 'has game-0-win')
      t.equal(data[0].result.them, 0, 'has game-0-score')
      t.equal(data[0].attendance, 44384, 'has game-0-attendance')
      // t.equal(data.length, 170, 'has 162 games') //+ rain outs?
      t.ok(data.length > 161, 'has atleast 161 games') //+ rain outs?
      t.end()
    })
})
