const doc = require('./01-doc')
const section = require('./02-section')
const paragraph = require('./03-paragraph')
const sentence = require('./04-sentence')
const link = require('./05-link')
const image = require('./image')
const infobox = require('./infobox')
const list = require('./list')
const reference = require('./reference')
const table = require('./table')

const plugin = function(models) {
  models.Doc.prototype.wikitext = doc
  models.Section.prototype.wikitext = section
  models.Paragraph.prototype.wikitext = paragraph
  models.Sentence.prototype.wikitext = sentence
  models.Link.prototype.wikitext = link
  models.Image.prototype.wikitext = image
  models.Infobox.prototype.wikitext = infobox
  models.Table.prototype.wikitext = table
  models.List.prototype.wikitext = list
  models.Reference.prototype.wikitext = reference
}
module.exports = plugin
