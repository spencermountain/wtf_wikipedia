const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
// const doc = await wtf.fetch('Berlin', 'de');
// console.log(doc.sentences(0).plaintext());
// })();

var doc=wtf("[[Fileaway|Fileaway]]")
console.log(doc.text())
//should return "Fileaway"; actually returns "away"
