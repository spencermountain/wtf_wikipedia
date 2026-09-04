import test from 'tape'
import fs from 'fs'
import path from 'path'
import wtf from '../../lib/index.js'
import golden from '../../lib/golden.js'
import { fileURLToPath } from 'url'

const dir = path.dirname(fileURLToPath(import.meta.url))

// full json output of every singular accessor, on a real page,
// snapshotted in tests/golden/ (regenerate with `npm run goldens:update`)
test('singular json output - Arts Club of Chicago', (t) => {
  const str = fs.readFileSync(path.join(dir, '../../cache/Arts_Club_of_Chicago.txt'), 'utf-8')
  const doc = wtf(str)
  const methods = [
    'section',
    'infobox',
    'sentence',
    'citation',
    'reference',
    'coordinate',
    'table',
    'list',
    'image',
    'template',
    'category',
  ]
  const results = {}
  methods.forEach((fn) => {
    ;[undefined, 1].forEach((clue) => {
      const val = doc[fn](clue)
      const out = val && typeof val.json === 'function' ? val.json() : val
      results[`${fn}(${clue === undefined ? '' : clue})`] = out === undefined ? null : out
    })
  })
  golden(t, 'arts-club-singulars', results)
  t.end()
})

test('document json output - Arts Club of Chicago', (t) => {
  const str = fs.readFileSync(path.join(dir, '../../cache/Arts_Club_of_Chicago.txt'), 'utf-8')
  const doc = wtf(str)
  golden(t, 'arts-club-json', {
    'json()': doc.json(),
    "json('sm')": doc.json('sm'),
    "json('md')": doc.json('md'),
  })
  t.end()
})
