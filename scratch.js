const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

(async () => {
  const doc = await wtf.fetch(`Abraham Lincoln`, 'en');
  // doc.html();
  console.log(doc.html().slice(0, 9900));
// console.log(doc.infoboxes(0).json());
// console.log(doc.json({
//   images: true
// }));
})();



// let str = `hello [[List of highest funded crowdfunding projects|highest funded crowdfunding projects]] world`;
// console.log(wtf(str).links());
