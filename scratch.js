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
|  [[four]]
| five
| six
|}

after now

`;
str = `{| class="wikitable" style="text-align: center; width: 200px; height: 200px;"
|+ Multiplication table
|-
! a
! b
! c
! d
|-
! 1
| 1 || 2 || 3
|-
! 2
| 2 || 4 || 6
|-
! 3
| 3 || 6 || 9
|-
! 4
| 4 || 8 || 12
|-
! 5
| 5 || 10 || 15
|}`;
console.log(wtf(str).tables(0).json());
// console.log(wtf(str).text());
