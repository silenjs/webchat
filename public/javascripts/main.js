$(document).ready(function(){
  var scio=io('http://localhost:3000',{});
  scio.emit('signin',{})
  scio.on('signinback',function(data){
    $('#userList').append('<li>'+data.unickname+' Signin!</li>')
  })
  scio.on('message',function(data){
    $('#chatList').append('<li>'+data.unickname+' sayed:'+data.comment+'</li>')
  })
  $('#chatBtn').on('click',function(){
    var chatVal=$('#chatInput').val().replace(/(^\s*)|(\s*$)/g,"");
    if(chatVal){
      scio.emit('chats',{ctent:chatVal});
      $('#chatInput').val('');
    }
  });
})