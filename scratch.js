const wtf = require('./src/index');
const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
//   let doc = await wtf.fetch('Pete Townshend', 'en');
//   console.log(doc.infoboxes(0).images(0).thumb());
// })();

// let doc = readFile('jodie_emery');
// console.log(doc.infobox(0).images(0).thumb());

var str = `
{{sdfurresncy|1,000}} gives: ¥1,000
`;
let doc = wtf(str, {
  missing_templates: true
});
// console.log(doc.templates());
console.log(doc.text());
