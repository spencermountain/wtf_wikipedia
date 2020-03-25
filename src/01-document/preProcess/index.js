const kill_xml = require('./kill_xml')

//this mostly-formatting stuff can be cleaned-up first, to make life easier
function preProcess(doc) {
  let wiki = doc.wiki
  //remove comments
  wiki = wiki.replace(/<!--[\s\S]{0,2000}?-->/g, '')
  wiki = wiki.replace(/__(NOTOC|NOEDITSECTION|FORCETOC|TOC)__/gi, '')
  //signitures
  wiki = wiki.replace(/~~{1,3}/g, '')
  //windows newlines
  wiki = wiki.replace(/\r/g, '')
  //japanese periods - '。'
  wiki = wiki.replace(/\u3002/g, '. ')
  //horizontal rule
  wiki = wiki.replace(/----/g, '')
  //formatting for templates-in-templates...
  wiki = wiki.replace(/\{\{\}\}/g, ' – ')
  wiki = wiki.replace(/\{\{\\\}\}/g, ' / ')
  //space
  wiki = wiki.replace(/&nbsp;/g, ' ')
  //give it the inglorious send-off it deserves..
  wiki = kill_xml(wiki)
  //({{template}},{{template}}) leaves empty parentheses
  wiki = wiki.replace(/\([,;: ]+?\)/g, '')
  //these templates just screw things up, too
  wiki = wiki.replace(/{{(baseball|basketball) (primary|secondary) (style|color).*?\}\}/i, '')
  doc.wiki = wiki
}
module.exports = preProcess
