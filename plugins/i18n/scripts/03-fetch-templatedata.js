/* eslint-disable no-console */
// TemplateData on each wiki names a template's parameters, usually listing the
// english ones as aliases — enough to map localized params to the names core reads.
import { families, langs, englishParams } from './_config.js'
import { getJson, readData, writeData, today } from './_lib.js'

const sitelinks = readData('01-sitelinks.json')
const english = new Set(englishParams)
const paramFamilies = Object.keys(families).filter((fam) => families[fam].params)

// 'nom' with aliases [nom1, last, last1] → { nom: 'last', nom1: 'last' }
const mapParams = (params) => {
  const map = {}
  Object.keys(params).forEach((name) => {
    const names = [name, ...(params[name].aliases || [])]
      .map((s) => String(s).toLowerCase().trim())
      .filter((s) => s && /^\d+$/.test(s) === false)
    const target = englishParams.find((e) => names.includes(e))
    if (!target) {
      return
    }
    names.forEach((s) => {
      if (s !== target && english.has(s) === false) {
        map[s] = target
      }
    })
  })
  return map
}

const out = { _fetched: today() }
for (const lang of langs) {
  const lookup = {}
  paramFamilies.forEach((fam) => {
    const pages = (sitelinks[fam] && sitelinks[fam].pages[lang]) || []
    pages.forEach((page) => {
      lookup[page] = fam
    })
  })
  const titles = Object.keys(lookup)
  if (titles.length === 0) {
    continue
  }
  const url =
    `https://${lang}.wikipedia.org/w/api.php?action=templatedata&format=json` +
    `&titles=${encodeURIComponent(titles.join('|'))}`
  const res = await getJson(url)
  const found = {}
  Object.values(res.pages || {}).forEach((page) => {
    const fam = lookup[page.title]
    if (!fam || !page.params) {
      return
    }
    const map = mapParams(page.params)
    if (Object.keys(map).length > 0) {
      // a family may span two templates on one wiki — merge their maps
      found[fam] = Object.assign(found[fam] || {}, map)
    }
  })
  if (Object.keys(found).length > 0) {
    out[lang] = found
    console.log(`${lang.padEnd(8)} param maps for: ${Object.keys(found).join(', ')}`)
  }
}

writeData('03-params.json', out)
console.log('\nwrote scripts/data/03-params.json')
