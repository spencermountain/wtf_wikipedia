const Document = require('./Document')
const redirects = require('./redirects')
const disambig = require('./disambig')
const preProcess = require('./preProcess')
const parse = {
  section: require('../02-section'),
  categories: require('./categories')
}

//convert wikiscript markup lang to json
const main = function(wiki, options) {
  options = options || {}
  let doc = Object.assign(options, {
    title: options.title || null,
    pageID: options.pageID || options.id || null,
    namespace: options.namespace || options.ns || null,
    type: 'page',
    wiki: wiki || '',
    sections: [],
    categories: [],
    coordinates: []
  })
  //detect if page is just redirect, and return it
  if (redirects.isRedirect(wiki) === true) {
    doc.type = 'redirect'
    doc.redirectTo = redirects.parse(wiki)
    parse.categories(doc)
    return new Document(doc)
  }
  //detect if page is just disambiguator page, and return
  if (disambig.isDisambig(doc.wiki) === true) {
    doc.type = 'disambiguation'
  }
  //give ourselves a little head-start
  preProcess(doc)
  //pull-out [[category:whatevers]]
  parse.categories(doc)
  //parse all the headings, and their texts/sentences
  doc.sections = parse.section(doc.wiki, doc) || []
  //all together now
  return new Document(doc)
}

module.exports = main
