/* eslint-disable no-console */
// Render each example page with Wikipedia's own parser, and show a readable diff against our .text().
//
//   node scripts/render/index.js                 # every page in tests/_examples/pages
//   node scripts/render/index.js zh/Toronto      # one page
//   node scripts/render/index.js Toronto         # that page in every language
//
// Each wikipedia sentence we don't reproduce exactly is shown diffed against the closest sentence
// of ours: [-removed-] {+added+}, coloured on a terminal. Pages with no differences are skipped.
// Wikipedia's html is cached in ./coverage/rendered-text-cache/ - delete it to re-render.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import wtf from '../../src/index.ts'
import renderOnWikipedia from './fetch.js'
import { htmlToText, sentences, compare } from './lib.js'
import { closest, wordDiff, renderDiff, changes } from './diff.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(here, '..', '..')
const pagesDir = path.join(root, 'tests', '_examples', 'pages')
const cacheDir = path.join(root, 'coverage', 'rendered-text-cache')
fs.mkdirSync(cacheDir, { recursive: true })
const MAX_DIFFS = 8

const color = process.stdout.isTTY
const bold = (t) => (color ? `\x1b[1m${t}\x1b[0m` : t)
const dim = (t) => (color ? `\x1b[2m${t}\x1b[0m` : t)
const yellow = (t) => (color ? `\x1b[33m${t}\x1b[0m` : t)

// ---- which pages: 'zh/Toronto' or 'Toronto' ----
const wanted = process.argv.slice(2).map((s) => s.toLowerCase().replace(/\.txt$/, ''))
const pages = []
for (const lang of fs.readdirSync(pagesDir)) {
  for (const file of fs.readdirSync(path.join(pagesDir, lang))) {
    const name = file.replace(/\.txt$/, '')
    const id = `${lang}/${name}`.toLowerCase()
    if (wanted.length === 0 || wanted.includes(id) || wanted.includes(name.toLowerCase())) {
      pages.push({
        lang,
        name,
        title: name.replace(/-/g, ' '),
        wikitext: fs.readFileSync(path.join(pagesDir, lang, file), 'utf8'),
      })
    }
  }
}
if (pages.length === 0) {
  console.error(`no example page matches '${process.argv.slice(2).join(' ')}' - try 'en/Anarchism'`)
  process.exit(1)
}

const rendered = async (page) => {
  const cache = path.join(cacheDir, `${page.lang}-${page.name}.html`)
  if (fs.existsSync(cache)) {
    return fs.readFileSync(cache, 'utf8')
  }
  const html = await renderOnWikipedia(page.wikitext, { lang: page.lang, title: page.title })
  fs.writeFileSync(cache, html)
  return html
}

// ---- run ----
let matched = 0
let total = 0
for (const page of pages) {
  let html
  try {
    html = await rendered(page)
  } catch (e) {
    console.log(`${bold(`${page.lang}/${page.name}`)}  ${yellow('could not render: ' + e.message)}`)
    continue
  }
  const wikipedia = htmlToText(html)
  const ourText = wtf(page.wikitext, { lang: page.lang, title: page.title }).text()
  const result = compare(wikipedia, ourText, page.lang)
  matched += result.matched
  total += result.total
  const pct = (result.score * 100).toFixed(0)
  if (result.missing.length === 0) {
    console.log(`${bold(`${page.lang}/${page.name}`)}  ${dim(`${result.matched}/${result.total} sentences match`)}`)
    continue
  }
  console.log(`\n${bold(`━━ ${page.lang}/${page.name}`)}  ${result.matched}/${result.total} sentences match (${pct}%)`)
  const ourSentences = sentences(ourText, page.lang)
  result.missing.slice(0, MAX_DIFFS).forEach((sen) => {
    const near = closest(sen, ourSentences)
    if (!near.sentence || near.score < 0.3) {
      console.log(`  ${yellow('lost')}  ${sen.slice(0, 200)}`)
      return
    }
    const parts = wordDiff(sen, near.sentence)
    console.log(`  ${dim('diff')}  ${renderDiff(parts, color)}`)
    console.log(`        ${dim(changes(parts).join('  '))}`)
  })
  if (result.missing.length > MAX_DIFFS) {
    console.log(dim(`  … ${result.missing.length - MAX_DIFFS} more`))
  }
}
if (pages.length > 1) {
  console.log(
    `\n${bold('total')}  ${matched}/${total} wikipedia sentences reproduced exactly (${((matched / total) * 100).toFixed(1)}%)`
  )
}
