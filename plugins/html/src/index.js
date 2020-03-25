const doc = require('./01-doc')
const section = require('./02-section')
const paragraph = require('./03-paragraph')
const sentence = require('./04-sentence')
const link = require('./05-link')
const infobox = require('./infobox')
const image = require('./image')
const list = require('./list')
const reference = require('./reference')
const table = require('./table')

const plugin = function(models) {
  models.Doc.prototype.html = doc

  models.Section.prototype.html = section

  models.Paragraph.prototype.html = paragraph

  models.Sentence.prototype.html = sentence

  models.Image.prototype.html = image

  models.Infobox.prototype.html = infobox

  models.Link.prototype.html = link

  models.List.prototype.html = list

  models.Reference.prototype.html = reference

  models.Table.prototype.html = table

  // models.Template.html = function(opts) {}
}
module.exports = plugin
