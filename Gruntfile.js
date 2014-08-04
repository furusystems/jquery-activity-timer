/* global module, require */

module.exports = function (grunt) {
  "use strict";

  // Load plugins.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-open');

  // Register tasks
  grunt.registerTask('default', [
    'build',
    'qunit',
    'package'
  ]);

  grunt.registerTask('build', [
    'jshint',
    'clean:build',
    'copy:build'
  ]);

  grunt.registerTask('test', [
    'jshint',
    'clean:test',
    'copy:test'
  ]);

  grunt.registerTask('package', [
    'clean:package',
    'concat:package',
    'uglify:package'
  ]);

  grunt.registerTask('workflow:dev', [
    'connect:dev',
    'build',
    'open:dev',
    'watch:dev'
  ]);

  // Configure
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    env: grunt.option('env') || 'dev',

    properties: {
      name: 'jquery-activity-timer',
      source_dir: 'src',
      build_dir: 'build',
      test_dir: 'test',
      package_dir: 'dist'
    },

    clean: {
      build: '<%= properties.build_dir %>',
      package: '<%= properties.package_dir %>',
    },

    jshint: {
      source: [
        '<%= properties.source_dir %>'
      ],
      test: [
        '<%= properties.test_dir %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    copy: {
      build: {
        files: [
          {
            expand: true,
            cwd: '<%= properties.source_dir %>',
            src: ['**'],
            dest: '<%= properties.build_dir %>'
          },
          {
            expand: true,
            src: ['bower_components/**'],
            dest: '<%= properties.build_dir %>'
          }
        ]
      }
    },

    qunit: {
      options: {
        timout: 30000,
      },
      files: ['test/**/*.html']
    },

    connect: {
      options: {
        hostname: '*'
      },
      dev: {
        options: {
          port: 9000,
          base: '<%= properties.build_dir %>'
        }
      }
    },

    open: {
      dev: {
        url: 'http://127.0.0.1:<%= connect.dev.options.port %>/demo.html'
      }
    },

    watch: {
      dev: {
        files: ['<%= properties.source_dir %>/**/*'],
        tasks: ['build', 'qunit'],
        options: {
          livereload: true
        }
      }
    }
  });
};
