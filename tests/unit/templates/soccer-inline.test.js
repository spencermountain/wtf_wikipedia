import test from 'tape'
import wtf from '../../lib/index.js'

// inline templates from club-season pages
const check = (t, cases) => {
  cases.forEach(([input, want]) => {
    t.equal(wtf(input).text(), want, input)
  })
}

test('flagg modes', (t) => {
  check(t, [
    ['{{flagg|unce|ESP}}', '🇪🇸 Spain'], //'n' shows the name, 'u' unlinked
    ['{{flagg|cxxlo|ENG}}', '🏴󠁧󠁢󠁥󠁮󠁧󠁿'], //icon-only mode
    ['{{flagg|ulc|NED}}', '🇳🇱'],
  ])
  t.end()
})

test('football association icon', (t) => {
  check(t, [['{{fbaicon|ENG}}', '🏴󠁧󠁢󠁥󠁮󠁧󠁿']])
  t.end()
})

test('sentoff alias', (t) => {
  check(t, [
    ['{{sentoff|2|38|45+4}}', "sent off: 38', 45+4'"],
    ['{{sent off|1|37}}', "sent off: 37'"],
  ])
  t.end()
})

test('result-summary cells', (t) => {
  check(t, [
    ["{{WinDL|'''5'''–0 (H)}}", '5–0 (H)'], //keeps the score text
    ['{{won|1st|place=1}}', '1st'],
    ['{{won}}', 'Won'],
    ['{{loss}}', 'Loss'],
  ])
  t.end()
})
