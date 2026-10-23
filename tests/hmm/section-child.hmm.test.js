import test from 'tape'
import wtf from '../../src/index.ts'

test('Section.child selects one child or null', (t) => {
  const doc = wtf(
    'Intro.\n\n== History ==\nHistory text.\n\n=== Early days ===\nEarly text.\n\n=== Later years ===\nLater text.'
  )
  const history = doc.section('history')
  t.equal(history.child().title(), 'Early days', 'defaults to first child')
  t.equal(history.child(1).title(), 'Later years', 'selects by index')
  t.equal(history.child('early days').title(), 'Early days', 'selects by title')
  t.equal(history.child('missing'), null, 'missing title returns null')
  t.equal(history.child(99), null, 'missing index returns null')
  t.equal(history.child('early days').child(), null, 'no children returns null')
  t.equal(history.children('early days').length, 1, 'plural accessor remains a collection')
  t.equal(history.children('missing').length === 0, true, 'empty plural result remains a collection')
  t.end()
})
