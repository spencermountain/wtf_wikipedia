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
|Jan mean C = −3.4
|Feb mean C = −0.1
|Mar mean C =  6.4
|Apr mean C = 14.7
|May mean C = 20.5
|Jun mean C = 24.8
|Jul mean C = 26.8
|Aug mean C = 25.9
|Sep mean C = 21.1
|Oct mean C = 14.1
|Nov mean C =  5.2
|Dec mean C = −1.2
|source 1=[[Environment Canada]]<ref name="envcan"/>
}}`;

let doc = wtf(str);
// console.log(doc.text());
// console.log(wtf(str).tables(0).keyValue());
console.log(wtf(str).templates(0).byMonth);

// Alan Bean marriage template
