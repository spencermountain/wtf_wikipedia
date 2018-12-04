const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

(async () => {
  var doc = await wtf.fetch('2009–10 Miami Heat season');
  // var doc = await wtf.random();
  console.log(doc.json());
})();

// let doc = readFile('BBDO');
// console.log(doc.infoboxes(0).data);

// let str = `
// {{player||USA|[[Ron Rothstein]]}}
// `;
// let doc = wtf(str);
// console.log(wtf(str).text());
// console.log(wtf(str).templates());
