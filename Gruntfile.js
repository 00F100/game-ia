module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        src: [
          'lib/melonjs.js',
          'js/game.js',
          'js/**/*.js',
          'node_modules/@00f100/neuralnetworkjs/src/neural-network.js'
        ],
        dest: 'build/js/app.js'
      }
    },

    copy: {
      dist: {
        files: [{
          src: 'index.css',
          dest: 'build/index.css'
        },{
          src: 'manifest.json',
          dest: 'build/manifest.json'
        },{
          src: 'package.json',
          dest: 'build/package.json'
        },{
          src: 'data/**/*',
          dest: 'build/',
          expand: true
        }]
      }
    },

    clean: {
      app: ['build/js/app.js'],
      dist: ['build/','bin/'],
    },

    processhtml: {
      dist: {
        options: {
          process: true,
          data: {
            title: '<%= pkg.name %>',
          }
        },
        files: {
          'build/index.html': ['index.html']
        }
      }
    },

    replace : {
      dist : {
        options : {
          usePrefix : false,
          force : true,
          patterns : [
            {
              match : /this\._super\(\s*([\w\.]+)\s*,\s*["'](\w+)["']\s*(,\s*)?/g,
              replacement : '$1.prototype.$2.apply(this$3'
            },
          ],
        },
        files : [
          {
            src : [ 'build/js/app.js' ],
            dest : 'build/js/app.js'
          }
        ]
      },
    },

    uglify: {
      options: {
        report: 'min',
        preserveComments: 'some'
      },
      dist: {
        files: {
          'build/js/app.min.js': [
            'build/js/app.js'
          ]
        }
      }
    },

    connect: {
      server: {
        options: {
          port: 8000,
          keepalive: false
        }
      }
    },

    'download-electron': {
      version: '1.4.6',
      outputDir: 'bin',
      rebuild: false,
    },

    asar: {
      dist: {
        cwd: 'build',
        src: ['**/*', '!js/app.js'],
        expand: true,
        dest: 'bin/' + (
          process.platform === 'darwin'
            ? 'Electron.app/Contents/Resources/'
            : 'resources/'
        ) + 'app.asar'
      },
    },

    resources: {
      dist: {
        options: {
          dest: 'build/js/resources.js',
          varname: 'game.resources',
        },
        files: [{
          src: ['data/img/**/*.png'],
          type: 'image'
        }]
      }
    },

    watch: {
      resources: {
        files: ['data/**/*'],
        tasks: ['resources'],
        options: {
          spawn: false,
        },
      },
    },

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks("grunt-replace");
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-download-electron');
  grunt.loadNpmTasks('grunt-asar');

  // Custom Tasks
  grunt.loadTasks('tasks');

  grunt.registerTask('default', [
    'resources',
    'concat',
    'replace',
    'uglify',
    'copy',
    'processhtml',
    'clean:app',
  ]);
  grunt.registerTask('dist', ['default', 'download-electron', 'asar']);
  grunt.registerTask('serve', ['resources', 'connect', 'watch']);
}
