/*global module:false*/
module.exports = function(grunt) {
  require('jit-grunt')(grunt, {
    replace: 'grunt-text-replace'
  });

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    mix: grunt.file.readJSON('mixture.json'),
    autoprefixer: {
      app: {
        options: { map: true },
        files: [{
          expand: true,
          
        }],
      },
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {}
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js']
      }
    },
    convert: { // https://github.com/assemble/grunt-convert
      models: {
        files: [{
          expand: true,
          cwd: 'models/',
          src: ['*.yml'],
          dest: 'models/',
          ext: '.json',
        }],
      },
      mixture: {
        src: ['mixture.yml'],
        dest: 'mixture-pre.json',
      },
    },
    replace: { // https://github.com/yoniholmes/grunt-text-replace
      mixture2: {
        src: ['mixture.yml'],
        dest: 'mixture.temp.yml',
        replacements: function() {
          var repl = [];
          var jsonRepl = grunt.file.readJSON('mixture.json');
          for (var key in jsonRepl) { repl.push({
            from: key,
            to: jsonRepl[key]
          }); }
          return repl;
        }
      },
      mixture: {
        src: ['mixture-pre.json'],
        dest: 'mixture.json',
        replacements: [
          {
            from: /(\"publishedId\"\:\s?).*?(\,)/,
            to: function (matchedWord, index, fullText, regexMatches) {
              var publishedId = grunt.file.readJSON('mixture-proxy.json').publishedId;
              return regexMatches[0] + publishedId + regexMatches[1];
            }
          },
        ],
      },
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'qunit']
      }
    }
  });

  grunt.registerTask('default', ['watch']);

};
