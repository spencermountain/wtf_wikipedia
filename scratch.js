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

// let str = `here {{math|f {{=}} x}} hello`
let str = `infront {{asdf| missing {{=}} text}} behind`
let doc = wtf(str)
console.log(doc.text())
