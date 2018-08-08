const wtf = require('./src/index');
const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// wtf.fetch('London', 'en', function(err, doc) {
// console.log(doc.plaintext().match('"ref"'));
// console.log(doc.isDisambiguation());
// });


// console.log(readFile('washington-nationals').tables()[1]);

let str = `before
{|
! h1 !! h2 || h3
|-
| one
| two
| three
|-
|  [[Minnesota Twins|Twins]]
| five
| six
|}

after now

`;
console.log(wtf(str).tables(0).json());
// console.log(wtf(str).text());
