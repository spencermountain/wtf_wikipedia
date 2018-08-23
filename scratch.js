const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// let p = wtf.fetch('Kurmi', 'en');
// p.then((doc) => {
//   console.log(doc.images());
// }).catch(console.log);


let str = `hello
* {{rhymes|are|lang=it}}
 `;
console.log(wtf(str).text());
console.log(wtf(str).templates());
