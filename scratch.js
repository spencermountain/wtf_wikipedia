const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// wtf.fetch('Spencer', 'en', function(err, doc) {
//   console.log(doc.plaintext());
//   console.log(doc.isDisambiguation());
// });




let str = `
{{Infobox scientist
| name        = Albert Einstein
| image       = Einstein 1921 by F Schmutzer - restoration.jpg
| spouse      = {{nowrap| {{marriage|[[Elsa Löwenthal]]<br>|1919|1936|end=died}} }}
| residence   = Germany, Italy, Switzerland, Austria (present-day Czech Republic), Belgium, United States
| signature = Albert Einstein signature 1934.svg
}}
`;
// console.log(wtf(str).infoboxes(0).json());
str = `{{nowrap| {{nowrap| {{marriage|[[Elsa Löwenthal]]<br>|1919|1936|end=died}} }}}}`;
console.log(wtf(str).plaintext());
