const wtf = require('./src/index');
const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');
let options = {
  // sections: false,
  // paragraphs: false,
  // sentences: true,
  // lists: false,
  // title: false,
  // links: false,
  // images: false,
  // tables: false,
};
// (async () => {
//   const doc = await wtf.fetch(`United Kingdom`, 'en');
//   console.log('|' + doc.latex(options) + '|');
// })();


// let doc = readFile('United-Kingdom');
// console.log(doc.sentences(0).html(options));

var doc = readFile('royal_cinema');
var data = doc.json({
  templates: false,
  images: false,
  infoboxes: true
});
console.log(data);
