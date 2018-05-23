const wtf = require('./src/index');
const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

var str = `{{Redirect|City of Toronto|the municipal government|Municipal government of Toronto|the historical part of the city prior to the 1998 amalgamation|Old Toronto}}`;
// var str = `{{tag|ref|content=haha}}`;
var doc = wtf(str);
// console.log(doc.plaintext())
console.log(doc.templates(0));
// var doc = readFile('toronto');
// console.log(doc.templates().filter(t => t.template !== 'citation'));
