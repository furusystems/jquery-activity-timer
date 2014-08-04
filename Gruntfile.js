/* global module, require */

module.exports = function (grunt) {
  "use strict";

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-open');


  grunt.registerTask('default', [
    'build',
    'test',
    'package'
  ]);

  grunt.registerTask('build', [
    'jshint',
    'clean:build',
    'copy:build'
  ]);

  // grunt.registerTask('test', [
  //   'karma:browser_unit'
  // ]);
  grunt.registerTask('test:dev', [
    // 'karma:headless_unit'
  ]);
  // grunt.registerTask('test:debug', [
  //   'karma:browser_unit_debug'
  // ]);

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

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    env: grunt.option('env') || 'dev',

    properties: {
      name: 'jquery-activity-timer',
      source_dir: 'src',
      build_dir: 'build',
      package_dir: 'dist'
    },

    clean: {
      build: '<%= properties.build_dir %>',
      package: '<%= properties.package_dir %>'
    },

    jshint: {
      source: [
        '<%= properties.source_dir %>'
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
        tasks: ['build', 'test:dev'],
        options: {
          livereload: true
        }
      }
    }
  });
};
