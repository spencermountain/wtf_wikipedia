var exec = require('shelljs').exec;
var codecov = '62d2cc94-1c1f-4e21-a9af-42cc0cf39c51'; //i don't really care if you steal this.

//run all the tests
let cmd = `./node_modules/.bin/nyc --reporter=text-lcov ./node_modules/.bin/tape ./tests/**/*.test.js > coverage.lcov && ./node_modules/.bin/codecov -t ${codecov}`;
exec(cmd);
console.log('\n 🏃 done!');
