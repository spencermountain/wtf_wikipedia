var test = require('tape')
var wtf = require('./lib')

test('bold/italics', t => {
  var str = `'''K. Nicole Mitchell''' is ''currently'' a [[U.S. Magistrate Judge]].

	She is '''''very''''' good`
  var sentence = wtf(str).sentences(0)
  t.deepEqual(sentence.bold(), ['K. Nicole Mitchell'], 'one bold')
  t.deepEqual(sentence.italic(), ['currently'], 'one italic')
  t.equal(sentence.links().length, 1, 'one link')

  sentence = wtf(str).sentences(1)
  t.deepEqual(sentence.bold(), ['very'], 'two bold')
  t.deepEqual(sentence.italic(), ['very'], 'two italic')
  t.end()
})

test('inline mixquotes test', t => {
  var str = `this is ''''four'''' and this is '''''five'''''`
  var sentence = wtf(str).sentences(0)
  // t.deepEqual(sentence.fmt.bold, ['five', '\'four\''], 'two bold');
  t.deepEqual(sentence.italic(), ['five'], 'five is italic')
  t.end()
})

test('inline mixquotes test', t => {
  var arr = [
    [`hello 'one' world`, `hello 'one' world`],
    [`hello ''two'' world`, `hello two world`],
    [`hello '''three''' world`, `hello three world`],
    [`hello ''''four'''' world`, `hello 'four' world`],
    [`hello '''''five''''' world`, `hello five world`],
    [`hello ''''''six'''''' world`, `hello 'six' world`]
  ]
  arr.forEach(a => {
    t.equal(wtf(a[0]).text(), a[1], a[1])
  })
  t.end()
})

test('links-with-ticks', t => {
  var doc = wtf(`hello '''[[Palme d'Or]]''' world`)
  t.equal(doc.text(), `hello Palme d'Or world`, 'text')
  t.equal(doc.links(0).page(), `Palme d'Or`, 'link')
  t.equal(doc.sentences(0).data.fmt.bold[0], `Palme d'Or`, 'fmt-bold')
  t.end()
})
