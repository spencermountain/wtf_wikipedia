import test from 'tape'
import { categories, infoboxes, redirects, stubs } from '../src/words/index.js'

test('i18n word lists are well-formed', (t) => {
  const lists = { categories, infoboxes, redirects, stubs }
  Object.keys(lists).forEach((kind) => {
    const words = lists[kind]
    t.ok(words.length > 30, `${kind}: has entries`)
    const bad = words.filter((w) => typeof w !== 'string' || w !== w.toLowerCase().trim() || w.length === 0)
    t.deepEqual(bad, [], `${kind}: words are trimmed lowercase`)
  })
  t.end()
})
