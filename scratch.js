import wtf from './src/index.ts'
import { readPage } from './tests/_examples/index.js'
let str = ''

const meta = {
  // pageImage: 'Grand_Bend_2.JPG',
}
str = '[[Stonehenge]], in [[Wiltshire]], was erected around 2500 BC'
str = `{{convert|524|ft|m}}
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
// console.log(doc.text())

// console.log(doc.templates('FoobarContract')?.json('xl'))
// console.log(doc.template().json('xl'))

str = `'''Barry''' may refer to:
{{TOC right}}

==People and fictional characters==
* [[Barry (name)]], including lists of people with the given name, nickname or surname, as well as fictional characters with the given name
* [[Dancing Barry]], stage name of Barry Richards (born c. 1950), former dancer at National Basketball Association games

==Places==
===Canada===
*[[Barry Lake]], Quebec
*[[Barry Islands]], Nunavut

===United Kingdom===
* [[Barry, Angus]], Scotland, a village
** [[Barry Mill]], a watermill
* [[Barry, Vale of Glamorgan]], Wales, a town
** [[Barry Railway Company]]

===United States===
* [[Barry, Illinois]], a city
* [[Barry, Minnesota]], a city
* [[Barry, Texas]], a city
* [[Barry County, Michigan]]
* [[Barry County, Missouri]]
* [[Barry Township (disambiguation)]], in several states
* [[Fort Barry]], Marin County, California, a former US Army installation

===Elsewhere===
* [[Barry Island (Debenham Islands)]], Antarctica
* [[Barry, New South Wales]], Australia, a village
* [[Barry, Hautes-Pyrénées]], France, a commune

==Arts and entertainment==
* [[Barry (album)|''Barry'' (album)]], by Barry Manilow
* "Barry", a character from the Marillion album cover ''[[Anoraknophobia]]''
* [[Barry (1949 film)|''Barry'' (1949 film)]], a French film
* [[Barry (2016 film)|''Barry'' (2016 film)]], an American film
* [[Barry (TV series)|''Barry'' (TV series)]], an American tragicomedy series
* [[Barry Award (for crime novels)]]
* [[Melbourne International Comedy Festival Award]], formerly called the Barry Award

==Other uses==
* [[Barry (heraldry)]]
* [[Barry (dog)]] (1800–1814), a mountain rescue St. Bernard
* [[Barry (radio)]], an Australian radio station
* [[Barry (UK Parliament constituency)]]
* [[Barry University]], a private Catholic university in Miami Shores, Florida
* [[Tropical Storm Barry]]
* {{USS|Barry}}, four US destroyers
* [[1703 Barry]], a minor planet

==See also==
* [[De Barry family]]
* [[Dubarry (disambiguation)]]
* [[Barre (disambiguation)]]
* [[Barrie (disambiguation)]]
* [[Berry (disambiguation)]]
{{srt}}

{{Disambiguation|geo}}
`
// const doc = wtf(str)
// const pages = doc.disambiguation().pages.map((page) => page.page)
// console.log(pages)
// console.log(pages.length)

wtf.fetch('Bremner').then((doc) => {
  console.log(doc.pageID)
  console.log(doc.wikidata)
  // console.log(doc.isDisambiguation())
  // console.log(doc.disambiguations())
})
