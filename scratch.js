const wtf = require('./src/index');
const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');
let options = {
  sections: false,
  // paragraphs: false,
  // sentences: true,
  // title: false,
  lists: false,
  // links: false,
  templates: false,
  citations: true
// images: false,
// tables: false,
};
// (async () => {
//   const doc = await wtf.fetch(`United Kingdom`, 'en');
//   console.log('|' + doc.latex(options) + '|');
// })();


let doc = readFile('United-Kingdom');
// console.log(doc.sentences(0).html(options));

// var doc = readFile('royal_cinema');
console.log(doc.html(options));
