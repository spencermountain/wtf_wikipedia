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
    t.equal(doc.isRedirect(), false, ' - - not-redirect')
    t.equal(doc.isDisambig(), false, ' - - not-disambiguation')
    t.ok(doc.categories().length > 0, ' - - cat-length')
    t.ok(doc.sections().length > 0, ' - - section-length')
    const intro = doc.section()
    t.ok(intro.title() === '', ' - - intro-title-empty')
    t.ok(intro.indentation() === 0, ' - - depth=0')
    t.ok(intro.sentences().length > 0, ' - - sentences-length')
    t.ok(intro.sentence().text().length > 0, ' - - intro-text')
    t.match(intro.sentence().text(), /\p{L}/u, ' - - intro-has words')
    if (noCitation[title] === true) {
      t.equal(doc.citations().length, 0, title + ' has no citation')
    } else {
      t.ok(doc.citations().length > 0, title + ' has a citation')
    }
    const text = doc.text()
    t.ok(text.length > 40, ' - - text-length')

    const json = doc.json({
      encode: true,
    })
    t.ok(Object.keys(json).length >= 2, ' - - json-keys-ok')
  })
  t.end()
})
