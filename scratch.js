const wtf = require('./src/index');
// const wtf = require('./builds/wtf_wikipedia.min');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
//   var doc = await wtf.fetch('Template:2014 Stanley Cup playoffs');
//   // var doc = await wtf.random();
//   console.log(doc.templates());
// })();

// let doc = readFile('BBDO');
// console.log(doc.infoboxes(0).data);

// wtf.fetch('Горбатая_гора', 'ru', function(err, doc) {
//   console.log(doc.sections('Сюжет').sentences().map((s) => s.text()));
// });


// let str = `前季より9つ勝ち星を増やし、30勝52敗でシーズンを終えた。順調に観戦客数も伸ばした。この年のドラフト1巡目2位で指名されたマーカス・キャンビーは期待外れに終わった。`;
let str = `前季より9つ。勝ち星を増やし、30勝52敗でシ。`;
//japanese periods
str = str.replace(/\u3002/g, '. ');
// console.log(str);
console.log(wtf(str).sentences());


// let str = `годы asf`;
// str = '4';
// // const hasWord = new RegExp('[a-z\u00C0-\u00FF][a-z\u00C0-\u00FF]', 'iu');
// // let hasWord = new RegExp('[\\w\u0430-\u044f]$', 'ui');
// // let hasWord = new RegExp('\p{L}', 'ui');
// let hasWord = /[\wа-я]$/;
// console.log(hasWord.test(str));
