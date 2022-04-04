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
export default plugin
