const doc = require('./01-doc')
const section = require('./02-section')
const paragraph = require('./03-paragraph')
const sentence = require('./04-sentence')
// const link = require('./05-link')
const infobox = require('./infobox')
const image = require('./image')

const plugin = function(models) {
  models.Doc.latex = doc
  models.Section.latex = section
  models.Paragraph.latex = paragraph
  models.Sentence.latex = sentence
  models.Image.latex = image
  models.Infobox.latex = infobox
  // models.Link.latex = link
  // models.Template.latex = function(opts) {}
}
module.exports = plugin
