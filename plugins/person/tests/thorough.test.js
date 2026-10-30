import test from 'tape'
import wtf from './_lib.js'
import parseDate from '../src/parseDate.js'

// note: months are 0-indexed (spacetime convention)
const bio = `{{Infobox person
| name         = Jane Example
| birth_date   = {{birth date|1931|6|24}}
| birth_place  = [[San Diego]], California
| death_date   = {{death date and age|2015|2|7|1931|6|24}}
| death_place  = [[Springville, Utah]]
| nationality  = American
}}
'''Jane Example''' (June 24, 1931 – February 7, 2015) was an American golfer.`

test('infobox person fields', (t) => {
  const doc = wtf(bio)
  t.deepEqual(doc.birthDate(), { year: 1931, month: 5, date: 24 }, 'birth date from infobox')
  t.deepEqual(doc.deathDate(), { year: 2015, month: 1, date: 7 }, 'death date from infobox')
  t.equal(doc.birthPlace(), 'San Diego, California', 'birth place text')
  t.equal(doc.deathPlace(), 'Springville, Utah', 'death place text')
  t.equal(doc.nationality(), 'American', 'nationality')
  t.equal(doc.isAlive(), false, 'has death date → not alive')
  t.end()
})

test('other person infobox types', (t) => {
  const doc = wtf(`{{Infobox baseball biography
| name = Joe
| birth_date = {{birth date|1950|3|4}}
| birth_place = [[Toronto]], Ontario
}}`)
  t.deepEqual(doc.birthDate(), { year: 1950, month: 2, date: 4 }, 'baseball biography birth date')
  t.equal(doc.birthPlace(), 'Toronto, Ontario', 'baseball biography birth place')
  t.equal(doc.deathPlace(), null, 'no death place')
  t.equal(doc.nationality(), null, 'no nationality')
  const notPerson = wtf(`{{Infobox settlement
| name = Springfield
| birth_place = nowhere
}}`)
  t.equal(notPerson.birthPlace(), null, 'non-person infobox ignored')
  t.end()
})

test('first-sentence dates', (t) => {
  let doc = wtf(`'''Ada Lovelace''' (10 December 1815 – 27 November 1852) was an English mathematician.`)
  t.deepEqual(doc.birthDate(), { year: 1815, month: 11, date: 10 }, 'birth from parentheses')
  t.deepEqual(doc.deathDate(), { year: 1852, month: 10, date: 27 }, 'death from parentheses')
  t.equal(doc.isAlive(), false, 'dead')
  doc = wtf(`'''Sam Person''' (born March 3, 1990) is a Canadian runner.`)
  t.deepEqual(doc.birthDate(), { year: 1990, month: 2, date: 3 }, 'born ...')
  t.equal(doc.deathDate(), null, 'no death date')
  doc = wtf(`'''Sam Person''' is a Canadian runner.`)
  t.equal(doc.birthDate(), null, 'no parentheses → null')
  doc = wtf(`'''Sam Person''' (also known as Sammy) is a Canadian runner.`)
  t.equal(doc.birthDate(), null, 'non-date parentheses → null')
  t.end()
})

test('category dates', (t) => {
  const doc = wtf(`Someone. [[Category:1901 births]] [[Category:1970 deaths]]`)
  t.deepEqual(doc.birthDate(), { year: 1901 }, 'births category')
  t.deepEqual(doc.deathDate(), { year: 1970 }, 'deaths category')
  t.equal(doc.isAlive(), false, 'deaths category → not alive')
  t.equal(wtf(`x [[Category:0999 births]]`).birthDate(), null, 'years before 1000 ignored')
  t.end()
})

test('isAlive signals', (t) => {
  t.equal(wtf(`x [[Category:Living people]]`).isAlive(), true, 'Living people')
  t.equal(wtf(`x [[Category:Year of birth missing (living people)]]`).isAlive(), true, 'birth missing (living)')
  t.equal(wtf(`x [[Category:People lost at sea]]`).isAlive(), false, 'lost at sea')
  t.equal(wtf(`x [[Category:Deaths from pneumonia]]`).isAlive(), false, 'deaths from …')
  t.equal(wtf(`{{BLP sources}} x`).isAlive(), true, 'BLP maintenance template')
  t.equal(wtf(`{{Recent death}} x`).isAlive(), false, 'recent death template')
  t.equal(wtf(`{{WikiProject Biography|living=no}}`).isAlive(), false, 'living=no')
  t.equal(wtf(`{{Infobox person|name=X|death_place=[[Paris]]}}`).isAlive(), false, 'death place → not alive')
  t.equal(wtf(`x`).isAlive(), null, 'no signal → null')
  t.equal(wtf(`x [[Category:1990 births]]`).isAlive(), null, 'recent birth alone is not proof')
  t.end()
})

test('isAlive: born long ago means not alive', { todo: true }, (t) => {
  // isAlive() returns true when birth.year < (now - 105); the comparison is inverted
  t.equal(wtf(`x [[Category:1850 births]]`).isAlive(), false, 'born 1850 → not alive')
  t.end()
})

test('parseDate', (t) => {
  t.deepEqual(parseDate('June 24, 1931'), { year: 1931, month: 5, date: 24 }, 'month day, year')
  t.deepEqual(parseDate('24 June 1931'), { year: 1931, month: 5, date: 24 }, 'day month year')
  t.equal(parseDate('1956').year, 1956, 'just a year')
  t.equal(parseDate('c. 1155').year, 1155, 'circa year')
  t.equal(parseDate('356 BC').year, -356, 'BC year is negative')
  t.equal(parseDate('44 BCE').year, -44, 'BCE year')
  t.equal(parseDate('c. 1155/1162').year, 1155, 'either/or → earliest')
  t.equal(parseDate('c. 1155/1162').originalDate, 'c. 1155/1162', 'original kept for inaccurate dates')
  t.equal(parseDate('183–181 BC').year, -182, 'BC range → average')
  t.deepEqual(parseDate('May 3, 800'), { year: 800, month: 4, date: 3 }, 'first-millennium full date')
  t.equal(parseDate('June 24, 1931 (aged 83)').year, 1931, 'parenthetical stripped')
  t.equal(parseDate(''), null, 'empty')
  t.equal(parseDate('banana'), null, 'garbage → null')
  t.end()
})

test('parseDate: BC dates with a month', { todo: true }, (t) => {
  // parseDate's own comments cite this example, but spacetime can't parse a BC month-date
  t.equal(parseDate('July 356 BC')?.year, -356, 'month + BC year')
  t.equal(parseDate('20 or 21 July 356 BC')?.year, -356, 'uncertain day, BC year')
  t.equal(parseDate('20 or 21 July 356 BC')?.date, 20, 'uncertain day → earliest day')
  t.end()
})
