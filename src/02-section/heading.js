const { trim_whitespace } = require('../_lib/helpers')
const parseSentence = require('../04-sentence/').fromText
const parseReferences = require('../reference/')
const getTemplates = require('../template/find/01-nested.js')
const parseTemplates = require('../template/parse/index.js')
const heading_reg = /^(={1,5})(.{1,200}?)={1,5}$/
const hasTemplate = /\{\{.+?\}\}/

const doInlineTemplates = function (wiki) {
  let list = getTemplates(wiki)
  if (list.length) {
    let [txt] = parseTemplates(list[0])
    wiki = wiki.replace(list[0].body, txt)
  }
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
 * @returns {fakeSection} section the depth in a object
 */
const parseHeading = function (section, str) {
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
    title = doInlineTemplates(title)
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

module.exports = parseHeading
