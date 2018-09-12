const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
//   const doc = await wtf.fetch(`List of submarine sandwich restaurants`, 'en');
//   console.log(doc.images());
// // console.log(doc.json({
// //   images: true
// // }));
// })();



let str = `hello [[List of highest funded crowdfunding projects|highest funded crowdfunding projects]] world`;
console.log(wtf(str).links());
