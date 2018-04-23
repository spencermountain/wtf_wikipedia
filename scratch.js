'use strict';
const wtf = require('./src/index');
const fromFile = require('./_fromFile');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

//'|'-separated titles in a titles parameter


let doc = fromFile('royal_cinema');
console.log(doc);

// wtf.fetch('Aldous Huxley', 'en', {
//   userAgent: 'spencermountain@gmail.com'
// }).then((doc) => {
//   console.log(doc.links().map(p => p.page));
// });


// console.log('|' + wtf('he is [[Spencer Kelly|so cool]] and [http://cool.com fresh]').toMarkdown());
