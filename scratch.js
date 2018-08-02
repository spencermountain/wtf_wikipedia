const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');


// wtf.fetch('Albert_Einstein', 'en', function(err, doc) {
//
//   console.log(doc.wikitext().substr(0, 5000));
// // var sentences = doc.section(0).sentences();
// // console.log(sentences)
// });

// '''Albert Einstein''' {{IPAc-en|ˈ|aɪ|n|s|t|aɪ|n}}; 14 March 18`;
let str = `
{{Infobox scientist
| name        = Albert Einstein
| image       = Einstein 1921 by F Schmutzer - restoration.jpg
| spouse      = {{nowrap| {{marriage|[[Elsa Löwenthal]]<br>|1919|1936|end=died}} }}
| residence   = Germany, Italy, Switzerland, Austria (present-day Czech Republic), Belgium, United States
| signature = Albert Einstein signature 1934.svg
}}
`;
str = `he married {{marriage|[[Elsa Löwenthal]]<br>|1919|1936|end=died}}`;
// console.log(wtf(str).text());
console.log(wtf(str).infoboxes(0).json());
