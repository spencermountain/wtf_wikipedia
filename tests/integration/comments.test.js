import test from 'tape'
import wtf from '../lib/index.js'

test('tricky comments', (t) => {
  let str = `hello <!-- <ref>blah blah</ref>  --> world`
  const doc = wtf(str)
  t.equal(doc.text(), 'hello world', 'with brackets')
  t.equal(doc.references().length, 0, 'found no references')

  str = `hello <!-- not this
or this
    --> world`
  t.equal(wtf(str).text(), 'hello world', 'newlines')

  str = `hello <!-- world`
  t.equal(wtf(str).text(), 'hello <!-- world', 'incomplete reference')

  str = `hello <!----> world`
  t.equal(wtf(str).text(), 'hello world', 'empty reference')

  str = `<!--col4-->[[File:New-York-Jan2005.jpg|100x95px]]<!--smaller-->`
  t.equal(wtf(str).images().length, 1, 'got inside image')

  t.end()
})
