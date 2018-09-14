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

// var doc = readFile('royal_cinema');
// console.log(wtf(`My image [File:my_image.png]`).images(0).latex());

var have = wtf(`==My Section==
Leading text
* First item
*Second Item
Closing remark`).latex();
console.log(have);
