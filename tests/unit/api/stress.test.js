import test from 'tape'
import readFile from '../../lib/_cachedPage.js'
import { allPages } from '../../_examples/index.js'

test('cached-page-stress', (t) => {
  const noCitation = {
    'Willow-Sw': true,
    'Tennis-Sw': true,
    'British-Films': true,
    'Groot-Brittanje': true,
    'Sara-C-Bisel': true,
    'Runtime-Callable-Wrapper': true,
    'Remote-Application-Programming-Interface': true,
    'Remote-Data-Services': true,
    'Neil-McLean-Saxophonist': true,
    'Magnar-Saetre': true,
    'Liste-Der-Argentinischen-Botschafter-In-Chile': true,
    Keilwelle: true,
    'HMS-Irresistible': true,
    'Ewelina-Setowska-Dryk': true,
    'Alexander-Y-Type': true,
  }
  allPages.forEach((title) => {
    if (title === 'Redirect') {
      return
    }
    const doc = readFile(title)
    //basic is-valid tests for the page parsing
    t.comment(title)
    t.equal(doc.isRedirect(), false, `${title}:not-redirect`)
    t.equal(doc.isDisambig(), false, `${title}:not-disambiguation`)
    t.ok(doc.categories().length > 0, `${title}:cat-length`)
    t.ok(doc.sections().length > 0, `${title}:section-length`)
    const intro = doc.sections()[0]
    t.ok(intro.title() === '', `${title}:intro-title-empty`)
    t.ok(intro.indentation() === 0, `${title}:depth=0`)
    t.ok(intro.sentences().length > 0, `${title}:sentences-length`)
    t.ok(intro.sentences()[0].text().length > 0, `${title}:intro-text`)
    t.match(intro.sentences()[0].text(), /\p{L}/u, `${title}:intro-has words`)
    if (noCitation[title] === true) {
      t.equal(doc.citations().length, 0, `${title}:no-citation`)
    } else {
      t.ok(doc.citations().length > 0, `${title}:citation`)
    }
    const text = doc.text()
    t.ok(text.length > 40, `${title}:text-length`)

    const json = doc.json({ encode: true })
    t.ok(Object.keys(json).length >= 2, `${title}:json-keys-ok`)
  })
  t.end()
})
