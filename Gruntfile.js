module.exports = function(grunt) {

    grunt.initConfig({
        jshint: ['app.js','services/*.js','server/*.js','pages/*/*.js','components/*/*.js'],
        concat: { js: {files: { 'min/app.js': [
            'services/*.js',
            'bower_components/html5-history-anchor/html5-history-anchor.js',
            'bower_components/marked/lib/marked.js',
            'bower_components/http-service/http.service.js',
            'bower_components/resource-service/resource.service.js',
            'app.js'
        ]}}},
        watch: {
            scripts: {
                files: [
                    'services/*.js',
                    'pages/*//*.js',
                    'components/**//*.js',
                    'bower_components/html5-history-anchor/html5-history-anchor.js',
                    'bower_components/http-service/http.service.js',
                    'app.js'
                ],
                tasks: ['concat'],
                options: {
                    spawn: false
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jshint','concat','watch']);

};