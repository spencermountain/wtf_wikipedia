import defaultParse from '../../parse/templates/parse/toJSON/text.ts'
import entries, { type Entry, type Args } from './_external-links.ts'

// External-link templates - https://en.wikipedia.org/wiki/Category:External_link_templates
// Each entry renders as '[url label]' (optionally '... at Site'), so the link is collected by
// the containing block like any other external link, and the arguments are kept as data.

// '20200101' → '2020-01-01'
const fmtDate = (str = '') => str.replace(/^(\d{4})(\d{2})(\d{2}).*$/, '$1-$2-$3')
const archiveSite = (url = '') => {
  if (/archive\.(today|is|ph|li|fo|md|vn)/.test(url)) {
    return 'archive.today'
  }
  if (/webcitation\.org/.test(url)) {
    return 'WebCite'
  }
  return 'the Wayback Machine'
}

// {{bibleverse||John|3:16|KJV}} / {{bibleref|John|3:16}} → John 3:16
const bibleverse = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl)
  let arr = (obj.list || []).map((s) => s.trim())
  // the first positional is an optional book-number prefix, like '1' for 1 Kings
  let num = ''
  if (/^[123]?$/.test(arr[0] || '')) {
    num = arr.shift() || ''
  }
  let [book = '', verse = '', version = ''] = arr
  let ref = `${num} ${book} ${verse}`.trim().replace(/\s+/g, ' ')
  if (!book) {
    return { data: obj, replacement: '' }
  }
  let url = `https://www.biblegateway.com/passage/?search=${encodeURIComponent(ref)}`
  if (version) {
    url += `&version=${encodeURIComponent(version)}`
  }
  return { data: { book: `${num} ${book}`.trim(), verse, version, ref }, replacement: `[${url} ${ref}]` }
}

const makeHandler = (name: string, entry: Entry) => {
  return (tmpl, parse = defaultParse, opts: any = {}) => {
    let obj = parse(tmpl, entry.order)
    let d: Args = { ...obj }
    // {{MusicBrainz artist|mbid=...}} names its id
    if (!d.id && d.mbid) {
      d.id = d.mbid
    }
    let title = opts.title || ''
    let label = entry.label ? entry.label(d, title) : d.name || d.title || title || d.id || ''
    let url = null
    try {
      url = d.id || !entry.order.includes('id') ? entry.url(d, title) : null
      // youtube can be keyed by user/channel instead
      if (!url && (d.u || d.user || d.c || d.channel)) {
        url = entry.url(d, title)
      }
    } catch {
      url = null
    }
    let str = label
    if (url && label) {
      str = `[${url} ${label}]`
    }
    // 'Archived 2020-01-01 at the Wayback Machine'
    if (name === 'webarchive' || name === 'wayback') {
      let date = fmtDate(d.date || '')
      str = [str, date, `at ${archiveSite(d.url || '')}`].filter((s) => s).join(' ')
      if (d.title && name === 'webarchive') {
        str = `${d.title} ${str}`
      }
    } else if (entry.site && label) {
      str += ` ${entry.joiner || 'at'} ${entry.site}`
    }
    return { data: obj, replacement: str }
  }
}

let templates: Record<string, any> = { bibleverse }
Object.keys(entries).forEach((name) => {
  templates[name] = makeHandler(name, entries[name])
})
export default templates
