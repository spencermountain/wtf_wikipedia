import fetch from './_fetch/index.js'
import version from './_version.js'
import Document from './01-document/Document.js'

//the main 'factory' exported method
const wtf = function (wiki, options) {
  return new Document(wiki, options)
}

//export classes for plugin development
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

wtf.fetch = function (title, options, cb) {
  return fetch(title, options, cb)
}
wtf.extend = function (fn) {
  fn(models, templates, infoboxes)
  return this
}
wtf.plugin = wtf.extend
wtf.version = version

export default wtf
