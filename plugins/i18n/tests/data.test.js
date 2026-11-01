import test from 'tape'
import birthDateAge from '../src/data/birth_date_and_age.js'
import citation from '../src/data/citation.js'
import citeBook from '../src/data/cite_book.js'
import citeJournal from '../src/data/cite_journal.js'
import citeWeb from '../src/data/cite_web.js'
import commonsCat from '../src/data/commons_cat.js'
import coord from '../src/data/coord.js'
import flag from '../src/data/flag.js'
import flagicon from '../src/data/flagicon.js'
import formatnum from '../src/data/formatnum.js'
import ipa from '../src/data/ipa.js'
import isbn from '../src/data/isbn.js'
import main from '../src/data/main.js'
import nihongo from '../src/data/nihongo.js'
import portal from '../src/data/portal.js'
import reflist from '../src/data/reflist.js'
import sfn from '../src/data/sfn.js'
import small from '../src/data/small.js'
import persondata from '../src/data/persondata.js'
import taxobox from '../src/data/taxobox.js'
import startDate from '../src/data/start_date.js'
import params from '../src/data/params.js'

const families = {
  'birth date and age': birthDateAge,
  citation,
  'cite book': citeBook,
  'cite journal': citeJournal,
  'cite web': citeWeb,
  'commons cat': commonsCat,
  coord,
  flag,
  flagicon,
  formatnum,
  ipa,
  isbn,
  main,
  nihongo,
  portal,
  reflist,
  sfn,
  small,
  persondata,
  taxobox,
  start: startDate,
}

test('i18n data files are well-formed', (t) => {
  Object.keys(families).forEach((fam) => {
    const list = families[fam]
    t.ok(Array.isArray(list) && list.length > 0, `${fam}: non-empty array`)
    const bad = list.filter(
      (name) =>
        typeof name !== 'string' ||
        name !== name.toLowerCase().trim() ||
        name.length === 0 ||
        (name.length === 1 && /[a-z0-9]/.test(name))
    )
    t.deepEqual(bad, [], `${fam}: entries are trimmed lowercase strings`)
    const dupes = list.filter((name, i) => list.indexOf(name) !== i)
    t.deepEqual(dupes, [], `${fam}: no duplicate entries`)
  })
  t.end()
})

test('i18n no alias is claimed by two families', (t) => {
  const owner = {}
  const conflicts = []
  Object.keys(families).forEach((fam) => {
    families[fam].forEach((name) => {
      if (owner[name]) {
        conflicts.push(`'${name}' (${owner[name]} + ${fam})`)
      }
      owner[name] = fam
    })
  })
  t.deepEqual(conflicts, [], 'no cross-family duplicates')
  t.end()
})

test('i18n param maps belong to registered aliases', (t) => {
  const names = new Set(Object.values(families).flat())
  const orphans = Object.keys(params.aliases).filter((name) => names.has(name) === false)
  t.deepEqual(orphans, [], 'every param entry is keyed by a known alias')
  const missing = Object.values(params.aliases)
    .flat()
    .filter((id) => params.maps[id] === undefined)
  t.deepEqual(missing, [], 'every referenced map id exists')
  const badTargets = Object.values(params.maps)
    .flatMap((map) => Object.values(map))
    .filter((target) => typeof target !== 'string' || target !== target.toLowerCase())
  t.deepEqual(badTargets, [], 'param targets are lowercase english names')
  t.end()
})
