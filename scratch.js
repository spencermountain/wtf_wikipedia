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
// console.log(doc.sections().map(s => s.title())); //'publikasies'
// console.log(doc.infobox(0).data);


let str = `hello <!-- <ref>blah blah</ref>  --> world`;
console.log(wtf(str).text());

// let str = `== Toekennings<ref>Stellenbosch Writers: http://www.stellenboschwriters.com/behrm.html</ref> ==`;
// console.log(wtf(str).sections().map(s => s.title()));
// console.log(wtf(str).references())
// let str = `{{Nihongo|'''Toyota Motor Corporation'''|トヨタ自動車株式会社|Toyota Jidōsha [[Kabushiki gaisha|KK]]|{{IPA-ja|toꜜjota|IPA}}, {{IPAc-en|lang|t|ɔɪ|ˈ|oʊ|t|ə}}|lead=yes}}, usually shortened to '''Toyota''', is a Japanese [[Multinational corporation|multinational]] [[Automotive industry|automotive]] manufacturer headquartered in [[Toyota, Aichi]], Japan. <!--Cited below-->`;
