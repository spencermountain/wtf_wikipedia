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


let str = `
{{Weather box
|metric first = Y
|single line= Y
|collapsed = Y
|location= [[Calgary International Airport]], 1981–2010 normals, extremes 1881–present
|Jan high C = -0.9
|Feb high C =  0.7
|Mar high C =  4.4
|Apr high C = 11.2
|May high C = 16.3
|Jun high C = 19.8
|Jul high C = 23.2
|Aug high C = 22.8
|Sep high C = 17.8
|Oct high C = 11.7
|Nov high C =  3.4
|Dec high C = -0.8
|source 1=[[Environment Canada]]<ref name="envcan"/>
}}`;
// str = `{{Weather box/concise_C
// | location=Marrakech, Morocco (1961-1990)
// | source=Hong Kong Observatory<ref name="HKO">
//   "Climatological Information for Marrakech, Morocco",
//   Hong Kong Observatory, 2003. Web: [http://www.hko.gov.hk/wxinfo/climat/world/eng/africa/mor_al/marrakech_e.htm HKO-Marrakech].</ref>
// | 18.4|19.9|22.3|23.7|27.5|31.3|36.8|36.5|32.5|27.5|22.2|18.7<!--highs-->
// | 5.9 |7.6 |9.4 |11.0|13.8|16.3|19.9|20.1|18.2|14.7|10.4|6.5 <!--lows-->
// | 32.2|37.9|37.8|38.8|23.7|4.5 |1.2 |3.4 |5.9 |23.9|40.6|31.4<!--rain-->
// }}`;

let doc = wtf(str);
// console.log(doc.text());
// console.log(wtf(str).tables(0).keyValue());
console.log(wtf(str).templates(0).byMonth['rain mm']);

// Alan Bean marriage template
