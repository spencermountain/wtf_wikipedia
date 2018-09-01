const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
// const doc = await wtf.fetch('Berlin', 'de');
// console.log(doc.sentences(0).plaintext());
// })();

let str = ` {| class="oopsie"
| first row
|-
| Secod row
{|
|-
| embed 1
|-
| embed 2
|}
|-
| Berlin!
|-
|}

Actual first sentence  is here`;
console.log(wtf(str).sentences(0).text());
