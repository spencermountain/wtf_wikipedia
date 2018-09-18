const wtf = require('./src/index');
const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');
let options = {
  sections: true,
  // paragraphs: false,
  // sentences: true,
  // title: false,
  lists: true,
  // links: false,
  templates: false,
  citations: false
// images: false,
// tables: false,
};
// (async () => {
//   const doc = await wtf.fetch(`United Kingdom`, 'en');
//   console.log('|' + doc.latex(options) + '|');
// })();


// let doc = readFile('United-Kingdom');
// console.log(doc.sentences(0).html(options));

let str = `John smith was a comedian<ref name="cool">{{cite web |url=http://supercool.com |title=John Smith sure was |last= |first= |date= |website= |publisher= |access-date= |quote=}}</ref>
and tap-dance pioneer. He was born in glasgow<ref>irelandtimes</ref>.

This is paragraph two.<ref>{{cite web |url=http://paragraphtwo.net}}</ref> It is the same deal.

==Section==
Here is the third paragraph. Nobody knows if this will work.<ref>[http://commonsense.com/everybody|says everybody]</ref>

`;
console.log(wtf(str).paragraphs(0).references());
