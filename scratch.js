const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
//   const doc = await wtf.fetch(`Abraham Lincoln`, 'en');
//   // doc.html();
// })();

let doc = wtf(`hello world.


paragraph two is here.
== section two==
paragraph three is here.
* some list
* is here
last paragraph here.
`);
console.log(doc.json());
