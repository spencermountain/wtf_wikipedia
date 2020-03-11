const doc = require('./01-doc')
const section = require('./02-section')
const paragraph = require('./03-paragraph')
const sentence = require('./04-sentence')
const link = require('./05-link')
const infobox = require('./infobox')
const image = require('./image')
const template = require('./template')

const plugin = function(models) {
  models.Doc.prototype.wikitext = doc

  models.Section.prototype.wikitext = section

  models.Paragraph.prototype.wikitext = paragraph

  models.Sentence.prototype.wikitext = sentence

  models.Image.prototype.wikitext = image

  models.Infobox.prototype.wikitext = infobox

  models.Template.prototype.wikitext = template

  models.Link.prototype.wikitext = link
}
module.exports = plugin
