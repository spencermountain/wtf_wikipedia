import test from 'tape'
import wtf from './_lib.js'

const casper = `{{Infobox golfer
| name         = Billy Casper
| birth_name   = William Earl Casper Jr.
| nickname     = Buffalo Bill
| birth_date   = {{birth date|1931|6|24}}
| occupation   = {{hlist|Professional golfer|Golf course designer}}
| spouse       = {{marriage|Shirley Franklin|1952|2010|end=died}}
| children     = 11, including [[Bob Casper|Bob]]
| death_date   = {{death date and age|2015|2|7|1931|6|24}}
}}
'''William Earl Casper Jr.''' (June 24, 1931 – February 7, 2015) was an American professional golfer.`

test('names', (t) => {
  let res = wtf(casper).names()
  t.equal(res.name, 'Billy Casper', 'infobox name')
  t.equal(res.birthName, 'William Earl Casper Jr.', 'birth_name')
  t.deepEqual(res.aliases, ['Buffalo Bill'], 'nickname alias')
  res = wtf(`'''Ada Lovelace''' (10 December 1815 – 27 November 1852) was an English mathematician.`).names()
  t.equal(res.name, 'Ada Lovelace', 'first-sentence bold')
  t.equal(res.birthName, null, 'no birth name')
  t.end()
})

test('occupation', (t) => {
  t.deepEqual(wtf(casper).occupation(), ['Professional golfer', 'Golf course designer'], 'hlist field')
  let doc = wtf(`'''Ada Lovelace''' (1815–1852) was an English mathematician and writer.`)
  t.deepEqual(doc.occupation(), ['mathematician', 'writer'], 'sentence, demonym stripped')
  doc = wtf(`'''Sam Person''' sat down.`)
  t.deepEqual(doc.occupation(), [], 'no occupation → empty')
  t.end()
})

test('spouses', (t) => {
  t.deepEqual(
    wtf(casper).spouses(),
    [{ name: 'Shirley Franklin', from: '1952', to: '2010', end: 'died' }],
    'marriage template'
  )
  const doc = wtf(`{{Infobox person|name=X|spouse=Jane Doe (m. 1990; div. 2001)}}`)
  t.deepEqual(doc.spouses(), [{ name: 'Jane Doe', from: '1990', to: '2001', end: 'div' }], 'plain-text field')
  t.deepEqual(wtf(`'''Sam Person''' sat down.`).spouses(), [], 'no spouse → empty')
  t.end()
})

test('children', (t) => {
  t.deepEqual(wtf(casper).children(), { count: 11, names: ['Bob'] }, 'count + linked name')
  let doc = wtf(`{{Infobox person|name=X|children=3}}`)
  t.deepEqual(doc.children(), { count: 3, names: [] }, 'count only')
  doc = wtf(`{{Infobox person|name=X|children=Jane, John}}`)
  t.deepEqual(doc.children(), { count: 2, names: ['Jane', 'John'] }, 'unlinked names')
  t.equal(wtf(`'''Sam Person''' sat down.`).children(), null, 'no field → null')
  t.end()
})

test('age', (t) => {
  t.equal(wtf(casper).age(), null, 'dead → null')
  const yearOnly = wtf(`x [[Category:1990 births]] [[Category:Living people]]`)
  t.equal(yearOnly.age(), new Date().getFullYear() - 1990, 'living, year-only birth')
  const doc = wtf(`{{Infobox person|name=X|birth_date={{birth date|1990|3|4}}}} x [[Category:Living people]]`)
  const now = new Date()
  let expected = now.getFullYear() - 1990
  if (now.getMonth() < 2 || (now.getMonth() === 2 && now.getDate() < 4)) {
    expected -= 1
  }
  t.equal(doc.age(), expected, 'living, full birth date')
  t.equal(wtf(`'''Sam Person''' sat down.`).age(), null, 'no birth date → null')
  t.end()
})
