import { trim_whitespace } from '../_lib/helpers.js'
import { fromText as parseSentence } from '../04-sentence/index.js'
import parseReferences from '../reference/index.js'
import getTemplates from '../template/find/01-nested.js'
import parseTemplates from '../template/parse/index.js'
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

/**
 * @typedef fakeSection
 * @property {string} title
 * @property {null | number} depth
 * @property {string} wiki
 */

/**
 * estimates the depth of a section and parses the title to a normal format
 *
 * @private
 * @param {fakeSection} section
 * @param {string} str
 * @param {Document} doc
 * @returns {fakeSection} section the depth in a object
 */
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
