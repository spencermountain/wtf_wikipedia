const doc = require('./01-doc')
const section = require('./02-section')
const paragraph = require('./03-paragraph')
const sentence = require('./04-sentence')
// const link = require('./05-link')
const infobox = require('./infobox')
const image = require('./image')

const plugin = function(models) {
  models.Doc.html = doc

  models.Section.html = section

  models.Paragraph.html = paragraph

  models.Sentence.html = sentence

  models.Image.html = image

  models.Infobox.html = infobox
  // models.Template.html = function(opts) {}
  // models.Link.html = link
}
module.exports = plugin
