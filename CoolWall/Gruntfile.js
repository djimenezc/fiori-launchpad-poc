// Generated on 2013-11-13 using generator-angular 0.6.0-rc.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    yeoman: {
      // configurable paths
      app: require('./bower.json').appPath || 'pubstatic',
      dist: 'dist',
      pubstatic : 'pubstatic'
    },
    watch: {
      coffee: {
        files: ['<%= yeoman.pubstatic %>/scripts/{,*/}*.coffee'],
        tasks: ['coffee:dist']
      },
      coffeeTest: {
        files: ['test/spec/{,*/}*.coffee'],
        tasks: ['coffee:test']
      },
      styles: {
        files: ['<%= yeoman.pubstatic %>/styles/{,*/}*.css'],
        tasks: ['copy:styles', 'autoprefixer']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.pubstatic %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '{.tmp,<%= yeoman.pubstatic %>}/scripts/{,*/}*.js',
          '<%= yeoman.pubstatic %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },
    autoprefixer: {
      options: ['last 1 version'],
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            '<%= yeoman.pubstatic %>'
          ]
        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            '.tmp',
            'test',
            '<%= yeoman.app %>'
          ]
        }
      },
      dist: {
        options: {
          base: '<%= yeoman.dist %>'
        }
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.pubstatic %>/scripts/{,*/}*.js'
      ]
    },
    coffee: {
      options: {
        sourceMap: true,
        sourceRoot: ''
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.pubstatic %>/scripts',
          src: '{,*/}*.coffee',
          dest: '.tmp/scripts',
          ext: '.js'
        }]
      },
      test: {
        files: [{
          expand: true,
          cwd: 'test/spec',
          src: '{,*/}*.coffee',
          dest: '.tmp/spec',
          ext: '.js'
        }]
      }
    },
    // not used since Uglify task does concat,
    // but still available if needed
    /*concat: {
      dist: {}
    },*/
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/styles/{,*/}*.css',
//            TODO use images with the revision prefix, currency hardcoded
//            '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
//            '<%= yeoman.dist %>/styles/fonts/*'
          ]
        }
      }
    },
    useminPrepare: {
      html: '<%= yeoman.pubstatic %>/*.html',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>']
      }
    },
//    imagemin: {
//      dist: {
//        files: [{
//          expand: true,
//          cwd: '<%= yeoman.app %>/images',
//          src: '{,*/}*.{png,jpg,jpeg}',
//          dest: '<%= yeoman.dist %>/images'
//        }]
//      }
//    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.pubstatic %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    cssmin: {
      // By default, your `index.html` <!-- Usemin Block --> will take care of
      // minification. This option is pre-configured if you do not wish to use
      // Usemin blocks.
      // dist: {
      //   files: {
      //     '<%= yeoman.dist %>/styles/main.css': [
      //       '.tmp/styles/{,*/}*.css',
      //       '<%= yeoman.app %>/styles/{,*/}*.css'
      //     ]
      //   }
      // }
    },
    htmlmin: {
      dist: {
        options: {
          /*removeCommentsFromCDATA: true,
          // https://github.com/yeoman/grunt-usemin/issues/44
          //collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true*/
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.pubstatic %>',
          src: ['*.html', 'views/*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    // Put files not handled in other tasks here
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.pubstatic %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '<%= yeoman.pubstatic %>}/lib/**/*',
            'images/{,*/}*.{gif,webp,png}',
            'styles/fonts/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: [
            'generated/*'
          ]
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.pubstatic %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },
    concurrent: {
      server: { 
    	  tasks : ['nodemon','coffee:dist','copy:styles', 'watch', 'node-inspector'],
    	  options: {
    		  logConcurrentOutput: true
    	  }
      },
      serverLocal: { 
    	  tasks : ['nodemon:serverLocal','coffee:dist','copy:styles', 'watch', 'node-inspector'],
    	  options: {
    		  logConcurrentOutput: true
    	  }
      },
      monitorServer: { 
    	  tasks : ['nodemon:monitorServer', 'node-inspector:monitorServer'],
    	  options: {
    		  logConcurrentOutput: true
    	  }
      },
      monitorServerProd: { 
    	  tasks : ['nodemon:monitorServerProd'],
    	  options: {
    		  logConcurrentOutput: true
    	  }
      },
      monitorServerLocal: { 
    	  tasks : ['nodemon:monitorServerLocal'],
    	  options: {
    		  logConcurrentOutput: true
    	  }
      },
      hanaServer: { 
    	  tasks : ['nodemon:hanaServer', 'node-inspector:hanaServer'],
    	  options: {
    		  logConcurrentOutput: true
    	  }
      },
      hanaServerLocal: { 
    	  tasks : ['nodemon:hanaServerLocal', 'node-inspector:hanaServer'],
    	  options: {
    		  logConcurrentOutput: true
    	  }
      },
      test: [
        'coffee',
        'copy:styles'
      ],
      testload: { //uses alternative config for redis
          tasks : ['nodemon:test'],
       	  options: {
       		  logConcurrentOutput: true
       	  }
      },
      dist: [
        'coffee',
        'copy:styles',
//        'imagemin',
        'svgmin',
        'htmlmin'
      ]
      
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },
    uglify: {
      dist: {
        files: {
          '<%= yeoman.dist %>/scripts/scripts.js': [
            '<%= yeoman.dist %>/scripts/scripts.js'
          ]
        }
      }
    },
    nodemon: {
        dev: {
            options: {
                file: 'server.js',
                nodeArgs: ['--debug'],
                args: [],
                ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
                watchedExtensions: ['js'],
                watchedFolders: ['app', 'config', 'pubstatic'],
//                debug: true,
                delayTime: 1,
                env: {
                    PORT: 3000
                },
                cwd: __dirname                
            }
        },
        serverLocal: {
        	options: {
        		file: 'server.js',
                nodeArgs: ['--debug'],
        		args: [],
        		ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
        		watchedExtensions: ['js'],
        		watchedFolders: ['app', 'config', 'pubstatic'],
//                debug: true,
        		delayTime: 1,
        		env: {
        			PORT: 3000,
        			NODE_ENV : "localhost"
        		},
        		cwd: __dirname                
        	}
        },
        monitorServer: {
        	options: {
        		file: 'monitor/monitorServer.js',
        		nodeArgs: ['--debug'],
        		args: [],
        		ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
        		watchedExtensions: ['js'],
        		watchedFolders: ['monitor', 'config'],
        		debug: true,
        		delayTime: 1,
        		env: {
        			PORT: 3080
        		},
        		cwd: __dirname                
        	}
        },
        monitorServerProd: {
        	options: {
        		file: 'monitor/monitorServer.js',
//        		nodeArgs: ['--debug'],
        		args: [],
        		ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
        		watchedExtensions: ['js'],
        		watchedFolders: ['monitor', 'config'],
//        		debug: true,
        		delayTime: 1,
        		env: {
        			PORT: 3080,
        			NODE_ENV : "production"
        		},
        		cwd: __dirname                
        	}
        },
        monitorServerLocal: {
        	options: {
        		file: 'monitor/monitorServer.js',
//        		nodeArgs: ['--debug'],
        		args: [],
        		ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
        		watchedExtensions: ['js'],
        		watchedFolders: ['monitor', 'config'],
//        		debug: true,
        		delayTime: 1,
        		env: {
        			PORT: 3080,
        			NODE_ENV : "localhost"
        		},
        		cwd: __dirname                
        	}
        },
        hanaServer: {
        	options: {
        		file: 'monitor/hanaServer.js',
//        		nodeArgs: ['--debug'],
        		args: [],
        		ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
        		watchedExtensions: ['js', 'json'],
        		watchedFolders: ['monitor', 'config'],
//        		debug: true,
        		delayTime: 1,
        		env: {
        			PORT: 3081,
        			NODE_ENV : "production"
        		},
        		cwd: __dirname                
        	}
        },
        hanaServerLocal: {
        	options: {
        		file: 'monitor/hanaServer.js',
//        		nodeArgs: ['--debug'],
        		args: [],
        		ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
        		watchedExtensions: ['js', 'json'],
        		watchedFolders: ['monitor', 'config'],
//        		debug: true,
        		delayTime: 1,
        		env: {
        			PORT: 3081,
        			NODE_ENV : "localhost"
        		},
        		cwd: __dirname                
        	}
        },
        cluster: {
            options: {
                file: 'server_cluster.js',
                //nodeArgs: ['--debug'],
                args: [],
                ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
                watchedExtensions: ['js'],
                watchedFolders: ['app', 'config', 'pubstatic'],
                debug: true,
                delayTime: 1,
                cwd: __dirname                
            }
        },
        clustx: {
            options: {
                file: 'server_cluster.js',
                //nodeArgs: ['--debug'],
                args: [],
                ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],               
                debug: true,
                delayTime: 1,
                env: {
                	NODE_ENV : "production"
                },
                cwd: __dirname                
            }
        },
        nginx: {
            options: {
                file: 'server.js',
                //nodeArgs: ['--debug'],
                args: [],
                ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
                //watchedExtensions: ['js'],
                //watchedFolders: ['app', 'config', 'pubstatic'],
                debug: true,
                delayTime: 1,
                env: {
                	NODE_ENV : "production",
                	PORT : 3000
                },
                cwd: __dirname                
            }
        },
        nginx1: {
            options: {
                file: 'server.js',
                //nodeArgs: ['--debug'],
                args: [],
                ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
                //watchedExtensions: ['js'],
                //watchedFolders: ['app', 'config', 'pubstatic'],
                debug: true,
                delayTime: 1,
                env: {
                	NODE_ENV : "production",
                	PORT : 3001
                },
                cwd: __dirname                
            }
        },
        nginx2: {
            options: {
                file: 'server.js',
                //nodeArgs: ['--debug'],
                args: [],
                ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
                //watchedExtensions: ['js'],
                //watchedFolders: ['app', 'config', 'pubstatic'],
                debug: true,
                delayTime: 1,
                env: {
                	NODE_ENV : "production",
                	PORT : 3002
                },
                cwd: __dirname                
            }
        },
        test: {
            options: {
                file: 'server.js',
                nodeArgs: ['--debug'],
                args: [],
                ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
                watchedExtensions: ['js'],
                watchedFolders: ['app', 'config', 'pubstatic'],
                debug: true,
                delayTime: 1,
                env: {
                    PORT: 3000,
                    NODE_ENV : "test"
                },
                cwd: __dirname                
            }
        }
    },
    'node-inspector': {
	  dev: {},
	  monitorServer : {
		  options: {
			  'web-port' : 8081
		  }
	  },
	  hanaServer : {
		  options: {
			  'web-port' : 8082
		  }
	  }
	}
  });

  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    } 
    
    if(target == 'local'){
    	return grunt.task.run([
			'clean:server',
			'concurrent:serverLocal',
			'autoprefixer',
			'connect:livereload',
			'watch'
    	]);
    }
    
    if(target == 'testload'){
    	return grunt.task.run(['concurrent:testload']);
    }

    if(target == 'cluster'){
    	return grunt.task.run(['nodemon:cluster']);
    }
    
    if(target && target.indexOf('nginx') == 0){
    	return grunt.task.run(['nodemon:'+target]);
    }    
    
    if(target &&  target == 'clustx'){
    	return grunt.task.run(['nodemon:clustx']);
    }
    
    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });
  
  grunt.registerTask('monitorServer', function (target) {

	  if(target === 'prod') {
		  grunt.task.run([
                'concurrent:monitorServerProd',
                'watch'
          ]);
	  } if(target === 'local') {
		  //localhost env
		  grunt.task.run([
		                  'concurrent:monitorServerLocal',
		                  'watch'
		            ]);
	  } 
	  else {
		  //development env
		  grunt.task.run([
               'concurrent:monitorServer',
               'watch'
          ]);
	  }
	  
  });
  
  grunt.registerTask('hanaServer', function (target) {
  	  
	  if(target === 'prod') {
		  grunt.task.run([
          'concurrent:hanaServer',
          'watch'
          ]);
	  } else {
		  grunt.task.run([
	          'concurrent:hanaServerLocal',
	          'watch'
	      ]);
	  }
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngmin',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'test',
    'build'
  ]);
  
  grunt.loadNpmTasks('grunt-node-inspector');
};
