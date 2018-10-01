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
hello
* [http://www.abrahamlincolnassociation.org/ Abraham Lincoln Association]
* [http://www.lincolnbicentennial.org/ Abraham Lincoln Bicentennial Foundation]
world
`;
// console.log(wtf(str).templates(0));
console.log(wtf(str).sections(0).text());
