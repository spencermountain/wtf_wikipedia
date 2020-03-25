const Document = require('./Document')
const redirects = require('./redirects')
const preProcess = require('./preProcess')
const parse = {
  section: require('../02-section'),
  categories: require('./categories')
}

//convert wikiscript markup lang to json
const main = function(wiki, options) {
  options = options || {}
  let data = Object.assign(options, {
    title: options.title || null,
    pageID: options.pageID || options.id || null,
    namespace: options.namespace || options.ns || null,
    type: 'page',
    wiki: wiki || '',
    categories: [],
    sections: [],
    coordinates: []
  })
  //detect if page is just redirect, and return it
  if (redirects.isRedirect(wiki) === true) {
    data.type = 'redirect'
    data.redirectTo = redirects.parse(wiki)
    parse.categories(data)
    return new Document(data)
  }
  //give ourselves a little head-start
  preProcess(data)
  //pull-out [[category:whatevers]]
  parse.categories(data)
  //parse all the headings, and their texts/sentences
  parse.section(data)
  //all together now
  return new Document(data)
}

module.exports = main
