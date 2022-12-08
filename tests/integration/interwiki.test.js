import test from 'tape'
import wtf from '../lib/index.js'

test('interwiki text', (t) => {
  let doc = wtf('hi [[as:Plancton]] there')
  t.equal(doc.text(), 'hi Plancton there', 'strip full interwiki')

  doc = wtf(`hi [[wiktionary:Plancton]] there [[zh:天問|天問]]`)
  t.equal(doc.text(), 'hi Plancton there 天問', 'strip full interwiki')

  t.end()
})

test('expand external interwiki link', (t) => {
  let str = `[[heroeswiki:cool]]`
  let doc = wtf(str)
  let obj = doc.link().json()
  t.equal(obj.type, 'interwiki', 'interwiki')
  t.equal(obj.text, 'cool', 'text')
  t.equal(obj.wiki, 'heroeswiki', 'wiki')

  let href = doc.link().href()
  t.equal(href, 'http://heroeswiki.com/cool', 'expand external link')

  str = `[[Wiktionary:fr:bonjour]]`
  doc = wtf(str)
  obj = doc.link().json()
  t.equal(obj.type, 'interwiki', 'interwiki')
  t.equal(obj.text, 'bonjour', 'text')
  t.deepEqual(obj.wiki, { wiki: 'wiktionary', lang: 'fr' }, 'wiki')

  str = `[[s:Administrative Order 9|legal text]]`
  doc = wtf(str)
  obj = doc.link().json()
  t.equal(obj.type, 'interwiki', 'interwiki')
  t.equal(obj.text, 'legal text', 'legal text')
  t.equal(obj.page, 'Administrative Order 9', 'page')
  t.deepEqual(obj.wiki, 's', 'wiki')


  str = `[[ThisIsNotAWiki:text]]`
  doc = wtf(str)
  obj = doc.link().json()
  t.notEqual(obj.type, 'interwiki')

  str = `[[ThisIsNotAWiki:en:text]]`
  doc = wtf(str)
  obj = doc.link().json()
  t.notEqual(obj.type, 'interwiki')

  str = `[[wikipedia:ThisIsNotALanguage:text]]`
  doc = wtf(str)
  obj = doc.link().json()
  t.notEqual(obj.type, 'interwiki')

  t.end()
})

test('expand internal interwiki link', (t) => {
  let str = `[[fr:cool]]`
  let doc = wtf(str)
  let obj = doc.link().json()
  t.equal(obj.type, 'interwiki', 'interwiki')
  t.equal(obj.text, 'cool', 'text')
  t.equal(obj.wiki, 'fr', 'wiki')

  let href = doc.link().href()
  t.equal(href, 'http://fr.wikipedia.org/wiki/cool', 'expand external link')
  t.end()
})
