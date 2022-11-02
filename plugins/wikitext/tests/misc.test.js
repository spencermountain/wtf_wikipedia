import test from 'tape'
import wtf from './_lib.js'

function tidy (str) {
  str = str.replace(/\s{2,}/g, ' ')
  str = str.replace(/\n/g, '')
  str = str.trim()
  return str
}

test('basic-wikitext', (t) => {
  let arr = [
    'that cat is [[a]] cool dude',
    `one [[two|2]] three`,
    'cool [[stuff]] **bold** too',
    '{{foobar | fun = true | key = val}}',
    // `[[Image:Levellers declaration and standard.gif|thumb|Woodcut from a [[Diggers]] document by [[William Everard (Digger)|William Everard]]]]`,
    `[[Image:Levellers_declaration_and_standard.gif|thumb|Woodcut from a Diggers document]]`,
    '== References ==\n{{ref-list}}',
    `{{Infobox award
| name           = Outstanding Achievement in Short Film Screen Craft
| website        = http://www.aacta.org
}}`,
  ]
  arr.forEach((str) => {
    let doc = wtf(str)
    let have = doc.makeWikitext()
    t.equal(tidy(have), tidy(str), str)
  })
  t.end()
})
