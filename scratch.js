const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
//   var doc = await wtf.fetch('2009–10 Miami Heat season');
//   // var doc = await wtf.random();
//   console.log(doc.json());
// })();

// let doc = readFile('BBDO');
// console.log(doc.infoboxes(0).data);

// let str = `{{Coord|57|18|22|N|4|27|32|W|display=title}}`;
let str = `{{Coor dms|29|58|41|N|31|07|53|E|type:landmark_region:EG_scale:5000}}`;
//let str=` {{Coord|44.112|-87.913|display=title}}`
// let str = `{{Coord|42.774|-78.787|type:landmark|name=Buffalo Bills}}`;
let doc = wtf(str);
// console.log(wtf(str).tables(0).keyValue());
console.log(wtf(str).coordinates());
