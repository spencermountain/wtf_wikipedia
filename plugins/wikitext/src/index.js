const doc = require('./01-doc')
const section = require('./02-section')
const paragraph = require('./03-paragraph')
const sentence = require('./04-sentence')
const link = require('./05-link')
const image = require('./image')
const template = require('./template')
const infobox = require('./infobox')
const list = require('./list')
const reference = require('./reference')
const table = require('./table')

const plugin = function (models) {
  models.Doc.prototype.makeWikitext = doc
  models.Section.prototype.makeWikitext = section
  models.Paragraph.prototype.makeWikitext = paragraph
  models.Sentence.prototype.makeWikitext = sentence
  models.Link.prototype.makeWikitext = link
  models.Image.prototype.makeWikitext = image
  models.Infobox.prototype.makeWikitext = infobox
  models.Template.prototype.makeWikitext = template
  models.Table.prototype.makeWikitext = table
  models.List.prototype.makeWikitext = list
  models.Reference.prototype.makeWikitext = reference
}
module.exports = plugin
