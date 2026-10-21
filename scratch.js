import wtf from './src/index.ts'
import { readPage } from './tests/_examples/index.js'

// const str = readPage('United-Kingdom')
const str = ` ### hello [[world]]
  {{Start date and age|2019|12|18}}

The '''City of New York''', often called '''New York City'''
`
const doc = wtf(str)
console.log(doc.text())
console.log(doc.sections()[0].json())
console.log(doc.templates()[0].json())
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
// console.log('templates', doc.templates())
// console.log('infoboxes', doc.infobox())
// console.log('debug', doc.debug())
// console.log('infobox', doc.infobox())
// console.log('isDisambig', doc.isDisambig())
// console.log('redirectsTo', doc.redirectsTo())
// console.log('redirect', doc.redirect())
// console.log('links', doc.links())
// console.log('text', doc.text())
// console.log('json', doc.json())
