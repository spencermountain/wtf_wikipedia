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
| caption     = Albert Einstein in 1921
| death_place = {{nowrap|[[Princeton, New Jersey]], US}}
| spouse      = {{marriage|[[Mileva Marić]]<br>|1903|1919|end=div}}<br />{{nowrap|{{marriage|[[Elsa Löwenthal]]<br>|1919|1936|end=died}}<ref>{{cite book |editor-last=Heilbron |editor-first=John L. |title=The Oxford Companion to the History of Modern Science |url=https://books.google.com/books?id=abqjP-_KfzkC&pg=PA233 |date=2003 |publisher=Oxford University Press |isbn=978-0-19-974376-6 |page=233}}</ref>{{sfnp|Pais|1982|p=301}}}}
| residence   = Germany, Italy, Switzerland, Austria (present-day Czech Republic), Belgium, United States
| signature = Albert Einstein signature 1934.svg
}}
Albert Einstein is a scientist 14 March 18`;

str = `{{marriage|[[Mileva Marić]]<br>|1903|1919|end=div}}<br />{{nowrap|{{marriage|[[Elsa Löwenthal]]<br>|1919|1936|end=died}}<ref>{{cite book |editor-last=Heilbron |editor-first=John L. |title=The Oxford Companion to the History of Modern Science |url=https://books.google.com/books?id=abqjP-_KfzkC&pg=PA233 |date=2003 |publisher=Oxford University Press |isbn=978-0-19-974376-6 |page=233}}</ref>{{sfnp|Pais|1982|p=301}}}}`;
console.log(wtf(str).templates());
