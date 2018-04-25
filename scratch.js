'use strict';
const wtf = require('./src/index');
// const fromFile = require('./_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// todo:
// description(), extract(), summary()

//doc.infoboxes('Venue')

// let doc = fromFile('toronto');


// wtf.fetch(['Royal Cinema', 'Aldous Huxley'], 'en', {
//   userAgent: 'spencermountain@gmail.com'
// }).then((docs) => {
//   let linkArray = docs.map(doc => doc.links());
//   console.log(linkArray);
// });

// let s = wtf(`i ''''think'''' so`).sentences(0);
// console.log(s);

// wtf.fetch('Whistling').then(doc => {
//   console.log(doc.sections('see also').links().map(l => l.page));
// });

// wtf.fetch('On a Friday', 'en', function(err, doc) { //"Radiohead" redirect
//   var members = doc.infobox(0).data.current_members.links();
//   console.log(members.map(l => l.page));
// //Thom Yorke, Jonny Greenwood, Colin Greenwood...
// });

wtf.fetch('Jodie Emery').then((doc) => {
  console.log(doc.categories());
}).catch(console.log);
