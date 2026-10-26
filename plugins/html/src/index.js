import version from './_version.js'
import doc from './01-doc.js'
import section from './02-section.js'
import paragraph from './03-paragraph.js'
import block from './04-block.js'
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

  models.Block.prototype.html = block

  models.Image.prototype.html = image

  models.Infobox.prototype.html = function (options) {
    return infobox.call(this, models.Block, options)
  }

  models.Link.prototype.html = link

  models.List.prototype.html = function (options) {
    return list.call(this, models.Block, options)
  }

  models.Reference.prototype.html = reference

  models.Table.prototype.html = function (options) {
    return table.call(this, models.Block, options)
  }

  // models.Template.html = function(opts) {}
}
plugin.version = version

export default plugin
