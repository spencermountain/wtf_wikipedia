const fetch = require('./_fetch/fetch')
const random = require('./_fetch/random')
const category = require('./_fetch/category')
const version = require('./_version')
const parseDocument = require('./01-document/index.js')

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
wtf.version = version

module.exports = wtf
