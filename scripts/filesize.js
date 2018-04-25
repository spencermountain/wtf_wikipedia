var fs = require('fs');
//print filesizes
var stats = fs.statSync('./builds/wtf_wikipedia.js');
var fileSize = (stats['size'] / 1000.0).toFixed(2);
console.log('\n\n main: ' + fileSize + 'kb');

stats = fs.statSync('./builds/wtf_wikipedia.min.js');
fileSize = (stats['size'] / 1000.0).toFixed(2);
console.log('\n\n min: ' + fileSize + 'kb');
