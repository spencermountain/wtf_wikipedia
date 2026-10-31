/* eslint-disable regexp/no-super-linear-move */
// Compare our .text() against what Wikipedia itself renders for the same wikitext.
// Used by scripts/render/index.js

// remove an element and everything inside it, including nested ones of the same tag
const removeElements = (html, tag, attrRegex) => {
  const open = new RegExp(`<${tag}\\b[^>]*>`, 'gi')
  let out = html
  let m
  // find each opening tag that matches, then walk to its matching close
  while ((m = open.exec(out))) {
    if (attrRegex && !attrRegex.test(m[0])) {
      continue
    }
    const start = m.index
    let depth = 0
    const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, 'gi')
    re.lastIndex = start
    let n
    let end = -1
    while ((n = re.exec(out))) {
      depth += n[1] === '/' ? -1 : 1
      if (depth === 0) {
        end = n.index + n[0].length
        break
      }
    }
    if (end === -1) {
      break
    }
    out = out.slice(0, start) + ' ' + out.slice(end)
    open.lastIndex = start
  }
  return out
}

const decode = (str) =>
  str
    .replace(/&#x([0-9a-f]+);/gi, (m, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (m, n) => String.fromCodePoint(Number(n)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')

// the article prose, roughly as .text() scopes it: no tables, infoboxes, navboxes, references,
// image captions, hatnotes, edit links or maintenance boxes
const htmlToText = (html) => {
  let out = html.replace(/<style[\s\S]*?<\/style>/g, '').replace(/<!--[\s\S]*?-->/g, '')
  out = removeElements(out, 'table')
  out = removeElements(out, 'figure')
  // .text() leaves out section headings
  out = out.replace(/<h[1-6]\b[^>]*>[\s\S]*?<\/h[1-6]>/g, ' ')
  out = removeElements(out, 'ol', /class="[^"]*references/)
  out = removeElements(
    out,
    'div',
    /class="[^"]*(hatnote|thumb|navbox|toc|reflist|mw-references-wrap|side-box|sistersitebox|dmbox|metadata|ambox|gallery|quotebox|mw-collapsible|navigation-not-searchable|printfooter|catlinks|preview-warning|shortdescription|portal\b)/
  )
  // citation templates render as <cite>; we leave citations out of .text()
  out = removeElements(out, 'cite')
  out = removeElements(out, 'div', /style="[^"]*display:\s*none/)
  out = removeElements(out, 'sup', /class="[^"]*(reference|noprint|Inline-Template)/)
  out = removeElements(
    out,
    'span',
    /class="[^"]*(mw-editsection|sortkey|mw-ref|mw-cite-backlink|bday|dtstart|dtend|geo-nondefault|geo-multi-punct)/
  )
  out = removeElements(out, 'span', /style="[^"]*display:\s*none/)
  out = out.replace(/<br\s*\/?>/g, ' ').replace(/<\/(p|div|li|tr|td|th|h\d|dd|dt)>/g, ' ')
  out = out.replace(/<[^>]+>/g, '')
  return decode(out)
    .replace(/[\u200b\ufeff\u200e\u200f\u00ad]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

const cjk = new Set(['ja', 'zh', 'ko', 'th'])
// cosmetic differences that are not worth failing on
const normalize = (str) =>
  str
    // our list items render as ' * item'
    .replace(/(^|\n)\s*(\*|\d+\.)\s+/g, '$1')
    .replace(/[\u2018\u2019\u2032]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u00a0\u2009\u202f\u200a]/g, ' ')
    .replace(/\s*[\u2013\u2014]\s*/g, '\u2013')
    .replace(/\s+([,.;:!?)])/g, '$1')
    .replace(/\(\s+/g, '(')
    .replace(/\s+/g, ' ')
    .trim()

// split prose into sentences, roughly the way our own sentence parser does
const abbreviations =
  /\b(c|ca|mr|mrs|ms|dr|prof|st|no|vs|etc|e\.g|i\.e|jr|sr|fl|[rbdp]|vol|pp|ed|op|cf|al|inc|ltd|co|gen|col|lt|sgt|capt|rev|hon|mt|ft|in|jan|feb|mar|apr|jun|jul|aug|sep|sept|oct|nov|dec)\.(?= ?\S)/gi
const sentences = (str, lang = 'en') => {
  str = normalize(str)
  if (cjk.has(lang)) {
    return (str.match(/[^。！？]+[。！？]?/g) || []).map((sen) => sen.trim()).filter((sen) => sen.length > 1)
  }
  // keep 'c. 1912' and 'Mr. Smith' together, then split on sentence-final punctuation
  const guarded = str
    .replace(abbreviations, (m) => m.replace('.', '\u0000'))
    .replace(/\b(\p{Lu})\.(?= ?\p{Lu})/gu, '$1\u0000')
  return (guarded.match(/[^.!?]+(?:[.!?]+(?=\s|$)|$)/g) || [])
    .map((sen) => sen.split('\u0000').join('.').trim())
    .filter((sen) => sen.length > 1)
}

// which of wikipedia's sentences appear verbatim in ours
const compare = (wikipediaText, ourText, lang = 'en') => {
  const theirs = sentences(wikipediaText, lang)
  const ours = normalize(ourText)
  const missing = theirs.filter((sen) => !ours.includes(sen))
  return {
    total: theirs.length,
    matched: theirs.length - missing.length,
    score: theirs.length ? (theirs.length - missing.length) / theirs.length : 1,
    missing,
  }
}

export { htmlToText, normalize, sentences, compare }
