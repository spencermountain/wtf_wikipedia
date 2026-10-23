import wtf from './src/index.ts'
import { readPage } from './tests/_examples/index.js'
let str = ''

const meta = {
  // pageImage: 'Grand_Bend_2.JPG',
}
str = '[[Stonehenge]], in [[Wiltshire]], was erected around 2500 BC'
str = `
'''Park Place''' may refer to:
{{TOC right}}

== Media ==
* [[Park Place (TV series)|Park Place]], a 1981 CBS sitcom

== Places ==
* [[Park Place (Ontario)]], a park in the city of Barrie
* [[Park Place (Vancouver)]], a skyscraper
* [[Park Place Mall]], Lethbridge, Alberta
`
// str = readPage('United-Kingdom')

str = `[[File:Cool.jpg|thumb|this is [[cool]]]]
  `
const doc = wtf(str, meta)
console.log(doc.images()[0].json())
console.log(doc.links().map((l) => l.json()))
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
