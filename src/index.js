const fetch = require('./_fetch')
const version = require('./_version')
const Document = require('./01-document/Document')

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
let infoboxes = require('./infobox/_infoboxes')

wtf.fetch = function (title, lang, options, cb) {
  return fetch(title, lang, options, cb)
}
wtf.extend = function (fn) {
  fn(models, templates, infoboxes)
  return this
}
wtf.plugin = wtf.extend
wtf.version = version

module.exports = wtf
