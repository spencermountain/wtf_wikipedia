/* eslint-disable no-console */
// diffs the fetched wikipedia data (01-03, cached in ./data/) against ../src/langs/ — the editable source of truth.
// reports per-pack name and param drift, core collisions and cross-pack conflicts. writes nothing.
//   +  new on wikipedia, not in src (name lines are paste-ready for a pack's aliases)
//   ~  fetched value disagrees with src
//   ?  in src but unconfirmed by the fetch — fine if kept by hand (silence via overrides.include)
//   !  needs attention (core collision, unpinned cross-family claim, cross-pack conflict)
import { readdirSync } from 'node:fs'
import { families } from './_config.js'
import { readData } from './_lib.js'
import overrides from './overrides.js'
import coreTemplates from '../../../src/templates/index.ts'
import coreAliases from '../../../src/templates/aliases.ts'

const sitelinks = readData('01-sitelinks.json')
const redirects = readData('02-redirects.json')
const paramData = readData('03-params.json')

// 'Modèle:Lien web' → 'lien web'
const strip = (title) => title.replace(/^[^:]+:/, '').toLowerCase().trim()
// single-character names are fine outside ascii ('旗', '門'), never inside it.
// a ':' reads as parser-function syntax, so those names can never match anyway.
const badName = (name) =>
  name.length === 0 || name.length > 60 || (name.length === 1 && /[\x20-\x7e]/.test(name)) || /[|{}=[\]<>#:]/.test(name) || /^\d+$/.test(name)

// every localized name for one family, with the wikis it was seen on
const gather = (fam) => {
  const names = new Map()
  const add = (title, lang) => {
    const name = strip(title)
    if (!names.has(name)) {
      names.set(name, new Set())
    }
    names.get(name).add(lang)
  }
  const pages = (sitelinks[fam] && sitelinks[fam].pages) || {}
  Object.keys(pages).forEach((lang) => pages[lang].forEach((title) => add(title, lang)))
  Object.keys(redirects).forEach((lang) => {
    const list = redirects[lang] ? redirects[lang][fam] : null
    if (lang !== '_fetched' && list) {
      list.forEach((title) => add(title, lang))
    }
  })
  return names
}

const famKeys = Object.keys(families)
const infoboxFam = famKeys.find((fam) => families[fam].infobox)
const all = {}
famKeys.forEach((fam) => {
  all[fam] = gather(fam)
})

let drift = 0
const report = (line) => {
  drift += 1
  console.log(line)
}

const excluded = new Set(overrides.exclude)
// junk, excluded names, and anything the core registry already owns can never register
const unusable = (name) => badName(name) || excluded.has(name) || coreTemplates[name] !== undefined || coreAliases[name] !== undefined

// a name can only serve one family — pin decides, unpinned claims are unusable either way
const claims = {}
famKeys.forEach((fam) => {
  all[fam].forEach((_langs, name) => {
    claims[name] = claims[name] || []
    claims[name].push(fam)
  })
})
Object.keys(claims)
  .filter((name) => claims[name].length > 1)
  .forEach((name) => {
    const keep = overrides.pin[name]
    claims[name].forEach((fam) => {
      if (fam !== keep) {
        all[fam].delete(name)
      }
    })
    if (!keep && unusable(name) === false) {
      console.log(`! '${name}' claimed by ${claims[name].join(' + ')} — pin or exclude it in overrides.js`)
    }
  })

// the shipped view: every pack directory in ../src/langs/
const langDir = new URL('../src/langs/', import.meta.url)
const packNames = readdirSync(langDir).filter((f) => f !== '_lib.js' && f !== 'all' && f.startsWith('.') === false)
const packLangs = new Set(packNames.filter((lang) => lang !== 'other'))
const packs = {}
for (const lang of packNames) {
  const mod = await import(new URL(`${lang}/index.js`, langDir))
  packs[lang] = mod.default
}
const packFam = {}
packNames.forEach((lang) => {
  const map = new Map()
  const data = packs[lang]
  Object.keys(data.aliases || {}).forEach((name) => map.set(name, data.aliases[name]))
  Object.keys(data.templates || {}).forEach((name) => {
    const def = data.templates[name]
    map.set(name, (def && def.template) || 'custom')
  })
  ;(data.infoboxes || []).forEach((name) => map.set(name, infoboxFam))
  packFam[lang] = map
})

// names the fetch expects in one pack: seen on that wiki ('other' = seen only on wikis without a pack)
const fetchedFor = (lang) => {
  const map = new Map()
  famKeys.forEach((fam) => {
    all[fam].forEach((langSet, name) => {
      if (name === fam || unusable(name)) {
        return
      }
      const inScope = lang === 'other' ? [...langSet].every((l) => packLangs.has(l) === false) : langSet.has(lang)
      if (inScope) {
        map.set(name, fam)
      }
    })
  })
  return map
}

// hand-kept names are expected to be unconfirmed — never report them
const handKept = new Set(Object.values(overrides.include).flat())

// template names, per pack
packNames.sort().forEach((lang) => {
  const want = fetchedFor(lang)
  const have = packFam[lang]
  want.forEach((fam, name) => {
    if (have.has(name) === false) {
      report(`+ ${lang}: '${name}': '${fam}',`)
    } else if (have.get(name) !== fam && have.get(name) !== 'custom') {
      report(`~ ${lang}: '${name}' fetched as ${fam}, src has ${have.get(name)}`)
    }
  })
  const gone = [...have.keys()].filter((name) => want.has(name) === false && handKept.has(name) === false).sort()
  if (gone.length > 0) {
    console.log(`? ${lang}: in src but unconfirmed by fetch — ${gone.map((name) => `'${name}'`).join(', ')}`)
  }
})

// core grows over time; a name it adopts would be shadowed by the plugin.
// one name must also resolve to the same template in every pack.
const owner = new Map()
packNames.forEach((lang) => {
  packFam[lang].forEach((fam, name) => {
    if (coreTemplates[name] !== undefined || coreAliases[name] !== undefined) {
      report(`! ${lang}: '${name}' collides with the core registry — remove it from src`)
    }
    if (owner.has(name) && owner.get(name).fam !== fam && fam !== 'custom' && owner.get(name).fam !== 'custom') {
      report(`! '${name}' is ${owner.get(name).fam} in ${owner.get(name).lang} but ${fam} in ${lang}`)
    } else {
      owner.set(name, { lang, fam })
    }
  })
})

// numbered co-author params (nom3→last3 …) are never shipped
const trimMap = (found) => {
  const map = {}
  Object.keys(found).forEach((key) => {
    if (/[2-9]$/.test(key) === false && /[2-9]$/.test(found[key]) === false) {
      map[key] = found[key]
    }
  })
  return map
}

// param maps: what live TemplateData offers vs what a pack's template defs carry
packNames.forEach((lang) => {
  if (lang === 'other' || paramData[lang] === undefined) {
    return
  }
  famKeys.forEach((fam) => {
    const found = paramData[lang][fam]
    if (!found) {
      return
    }
    const fetchedMap = trimMap(found)
    if (Object.keys(fetchedMap).length === 0) {
      return
    }
    const shipsFam = [...packFam[lang].values()].includes(fam)
    if (shipsFam === false) {
      return
    }
    const maps = Object.values(packs[lang].templates)
      .filter((def) => def && def.template === fam && def.map)
      .map((def) => def.map)
    if (maps.length === 0) {
      report(`+ ${lang}: ${fam} has ${Object.keys(fetchedMap).length} param renames on wikipedia — add a { template, map } def`)
      return
    }
    Object.keys(fetchedMap).forEach((key) => {
      const hit = maps.find((map) => map[key] !== undefined)
      if (!hit) {
        report(`+ ${lang} ${fam}: '${key}' → '${fetchedMap[key]}'`)
      } else if (hit[key] !== fetchedMap[key] && maps.every((map) => map[key] !== fetchedMap[key])) {
        report(`~ ${lang} ${fam}: '${key}' → '${fetchedMap[key]}' (src has '${hit[key]}')`)
      }
    })
  })
})

// page-level words: fetched category/redirect namespaces + stub/infobox sitelinks vs each pack.
// extra words in a pack are hand-kept and fine; only fetched-but-missing ones are drift.
const fetchedWords = readData('04-words.json')
packNames.forEach((lang) => {
  if (lang === 'other') {
    return
  }
  const pack = packs[lang]
  const wanted = {
    category: fetchedWords.langs[lang]?.category || [],
    redirect: fetchedWords.langs[lang]?.redirect || [],
    image: fetchedWords.langs[lang]?.image || [],
    stub: fetchedWords.stub[lang] ? [fetchedWords.stub[lang]] : [],
    infobox: fetchedWords.infobox[lang] ? [fetchedWords.infobox[lang]] : [],
    disambig: fetchedWords.disambig[lang] ? [fetchedWords.disambig[lang]] : [],
  }
  Object.keys(wanted).forEach((kind) => {
    wanted[kind]
      .filter((word) => word !== kind && (pack[kind] || []).includes(word) === false)
      .forEach((word) => report(`+ ${lang}: ${kind}: '${word}',`))
  })
})

if (drift === 0) {
  console.log('✓ src matches the fetched data — no drift')
} else {
  console.log(`\n${drift} differences — src stays the source of truth; fold in what you want by hand`)
  process.exitCode = 1
}
