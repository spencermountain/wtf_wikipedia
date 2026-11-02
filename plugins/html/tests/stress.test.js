import test from 'tape'
import wtf from './_lib.js'
import { allPages, readPage } from '../../../tests/_examples/index.js'
import { allPages as i18nPages, readPage as readI18nPage } from '../../i18n/tests/_examples/index.js'

test('try all pages', (t) => {
  const pages = [...allPages.map((page) => [page, readPage]), ...i18nPages.map((page) => [page, readI18nPage])]
  pages.forEach(([page, read]) => {
    const doc = wtf(read(page))
    const html = doc.html()
    t.ok(html && html.length > 5, page)
  })
  t.end()
})
