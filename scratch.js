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

let str = `
lkjasdfh

==References==
{{reflist}}

`;
console.log(wtf(str).sections());
