const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');


// wtf.fetch('Albert_Einstein', 'en', function(err, doc) {
//   var sentences = doc.section(0).sentences();
//   console.log(sentences);
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

// str = `'''Albert Einstein''' ({{IPAc-en|ˈ|aɪ|n|s|t|aɪ|n}};<ref>{{cite book|last=Wells|first=John|authorlink=John C. Wells|title=Longman Pronunciation Dictionary|publisher=Pearson Longman|edition=3rd|date=3 April 2008|isbn=1-4058-8118-6}}</ref> {{IPA-de|ˈalbɛɐ̯t ˈʔaɪnʃtaɪn|lang|Albert Einstein german.ogg}}; 14 March 1879&nbsp;– 18&nbsp;April 1955) was a German-born<!-- Please do not change this—see talk page and its many archives.--> theoretical physicist`;
// console.log(wtf(str).text());
console.log(wtf(str).infoboxes(0).json());
