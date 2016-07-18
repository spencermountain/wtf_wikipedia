module.exports = function(grunt) {
  //paths to binaries, so no globals are needed
  var browserify = './node_modules/.bin/browserify';
  var derequire = './node_modules/.bin/derequire';
  var eslint = './node_modules/.bin/eslint';
  var tape = './node_modules/tape/bin/tape';
  var tapSpec = './node_modules/tap-spec/bin/cmd.js';
  var fileServer = './node_modules/.bin/http-server';
  var uglify = './node_modules/uglify-js/bin/uglifyjs';

  //paths
  var uncompressed = './builds/wtf_wikipedia.js';
  var compressed = './builds/wtf_wikipedia.min.js';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      files: ['./src/**', './scratch.js', './Gruntfile.js'],
      tasks: ['run:main']
    },
    run: {
      cleanup: { //remove builds
        exec: 'rm -rf ./builds && mkdir builds'
      },
      init: { //add a header, before browserify
        exec: 'echo "/* wtf_wikipedia v<%= pkg.version %> */" > ' + uncompressed
      },
      build: { //browserify -> babel -> derequire
        exec: browserify + ' ./src/index.js --standalone wtf_wikipedia -t [ babelify --presets [ es2015 ] ] | ' + derequire + ' >> ' + uncompressed
      },
      uglify: { // jsFile -> jsFile.min
        exec: uglify + ' ' + uncompressed + ' --mangle --compress --output ' + compressed + ' --preamble "/*wtf_wikipedia*/"' // --source-map ' + compressed + '.map'
      },
      test: {
        exec: tape + ' ./tests/*_tests.js | ' + tapSpec
      },
      browser_test: {
        exec: 'browserify ./tests/unit_tests.js -o ./demo/tests/compiled_tests.js && ' + fileServer + ' demo/tests -o -c-1'
      },
      prerelease: { //test all versions serverside, client-side
        exec: tape + ' ./test/prerelease/index.js | ' + tapSpec
      },
      demo: {
        exec: fileServer + ' demo -o -c-1'
      },
      main: {
        exec: 'node ./scratch.js'
      },
      lint: {
        exec: eslint + ' ./src/**'
      }
    },

    filesize: {
      base: {
        files: [{
          src: [compressed]
        }],
        options: {
          ouput: [{
            stdout: true
          }]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-run');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-filesize');
  grunt.registerTask('test', ['run:test']);
  grunt.registerTask('demo', ['run:demo']);
  grunt.registerTask('browser_test', ['run:browser_test']);
  grunt.registerTask('test_browser', ['run:browser_test']);
  grunt.registerTask('default', ['test']);
  grunt.registerTask('build', ['run:test', 'run:lint', 'run:cleanup', 'run:init', 'run:build', 'run:uglify', 'filesize']);

};
