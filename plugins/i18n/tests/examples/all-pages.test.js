import test from 'tape'
import wtf from '../_lib.js'
import { allPages, readPage } from '../_examples/index.js'

// basic is-valid sweep over every cached non-english page, parsed with every pack loaded
test('i18n cached-page-stress', (t) => {
  const noCitation = {
    'Willow-Sw': true,
    'Tennis-Sw': true,
    'Groot-Brittanje': true,
    'Sara-C-Bisel': true,
    'HMS-Irresistible': true,
    Keilwelle: true,
    'Liste-Der-Argentinischen-Botschafter-In-Chile': true,
  }
  allPages.forEach((title) => {
    const doc = wtf(readPage(title))
    t.comment(title)
    t.equal(doc.isRedirect(), false, `${title}:not-redirect`)
    t.equal(doc.isDisambig(), false, `${title}:not-disambiguation`)
    t.ok(doc.categories().length > 0, `${title}:cat-length`)
    t.ok(doc.sections().length > 0, `${title}:section-length`)
    const intro = doc.sections()[0]
    t.ok(intro.title() === '', `${title}:intro-title-empty`)
    t.ok(intro.depth() === 0, `${title}:depth=0`)
    t.ok(intro.sentences().length > 0, `${title}:sentences-length`)
    t.ok(intro.sentences()[0].text().length > 0, `${title}:intro-text`)
    t.match(intro.sentences()[0].text(), /\p{L}/u, `${title}:intro-has words`)
    if (noCitation[title] === true) {
      t.equal(doc.citations().length, 0, `${title}:no-citation`)
    } else {
      t.ok(doc.citations().length > 0, `${title}:citation`)
    }
    t.ok(doc.text().length > 40, `${title}:text-length`)
    t.ok(Object.keys(doc.json()).length >= 2, `${title}:json-keys-ok`)
  })
  t.end()
})
