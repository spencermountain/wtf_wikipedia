var exec = require('shelljs').exec;
var echo = require('shelljs').echo;
var fs = require('fs');
var browserify = './node_modules/.bin/browserify';
var derequire = './node_modules/.bin/derequire';
var terser = './node_modules/.bin/terser';

// ok somehow,
// for deploys, we want the 'browser' field
// but that messes with browserify...
// so temporarily remove it during builds.
// ¯\_(ツ)_/¯
var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
exec('mv ./package.json ./package.json.backup');
delete pkg.browser;
fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));

//make a small file for our version number
fs.writeFileSync('./src/_version.js', `module.exports = '${pkg.version}'`);

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
var cmd = browserify + ' ./src/index.js --standalone wtf';
cmd += ' -t [ babelify --presets [ @babel/preset-env ] ]';
cmd += ' | ' + derequire;
cmd += ' >> ' + uncompressed;
exec(cmd);

//uglify
cmd = terser + ' ' + uncompressed + ' --mangle --compress ';
cmd += ' >> ' + compressed;
exec(cmd);

//log the size of our builds
require('./filesize');

//.. then we replace original package.json file
exec('mv ./package.json.backup ./package.json ');
