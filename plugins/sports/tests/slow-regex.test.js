import test from 'tape'
import wtf from './_lib.js'

const MAX_MS = 1000
const LINE_SEPARATOR = String.fromCharCode(0x2028)

const season = (cell) =>
  wtf(`== Regular season ==\n{|\n! Date !! Opponent !! Score !! Record\n|-\n| October 5 || ${cell} || 3–2 || 1–0–0\n|}\n`)

test('opponent names lose their suffixes', (t) => {
  const arr = [
    ['@ Boston Bruins', 'Boston Bruins'],
    ['Boston Bruins (2002–03)', 'Boston Bruins'],
    ['at Boston Bruins (2002)', 'Boston Bruins'],
    ['Boston Bruins 6:05pm (ESPN)', 'Boston Bruins'],
    ['Boston Bruins 6:05 p.m.', 'Boston Bruins'],
    ['[[Texas Rangers (baseball)|Texas]]', 'Texas Rangers'],
    ['[[Foo (a) (b)|Foo]]', 'Foo'],
    ['[[2002–03 Boston Bruins season|Boston]]', 'Boston Bruins'],
    ['[[Plain Team|Plain]]', 'Plain Team'],
  ]
  arr.forEach(([cell, want]) => {
    t.equal(season(cell).nhlSeason().games[0].opponent, want, cell)
  })
  t.end()
})

test('a long opponent cell takes linear time', (t) => {
  const arr = [
    ['(1234 ', `${'(1234 '.repeat(32000)})x`],
    [' 1:23am, then a line separator', `a${' 1:23am'.repeat(32000)}${LINE_SEPARATOR}x`],
  ]
  arr.forEach(([label, cell]) => {
    const doc = season(cell)
    const begin = Date.now()
    doc.nhlSeason()
    const ms = Date.now() - begin
    t.ok(ms < MAX_MS, `${label} took ${ms}ms`)
  })
  t.end()
})

test('many matching sections take linear time', (t) => {
  const arr = [
    ['game log', '===game log===\n'.repeat(30000), (doc) => doc.nhlSeason()],
    ['transactions', '==transactions==\n'.repeat(30000), (doc) => doc.nhlSeason()],
    ['results', '===results===\n'.repeat(30000), (doc) => doc.eplSeason()],
    ['cups', '==FA Cup==\n'.repeat(30000), (doc) => doc.eplSeason()],
  ]
  arr.forEach(([label, str, run]) => {
    const doc = wtf(str)
    const begin = Date.now()
    run(doc)
    const ms = Date.now() - begin
    t.ok(ms < 3000, `${label} took ${ms}ms`)
  })
  t.end()
})
