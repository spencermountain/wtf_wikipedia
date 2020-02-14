const fetch = require('./_fetch/fetch')
const random = require('./_fetch/random')
const category = require('./_fetch/category')
const version = require('./_version')
const parseDocument = require('./01-document/index.js')

// export classes for plugin development
const models = {
  Doc: require('./01-document/Document'),
  Section: require('./02-section/Section'),
  Paragraph: require('./03-paragraph/Paragraph'),
  Sentence: require('./04-sentence/Sentence'),
  Image: require('./image/Image'),
  Infobox: require('./infobox/Infobox'),
  List: require('./list/List'),
  Reference: require('./reference/Reference'),
  Table: require('./table/Table'),
  Template: require('./templates/Template')
}

//the main 'factory' exported method
const wtf = function(wiki, options) {
  return parseDocument(wiki, options)
}
wtf.fetch = function(title, lang, options, cb) {
  return fetch(title, lang, options, cb)
}
wtf.random = function(lang, options, cb) {
  return random(lang, options, cb)
}
wtf.category = function(cat, lang, options, cb) {
  return category(cat, lang, options, cb)
}
wtf.extend = function(fn) {
  fn(models)
  return this
}
wtf.version = version

module.exports = wtf
