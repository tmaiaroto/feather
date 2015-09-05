// NOTE: Since Sass and LESS are used and Feather pulls from a number of various projects, things get built separately
// in pieces into a `.build` directory. Please disregard this directory. A cleanup task was not added, but that directory
// is essentially trash.

module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		browserify: {
			dist: {
				src: ['src/js/**/*.js', 'node_modules/cookies-js/src/**/*.js'],
				dest: 'dist/<%= pkg.name %>.js'
			},
			dev: {
				files: {
					'dev/js/<%= pkg.name %>.js': ['src/js/**/*.js'],
				}
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			dist: {
				files: {
					'dist/<%= pkg.name %>.min.js': ['<%= browserify.dist.dest %>']
				}
			}
		},
		jshint: {
			files: ['Gruntfile.js', 'src/js/**/*.js', "test/**/*.js"],
			options: {
				globals: {
					jQuery: true
				}
			}
		},
		sass: {
			dist: {
				options: {
					style: 'expanded'
				},
				files: {
					".build/dist/typography.css": "src/sass/typography.scss",
					".build/dist/reset.css": "src/sass/reset.scss"
				}
			},
			dev: {
				files: {
					".build/dev/typography.css": "src/sass/typography.scss",
					".build/dev/reset.css": "src/sass/reset.scss"
				}
			},
			font: {
				files: {
					".build/dist/typography-kit.css": "src/sass/typography.scss",
				}
			}
		},
		less: {
			dist: {
				files: {
					".build/dist/style.css": "src/less/style.less"
				}
			},
			dev: {
				files: {
					".build/dev/style.css": "src/less/style.less"
				}	
			}
		},
		concat_css: {
			options: {
				// Task-specific options go here. 
			},
			dist: {
				// can't just do: ".build/dist/*.css"
				// because they need to be concatenated in a specific order...well, i could name them alphabetically i suppose...
				src: [".build/dist/reset.css",".build/dist/typography.css",".build/dist/style.css"],
				dest: "dist/feather.css"
			},
			dev: {
				src: [".build/dev/reset.css",".build/dev/typography.css",".build/dev/style.css"],
				dest: "dev/feather.css"
			},
			font: {
				src: [".build/dist/typography-kit.css"],
				dest: "dist/typography-kit.css"
			}
		},
		cssmin: {
			// options: {
			// 	shorthandCompacting: false,
			// 	roundingPrecision: -1
			// },
			target: {
				files: [{
					expand: true,
					cwd: 'dist',
					src: ['feather.css', 'typography-kit.css', '!*.min.css'],
					dest: 'dist',
					ext: '.min.css'
				}]
			}	
		},
		watch: {
			files: ['<%= jshint.files %>','src/sass/**/*.scss','src/less/**/*.less','dev/index.html'],
			//tasks: ['browserify:dev','jshint','karma:unit'],
			tasks: ['browserify:dev','jshint', 'sass:dev', 'less:dev', 'concat_css:dev'],
			options: {
				livereload: true,
			}
		},
		karma: {
			unit: {
				configFile: 'karma.conf.js'
			},
			// sauce: {
			// 	configFile: 'karma.conf-sauce.js'
			// }
		},
		express: {
			all: {
				options: {
					port: 3125,
					hostname: "0.0.0.0",
					bases: ["dev","src","dist"],
					livereload: true
				}
			}
		},
		open: {
			devserver: {
				path: 'http://localhost:3125'
			}
		}
	});

	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-concat-css');
	// actually, ccsmin makes concat-css redundant...
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	//grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-open');
	grunt.loadNpmTasks('grunt-express');

	grunt.registerTask('default', ['jshint']);
	grunt.registerTask('test', ['jshint', 'karma:unit']);

	// Builds feather.js, feather.min.js, feather.css, and feather.min.css.
	grunt.registerTask('build', ['browserify:dist', 'uglify', 'sass:dist', 'less:dist', 'concat_css:dist', 'cssmin']);

	// Builds the files in `src` into `dev` and starts a little web server with live reload for you to work on modifying Feather.
	// See `dev/index.html` for a demo/playground.
	grunt.registerTask('dev', ['browserify:dev', 'sass:dev', 'less:dev', 'concat_css:dev', 'express', 'open:devserver', 'watch']);

	// Modular typefaces or "typography kits" that are easy to share.
	// 
	// Builds CSS for new typeface settings only - tweak `fonts.scss`, `scale.scss` and then run this. Add the CSS after `feather.css`
	// on your pages. It will increase the total CSS size on your page and page load time, but it's non-destructive.
	// Alternatively, you can run `build` and build in your fonts to feather.css directly.
	// This task will leave you with a `typography-kit.css` in the `dist` directory. Aabout 11kb minified.
	// That plus any actual web fonts you bring should be a small price to pay for beautiful type.
	grunt.registerTask('build-font', ['sass:font', 'concat_css:font', 'cssmin']);

	// TODO: registerTask for building themes. Just launches the dev site in a sense -- 
	// but also includes a theme directory in the Node.js web server and puts new CSS/JS assets in the HTML too.
};