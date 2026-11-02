import test from 'tape'
import wtf from './_lib.js'
import parseDate from '../src/parseDate.js'

test('sentence: born after a pronunciation', (t) => {
  const doc = wtf(`'''Wayne Gretzky''' CC (/ˈɡrɛtski/; born January 26, 1961) is a Canadian former hockey player.`)
  t.deepEqual(doc.birthDate(), { year: 1961, month: 0, date: 26 }, 'birth date found')
  t.end()
})

test('sentence: tight year ranges', (t) => {
  let doc = wtf(`'''Old Guy''' (1625–1696) was a leader.`)
  t.deepEqual(doc.birthDate(), { year: 1625 }, 'tight en-dash birth')
  t.deepEqual(doc.deathDate(), { year: 1696 }, 'tight en-dash death')
  doc = wtf(`'''Old Guy''' (1625-1696) was a leader.`)
  t.deepEqual(doc.birthDate(), { year: 1625 }, 'tight hyphen birth')
  doc = wtf(`'''David Jones''' (8 January 1947 - 10 January 2016) was a musician.`)
  t.equal(doc.birthDate().year, 1947, 'spaced hyphen birth')
  t.equal(doc.deathDate().year, 2016, 'spaced hyphen death')
  // a birth-year range is not a lifespan
  doc = wtf(`'''Ancient Guy''' (183–181 BC) was a philosopher.`)
  t.equal(doc.deathDate(), null, 'BC birth-range is not split into birth/death')
  t.end()
})

test('infobox: param aliases', (t) => {
  let doc = wtf(`{{Infobox person|name=X|birthdate={{birth date|1950|3|4}}|birthplace=[[Toronto]]}}`)
  t.deepEqual(doc.birthDate(), { year: 1950, month: 2, date: 4 }, 'birthdate')
  t.equal(doc.birthPlace(), 'Toronto', 'birthplace')
  doc = wtf(`{{Infobox person|name=X|born={{birth date|1950|3|4}}|died=February 7, 2015|deathplace=[[Paris]]}}`)
  t.deepEqual(doc.birthDate(), { year: 1950, month: 2, date: 4 }, 'born')
  t.deepEqual(doc.deathDate(), { year: 2015, month: 1, date: 7 }, 'died')
  t.equal(doc.deathPlace(), 'Paris', 'deathplace')
  t.end()
})

test('infobox: underscored type names', (t) => {
  const doc = wtf(`{{Infobox prime_minister|name=X|birth_date={{birth date|1950|3|4}}}}`)
  t.deepEqual(doc.birthDate(), { year: 1950, month: 2, date: 4 }, 'prime_minister → prime minister')
  t.end()
})

test('parseDate: year-only has no month/date', (t) => {
  t.deepEqual(parseDate('1956'), { year: 1956 }, 'plain year')
  t.deepEqual(parseDate('c. 1155'), { year: 1155 }, 'circa year')
  t.deepEqual(parseDate('356 BC'), { year: -356 }, 'BC year')
  t.end()
})
