const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
//   const doc = await wtf.fetch(`Saint Clare's Hospital at Boonton Township`, 'en');
//   console.log(doc.plaintext());
// })();

let str = wtf(`first sentence.
* akuter Tinnitus (bis drei Monate)
* chronischer Tinnitus (über drei Monate)
last sentence. `).sentences();

console.log(str);
