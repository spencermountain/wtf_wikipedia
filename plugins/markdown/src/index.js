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
  models.Doc.prototype.markdown = doc
  models.Section.prototype.markdown = section
  models.Paragraph.prototype.markdown = paragraph
  models.Sentence.prototype.markdown = sentence
  models.Link.prototype.markdown = link
  models.Image.prototype.markdown = image
  models.Infobox.prototype.markdown = infobox
  models.Table.prototype.markdown = table
  models.List.prototype.markdown = list
  models.Reference.prototype.markdown = reference
}
module.exports = plugin
