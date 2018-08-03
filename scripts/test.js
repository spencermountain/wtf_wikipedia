var exec = require('shelljs').exec;
var tape = './node_modules/.bin/tape';
var spec = './node_modules/.bin/tap-dancer --color';
// var spec = '/Users/spencer/mountain/tap-dance/bin/cmd.js --color';

//run tests server-side
exec(tape + ' ./tests/*.test.js | ' + spec);
