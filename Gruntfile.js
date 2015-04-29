'use strict';
module.exports = function(grunt){
  // var sftpkey = {
  //   "host":"10.11.8.102",
  //   "port":22,
  //   "authKey":"lsl102"
  // };
  var sftpkey = {
    "host":"61.155.179.199",
    "port":21,
    "authKey":"lsl06006"
  }
  // var dest102 = "/data/vhosts/kankan.com/chat/public_html/";
  var dest102 = "/data/vhosts/kankan.com/chat.live/";
  var pkg = grunt.file.readJSON('package.json');
  grunt.initConfig({
    watch:{
      plugins:{
        files:['plugins/*.js'],
        tasks:['sftp-deploy:plugin']
      },
      models:{
        files:['models/*.js'],
        tasks:['sftp-deploy:model']
      },
      bin:{
        files:['bin/*'],
        tasks:['sftp-deploy:bin']
      },
      app:{
        files:['app/*.js'],
        tasks:['sftp-deploy:app']
      },
      phpt:{
        files:['phpt/*.php'],
        tasks:['sftp-deploy:phpt']
      }
    },
    'sftp-deploy':{
      plugin:{
        auth:sftpkey,
        src:'plugins',
        dest:dest102+'plugins',
        progress:true
      },
      model:{
        auth:sftpkey,
        src:'models',
        dest:dest102+'models',
        progress:true
      },
      bin:{
        auth:sftpkey,
        src:'bin',
        dest:dest102+'bin',
        progress:true
      },
      app:{
        auth:sftpkey,
        src:'app',
        dest:dest102+'app',
        progress:true
      },
      phpt:{
        auth:sftpkey,
        src:'phpt',
        dest:'/data/vhosts/xunlei.com/movie/inc/library/',
        progress:true
      }
    } 
  });
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sftp-deploy');
  grunt.registerTask('default',['watch']);   
}