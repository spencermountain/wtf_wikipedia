const wtf = require('./src/index');
const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// wtf.fetch('London', 'en', function(err, doc) {
// console.log(doc.plaintext().match('"ref"'));
// console.log(doc.isDisambiguation());
// });


// console.log(readFile('washington-nationals').tables()[1]);

str = `{|
|-
| one
| two
| three
|-
|  [[four]]
| five
| six
|}`;

// console.log(wtf(str).tables(0));
console.log(wtf(str).links());
