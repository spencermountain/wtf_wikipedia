import misc from '../text-and-data/misc.ts'
import parsers from '../text-and-data/dates/_parsers.ts'

// The base registry is English Wikipedia. These overlays add the template names other wikis
// use for the same things, and are applied only when a document's lang/project matches.
// A plugin writes into them via `wtf.extend((models, templates, infoboxes, i18n) => { i18n.byLang.fr ??= {}; ... })`.

// reuse a base handler under another name, keeping its data 'kind'
const as = (handler, kind: string) => {
  const fn = (...args) => handler(...args)
  fn.kind = kind
  return fn
}

// per-language template names live in wtf-plugin-i18n's packs (their `gated` section); this is the mount point
const byLang: Record<string, Record<string, any>> = {}

const byProject: Record<string, Record<string, any>> = {
  wikinews: {
    byline: as(parsers.date, 'date'),
    dateline: as(parsers.date, 'date'),
    source: as(misc.citation, 'citation'),
    'source-pr': as(misc.citation, 'citation'),
    'source-science': as(misc.citation, 'citation'),
  },
}

export { byLang, byProject }
export default { byLang, byProject }
