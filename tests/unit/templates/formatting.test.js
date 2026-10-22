import test from 'tape'
import wtf from '../../lib/index.js'

test('Font-Size-Templates', (t) => {
  let str = 'hello {{small|(1995-1997)}} world'
  t.equal(wtf(str).text(), 'hello (1995-1997) world', '{{small}}')

  str = 'hello {{huge|world}}'
  t.equal(wtf(str).text(), 'hello world', '{{huge}}')

  str = `hello {{nowrap|{{small|(1995–present)}}}} world`
  t.equal(wtf(str).text(), 'hello (1995–present) world', '{{nowrap}}')
  t.end()
})

test('Small-Template-Content', (t) => {
  t.equal(wtf(`hello {{small|2 February}}`).text(), 'hello 2 February', 'small text')
  t.end()
})

test('Block-Indent-Content', (t) => {
  t.equal(wtf(`{{block indent |1=The material to be indented here. May include markup, paragraph breaks, etc.}}`).text(), 'The material to be indented here. May include markup, paragraph breaks, etc.', 'block indent text')
  t.end()
})
