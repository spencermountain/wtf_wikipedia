import test from 'tape'
import wtf from '../lib/index.js'
import readFile from '../lib/_cachedPage.js'

test('redirect json', (t) => {
  const str = `#REDIRECT [[Toronto Blue Jays#Stadium|Tranno]]`
  const doc = wtf(str)
  t.equal(doc.isRedirect(), true, 'is-redirect')
  const obj = doc.json()
  t.equal(obj.isRedirect, true, 'json-has-redirect')
  t.equal(obj.redirectTo.page, 'Toronto Blue Jays', 'redirect page')
  t.equal(obj.redirectTo.anchor, 'Stadium', 'redirect anchor')
  t.equal(obj.redirectTo.text, 'Tranno', 'redirect text')
  t.end()
})

test('is-redirect', (t) => {
  const doc = readFile('redirect')
  t.equal(doc.isRedirect(), true, 'is-redirect')
  // t.equal(doc.link().page, 'Toronto', 'redirect-place')
  t.equal(doc.infobox(), null, 'has-no-infobox')
  t.end()
})

test('redirect-newlines', (t) => {
  const doc = wtf(`
    #REDIRECT [[TORONTO]]

    `)
  t.equal(doc.isRedirect(), true, 'isredirect')
  t.equal(doc.redirectsTo().page, 'TORONTO', 'redirectsto')

  t.end()
})

test('redirect-extra-stuff', (t) => {
  const doc = wtf(`#REDIRECT [[Wikipedia:Bug reports and feature requests]]

{{Redirect category shell|1=
{{R to project namespace}}
}}`)
  t.equal(doc.isRedirect(), true, 'isredirect')
  t.equal(doc.redirectsTo().page, 'Bug reports and feature requests', 'redirectsto')
  t.equal(doc.redirectsTo().wiki, 'wikipedia', 'interwiki redirect')
  t.end()
})

test('long redirects', (t) => {
  let str = `#REDIRECT [[List of Directors and Commissioners-General of the United Nations Relief and Works Agency for Palestine Refugees in the Near East]]`
  let doc = wtf(str)
  t.equal(doc.isRedirect(), true, 'isredirect')
  t.equal(
    doc.redirectsTo().page,
    'List of Directors and Commissioners-General of the United Nations Relief and Works Agency for Palestine Refugees in the Near East',
    'redirectsto',
  )

  //another one
  str = `#REDIRECT[[List of Evil Con Carne characters#Cod Commando]]

  {{Redirect category shell|
  {{R from fictional character|Evil Con Carne}}
  {{R to section}}
  }}

  [[Category:Evil Con Carne character redirects to lists]]
  [[Category:Fictional anthropomorphic characters]]
  [[Category:Fictional secret agents and spies]]
  [[Category:Fictional characters introduced in 2001]]`
  doc = wtf(str)
  t.equal(doc.isRedirect(), true, 'isredirect')
  t.equal(doc.redirectsTo().page, 'List of Evil Con Carne characters', 'redirectsto')
  t.equal(doc.json().categories.length, 4, 'redirect has categories')
  t.end()
})

test('redirect output', (t) => {
  const str = `#REDIRECT [[Toronto Blue Jays#Stadium|Tranno]]`
  const doc = wtf(str)
  t.equal(doc.text(), '', 'text')
  // t.equal(doc.markdown(), '↳ [Tranno](./Toronto_Blue_Jays#Stadium)', 'markdown')
  // t.equal(doc.latex(), '↳ \\href{./Toronto_Blue_Jays#Stadium}{Tranno}', 'latex')
  // t.ok(/Toronto_Blue_Jays/.test(doc.html()), 'html')
  t.end()
})
