module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                banner: '/*! <%= pkg.name %> \n by @spencermountain\n <%= grunt.template.today("yyyy-mm-dd") %> <%= pkg.license %> */\n',
            },
            dist: {
                src: ['./i18n.js', './lib/sentence_parser.js', './lib/site_map.js', './lib/fetch_text.js', './index.js'],
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
