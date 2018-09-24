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
// console.log(doc.infobox(0).data);


let str = `{| class="wikitable"
   |[[File:Worms 01.jpg|199x95px]]
    |[[File:Worms Wappen 2005-05-27.jpg|199x95px]]
|<!--col3-->[[File:Liberty-statue-with-manhattan.jpg|199x95px]]
|<!--col4-->[[File:New-York-Jan2005.jpg|100x95px]]<!--smaller-->


  |-
|<!--col1-->Nibelungen Bridge to Worms
|Worms and its sister cities
|Statue of Liberty
|New York City
|}`;
console.log(wtf(str).tables(0).keyValue());
