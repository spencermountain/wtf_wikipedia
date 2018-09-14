const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
//   const doc = await wtf.fetch(`Abraham Lincoln`, 'en');
//   // doc.html();
// })();

let doc = wtf(`hello world.
new line here.
 
then skipped two
`);

// paragraph two is here.
// == section two==
// paragraph three is here.
// * some list
// * is here
// last paragraph here.
let options = {
  sentences: true,
  images: false
};
console.log(doc.paragraphs());

// console.log(options);
