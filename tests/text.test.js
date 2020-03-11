var test = require('tape')
var wtf = require('./lib')

test('lists in text output', t => {
  var str = `
hello
* [http://www.abrahamlincolnassociation.org/ Abraham Lincoln Association]
* [http://www.lincolnbicentennial.org/ Abraham Lincoln Bicentennial Foundation]

`
  var doc = wtf(str)
  var want = `hello
 * Abraham Lincoln Association
 * Abraham Lincoln Bicentennial Foundation`
  t.equal(doc.text(), want, 'lists rendered in text output')
  t.end()
})
