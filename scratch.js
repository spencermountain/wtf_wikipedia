const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
//   var doc = await wtf.fetch('Jurassic Park (film)');
//   console.log(doc.infoboxes(0).keyValue());
// })();

// let doc = readFile('jodie_emery');
// console.log(doc.markdown());


var str = `hellow world
{{Based on|''[[Jurassic Park (novel)|Jurassic Park]]''|Michael Crichton}}

{{Plain list|
* [[Sam Neill]]
* [[Laura Dern]]
* [[Jeff Goldblum]]
* [[Richard Attenborough]]
* [[Bob Peck]]
* [[Martin Ferrero]]
* [[BD Wong]]
* [[Samuel L. Jackson]]
* [[Wayne Knight]]
* [[Joseph Mazzello]]
* [[Ariana Richards]]
}}`;
let doc = wtf(str, {
  missing_templates: true
});
console.log(doc.text());
