module.exports = function (grunt) {
  grunt.initConfig({
    execute: {
      target: {
        src: ['app.js']
      }
    },
    watch: {
      scripts: {
        files: ['app.js'],
        tasks: ['execute'],
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-execute');
};
