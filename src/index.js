import fetch from './_fetch/index.js'
import Document from './01-document/Document.js'
import version from './_version.js'

/**
 * the main 'factory' exported method
 *
 * @param {string} [wiki]
 * @param {object} [options] options for parsing the wiki text
 * @returns {Document} a parsed document
 */
function wtf (wiki, options) {
  return new Document(wiki, options)
}

wtf.fetch = fetch
wtf.version = version

//export classes for plugin development
// and export them for typescript compatibility
import Doc from './01-document/Document.js'
import Section from './02-section/Section.js'
import Paragraph from './03-paragraph/Paragraph.js'
import Sentence from './04-sentence/Sentence.js'
import Image from './image/Image.js'
import Infobox from './infobox/Infobox.js'
import Link from './link/Link.js'
import List from './list/List.js'
import Reference from './reference/Reference.js'
import Table from './table/Table.js'
import Template from './template/Template.js'
import http from './_lib/fetch.js'
import templates from './template/custom/index.js'
import infoboxes from './infobox/_infoboxes.js'

const models = {
  Doc,
  Section,
  Paragraph,
  Sentence,
  Image,
  Infobox,
  Link,
  List,
  Reference,
  Table,
  Template,
  http,
  wtf: wtf,
}

/**
 * there are multiple plugins available for wtf_wikipedia
 * these enable new parse options or different ways of outputting the wiki text
 *
 * @param {function} fn a wtf_wikipedia plugin
 * @returns {wtf} the extended
 */
wtf.extend = function (fn) {
  fn(models, templates, infoboxes)
  return this
}
wtf.plugin = wtf.extend

wtf.Document = Doc
wtf.Section = Section
wtf.Paragraph = Paragraph
wtf.Sentence = Sentence
wtf.Image = Image
wtf.Infobox = Infobox
wtf.Link = Link
wtf.List = List
wtf.Reference = Reference
wtf.Table = Table
wtf.Template = Template

export default wtf
