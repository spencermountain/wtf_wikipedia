import kill_xml from './kill_xml.js'

// strips out formatting cruft up-front to make the later parsing easier
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
  wiki = wiki.replace(/&mdash;/g, '—')
  wiki = wiki.replace(/&amp;/g, '&')
  wiki = wiki.replace(/&quot;/g, '"')
  wiki = wiki.replace(/&apos;/g, "'")
  wiki = wiki.replace(/&copy;/g, '©')
  wiki = wiki.replace(/&reg;/g, '®')
  wiki = wiki.replace(/&trade;/g, '™')
  // wiki = wiki.replace(/&lt;/g, '<')
  // wiki = wiki.replace(/&gt;/g, '>')

  //give it the inglorious send-off it deserves..
  wiki = kill_xml(wiki)
  //({{template}},{{template}}) leaves empty parentheses
  wiki = wiki.replace(/\([,;: ]+\)/g, '')
  //these templates just screw things up, too
  wiki = wiki.replace(/\{\{(baseball|basketball) (primary|secondary) (style|color).*?\}\}/gi, '')

  return wiki
}
export default preProcess
