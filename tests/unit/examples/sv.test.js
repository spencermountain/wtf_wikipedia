import test from 'tape'
import wtf from '../../lib/index.js'
import { readPage } from '../../_examples/index.js'

test('The-Starry-Night-Sv', (t) => {
  const doc = wtf(readPage('The-Starry-Night-Sv'))
  t.match(doc.text(), /Stjärnenatt/, 'Swedish painting title')
  t.match(doc.text(), /1889/, 'year of creation')
  t.ok(
    doc.links().some((link) => link.page() === 'Vincent van Gogh'),
    'artist link'
  )
  t.ok(doc.section('Kronologi').list(), 'ownership chronology')
  t.ok(doc.references().length > 0, 'art history sources')
  t.end()
})

test('Toronto-Sv', (t) => {
  const doc = wtf(readPage('Toronto-Sv'))
  t.match(doc.text(), /Toronto/, 'city name')
  t.ok(
    doc.links().some((link) => link.page() === 'Ontario'),
    'province link'
  )
  t.ok(doc.section('Historia'), 'Swedish history heading')
  t.match(doc.text(), /CN Tower/, 'city landmark')
  t.ok(doc.references().length > 0, 'city sources')
  t.end()
})
