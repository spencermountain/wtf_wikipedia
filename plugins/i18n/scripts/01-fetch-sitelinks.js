/* eslint-disable no-console */
// each template family's wikidata item links the template's page on every wikipedia.
// one api call per anchor-site fetches the canonical localized name for ~300 wikis.
// a family may list `extra` anchors — native templates that have their own item.
import { families, langs } from './_config.js'
import { getJson, writeData, today } from './_lib.js'

const api = 'https://www.wikidata.org/w/api.php'

// sitelink keys like 'frwiki' → lang 'fr'; skip the non-wikipedia projects
const skipSites = new Set(['commonswiki', 'specieswiki', 'metawiki', 'mediawikiwiki', 'wikidatawiki', 'incubatorwiki', 'sourceswiki'])
const langOf = (site) => {
  if (/wiki$/.test(site) === false || skipSites.has(site)) {
    return null
  }
  return site.slice(0, -4).replace(/_/g, '-')
}

// every anchor page, grouped by the wiki that holds it
const anchors = []
Object.keys(families).forEach((fam) => {
  anchors.push({ fam, site: families[fam].site || 'enwiki', page: families[fam].page })
  ;(families[fam].extra || []).forEach((a) => anchors.push({ fam, site: a.site, page: a.page }))
})
const bySite = {}
anchors.forEach((a) => {
  bySite[a.site] = bySite[a.site] || []
  bySite[a.site].push(a)
})

const out = { _fetched: today() }
for (const site of Object.keys(bySite)) {
  const titles = bySite[site].map((a) => a.page).join('|')
  const url = `${api}?action=wbgetentities&sites=${site}&titles=${encodeURIComponent(titles)}&props=sitelinks&format=json`
  const res = await getJson(url)
  const entities = Object.values(res.entities || {})
  bySite[site].forEach((anchor) => {
    const entity = entities.find((e) => e.sitelinks && e.sitelinks[site] && e.sitelinks[site].title === anchor.page)
    if (!entity) {
      console.log(`⚠️  no wikidata item found for ${site} ${anchor.page}`)
      return
    }
    out[anchor.fam] = out[anchor.fam] || { items: [], pages: {} }
    const fam = out[anchor.fam]
    fam.items.push(entity.id)
    Object.keys(entity.sitelinks).forEach((key) => {
      const lang = langOf(key)
      if (!lang) {
        return
      }
      fam.pages[lang] = fam.pages[lang] || []
      if (fam.pages[lang].includes(entity.sitelinks[key].title) === false) {
        fam.pages[lang].push(entity.sitelinks[key].title)
      }
    })
    console.log(`${anchor.fam.padEnd(20)} ${entity.id.padEnd(10)} ${Object.keys(fam.pages).length} wikis`)
  })
}

writeData('01-sitelinks.json', out)
console.log(`\nwrote scripts/data/01-sitelinks.json (${langs.length} langs configured for stages 02-03)`)
