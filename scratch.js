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

// str = readPage('United-Kingdom')
// str = readPage('Arts-Club-Of-Chicago')
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

// str = `hello <asd f> world </asd>`
// const doc = wtf(str, meta)

// console.log(doc.templates('FoobarContract')?.json('xl'))
// console.log(doc.template().json('xl'))

console.log(wtf('{{lang-la|Salix}}', { lang: 'de' }).debug())
