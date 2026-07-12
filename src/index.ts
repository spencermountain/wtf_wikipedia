import fetch from './_fetch/index.ts'
import version from './_version.ts'
import Document from './01-document/Document.ts'

//the main 'factory' exported method
const wtf = function (wiki, options) {
  return new Document(wiki, options)
}

//export classes for plugin development
import Doc from './01-document/Document.ts'
import Section from './02-section/Section.ts'
import Paragraph from './03-paragraph/Paragraph.ts'
import Sentence from './04-sentence/Sentence.ts'
import Image from './image/Image.ts'
import Infobox from './infobox/Infobox.ts'
import Link from './link/Link.ts'
import List from './list/List.ts'
import Reference from './reference/Reference.ts'
import Table from './table/Table.ts'
import Template from './template/Template.ts'
import http from './_lib/fetch.ts'
import templates from './template/custom/index.ts'
import infoboxes from './infobox/_infoboxes.ts'

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
