import test from 'tape'
import wtf from '../lib/index.js'

test('disambig template', function (t) {
  const str = `
'''Park Place''' is cool:
* [[Park Place (Ontario)]], a park in the city of Barrie
* [[Park Place (Vancouver)]], a skyscraper
* [[Park Place Mall]], Lethbridge, Alberta
{{disambiguation}}
  `
  const doc = wtf(str)
  t.equal(doc.isDisambiguation(), true, 'is-disambiguation')
  t.end()
})

test('alt template', function (t) {
  const str = `
* [[Park Place (Ontario)]], a park in the city of Barrie
* [[Park Place (Vancouver)]], a skyscraper
{{geodis}}
  `
  const doc = wtf(str)
  t.equal(doc.isDisambiguation(), true, 'is-disambiguation')
  t.end()
})

test('i18n template', function (t) {
  const str = `
'''Park Place''' is cool:
* [[Park Place (Ontario)]], a park in the city of Barrie
* [[Park Place (Vancouver)]], a skyscraper
{{bisongidila}}
  `
  const doc = wtf(str)
  t.equal(doc.isDisambiguation(), true, 'is-disambiguation')
  t.end()
})

test('may refer to', function (t) {
  const str = `
'''Park Place''' may refer to:
{{TOC right}}

== Media ==
* [[Park Place (TV series)|Park Place]], a 1981 CBS sitcom

== Places ==
* [[Park Place (Ontario)]], a park in the city of Barrie
* [[Park Place (Vancouver)]], a skyscraper
* [[Park Place Mall]], Lethbridge, Alberta
  `
  const doc = wtf(str)
  t.equal(doc.isDisambiguation(), true, 'is-disambiguation')
  t.equal(doc.links().length, 4, 'links')
  t.equal(doc.link().page(), 'Park Place (TV series)', 'first-link')
  t.end()
})

test('by title', function (t) {
  const str = `
'''Park Place''' is cool:
* [[Park Place (Ontario)]], a park in the city of Barrie
* [[Park Place (Vancouver)]], a skyscraper
  `
  const doc = wtf(str)
  doc.title('Park Place (disambiguation)')
  t.equal(doc.isDisambiguation(), true, 'is-disambiguation')
  t.end()
})

test('by text', function (t) {
  const str = `'''22''' may refer to:
  * [[22 (number)]]
  * [[22 BC]]
  * [[AD 22]]
  * [[1922]]
  * [[2022]]
  `
  const doc = wtf(str)
  t.equal(doc.isDisambiguation(), true, 'may-refer-to')
  t.end()
})

test('by i18n title', function (t) {
  const str = `
'''Park Place''' is cool:
* [[Park Place (Ontario)]], a park in the city of Barrie
* [[Park Place (Vancouver)]], a skyscraper
  `
  const doc = wtf(str)
  doc.title('Park Place (توضيح)')
  t.equal(doc.isDisambiguation(), true, 'is-disambiguation')
  t.end()
})

test('false-positive', function (t) {
  let str = `{{Hatnote|"Dandelion" redirects here. It may refer to any species of the genus ''Taraxacum'' or specifically to ''[[Taraxacum officinale]]''. For similar plants, see [[False dandelion]]. For other uses, see [[Dandelion (disambiguation)]]}}
'''''Taraxacum''''' ({{IPAc-en|t|ə|ˈ|r|æ|k|s|ə|k|ᵿ|m}}) is a large [[genus]] of [[flowering plant]]s`
  let doc = wtf(str)
  t.equal(doc.isDisambiguation(), false, 'skip-hatnote')
  t.end()
})
