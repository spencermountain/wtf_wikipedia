const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
// const doc = await wtf.fetch('Berlin', 'de');
// console.log(doc.sentences(0).plaintext());
// })();
let str = `{|class="wikitable sortable"
!Name and Surname!!Height
|-
|data-sort-value="Smith, John"|John Smith||1.85
|-
|data-sort-value="Ray, Ian"|Ian Ray||1.89
|-
|data-sort-value="Bianchi, Zachary"|Zachary Bianchi||1.72
|-
!Average:||1.82
|}`;
let doc = wtf(str);
console.log(doc.tables(0).data[0]);
