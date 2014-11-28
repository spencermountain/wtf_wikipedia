module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                banner: '/*! <%= pkg.name %> \n by @spencermountain\n <%= grunt.template.today("yyyy-mm-dd") %> */\n',
            },
            dist: {
                src: ['./sentence_parser.js', './index.js'],
                dest: './client_side/wikiscript.js'
            }
        },
        uglify: {
            do :{
                src: ['./client_side/wikiscript.js'],
                dest: './client_side/wikiscript.min.js'
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['concat', 'uglify']);

};