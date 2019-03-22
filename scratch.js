const wtf = require('./src/index');
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


let str = `[[चित्र:Gandhis ashes.jpg|thumb|left|[[राज घाट और अन्य स्मारक|राज घाट]] ([[:en:Raj Ghat and other memorials|Raj Ghat]]):आगा खान पैलेस में गांधी की अस्थियां (पुणे, भारत) .]]`;
console.log(wtf(str).images(0).json());
