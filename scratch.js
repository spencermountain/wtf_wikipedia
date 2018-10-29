const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

(async () => {
  let options = {
    missing_templates: true
  };
  let doc = await wtf.fetch('Cuba', 'en', options);
  console.log(doc.infoboxes());
})();

// let doc = readFile('jodie_emery');
// console.log(doc.markdown());


// var str = `hello {{lksjdf aef}} world`;
// let doc = wtf(str, {
//   missing_templates: true
// });
// console.log(doc.tables(0).keyValue());
