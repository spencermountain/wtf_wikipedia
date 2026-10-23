import test from 'tape'
import wtf from '../../lib/index.js'

test('interwiki text', (t) => {
  let doc = wtf('hi [[as:Plancton]] there')
  t.equal(doc.text(), 'hi there', 'hide language-menu link')

  doc = wtf(`hi [[wiktionary:Plancton]] there [[zh:天問|天問]]`)
  t.equal(doc.text(), 'hi wiktionary:Plancton there', 'show project link and hide language-menu link')

  t.end()
})

test('expand external interwiki link', (t) => {
  let str = `[[heroeswiki:cool]]`
  let doc = wtf(str)
  let obj = doc.links()[0].json()
  t.equal(obj.type, 'interwiki', 'interwiki')
  t.equal(obj.text, 'heroeswiki:cool', 'text')
  t.equal(obj.project, 'heroeswiki', 'project')

  const href = doc.links()[0].href()
  t.equal(href, 'http://heroeswiki.com/cool', 'expand external link')

  str = `[[Wiktionary:fr:bonjour]]`
  doc = wtf(str)
  obj = doc.links()[0].json()
  t.equal(obj.type, 'interwiki', 'interwiki')
  t.equal(obj.text, 'Wiktionary:fr:bonjour', 'text')
  t.equal(obj.project, 'wiktionary', 'project')
  t.equal(obj.lang, 'fr', 'language')

  str = `[[s:Administrative Order 9|legal text]]`
  doc = wtf(str)
  obj = doc.links()[0].json()
  t.equal(obj.type, 'interwiki', 'interwiki')
  t.equal(obj.text, 'legal text', 'legal text')
  t.equal(obj.page, 'Administrative Order 9', 'page')
  t.equal(obj.project, 'wikisource', 'project')


  str = `[[ThisIsNotAWiki:text]]`
  doc = wtf(str)
  obj = doc.links()[0].json()
  t.notEqual(obj.type, 'interwiki', 'unknown wiki prefix')

  str = `[[ThisIsNotAWiki:en:text]]`
  doc = wtf(str)
  obj = doc.links()[0].json()
  t.notEqual(obj.type, 'interwiki', 'unknown wiki with language prefix')

  str = `[[wikipedia:ThisIsNotALanguage:text]]`
  doc = wtf(str)
  obj = doc.links()[0].json()
  t.equal(obj.type, 'interwiki', 'recognized project keeps unknown prefix in target')
  t.equal(obj.page, 'ThisIsNotALanguage:text', 'unknown prefix remains part of page title')

  t.end()
})

test('expand internal interwiki link', (t) => {
  const str = `[[fr:cool]]`
  const doc = wtf(str)
  const obj = doc.links()[0].json()
  t.equal(obj.type, 'interwiki', 'interwiki')
  t.equal(obj.text, '', 'language-menu link has no text')
  t.equal(obj.inline, false, 'language-menu link is not inline')
  t.equal(obj.lang, 'fr', 'language')

  const href = doc.links()[0].href()
  t.equal(href, 'http://fr.wikipedia.org/wiki/Cool', 'expand external link')
  t.end()
})
