'use strict';
// const wtf = require('./src/index');
// const fromFile = require('./_fromFile');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// todo:
// description(), extract(), summary()

// let doc = fromFile('toronto');


// wtf.fetch(['Royal Cinema', 'Aldous Huxley'], 'en', {
//   userAgent: 'spencermountain@gmail.com'
// }).then((docs) => {
//   let linkArray = docs.map(doc => doc.links());
//   console.log(linkArray);
// });

// let s = wtf(`i ''''think'''' so`).sentences(0);
// console.log(s);

// wtf.fetch('Royal Cinema').then((doc) => {
//   console.log(doc.plaintext());
// }).catch(console.log);

const w = require('./builds/wtf_wikipedia');
console.log(w);
