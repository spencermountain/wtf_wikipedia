module.exports = function(grunt) {
  //paths to binaries, so no globals are needed
  var browserify = './node_modules/.bin/browserify';
  var derequire = './node_modules/.bin/derequire';
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
        exec: 'browserify ./test/unit_test/**/*_test.js -o ./test/browser_test/compiled_tests.js && ' + fileServer + ' test/browser_test -o -c-1'
      },
      prerelease: { //test all versions serverside, client-side
        exec: tape + ' ./test/prerelease/index.js | ' + tapSpec
      },
      demo: {
        exec: fileServer + ' demo -o -c-1'
      },
      main: {
        exec: 'node ./scratch.js --debug'
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-run');
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.registerTask('default', ['browserify', 'uglify']);
  grunt.registerTask('test', ['mochaTest']);
  grunt.registerTask('coverage', ['mocha_istanbul']);

};
