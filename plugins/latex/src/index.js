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
  models.Doc.prototype.latex = doc
  models.Section.prototype.latex = section
  models.Paragraph.prototype.latex = paragraph
  models.Sentence.prototype.latex = sentence
  models.Image.prototype.latex = image
  models.Link.prototype.latex = link
  models.Image.prototype.latex = image
  models.Infobox.prototype.latex = infobox
  models.List.prototype.latex = list
  models.Reference.prototype.latex = reference
  models.Table.prototype.latex = table
}
module.exports = plugin
