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


let str = `In its broadest sense, a pest is a [[Competition (biology)|competitor]] of humanity.<ref>[http://www.merriam-webster.com/dictionary/pest Merriam-Webster dictionary], accessed 22 August 2012.</ref><ref>{{cite web |title=Pest vermin |url=http://www.britannica.com/EBchecked/topic/453421/pest |publisher=Britannica |accessdate=24 August 2016}}</ref> `;
console.log(wtf(str).json());


// let str = `годы asf`;
// str = '4';
// // const hasWord = new RegExp('[a-z\u00C0-\u00FF][a-z\u00C0-\u00FF]', 'iu');
// // let hasWord = new RegExp('[\\w\u0430-\u044f]$', 'ui');
// // let hasWord = new RegExp('\p{L}', 'ui');
// let hasWord = /[\wа-я]$/;
// console.log(hasWord.test(str));
