import kill_xml from './kill_xml.ts'

// strips out formatting cruft up-front to make the later parsing easier
function preProcess(wiki) {
  //remove comments
  wiki = wiki.replace(/<!--.{0,3000}?-->/gs, '')
  wiki = wiki.replace(/__(NOTOC|NOEDITSECTION|FORCETOC|TOC)__/gi, '')
  //signitures
  wiki = wiki.replace(/~{2,3}/g, '')
  //windows newlines
  wiki = wiki.replaceAll('\r', '')
  //japanese periods - '。'
  wiki = wiki.replaceAll('。', '. ')
  //horizontal rule
  wiki = wiki.replaceAll('----', '')
  //formatting for templates-in-templates...
  wiki = wiki.replaceAll('{{}}', ' – ')
  wiki = wiki.replaceAll('{{\\}}', ' / ')
  // some html escaping
  wiki = wiki.replaceAll('&nbsp;', ' ')
  wiki = wiki.replaceAll('&ndash;', '–')
  wiki = wiki.replaceAll('&mdash;', '—')
  wiki = wiki.replaceAll('&amp;', '&')
  wiki = wiki.replaceAll('&quot;', '"')
  wiki = wiki.replaceAll('&apos;', "'")
  wiki = wiki.replaceAll('&copy;', '©')
  wiki = wiki.replaceAll('&reg;', '®')
  wiki = wiki.replaceAll('&trade;', '™')
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
