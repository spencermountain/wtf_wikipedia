const wtf = require('./src/index');
const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

(async () => {
  // #1  - SK Koeban Krasnodar
  // #3  - Vleitjagra
  // #4  - Indiese gelowe
  // let doc = await wtf.fetch('SK Koeban Krasnodar', 'af');
  // console.log(doc.templates());
})();

// let doc = readFile('Mark-Behr');
// console.log(doc.infobox(0).data);

var str = `hello {{citation|url=citation.one/here}} <ref>{{citation|url=citation.two/here}}</ref>`;
var arr = wtf(str).citations().map(c => c.json());
console.log(arr);
