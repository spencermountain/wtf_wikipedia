import { findSection, withChildren } from '../_lib.js'

// the roster is a list of {{CFL player|21|N|[[Daniel Adeboboye]]}} templates
const parseRoster = function (doc) {
  const s = findSection(doc, ['roster', 'current roster'])
  if (!s) {
    return []
  }
  const entries = withChildren(doc, s).flatMap((c) => c.templates('cfl player'))
  return entries.map((tmpl) => {
    const list = tmpl.json().data?.list || []
    return {
      number: parseInt(String(list[0]).replace(/[^0-9]/g, ''), 10) || null,
      name: String(list[2] || '').trim(),
      position: '', //the cfl template carries no position
      status: String(list[1] || '').trim(), //N=national, I=international, G=global
    }
  })
}

export { parseRoster }
