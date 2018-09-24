const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
//   let doc = await wtf.fetch('Rush Street (Chicago)', 'en');
//   console.log(doc.json());
// })();

// let doc = readFile('Mark-Behr');
// console.log(doc.infobox(0).data);

var str = `
{{Infobox
|image =
[[Image:20070913 Rush Street Swing Bridge beyond Wrigley Building.JPG|asd]]
}}`;
console.log(wtf(str).json());
