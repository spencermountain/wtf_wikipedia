//we explicitly ignore these, because they sometimes have resolve some data
const list = [
  //https://en.wikipedia.org/wiki/category:templates_with_no_visible_output
  'anchor',
  'defaultsort',
  'use american english',
  'use australian english',
  'use bangladeshi english',
  'use british english',
  'use british english oxford spelling',
  'use canadian english',
  'use dmy dates',
  'use harvard referencing',
  'use hong kong english',
  'use indian english',
  'use irish english',
  'use jamaican english',
  'use list-defined references',
  'use mdy dates',
  'use new zealand english',
  'use pakistani english',
  'use singapore english',
  'use south african english',
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
  'navboxes',
  'reflist',
  'ref-list',
  'div col',
  'authority control',
  //https://en.wikipedia.org/wiki/Template:Citation_needed
  'better source',
  'citation needed',
  'clarify',
  'cite quote',
  'dead link',
  'by whom',
  'dubious',
  'when',
  'who',
  'quantify',
  'refimprove',
  'weasel inline',
];
const ignore = list.reduce((h, str) => {
  h[str] = true;
  return h;
}, {});
module.exports = ignore;
