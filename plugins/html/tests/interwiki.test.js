import test from 'tape'
import wtf from './_lib.js'

test('expand external interwiki link', (t) => {
  const str = `[[heroeswiki:cool]]`
  const doc = wtf(str)
  const html = doc.links()[0].html()

  t.equal(
    html,
    '<a class="link" href="http://heroeswiki.com/cool">cool</a>',
    'expand external link'
  )
  t.end()
})

test('expand internal interwiki link', (t) => {
  const str = `[[fr:cool]]`
  const doc = wtf(str)

  const href = doc.links()[0].html()
  t.equal(
    href,
    '<a class="link" href="http://fr.wikipedia.org/wiki/cool">cool</a>',
    'expand external link'
  )
  t.end()
})
