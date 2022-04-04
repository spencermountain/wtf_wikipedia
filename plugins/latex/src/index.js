import doc from './01-doc.js'
import section from './02-section.js'
import paragraph from './03-paragraph.js'
import sentence from './04-sentence.js'
import link from './05-link.js'
import image from './image.js'
import infobox from './infobox.js'
import list from './list.js'
import reference from './reference.js'
import table from './table.js'

const plugin = function (models) {
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
export default plugin
