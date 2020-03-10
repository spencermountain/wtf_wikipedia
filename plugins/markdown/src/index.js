const doc = require('./01-doc')
const section = require('./02-section')
const paragraph = require('./03-paragraph')
const sentence = require('./04-sentence')
// const link = require('./05-link')
const infobox = require('./infobox')
const image = require('./image')

const plugin = function(models) {
  models.Doc.markdown = doc
  models.Section.markdown = section
  models.Paragraph.markdown = paragraph
  models.Sentence.markdown = sentence
  models.Image.markdown = image
  models.Infobox.markdown = infobox
  // models.Link.markdown = link
  // models.Template.markdown = function(opts) {}
}
module.exports = plugin
