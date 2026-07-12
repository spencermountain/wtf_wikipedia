import { trim_whitespace } from '../_lib/helpers.ts'
import { fromText as parseSentence } from '../04-sentence/index.ts'
import parseReferences from '../reference/index.ts'
import getTemplates from '../template/find/01-nested.ts'
import parseTemplates from '../template/parse/index.ts'
const heading_reg = /^(={1,6})(.{1,200}?)={1,6}$/ //eslint-disable-line
const hasTemplate = /\{\{.+?\}\}/

const doInlineTemplates = function (wiki, doc) {
  let list = getTemplates(wiki)
  list.forEach((item) => {
    let [txt] = parseTemplates(item, doc)
    wiki = wiki.replace(item.body, txt)
  })
  return wiki
}

//estimates the depth of a section and normalizes its title
const parseHeading = function (section, str, doc) {
  let m = str.match(heading_reg)
  if (!m) {
    section.title = ''
    section.depth = 0
    return section
  }
  let title = m[2] || ''
  title = parseSentence(title).text()

  //amazingly, you can see inline {{templates}} in this text, too
  if (hasTemplate.test(title)) {
    title = doInlineTemplates(title, doc)
  }
  //same for references (i know..)
  let obj = { _wiki: title }
  parseReferences(obj)
  title = obj._wiki

  //trim leading/trailing whitespace
  title = trim_whitespace(title)
  let depth = 0
  if (m[1]) {
    depth = m[1].length - 2
  }
  section.title = title
  section.depth = depth
  return section
}

export default parseHeading
