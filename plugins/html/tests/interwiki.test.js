import test from 'tape'
import wtf from './_lib.js'

test('expand external interwiki link', (t) => {
  let str = `[[heroeswiki:cool]]`
  let doc = wtf(str)
  let html = doc.link().html()

  t.equal(
    html,
    '<a class="link" href="http://heroeswiki.com/cool">cool</a>',
    'expand external link'
  )
  t.end()
})

test('expand internal interwiki link', (t) => {
  let str = `[[fr:cool]]`
  let doc = wtf(str)

  let href = doc.link().html()
  t.equal(
    href,
    '<a class="link" href="http://fr.wikipedia.org/wiki/cool">cool</a>',
    'expand external link'
  )
  t.end()
})
