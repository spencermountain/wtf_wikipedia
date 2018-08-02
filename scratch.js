const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');


wtf.fetch('Albert_Einstein', 'en', function(err, doc) {

  console.log(doc.section(0).wikitext());
// var sentences = doc.section(0).sentences();
// console.log(sentences)
});
