const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
//   const doc = await wtf.fetch(`Saint Clare's Hospital at Boonton Township`, 'en');
//   console.log(doc.plaintext());
// })();

let str = `'''Saint Clare's Hospital''' Catholic Health Init`;
console.log(wtf(str).plaintext());
