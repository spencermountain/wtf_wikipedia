import test from 'tape'
import wtf from './_lib.js'
import { allPages, readPage } from '../../../tests/_examples/index.js'

test('try all pages', (t) => {
  allPages.forEach((page) => {
    const doc = wtf(readPage(page))
    const wiki = doc.makeWikitext()
    t.ok(wiki && wiki.length > 5, page)
  })
  t.end()
})
