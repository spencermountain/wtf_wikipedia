const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

//images in tables...

// wtf.fetch('London', 'en', function(err, doc) {
//   console.log(doc.lists());
// });


// console.log(readFile('washington-nationals').tables(0));

var str = 'hello';
console.log(wtf(str).links());
