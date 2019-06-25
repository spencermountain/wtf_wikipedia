const wtf = require('./src/index')
// const wtf = require('./builds/wtf_wikipedia.min');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
// var doc = await wtf.fetch('महात्मा_गांधी', 'hi');
// var doc = await wtf.random();
// console.log(doc.text());
// })();

// let doc = readFile('BBDO');
// console.log(doc.infoboxes(0).data);

// wtf.fetch('Горбатая_гора', 'ru', function(err, doc) {
//   console.log(doc.sections('Сюжет').sentences().map((s) => s.text()));
// });

let str = `{{Infobox Société
  | couleur boîte             = 706D6E
  | titre blanc               = oui
  | nom                       = Microsoft Corporation
  | secteurs d'activités      = found1
  | chiffre d'affaires        = found2
 }}
`
let obj = wtf(str)
  .infobox(0)
  .keyValue()
obj[`secteurs d'activités`]
