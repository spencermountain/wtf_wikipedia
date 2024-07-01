import kill_xml from './kill_xml.js'

/**
 * removes unnecessary strings from the wikitext
 * it is mostly-formatting stuff can be cleaned-up first, to make life easier
 *
 * @private
 * @param {string} wiki the wikitext that needs processing
 * @returns {string} the processed text
 */
function preProcess(wiki) {
  //remove comments
  wiki = wiki.replace(/<!--[\s\S]{0,3000}?-->/g, '')
  wiki = wiki.replace(/__(NOTOC|NOEDITSECTION|FORCETOC|TOC)__/gi, '')
  //signitures
  wiki = wiki.replace(/~{2,3}/g, '')
  //windows newlines
  wiki = wiki.replace(/\r/g, '')
  //japanese periods - '。'
  wiki = wiki.replace(/\u3002/g, '. ')
  //horizontal rule
  wiki = wiki.replace(/----/g, '')
  //formatting for templates-in-templates...
  wiki = wiki.replace(/\{\{\}\}/g, ' – ')
  wiki = wiki.replace(/\{\{\\\}\}/g, ' / ')
  // some html escaping
  wiki = wiki.replace(/&nbsp;/g, ' ')
  wiki = wiki.replace(/&ndash;/g, '–')

  //give it the inglorious send-off it deserves..
  wiki = kill_xml(wiki)
  //({{template}},{{template}}) leaves empty parentheses
  wiki = wiki.replace(/\([,;: ]+\)/g, '')
  //these templates just screw things up, too
  wiki = wiki.replace(/\{\{(baseball|basketball) (primary|secondary) (style|color).*?\}\}/i, '')

  return wiki
}
export default preProcess
