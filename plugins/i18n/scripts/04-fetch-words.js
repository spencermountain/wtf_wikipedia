/* eslint-disable no-console */
// per-wiki page-level words: the category namespace and redirect magic word come from
// each wiki's siteinfo api; stub + infobox template names come from wikidata sitelinks.
import { langs } from './_config.js'
import { getJson, writeData, today } from './_lib.js'

// sitelink keys like 'frwiki' → lang 'fr'; skip the non-wikipedia projects
const skipSites = new Set(['commonswiki', 'specieswiki', 'metawiki', 'mediawikiwiki', 'wikidatawiki', 'incubatorwiki', 'sourceswiki'])
const langOf = (site) => {
  if (/wiki$/.test(site) === false || skipSites.has(site)) {
    return null
  }
  return site.slice(0, -4).replace(/_/g, '-')
}
// 'Modèle:Ébauche' → 'ébauche'
const dropNamespace = (title) => title.replace(/^[^:]+:/, '').toLowerCase().trim()

// one wikidata call per anchor template, linking its name on every wikipedia
const sitelinksFor = async (page) => {
  const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&sites=enwiki&titles=${encodeURIComponent(page)}&props=sitelinks&format=json`
  const res = await getJson(url)
  const entity = Object.values(res.entities || {})[0]
  const byLang = {}
  Object.values(entity.sitelinks || {}).forEach((link) => {
    const lang = langOf(link.site)
    if (lang !== null) {
      byLang[lang] = dropNamespace(link.title)
    }
  })
  return byLang
}

// the english words core handles on its own
const english = new Set(['category', 'redirect', 'file', 'image', 'stub', 'infobox', 'disambiguation'])
const clean = (words) => [...words].map((w) => w.toLowerCase().trim()).filter((w) => english.has(w) === false && w.length > 0)

const out = { _fetched: today(), langs: {} }
out.stub = await sitelinksFor('Template:Stub')
out.infobox = await sitelinksFor('Template:Infobox')
out.disambig = await sitelinksFor('Template:Disambiguation')
Object.keys(out).forEach((kind) => {
  if (kind !== '_fetched' && kind !== 'langs') {
    Object.keys(out[kind]).forEach((lang) => {
      if (english.has(out[kind][lang])) {
        delete out[kind][lang]
      }
    })
  }
})

// each wiki's siteinfo: category + file namespace names, redirect magic word aliases
for (const lang of langs) {
  const url = `https://${lang}.wikipedia.org/w/api.php?action=query&meta=siteinfo&siprop=namespaces%7Cnamespacealiases%7Cmagicwords&format=json`
  const res = await getJson(url)
  const { namespaces, namespacealiases, magicwords } = res.query
  const names = { 6: new Set(), 14: new Set() }
  names[6].add(namespaces['6']['*'])
  names[14].add(namespaces['14']['*'])
  ;(namespacealiases || []).forEach((a) => {
    if (names[a.id]) {
      names[a.id].add(a['*'])
    }
  })
  const redirect = new Set()
  const magic = (magicwords || []).find((m) => m.name === 'redirect')
  ;(magic ? magic.aliases : []).forEach((a) => redirect.add(a.replace(/^#/, '')))
  out.langs[lang] = {
    category: clean(names[14]),
    redirect: clean(redirect),
    image: clean(names[6]),
  }
  console.log(`${lang}: ${out.langs[lang].category.join(', ')} / ${out.langs[lang].image.join(', ')}`)
}

writeData('04-words.json', out)
console.log(`\n${langs.length} wikis fetched → scripts/data/04-words.json`)
