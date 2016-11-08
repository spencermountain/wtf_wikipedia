require('shelljs/global');
config.silent = true;
//use paths, so libs don't need a -g
var fileServer = './node_modules/.bin/http-server';
exec('browserify ./tests/unit_tests.js -o ./demo/tests/compiled_tests.js && ' + fileServer + ' demo/tests -o -c-1');
