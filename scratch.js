import wtf from './src/index.ts'
import { readPage } from './tests/_examples/index.js'
let str = ''

const meta = {
  // pageImage: 'Grand_Bend_2.JPG',
}
str = '[[Stonehenge]], in [[Wiltshire]], was erected around 2500 BC'
str = `
  {{FoobarContract|one=yes|caption=long text with [[link]]}}
`

str = readPage('United-Kingdom')
// str = `
// {{Infobox settlement
// | name = New York City
// | official_name                   = City of New York
// | settlement_type                 = [[City]]
// | named_for                       = [[James II of England|James, Duke of York]]
// | coordinates                     = {{coord|40.7127|N|74.0059|W|region:US-NY|format=dms|display=inline,title}}
// }}
//   `
// str = `{{foobar|one=yes|caption=long text with [[link]]}}`
// str = `=== Tydskrifte en koerante ===
// * Behr, Mark “Speaking the unspeakable” “Sunday Times 9 April 2000
// * Crocker, Jennifer “Paradys found” “Sunday Times” 28 Februarie 2010
// * O’Hara, Glynis “Pressing sweetness out of anger” “The Pretoria News” 7 Julie 1995
// * Roux, J.B. “Mark Behr oor man-, soldaat- en gay-wees” “Beeld” 7 Mei 2012
// * Van Zyl, Johan “As wroeging verby is” “Beeld” 25 Oktober 2003
// * Vosloo, Johan “Spioen se ‘appels’ nou vrot” “Rapport” 14 Julie 1996
// `

// str = `{{Infobox legislature
// | name               = Senate of Pakistan<br>{{Nastaliq|'''ایوانِ بالا پاکستان'''}}
// | native_name        =
// | native_name_lang   =
// | transcription_name =
// | legislature        =
// }}`

str = `hello <!----> world`
const doc = wtf(str, meta)
console.log(doc.comments())
console.log(doc.text())
// console.log(doc.infoboxes().map((l) => l.type()))
// const table = doc.tables()[0]
// console.log(table.getRows(['Name', 'team']))
// console.log(table.getRows('Name'))
// console.log(table.getRows())
// console.log(table.json().rows)
// console.log(doc.links().map((l) => l.json()))
// console.log(doc.images()[0].json())
// console.log(doc.sections()[2].title())
// const found = doc.template('main srticle')
// console.log('found', found.json())
// found.forEach((t) => console.log(t.json()))
// doc.templates().forEach((t) => console.log(t.json()))
// console.log(doc.sections()[0].json())
// console.log('title', doc.title)
// console.log('wikitext', doc.wikitext())
// console.log('url', doc.url())
// console.log('isRedirect', doc.isRedirect())
// console.log('isStub', doc.isStub())
// console.log('redirectTo', doc.redirectTo())
// console.log('isDisambiguation', doc.isDisambiguation())
// console.log('categories', doc.categories())
// console.log('sections', doc.sections())
// console.log('paragraphs', doc.paragraphs())
// console.log('sentences', doc.sentences())
// console.log('images', doc.images())
// console.log('interwiki', doc.interwiki())
// console.log('lists', doc.lists())
// console.log('tables', doc.tables())
// console.log('references', doc.references())
// console.log('citations', doc.citations())
// console.log('coordinates', doc.coordinates())
// console.log('templates', doc.templates()[0].json())
// console.log('infoboxes', doc.infobox().json())
// console.log('debug', doc.debug())
// console.log('infobox', doc.infobox())
// console.log('isDisambig', doc.isDisambig())
// console.log('redirectsTo', doc.redirectsTo())
// console.log('redirect', doc.redirect())
// console.log('links', doc.links())
// console.log('text', doc.text())
// console.log('json', doc.json())
