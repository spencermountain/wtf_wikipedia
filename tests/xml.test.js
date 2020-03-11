var wtf = require('./lib')
var test = require('tape')

test('clean removal of xml', function(t) {
  var hards = [
    [
      "hello <ref>nono!</ref> world1. hello <ref name='hullo'>nono!</ref> world2. hello <ref name='hullo'/>world3.  hello <table name=''><tr><td>hi<ref>nono!</ref></td></tr></table>world4. hello<ref name=''/> world5 <ref name=''>nono</ref>, man.",
      'hello world1. hello world2. hello world3. hello world4. hello world5, man.'
    ],
    ["hello <table name=''><tr><td>hi<ref>nono!</ref></td></tr></table>world4", 'hello world4'],
    ['hello<ref name="theroyal"/> world <ref>nono</ref>, man', 'hello world, man'],
    ['hello<ref name="theroyal"/> world5, <ref name="">nono</ref> man', 'hello world5, man'],
    ['hello <asd f> world </asd>', 'hello world'],
    ['North America,<ref name="fhwa"> and one of', 'North America, and one of'],
    ['North America,<br /> and one of', 'North America, and one of']
  ]
  hards.forEach(a => {
    var have = wtf(a[0]).text()
    t.equal(have, a[1], a[0])
  })
  t.end()
})

test('avoid greedy xml replacement', function(t) {
  var str = `hi up here
=== one ===
hello
<math>foo</math>
==two==
lkjsdf
==three==
<references>
</references>
`
  var doc = wtf(str)
  t.equal(doc.sections().length, 4, 'got all sections')
  t.end()
})
