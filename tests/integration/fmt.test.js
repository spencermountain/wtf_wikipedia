import test from 'tape'
import wtf from '../lib/index.js'

test('bold/italics', (t) => {
  const str = `'''K. Nicole Mitchell''' is ''currently'' a [[U.S. Magistrate Judge]].

	She is '''''very''''' good`
  let sentence = wtf(str).sentence(0)
  t.deepEqual(sentence.bolds(), ['K. Nicole Mitchell'], 'one bold')
  t.deepEqual(sentence.italics(), ['currently'], 'one italic')
  t.equal(sentence.links().length, 1, 'one link')

  sentence = wtf(str).sentence(1)
  t.deepEqual(sentence.bolds(), ['very'], 'two bold')
  t.deepEqual(sentence.italics(), ['very'], 'two italic')
  t.end()
})

test('newline combine', (t) => {
  let str = `650 students drawn from a
community that has levels`
  let doc = wtf(str)
  t.equal(doc.text(), `650 students drawn from a community that has levels`, 'combine newline w/ splace')
  t.end()
})

test('inline mixquotes test', (t) => {
  const str = `this is ''''four'''' and this is '''''five'''''`
  const sentence = wtf(str).sentences()[0]
  // t.deepEqual(sentence.fmt.bold, ['five', '\'four\''], 'two bold');
  t.deepEqual(sentence.italics(), ['five'], 'five is italic')
  t.end()
})

test('inline mixquotes test', (t) => {
  const arr = [
    [`hello 'one' world`, `hello 'one' world`],
    [`hello ''two'' world`, `hello two world`],
    [`hello '''three''' world`, `hello three world`],
    [`hello ''''four'''' world`, `hello 'four' world`],
    [`hello '''''five''''' world`, `hello five world`],
    [`hello ''''''six'''''' world`, `hello 'six' world`],
  ]
  arr.forEach((a) => {
    t.equal(wtf(a[0]).text(), a[1], a[1])
  })
  t.end()
})

test('links-with-ticks', (t) => {
  const doc = wtf(`hello '''[[Palme d'Or]]''' world`)
  t.equal(doc.text(), `hello Palme d'Or world`, 'text')
  t.equal(doc.link(0).page(), `Palme d'Or`, 'link')
  t.equal(doc.sentence(0).data.fmt.bold[0], `Palme d'Or`, 'fmt-bold')
  t.end()
})
