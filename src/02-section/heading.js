const fns = require('../_lib/helpers')
const parseSentence = require('../04-sentence/').fromText
const parseReferences = require('../reference/')
const heading_reg = /^(={1,5})(.{1,200}?)={1,5}$/

//interpret depth, title of headings like '==See also=='
const parseHeading = function(section, str) {
  let m = str.match(heading_reg)
  if (!m) {
    section.title = ''
    section.depth = 0
    return section
  }
  let title = m[2] || ''
  title = parseSentence(title).text()
  //amazingly, you can see inline {{templates}} in this text, too
  //... let's not think about that now.
  title = title.replace(/\{\{.+?\}\}/, '')
  //same for references (i know..)
  let obj = { wiki: title }
  parseReferences(obj)
  title = obj.wiki
  //trim leading/trailing whitespace
  title = fns.trim_whitespace(title)
  let depth = 0
  if (m[1]) {
    depth = m[1].length - 2
  }
  section.title = title
  section.depth = depth
  return section
}
module.exports = parseHeading
