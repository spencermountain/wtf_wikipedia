module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      do: {
        src: ['./client_side/wikiscript.js'],
        dest: './client_side/wikiscript.min.js'
      }
    },
    "browserify": {
      client: {
        src: './src/index.js',
        dest: './client_side/wikiscript.js',
        options: {
          "standalone": true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.registerTask('default', ['browserify', 'uglify']);

};
