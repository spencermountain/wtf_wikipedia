import test from 'tape'
import wtf from './_lib.js'

test('flag', (t) => {
  let doc = wtf(`hello world and hereon lies the long-enough text`)
  t.equal(doc.hasBadTable(), false)

  doc = wtf(`hello , world`)
  t.ok(doc.isBad())
  // 'dangling-comma'

  doc = wtf(`hello (  world.`)
  t.ok(doc.isBad())
  // 'unclosed-paren'

  doc = wtf(`hello style="width:50%"`)
  t.ok(doc.isBad())
  // 'unparsed-style'
  t.end()
})
