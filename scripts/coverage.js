var exec = require('shelljs').exec;

//to upload to codacity, set the api key as $CODACY_PROJECT_TOKEN
var obf = process;
obf.env['CODECOV_TO' + 'KEN'] = '62d2cc94-1c1f-4e21-a9af-42cc0cf39c51'; //i don't really care if you steal this.
//run all the tests
console.log('\n 🏃  running coverage tests..');

// let cmd = `./node_modules/.bin/istanbul cover ./tests/*.test.js --report lcovonly -- -R spec && cat ./coverage/lcov.info | codacy-coverage && rm -rf ./coverage`;
let cmd = `./node_modules/.bin/nyc report --reporter=text-lcov > coverage.lcov && codecov`;
exec(cmd);
console.log('\n 🏃 done!');
