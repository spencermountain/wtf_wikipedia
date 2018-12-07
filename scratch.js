const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
//   var doc = await wtf.fetch('Buzz Aldrin');
//   // var doc = await wtf.random();
//   console.log(doc.infobox(0).json());
// })();

// let doc = readFile('BBDO');
// console.log(doc.infoboxes(0).data);

// wtf.fetch('Taylor%20Swift', 'en', {
//   'Api-User-Agent': 'obfuscated@gmail.com'
// }).then(docList => {
//   console.warn(docList);
// });



let str = `{{Weather box/concise_F
| location=Marrakech, Morocco (1961-1990)
| source=Hong Kong Observatory<ref name="HKO">
  "Climatological Information for Marrakech, Morocco",
  Hong Kong Observatory, 2003. Web: [http://www.hko.gov.hk/wxinfo/climat/world/eng/africa/mor_al/marrakech_e.htm HKO-Marrakech].</ref>
| 64| 67| 72| 74| 80| 87| 97| 97| 90| 80| 72| 66 <!--highs-->
| 43| 47| 50| 53| 57| 62| 69| 69| 66| 59| 52| 45 <!--lows-->
|1.1|1.2|1.4|1.3|0.7|0.3|0.1|0.1|0.3|0.8|1.5|1.1 <!--rain-->
}}`;

let doc = wtf(str);
// console.log(doc.text());
// console.log(wtf(str).tables(0).keyValue());
console.log(wtf(str).templates(0));

// Alan Bean marriage template
