const wtf = require('./src/index');
const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
//   let docs = await wtf.fetch(['June', 'July'], 'en');
//   console.log(docs);
// })();


// let doc = readFile('toronto');
// console.log(doc.infobox(0).data);
let str = `
'''Park Place''' may refer to:
{{TOC right}}

== Media ==
* [[Park Place (TV series)|Park Place]], a 1981 CBS sitcom

== Places ==

=== Canada ===
* [[Park Place (Ontario)]], a park in the city of Barrie
* [[Park Place (Vancouver)]], a skyscraper
* [[Park Place Mall]], Lethbridge, Alberta
{{disambiguation}}
`;
console.log(wtf(str).links());

// let str = `{{Nihongo|'''Toyota Motor Corporation'''|トヨタ自動車株式会社|Toyota Jidōsha [[Kabushiki gaisha|KK]]|{{IPA-ja|toꜜjota|IPA}}, {{IPAc-en|lang|t|ɔɪ|ˈ|oʊ|t|ə}}|lead=yes}}, usually shortened to '''Toyota''', is a Japanese [[Multinational corporation|multinational]] [[Automotive industry|automotive]] manufacturer headquartered in [[Toyota, Aichi]], Japan. <!--Cited below-->`;
