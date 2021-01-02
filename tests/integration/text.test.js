const test = require('tape')
const wtf = require('../lib')

test('lists in text output', (t) => {
  const str = `
hello
* [http://www.abrahamlincolnassociation.org/ Abraham Lincoln Association]
* [http://www.lincolnbicentennial.org/ Abraham Lincoln Bicentennial Foundation]

`
  const doc = wtf(str)
  const want = `hello
 * Abraham Lincoln Association
 * Abraham Lincoln Bicentennial Foundation`
  t.equal(doc.text(), want, 'lists rendered in text output')
  t.end()
})
