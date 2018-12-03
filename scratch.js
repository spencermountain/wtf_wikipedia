const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
// var doc = await wtf.fetch('Jurassic Park (film)');
// var doc = await wtf.random();
// let list = await wtf.category('National Basketball Association teams');
// let list = await wtf.category(856891);
// })();

// let doc = readFile('BBDO');
// console.log(doc.infoboxes(0).data);

let str = `{{bbl to t| 1 | 2 | 3 | 4 |API=|abbr=|lk=|adj=|per=|t_per=|mlt=}}`;

console.log(wtf(str).text());
console.log(wtf(str).templates());
// console.log(wtf(str).tables(0).keyValue());
