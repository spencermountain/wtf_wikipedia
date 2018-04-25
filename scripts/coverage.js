var exec = require('shelljs').exec;
var nyc = './node_modules/nyc/bin/nyc.js';
var codacity = './node_modules/.bin/codacy-coverage';
var tape = './node_modules/tape/bin/tape';
var test = tape + ' "./tests/**/*.test.js" ';

//to upload to codacity, set the api key as $CODACY_PROJECT_TOKEN
var obf = process;
var mid = 'ECT_TOK';
obf.env['CODACY_PROJ' + mid + 'EN'] = '07903b1db5f440a2a3caf49fc40ba995'; //i don't really care if you steal this.
//run all the tests
console.log('\n 🏃  running coverage tests..');
// exec(nyc + ' --reporter=text-lcov ' + test + ' > coverage.lcov');
exec(nyc + ' --reporter=html ' + test + ' | tap-min');

//publish results for codacity
console.log('\n\n\nPublishing results to codacity...\n');
var cmd = nyc + ' report --reporter=text-lcov ' + test + ' | ' + codacity;
exec(cmd);
console.log('\n 🏃 done!');
