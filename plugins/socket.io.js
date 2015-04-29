var comment = require('../models/comment');
var usrapi = require('./socket.net');
usrapi.sAction();
function Socketio(){
  var visitorOrder=1,socketArr=[];
  return function(io){
    io.checkRequest();
    io.sockets.on('connection',function(socket){
      /*  
      客户端登陆 
      data {unickname}
      */
      socket.on('signin',function(data){
        socket.name=data.unickname||'visitor'+visitorOrder++;
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
          io.sockets.send({unickname:socket.name,comment:socket.name+'下线了！'})      
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
            comment.save({unickname:socket.name,comment:content,filter:filterFlag?1:0},function(){});
            if(filterFlag){
              socket.send({unickname:socket.name,comment:content});
            }else{
              //广播
              io.sockets.send({unickname:socket.name,comment:content});
              //socket.broadcast.send({unickname:socket.name,comment:content})
            }
          }else{

          }
      })      
    }) 
  }
}
module.exports = new Socketio();