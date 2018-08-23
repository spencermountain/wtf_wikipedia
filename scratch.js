const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
//   const document = await wtf.fetch('Formel 1', 'de');
//
//   console.log(document.section('Länderbezug').sentences(4).plaintext());
// })();

let str = ` ''[[archon]]'' `;
console.log(wtf(str).sentences(0).links());
// console.log(wtf(str).images());
