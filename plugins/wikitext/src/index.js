import doc from './01-doc.js'
import section from './02-section.js'
import paragraph from './03-paragraph.js'
import sentence from './04-sentence.js'
import link from './05-link.js'
import image from './image.js'
import template from './template.js'
import infobox from './infobox.js'
import list from './list.js'
import reference from './reference.js'
import table from './table.js'

function plugin (models) {
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
export default plugin
