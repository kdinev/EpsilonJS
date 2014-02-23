module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				src: 'src/<%= pkg.name %>.js',
				dest: 'build/<%= pkg.name %>.min.js'
			}
		},
		jshint: {
			options: {
				jshintrc: ".jshint",
				ignores: ["build/*.min.js"]
			},
			changed: [
				"src/*.js"
			],
			all: [
				"Gruntfile.js",
				"src/*.js",
				"test/*.js",
			]
		},
		qunit: {
			all: ['test/*.html']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-qunit');

	// Default task(s).
	grunt.registerTask('default', ['jshint', 'qunit', 'uglify']);
};