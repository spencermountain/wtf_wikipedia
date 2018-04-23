'use strict';
const wtf = require('./src/index');
const fromFile = require('./_fromFile');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

//'|'-separated titles in a titles parameter
// description(), extract(), summary()

// let doc = fromFile('royal_cinema');
// console.log(JSON.stringify(doc, null, 2));

// wtf.fetch(['Royal Cinema', 'Aldous Huxley'], 'en', {
//   userAgent: 'spencermountain@gmail.com'
// }).then((docs) => {
//   let linkArray = docs.map(doc => doc.links());
//   console.log(linkArray);
// });

let str = wtf(`==My Section==
Leading text
* First item
*Second Item
Closing remark`).toLatex();
console.log(str);
