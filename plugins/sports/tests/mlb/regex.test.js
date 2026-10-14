import test from 'tape'
import parseGame from '../../src/mlb/gameLog/parseGame.js'

test('pitcher annotations retain the original first-closing-parenthesis behavior', (t) => {
  const row = parseGame({ Win: 'Name (outer (inner))', Loss: 'Name (1) (2)', Save: 'Name\n(note)' })
  t.deepEqual(row.pitchers, { win: 'Name )', loss: 'Name  (2)', save: 'Name' })
  const long = 'Name ' + '('.repeat(100000)
  t.equal(parseGame({ Win: long }).pitchers.win, long, 'unclosed annotation is preserved')
  t.end()
})
