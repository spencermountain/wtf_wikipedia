import test from 'tape'
import wtf from '../../lib/index.js'

test('External-Link-Labels', (t) => {
  let str = `The [http://w110.bcn.cat/portal/site/Eixample] is the quarter designed`
  let obj = wtf(str)
  let link = obj.sentence().link()
  t.equal(link.text(), '', 'link-text')
  t.equal(link.site(), 'http://w110.bcn.cat/portal/site/Eixample', 'link-site')
  t.equal(link.type(), 'external', 'link-type')

  str = `The [http://w110.bcn.cat/portal/site/Eixample Fun Times] is the quarter designed`
  obj = wtf(str)
  link = obj.sentence().link()
  t.equal(link.text(), 'Fun Times', 'link-text')
  t.equal(link.site(), 'http://w110.bcn.cat/portal/site/Eixample', 'link-site')
  t.equal(link.type(), 'external', 'link-type')
  t.end()
})
