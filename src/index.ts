import fetch from './API/_fetch/index.ts'
import version from './_version.ts'
import http from './API/_lib/fetch.ts'
import parse from './parse/index.ts'
import templates from './templates/index.ts'
import infoboxes from './_data/infoboxes.ts'

import type { DocInfo } from './types/index.ts'
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
} from './API/index.ts'

//the main 'factory' exported method
const wtf = function (wiki: string, info?: DocInfo) {
  const data = parse(wiki, info)
  return new Document(data, info)
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
