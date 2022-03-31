import doc from './01-doc.js'
import section from './02-section.js'
import paragraph from './03-paragraph.js'
import sentence from './04-sentence.js'
import link from './05-link.js'
import infobox from './infobox.js'
import image from './image.js'
import list from './list.js'
import reference from './reference.js'
import table from './table.js'

const plugin = function (models) {
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
export default plugin
