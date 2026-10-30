import smartReplace from './_lib/smartReplace.js'

const defaults = {
  links: true,
  formatting: true,
}
const escape = (str) =>
  String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const BOLD_OPEN = '\uE000'
const BOLD_CLOSE = '\uE001'
const ITALIC_OPEN = '\uE002'
const ITALIC_CLOSE = '\uE003'
// one private-use char per link, so later replacements never touch generated markup
const linkToken = (n) => String.fromCharCode(0xe010 + n)

// create links, bold, italic in html
const doSentence = function (options) {
  options = { ...defaults, ...options }
  let text = escape(this.text())
  // mark bold/italic spans first, so a bolded link wraps the whole <a>
  if (options.formatting === true) {
    this.bolds().forEach(({ text: str }) => {
      str = escape(str)
      text = smartReplace(text, str, () => BOLD_OPEN + str + BOLD_CLOSE)
    })
    this.italics().forEach(({ text: str }) => {
      str = escape(str)
      text = smartReplace(text, str, () => ITALIC_OPEN + str + ITALIC_CLOSE)
    })
  }
  const tags = []
  if (options.links === true) {
    this.links().forEach((link) => {
      const str = escape(link.text() || link.page())
      const token = linkToken(tags.length)
      tags.push(link.html())
      text = smartReplace(text, str, () => token)
    })
  }
  text = text
    .replace(/[\uE010-\uE0FF]/g, (c) => tags[c.charCodeAt(0) - 0xe010] ?? '')
    .replace(/\uE000/g, '<b>')
    .replace(/\uE001/g, '</b>')
    .replace(/\uE002/g, '<i>')
    .replace(/\uE003/g, '</i>')
  return '<span class="sentence">' + text + '</span>'
}
export default doSentence
