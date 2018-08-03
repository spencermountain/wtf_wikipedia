var exec = require('shelljs').exec;
var echo = require('shelljs').echo;
var fs = require('fs');
//use paths, so libs don't need a -g
var browserify = './node_modules/.bin/browserify';
var derequire = './node_modules/.bin/derequire';
var uglify = './node_modules/.bin/uglifyjs';

var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

if (pkg.browser !== undefined) {
  console.log(`

----
  Yo, please remove the "browser" property from package.json before building

  sorry, somehow this is necessary to build-up the deps properly.
   - I don't like computers either
----

-stopping build.-
  `);
  process.exit(1);
}

//final build locations
var banner = '/* wtf_wikipedia v' + pkg.version + '\n   github.com/spencermountain/wtf_wikipedia\n   MIT\n*/\n';
var uncompressed = './builds/wtf_wikipedia.js';
var compressed = './builds/wtf_wikipedia.min.js';

//cleanup. remove old builds
exec('rm -rf ./builds && mkdir builds');

//add a header, before our sourcecode
echo(banner).to(uncompressed);
echo(banner).to(compressed);

//browserify + derequire
//var cmd = browserify + ' ./src/index.js --standalone wtf';
var cmd = browserify + ' ./src/index.js --standalone wtf';
cmd += ' -t [ babelify --presets [ env ] ]';
cmd += ' | ' + derequire;
cmd += ' >> ' + uncompressed;
// console.log(cmd);
exec(cmd);

//uglify
cmd = uglify + ' ' + uncompressed + ' --mangle --compress ';
cmd += ' >> ' + compressed;
exec(cmd); // --source-map ' + compressed + '.map'

require('./filesize');
