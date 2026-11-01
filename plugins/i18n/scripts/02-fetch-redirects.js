/* eslint-disable no-console */
// each wiki's aliases for a template are redirects to its canonical page.
// one batched api call per wiki covers every family found in stage 01.
import { families, langs } from './_config.js'
import { getJson, readData, writeData, today } from './_lib.js'

const sitelinks = readData('01-sitelinks.json')

// the canonical localized title(s) → family key, for one wiki
const titlesOn = (lang) => {
  const lookup = {}
  Object.keys(families).forEach((fam) => {
    const pages = (sitelinks[fam] && sitelinks[fam].pages[lang]) || []
    pages.forEach((page) => {
      lookup[page] = fam
    })
  })
  return lookup
}

const out = { _fetched: today() }
for (const lang of langs) {
  const lookup = titlesOn(lang)
  const titles = Object.keys(lookup)
  if (titles.length === 0) {
    continue
  }
  const base =
    `https://${lang}.wikipedia.org/w/api.php?action=query&prop=redirects&rdlimit=500` +
    `&format=json&formatversion=2&titles=${encodeURIComponent(titles.join('|'))}`
  const found = {}
  let next = ''
  for (;;) {
    const res = await getJson(base + next)
    // the api may normalize our titles; map them back
    const denormal = {}
    ;(res.query.normalized || []).forEach((n) => {
      denormal[n.to] = n.from
    })
    ;(res.query.pages || []).forEach((page) => {
      const fam = lookup[page.title] || lookup[denormal[page.title]]
      if (!fam || !page.redirects) {
        return
      }
      found[fam] = found[fam] || []
      page.redirects.forEach((r) => found[fam].push(r.title))
    })
    if (!res.continue) {
      break
    }
    const cont = res.continue
    next = '&' + Object.keys(cont).map((key) => `${key}=${encodeURIComponent(cont[key])}`).join('&')
  }
  out[lang] = found
  const count = Object.values(found).reduce((n, list) => n + list.length, 0)
  console.log(`${lang.padEnd(8)} ${count} redirects across ${Object.keys(found).length} templates`)
}

writeData('02-redirects.json', out)
console.log('\nwrote scripts/data/02-redirects.json')
