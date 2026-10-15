import fetch from './_fetch/index.ts'
import version from './_version.ts'
import http from './_lib/fetch.ts'

import {
  Document,
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
  templates,
  infoboxes,
} from './API/index.ts'

//the main 'factory' exported method
const wtf = function (wiki, options) {
  return new Document(wiki, options)
}

const models = {
  Doc: Document,
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
