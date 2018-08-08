const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// wtf.fetch('London', 'en', function(err, doc) {
//   console.log(doc.sections(0).data);
// });


// console.log(readFile('washington-nationals').tables()[1]);

let str = `before
* one
* two
* [[three]]
* four {{cool|fun=walking the [[thames]]}}
`;
console.log(wtf(str).lists(0).plaintext());
// console.log(wtf(str).templates());

// console.log(wtf(str).lists(0).links());
// console.log(wtf(`he is good. i think "he is so." after`).sentences());
