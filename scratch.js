'use strict';
const wtf = require('./src/index');
const fromFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// todo:
// description(), extract(), summary()

//doc.infoboxes('Venue')

// let doc = fromFile('royal_cinema');
// let doc = fromFile('toronto');
// console.log(doc.sentences(0).text());
// console.log(doc.sections('Infrastructure').json());
// // wtf.fetch('Royal Cinema').then((doc) => {
// //   console.log(doc.json({
// //     categories: false
// //   }));
// // }).catch(console.log);

// console.log(wtf(wiki).json({
//   images: true
// }));
let wiki = `'''Toronto''' ({{IPAc-en|t|ɵ|ˈ|r|ɒ|n|t|oʊ}}, {{IPAc-en|local|ˈ|t|r|ɒ|n|oʊ}}) is the [[List of the 100 largest municipalities in Canada by population|most populous city]] in [[Canada]] and the [[Provinces and territories of Canada|provincial]] [[capital city|capital]] of [[Ontario]]. It is located in [[Southern Ontario]] on the northwestern shore of [[Lake Ontario]]. The [[history of Toronto]] began in the late 18th century when the [[The Crown|British Crown]] [[Toronto Purchase|purchased]] its land from the [[Mississaugas of the New Credit`;
console.log(wtf(wiki).plaintext());
