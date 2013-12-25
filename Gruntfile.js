module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      dist: {
        src: ['src/*.js'],
        dest: 'dist/fuel-badge.js'
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      my_target: {
        files: {
          'dist/fuel-badge.min.js': 'dist/fuel-badge.js'
        }
      }
    },

    watch: {
      scripts: {
        files: ['src/*.js'],
        tasks: ['concat', 'uglify'],
        options: {
          spawn: false
        }
      } 
    }

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['concat', 'uglify']);
};
