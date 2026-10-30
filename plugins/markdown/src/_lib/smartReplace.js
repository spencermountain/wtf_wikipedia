//escape a string like 'fun*2.Co' for a regExpr
function escapeRegExp(str) {
  return str.replace(/[\-[\]/{}()*+?.\\^$|]/g, '\\$&')
}

// rough plaintext of some wikitext, enough to count words
const stripWiki = (str) =>
  str
    .replace(/<ref[^>]*\/>/g, '')
    .replace(/<ref[\s\S]*?<\/ref>/g, '')
    .replace(/\{\{[\s\S]*?\}\}/g, '')
    .replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, '$1')
    .replace(/\[https?:\/\/\S+ ([^\]]*)\]/g, '$1')
    .replace(/'{2,}/g, '')

// count how many times `text` appears in `str`
const countIn = (str, text) => {
  let n = 0
  let at = str.indexOf(text)
  while (at !== -1) {
    n += 1
    at = str.indexOf(text, at + text.length)
  }
  return n
}

// which occurrence of its text does this link stand on?
// found by locating the link in the sentence's wikitext and counting the same words before it
const linkOccurrence = function (sentence, link, cursor = { at: 0 }) {
  const wiki = sentence.wikitext() || ''
  const linkWiki = link.wikitext() || ''
  const text = link.text() || link.page() || ''
  if (!wiki || !linkWiki || !text) {
    return 0
  }
  const idx = wiki.indexOf(linkWiki, cursor.at)
  if (idx === -1) {
    return 0
  }
  cursor.at = idx + linkWiki.length
  return countIn(stripWiki(wiki.slice(0, idx)), text)
}

//sometimes text-replacements can be ambiguous - words used multiple times..
// `nth` picks which occurrence (0-based) to replace; falls back to the first
const smartReplace = function (all, text, result, nth = 0) {
  if (!text || !all) {
    return all
  }
  if (typeof all === 'number') {
    all = String(all)
  }
  const fn = typeof result === 'function' ? result : () => result
  //try a word-boundary replace
  const reg = new RegExp('\\b' + escapeRegExp(text) + '\\b', 'g')
  const matches = [...all.matchAll(reg)]
  if (matches.length > 0) {
    const m = matches[nth] || matches[0]
    return all.slice(0, m.index) + fn(m[0]) + all.slice(m.index + m[0].length)
  }
  //otherwise, fall-back to a much messier, dangerous replacement
  let at = all.indexOf(text)
  for (let i = 0; i < nth && at !== -1; i += 1) {
    const next = all.indexOf(text, at + text.length)
    if (next === -1) {
      break
    }
    at = next
  }
  if (at === -1) {
    return all
  }
  return all.slice(0, at) + fn(text) + all.slice(at + text.length)
}

export { linkOccurrence }
export default smartReplace
