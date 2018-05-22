const wtf = require('./src/index');
const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');


// var str = `{{convert|7|and|8|km}}`;
// var str = `{{convert|7|to|8|mi}}`;
// var str = `{{ill|Joke|fr|Blague|hu|Vicc|de|Witz}}`;
// var str = `hello {{small|2 February}}`;
// var str = `{{tiw|Hatnote}}`;
var str = `{{date|June 8 2018|mdy}}`;
var str = `{{l|cs|háček}}`;
let doc = wtf(str);
console.log(doc.plaintext());
console.log(doc.templates());
