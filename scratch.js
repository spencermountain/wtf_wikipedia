'use strict';
const wtf = require('./src/index');
const fromFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// todo:
// description(), extract(), summary()

//doc.infoboxes('Venue')

// let doc = fromFile('royal_cinema');
let doc = fromFile('toronto');
console.log(doc.sections('Infrastructure').json());
// wtf.fetch('Royal Cinema').then((doc) => {
//   console.log(doc.json({
//     categories: false
//   }));
// }).catch(console.log);
