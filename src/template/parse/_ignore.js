//we explicitly ignore these, because they sometimes have resolve some data
const list = [
  //https://en.wikipedia.org/wiki/category:templates_with_no_visible_output
  'anchor',
  'defaultsort',
  'use list-defined references',
  'void',
  //https://en.wikipedia.org/wiki/Category:Protection_templates
  'pp',
  'pp-move-indef',
  'pp-semi-indef',
  'pp-vandalism',
  //https://en.wikipedia.org/wiki/Template:R
  'r',
  //out-of-scope still - https://en.wikipedia.org/wiki/Template:Tag
  '#tag',
  //https://en.wikipedia.org/wiki/Template:Navboxes
  // 'navboxes',
  // 'reflist',
  // 'ref-list',
  'div col',
  // 'authority control',
  //https://en.wikipedia.org/wiki/Template:Citation_needed
  // 'better source',
  // 'citation needed',
  // 'clarify',
  // 'cite quote',
  // 'dead link',
  // 'by whom',
  // 'dubious',
  // 'when',
  // 'who',
  // 'quantify',
  // 'refimprove',
  // 'weasel inline',
  //https://en.wikipedia.org/wiki/Template:End
  'pope list end',
  'shipwreck list end',
  'starbox end',
  'end box',
  'end',
  's-end',
]
const ignore = list.reduce((h, str) => {
  h[str] = true
  return h
}, {})
module.exports = ignore
