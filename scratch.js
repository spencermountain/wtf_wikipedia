const wtf = require('./src/index');
const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
//   let doc = await wtf.fetch('Pete Townshend', 'en');
//   console.log(doc.infoboxes(0).images(0).thumb());
// })();

let doc = readFile('jodie_emery');
console.log(doc.infobox(0).images(0).thumb());

// var str = `
// ==Soccer==
// The soccer game consists of the following components:
// * 2 Teams with 11 players each,
// * 3 referees
// The game last 90 min.
// `;
// str = `hello up here
//     block section
// hello down here`;
// // console.log(wtf(str).templates(0));
// console.log(wtf(str).sections(0).text());

// console.log(wtf('the is [[he]] nice').markdown());
