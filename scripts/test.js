require('shelljs/global');
var tape = './node_modules/tape/bin/tape';
var spec = './node_modules/.bin/am-tap-dot --color';

//run tests server-side
exec(tape + ' ./tests/*.test.js | ' + spec);
