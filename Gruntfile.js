module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    script:'json2java',
    banner:'/*!\n * <%= script %>.js\n'+
           ' * Author:<%= pkg.author %>\n'+
           ' * Summary:<%= pkg.description %>\n'+
           ' * License:<%= pkg.license %>\n'+
           ' * Version: <%= pkg.version %>\n'+
           ' *\n * URL:\n * <%= pkg.homepage %>\n'+
           ' * <%= pkg.homepage %>/blob/master/LICENSE\n *\n */\n',
    uglify: {
      options: {
        banner: '<%= banner %>',
          compress: {
          drop_console: true
        }
      },
      clean:{
        options: {
          beautify: {
            width: 50,
            beautify: true
          },
          mangle: {
            except: ['json2java']
          }
      },
        src: '<%= script %>.origin.js',
        dest: '<%= script %>.js',
      },
      compress: {
        src: '<%= script %>.js',
        dest: '<%= script %>.min.js'
      }
    }
  });

 
  grunt.loadNpmTasks('grunt-contrib-uglify');
 
 
  grunt.registerTask('build',['uglify:clean','uglify:compress']);

  grunt.registerTask('test','test',function(){
    
  });

};