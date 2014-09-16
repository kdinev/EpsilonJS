module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				files: {
					'build/epsilon.min.js': ['src/epsilon.js']
				}
			}
		},
		jshint: {
			options: {
				jshintrc: ".jshint",
				ignores: ["build/*.min.js"]
			},
			//changed: [],
			all: [
				"Gruntfile.js",
				"src/*.js",
				"test/*.js",
			]
		},
		qunit: {
			all: ['test/*.html']
		},
		watch: {
			files: ["**/*.js"],
			tasks: ["test"],
			options: {
				spawn: false
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-qunit");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-cssmin");

	// Default task(s).
	grunt.registerTask('default', ['jshint', 'qunit', 'uglify']);
	
	// Custom task{s}.
	grunt.registerTask("test", ["jshint", "qunit"]);
};