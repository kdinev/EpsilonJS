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
					'build/epsilon.min.js': ['src/epsilon.js'],
					'build/calculator.min.js': ['src/calculator.js']
				}
			}
		},
		cssmin: {
			combine: {
				files: {
					'build/css/calculator.min.css': ['src/css/calculator.css']
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
	grunt.registerTask('default', ['jshint', 'qunit', 'uglify', 'cssmin']);
	
	// Custom task{s}.
	grunt.registerTask("test", ["jshint", "qunit"]);
};