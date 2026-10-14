import test from 'tape'
import wtf from '../../lib/index.js'
import { readPage } from '../../_examples/index.js'

test('The-Starry-Night-Sv', (t) => {
  const doc = wtf(readPage('The-Starry-Night-Sv'))
  t.match(doc.text(), /Stjärnenatt/, 'The-Starry-Night-Sv: Swedish painting title')
  t.match(doc.text(), /1889/, 'The-Starry-Night-Sv: year of creation')
  t.ok(
    doc.links().some((link) => link.page() === 'Vincent van Gogh'),
    'The-Starry-Night-Sv: artist link'
  )
  t.ok(doc.section('Kronologi').list(), 'The-Starry-Night-Sv: ownership chronology')
  t.ok(doc.references().length > 0, 'The-Starry-Night-Sv: art history sources')
  t.ok(doc.section('Historik och tema'), 'The-Starry-Night-Sv: Historik och tema section')
  t.ok(doc.links().some((link) => link.page() === 'Museum of Modern Art'), 'The-Starry-Night-Sv: museum collection link')
  t.end()
})

test('Toronto-Sv', (t) => {
  const doc = wtf(readPage('Toronto-Sv'))
  t.match(doc.text(), /Toronto/, 'Toronto-Sv: city name')
  t.ok(
    doc.links().some((link) => link.page() === 'Ontario'),
    'Toronto-Sv: province link'
  )
  t.ok(doc.section('Historia'), 'Toronto-Sv: Swedish history heading')
  t.match(doc.text(), /CN Tower/, 'Toronto-Sv: city landmark')
  t.ok(doc.references().length > 0, 'Toronto-Sv: city sources')
  t.ok(doc.infoboxes().some((box) => box.get('category').text() === 'Stad'), 'Toronto-Sv: category field')
  t.ok(doc.categories().includes('Orter i Ontario'), 'Toronto-Sv: Orter i Ontario category')
  t.end()
})
