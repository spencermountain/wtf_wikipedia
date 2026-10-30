import currency from '../text-and-data/currency.ts'
import misc from '../text-and-data/misc.ts'
import dataFns from '../data-only/functions.ts'
import parsers from '../text-and-data/dates/_parsers.ts'

// The base registry is English Wikipedia. These overlays add the template names other wikis
// use for the same things, and are applied only when a document's lang/project matches.
// A plugin can add its own with `wtf.extend((models, templates, infoboxes, i18n) => { i18n.fr.foo = ... })`.

// reuse a base handler under another name, keeping its data 'kind'
const as = (handler, kind: string) => {
  const fn = (...args) => handler(...args)
  fn.kind = kind
  return fn
}

const byLang: Record<string, Record<string, any>> = {
  fr: {
    monnaie: as(currency.currency, 'currency'),
    unité: as(currency.currency, 'currency'),
    nombre: as(currency.currency, 'currency'),
    nb: as(currency.currency, 'currency'),
    iso4217: as(currency.currency, 'currency'),
  },
  es: {
    'cita requerida': as(dataFns['citation needed'], 'citation needed'),
  },
  it: {
    'citazione necessaria': as(dataFns['citation needed'], 'citation needed'),
  },
  pt: {
    pbpe: 0, // https://pt.wikipedia.org/wiki/Predefinição:PBPE - português brasileiro/europeu
  },
  eu: {
    egiptekas: '{|-\n',
  },
}

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
