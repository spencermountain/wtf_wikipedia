const fetch = require('./_fetch')
const random = require('./_fetch/random')
const category = require('./_fetch/category')
const version = require('./_version')
const Document = require('./01-document/Document')
//this gets swapped for client-version in builds
const http = require('./_fetch/http/server')

//the main 'factory' exported method
const wtf = function (wiki, options) {
  return new Document(wiki, options)
}

//export classes for plugin development
const models = {
  Doc: require('./01-document/Document'),
  Section: require('./02-section/Section'),
  Paragraph: require('./03-paragraph/Paragraph'),
  Sentence: require('./04-sentence/Sentence'),
  Image: require('./image/Image'),
  Infobox: require('./infobox/Infobox'),
  Link: require('./link/Link'),
  List: require('./list/List'),
  Reference: require('./reference/Reference'),
  Table: require('./table/Table'),
  Template: require('./template/Template'),
  http: require('./_fetch/http/server'),
  wtf: wtf,
}
let templates = require('./template/templates')

wtf.fetch = function (title, lang, options, cb) {
  return fetch(title, lang, options, cb)
}
wtf.random = function (lang, options, cb) {
  return random(lang, options, cb)
}
wtf.category = function (cat, lang, options, cb) {
  return category(cat, lang, options, cb)
}
wtf.extend = function (fn) {
  fn(models, templates, this, http)
  return this
}
wtf.version = version

module.exports = wtf
