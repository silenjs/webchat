var comment = require('../models/comment');
var usrapi = require('./socket.net');
var uidFlag = 'KANKANWEBUID';
usrapi.sAction();
function Socketio(){
  var visitorOrder=1,socketArr=[];
  return function(io){
    io.sockets.on('connection',function(socket){
      var sname = socket.conn.request.headers.cookie?socket.conn.request.headers.cookie.split(';').filter(function(icookie){
        return !!~icookie.indexOf(uidFlag)
      }):[];
      socket.name = sname.length?sname[0].split('=')[1]:'visitor'+visitorOrder++;
      socket.refer = socket.conn.request.headers.referer;
      console.log(socket.refer)
      console.log(socket.conn.remoteAddress);
      /*  
      客户端登陆 
      data {unickname}
      */
      socket.on('signin',function(data){
        socketArr.push(socket.name);  
        io.sockets.emit('signinback',{unickname:socket.name});    
      });
      /*
      客户端登出
      */
      socket.on('signout',function(data){
         var index = socketArr.indexOf(socket.name);
         if(index+1){
            socketArr.splice(index,1)
         } 
      });
      /*
        disconnect
      */
      socket.on('disconnect',function(){
          var index = socketArr.indexOf(socket.name);
          if(index+1){
            socketArr.splice(index,1)
          } 
          // io.sockets.send({unickname:socket.name,comment:socket.name+'下线了！'})      
       })
      /*
      客户端发送消息
      */
      socket.on('chats',function(data){
          if(socket.name){
              //获取sessionid 验证session有效性
              var content=data.ctent;
              var filterFlag = false;
              //敏感词过滤
              if(content.length>1){
                filterFlag = comment.filter(content.replace(/\s*/g,''));
              }
            //存mongodb
            comment.save({unickname:socket.name,comment:content,filter:filterFlag?1:0,refer:socket.refer,fip:socket.conn.remoteAddress,insert_time:new Date().getTime()},function(){});
            if(filterFlag){
              socket.send({unickname:socket.name,comment:content});
            }else{
              //广播
              io.sockets.send({unickname:socket.name,comment:content});
              // socket.broadcast.send({unickname:socket.name,comment:content})
            }
          }else{

          }
      })      
    }) 
  }
}
module.exports = new Socketio();