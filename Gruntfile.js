module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      files: ['./src/**', './scratch.js', './Gruntfile.js'],
      tasks: ['run:scratch']
    },
    run: {
      scratch: {
        exec: 'node ./scratch.js --debug'
      }
    },
    uglify: {
      do: {
        src: ['./client_side/wikiscript.js'],
        dest: './client_side/wikiscript.min.js'
      }
    },
    'browserify': {
      client: {
        src: './src/index.js',
        dest: './client_side/wikiscript.js',
        options: {
          'standalone': true
        }
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          clearRequireCache: true,
          colors: true,
          growl: false
        },
        src: ['./tests/*.js']
      }
    },

    mocha_istanbul: {
      coverageSpecial: {
        src: 'tests/*.js',
        options: {
          reportFormats: ['html'],
          quiet: true,
          coverageFolder: './tests/coverage'
        }
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
