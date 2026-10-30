/* eslint-disable no-console, regexp/no-super-linear-move */
/* global URLSearchParams, fetch */
// Measure template coverage against English Wikipedia, by rendered text rather than by name.
//
// For each of the most-transcluded templates:
//   1. find a real article that uses it, and pull one actual {{invocation}} from its wikitext
//   2. ask Wikipedia to render that invocation on its own (action=parse)  → the ground truth
//   3. render the same invocation with wtf_wikipedia                        → ours
//   4. compare the plain text (and external links) and classify the result
//
// A template that the generic parser already handles correctly scores as 'ok', recognized or not.
// Only templates where Wikipedia shows text that we drop or garble rank highly.
//
//   node --experimental-strip-types scripts/template-coverage.mjs [--top 500] [--samples 2] [--out coverage.tsv]
//
// Results are cached in ./coverage/template-coverage-cache/ so reruns are cheap.

import fs from 'node:fs'
import path from 'node:path'
import wtf from '../src/index.ts'

const args = Object.fromEntries(
  process.argv
    .slice(2)
    .join(' ')
    .split(/\s+--/)
    .filter(Boolean)
    .map((s) => {
      let [k, v = 'true'] = s.replace(/^--/, '').split(/[= ]/)
      return [k, v]
    })
)
const TOP = Number(args.top) || 500
const SAMPLES = Number(args.samples) || 2
const OUT = args.out || 'coverage.tsv'
const API = 'https://en.wikipedia.org/w/api.php'
const UA = 'wtf_wikipedia template-coverage script (https://github.com/spencermountain/wtf_wikipedia)'
// (*.tsv and coverage/ are already gitignored)
const cacheDir = path.join('coverage', 'template-coverage-cache')
fs.mkdirSync(cacheDir, { recursive: true })

// ---------- http, with a disk cache ----------
const cached = async (key, fn) => {
  const file = path.join(cacheDir, key.replace(/[^\w.-]/g, '_').slice(0, 150) + '.json')
  if (fs.existsSync(file)) {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  }
  const res = await fn()
  fs.writeFileSync(file, JSON.stringify(res))
  return res
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const api = async (params) => {
  const url = API + '?' + new URLSearchParams({ format: 'json', formatversion: '2', ...params })
  const key = 'api_' + JSON.stringify(params)
  return cached(key, async () => {
    for (let attempt = 0; attempt < 6; attempt += 1) {
      await sleep(250)
      const res = await fetch(url, { headers: { 'User-Agent': UA, 'Api-User-Agent': UA } })
      if (res.status === 429 || res.status >= 500) {
        // back off: the api asks for a pause with Retry-After
        const wait = Number(res.headers.get('retry-after')) * 1000 || 2000 * Math.pow(2, attempt)
        console.error(`  ${res.status}, waiting ${wait / 1000}s`)
        await sleep(wait)
        continue
      }
      if (!res.ok) {
        throw new Error(`${res.status} ${url}`)
      }
      return res.json()
    }
    throw new Error(`gave up after 6 attempts: ${url}`)
  })
}

// ---------- 1. the most-transcluded templates ----------
// The report page is generated from Module:Transclusion_count/data/<Letter>, which are lua tables:
//   return { ["Reflist"] = 5123456, ["Reflist/styles.css"] = 5123450, ... }
const topTemplates = async () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').concat(['other'])
  const titles = letters.map((c) => 'Module:Transclusion_count/data/' + c)
  const rows = []
  for (let i = 0; i < titles.length; i += 25) {
    const json = await api({ action: 'query', prop: 'revisions', titles: titles.slice(i, i + 25).join('|'), rvprop: 'content', rvslots: 'main' })
    for (const page of json.query?.pages || []) {
      const lua = page.revisions?.[0]?.slots?.main?.content || ''
      const re = /\[\s*(["'])(.+?)\1\s*\]\s*=\s*(\d+)/g
      let m
      while ((m = re.exec(lua))) {
        rows.push({ name: m[2].replace(/_/g, ' '), count: Number(m[3]) })
      }
    }
  }
  if (rows.length === 0) {
    throw new Error('found no transclusion counts - has Module:Transclusion_count/data/ moved?')
  }
  rows.sort((a, b) => b.count - a.count)
  // skip the plumbing that never appears in article wikitext
  const skip = /\/|^(WikiProject|WPBanner|Cite |Citation$|Reflist|Infobox|Navbox|Category |Portal|Authority control|Taxonbar|Short description|Use \w+ dates|Use \w+ English|Pp-|Main other|Yesno|Template |Documentation|Ambox|Mbox|Tmbox|Ombox|Cmbox|Fmbox|Imbox|Asbox|Dmbox|Sidebar|Lang-|Module|Sandbox|Testcases|Navbar|Country data|Talk|Archive|Redirect category|R from|R to|Db-|Noinclude|Includeonly)/i
  return rows.filter((r) => !skip.test(r.name)).slice(0, TOP)
}

// ---------- 2. a real invocation from an article ----------
const findInvocation = (wiki, name) => {
  // first {{name ...}} with balanced braces, case-insensitive on the first letter
  const first = name.charAt(0)
  const re = new RegExp('\\{\\{\\s*[' + first.toLowerCase() + first.toUpperCase() + ']' + name.slice(1).replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/[ _]/g, '[ _]') + '\\s*[|}]')
  const m = re.exec(wiki)
  if (!m) {
    return null
  }
  let depth = 0
  for (let i = m.index; i < wiki.length - 1; i += 1) {
    if (wiki[i] === '{' && wiki[i + 1] === '{') {
      depth += 1
      i += 1
    } else if (wiki[i] === '}' && wiki[i + 1] === '}') {
      depth -= 1
      i += 1
      if (depth === 0) {
        return wiki.slice(m.index, i + 1)
      }
    }
  }
  return null
}
const sampleInvocations = async (name) => {
  const json = await api({ action: 'query', list: 'embeddedin', eititle: 'Template:' + name, einamespace: '0', eilimit: '40' })
  const pages = (json.query?.embeddedin || []).map((p) => p.title)
  const out = []
  for (const title of pages) {
    if (out.length >= SAMPLES) {
      break
    }
    const page = await api({ action: 'query', prop: 'revisions', titles: title, rvprop: 'content', rvslots: 'main' })
    const wiki = page.query?.pages?.[0]?.revisions?.[0]?.slots?.main?.content || ''
    const inv = findInvocation(wiki, name)
    // skip invocations that are too big to be inline text
    if (inv && inv.length < 400) {
      out.push({ title, invocation: inv })
    }
  }
  return out
}

// ---------- 3. ground truth from Wikipedia ----------
const decode = (str) =>
  str
    .replace(/&#x([0-9a-f]+);/gi, (m, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (m, n) => String.fromCodePoint(Number(n)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
const htmlToText = (html) => {
  return decode(
    html
      .replace(/<style[\s\S]*?<\/style>/g, '')
      // reference markers, [citation needed]-style markers, edit links
      .replace(/<sup[^>]*class="[^"]*(reference|noprint|Inline-Template)[^"]*"[\s\S]*?<\/sup>/g, '')
      .replace(/<span class="(mw-editsection|noprint|sortkey|mw-ref|mw-reflink-text)[^"]*"[\s\S]*?<\/span>/g, '')
      // hidden microformat data: (1809-02-12) in birth dates, the extra coordinate formats
      .replace(/<span[^>]*style="[^"]*display:\s*none[^"]*"[\s\S]*?<\/span>/g, '')
      .replace(/<span class="(bday|dtstart|dtend|geo-nondefault|geo-multi-punct|geo-geo-dec|geo-geo-dms)[^"]*"[\s\S]*?<\/span>/g, '')
      .replace(/<br\s*\/?>/g, ' ')
      .replace(/<\/(p|div|li|tr|td|th|h\d)>/g, ' ')
      .replace(/<[^>]+>/g, '')
  )
    .replace(/[\u200b\ufeff\u200e\u200f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}
const renderOnWikipedia = async (invocation, title) => {
  const json = await api({ action: 'parse', text: invocation, title, contentmodel: 'wikitext', prop: 'text|externallinks', disablelimitreport: '1', wrapoutputclass: '' })
  const html = json.parse?.text || ''
  const isBlock = /<table|class="navbox|class="hatnote|class="infobox|<ul|<ol|class="thumb|class="gallery|<div class="(quotebox|toc)/i.test(html)
  return { text: htmlToText(html), links: json.parse?.externallinks || [], isBlock, html }
}

// ---------- 4. compare ----------
const norm = (str) =>
  str
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u00a0\u2009\u202f\u200a]/g, ' ')
    .replace(/ ?– ?/g, '–')
    .replace(/\s*\(\s*/g, ' (')
    .replace(/\s+/g, ' ')
    .replace(/\s*\[edit\]\s*/g, '')
    .trim()
    .toLowerCase()

// things we leave out of .text() on purpose
const omitted = /^(ipa|ipac?-.*|respell|pronunciation|pron-en|efn|efn-.*|refn|sfn.*|harvnb|harvid|r|rp|citation needed|cn|fact|clarify|when|who|which|dubious|dead link|better source needed|page needed|notetag|note|ref|ref label|anchor|visible anchor|hidden begin|hidden end|-r)$/i
const classify = (name, invocation, wp, ours) => {
  const a = norm(wp.text)
  const b = norm(ours.text)
  if (a === b) {
    return 'ok'
  }
  if (omitted.test(name)) {
    return 'omitted'
  }
  if (/cite error/i.test(wp.text)) {
    return 'omitted' // a lone <ref> cannot render outside a page
  }
  if (/^(\{\||\||!)/.test(wp.text.trim())) {
    return 'table-syntax' // {{s-end}}, {{col-2}}: fragments of table markup
  }
  if (/display\s*=\s*title/i.test(invocation) && !b) {
    return 'ok' // title-bar coordinates render nothing in the article body
  }
  if (!a) {
    return b ? 'extra-text' : 'ok' // wikipedia shows nothing; we show nothing or something
  }
  if (wp.isBlock) {
    return b ? 'block-differs' : 'block' // tables, lists, boxes: our '' is usually fine
  }
  if (!b) {
    return 'text-lost'
  }
  if (a.includes(b) || b.includes(a)) {
    return 'partial'
  }
  return 'differs'
}

// ---------- run ----------
const main = async () => {
  const templates = await topTemplates()
  if (templates.length === 0) {
    throw new Error('no templates to check')
  }
  console.error(`checking ${templates.length} templates, ${SAMPLES} samples each`)
  const rows = []
  for (const [i, tmpl] of templates.entries()) {
    try {
      const samples = await sampleInvocations(tmpl.name)
      for (const s of samples) {
        const wp = await renderOnWikipedia(s.invocation, s.title)
        const doc = wtf(s.invocation, { title: s.title })
        const ours = { text: doc.text(), links: doc.links().filter((l) => l.json().type === 'external').map((l) => l.json().site) }
        const status = classify(tmpl.name, s.invocation, wp, ours)
        const linksLost = wp.links.filter((u) => !ours.links.includes(u)).length
        rows.push({ ...tmpl, status, linksLost, invocation: s.invocation, wikipedia: wp.text.slice(0, 120), ours: ours.text.slice(0, 120), page: s.title })
      }
      if (samples.length === 0) {
        rows.push({ ...tmpl, status: 'no-sample', linksLost: 0, invocation: '', wikipedia: '', ours: '', page: '' })
      }
    } catch (e) {
      rows.push({ ...tmpl, status: 'error', linksLost: 0, invocation: '', wikipedia: String(e.message).slice(0, 80), ours: '', page: '' })
    }
    if (i % 25 === 0) {
      console.error(`  ${i}/${templates.length} ${tmpl.name}`)
    }
  }
  // rank: lost text first, weighted by transclusions
  const severity = { 'text-lost': 3, differs: 2, partial: 1, 'block-differs': 1, 'extra-text': 1, block: 0, ok: 0, omitted: 0, 'table-syntax': 0, 'no-sample': 0, error: 0 }
  rows.sort((a, b) => severity[b.status] * b.count - severity[a.status] * a.count)
  const cols = ['name', 'count', 'status', 'linksLost', 'page', 'invocation', 'wikipedia', 'ours']
  const tsv = [cols.join('\t'), ...rows.map((r) => cols.map((c) => String(r[c] ?? '').replace(/[\t\n]/g, ' ')).join('\t'))].join('\n')
  fs.writeFileSync(OUT, tsv)
  // summary
  const byStatus = {}
  rows.forEach((r) => {
    byStatus[r.status] = (byStatus[r.status] || 0) + 1
  })
  console.error('\nby status:', byStatus)
  console.error(`\ntop problems (written to ${OUT}):`)
  rows
    .filter((r) => severity[r.status] > 0)
    .slice(0, 30)
    .forEach((r) => console.error(`  ${r.status.padEnd(12)} ${String(r.count).padStart(9)}  {{${r.name}}}  wp="${r.wikipedia.slice(0, 50)}" ours="${r.ours.slice(0, 50)}"`))
}
main().catch((e) => {
  console.error(e)
  process.exit(1)
})
