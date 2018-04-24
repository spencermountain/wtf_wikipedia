'use strict';
const wtf = require('./src/index');
const fromFile = require('./_fromFile');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

//'|'-separated titles in a titles parameter
// description(), extract(), summary()

let doc = fromFile('toronto');

console.log(doc.sections().length);
let sec = doc.section('See Also');
sec.remove();
console.log(sec.title);
console.log(doc.sections().length);

doc.debug();


// wtf.fetch(['Royal Cinema', 'Aldous Huxley'], 'en', {
//   userAgent: 'spencermountain@gmail.com'
// }).then((docs) => {
//   let linkArray = docs.map(doc => doc.links());
//   console.log(linkArray);
// });

// let s = wtf(`i ''''think'''' so`).sentences(0);
// console.log(s);
