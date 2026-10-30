import smartReplace, { linkOccurrence } from './_lib/smartReplace.js'

const defaults = {
  links: true,
  formatting: true,
}

// escape the characters markdown would otherwise read as markup
const escape = (str) => String(str).replace(/[\\*_`[\]]/g, '\\$&')

const BOLD_OPEN = ''
const BOLD_CLOSE = ''
const ITALIC_OPEN = ''
const ITALIC_CLOSE = ''
// one private-use char per link, so later replacements never touch generated markup
const linkToken = (n) => String.fromCharCode(0xe010 + n)

//create links, bold, italic in markdown
const toMarkdown = function (options) {
  options = { ...defaults, ...options }
  let md = escape(this.text())
  const links = []
  //turn links back into links
  if (options.links === true) {
    const cursor = { at: 0 }
    this.links().forEach((link) => {
      const str = escape(link.text() || link.page())
      const nth = linkOccurrence(this, link, cursor)
      const href = (link.href() || '').replace(/ /g, '_')
      const token = linkToken(links.length)
      links.push({ text: str, href })
      md = smartReplace(md, str, () => token, nth)
    })
  }
  // wrap a span - in the text, or inside a link's label
  const wrap = (str, open, close) => {
    const reg = new RegExp('\\b' + str.replace(/[\-[\]/{}()*+?.\\^$|]/g, '\\$&') + '\\b')
    if (reg.test(md) || md.includes(str)) {
      md = smartReplace(md, str, () => open + str + close)
      return
    }
    const link = links.find((l) => l.text === str)
    if (link) {
      link.text = open + link.text + close
    }
  }
  if (options.formatting === true) {
    this.bolds().forEach(({ text: b }) => wrap(escape(b), BOLD_OPEN, BOLD_CLOSE))
    this.italics().forEach(({ text: i }) => wrap(escape(i), ITALIC_OPEN, ITALIC_CLOSE))
  }
  md = [...md]
    .map((c) => {
      const n = c.charCodeAt(0) - 0xe010
      if (n < 0 || n >= links.length) {
        return c
      }
      return '[' + links[n].text + '](' + links[n].href + ')'
    })
    .join('')
    .replace(//g, '**')
    .replace(//g, '**')
    .replace(//g, '*')
    .replace(//g, '*')
  return md
}
export default toMarkdown
