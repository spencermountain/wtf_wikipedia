import fetch from './API/_fetch/index.ts'
import version from './_version.ts'
import { warnDeprecated } from './API/_lib/warn.ts'
import parse from './parse/index.ts'
import templates, { i18n } from './world/templates/index.ts'
import infoboxes from './world/data/infoboxes.ts'
import { refreshWrappers } from './_lib/plural-wrapper.ts'
import type { DocInfo } from './types/index.ts'
import makeWorld from './world/index.ts'
import {
  Document,
  Section,
  Paragraph,
  Image,
  Infobox,
  Link,
  List,
  Reference,
  Table,
  Template,
  Block,
} from './API/index.ts'

//the main 'factory' exported method
const wtf = function (wiki: string, info: DocInfo = {}) {
  const world = makeWorld()
  const data = parse(wiki, info)
  return new Document(data, info, world)
}

const models = {
  Doc: Document,
  Section,
  Paragraph,
  Image,
  Infobox,
  Link,
  List,
  Reference,
  Table,
  Template,
  Block,
  wtf: wtf,
}

wtf.fetch = function (title, options, cb) {
  // the callback/errback form has been removed
  if (typeof cb === 'function') {
    warnDeprecated(
      'callback removed',
      `wtf.fetch() no longer accepts a callback - the one passed-in will never be called.`,
      `use the promise:  let doc = await wtf.fetch(title)`
    )
  }
  return fetch(title, options)
}
wtf.extend = function (fn) {
  fn(models, templates, infoboxes, i18n)
  refreshWrappers()
  return this
}
wtf.plugin = wtf.extend
wtf.version = version

export default wtf
