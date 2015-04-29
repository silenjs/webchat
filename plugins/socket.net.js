var net = require('net');
var parse = require('./data.parse');
var log4js = require('../logger/logger');
var bin2Hex = function(s){
    var i,l,o='',n;
    s += '';
    for (i = 0, l = s.length; i < l; i++) {
      n = s.charCodeAt(i)
        .toString(16);
      o += n.length < 2 ? '0' + n : n;
    }
    return o;
  }
module.exports = new function(){
  this.sAction = function(){
      var socket = new net.Socket();
      // socket.connect(6002,'10.10.41.31');

      socket.on('data',function(data){
        console.log('data');
        console.log(data);
        parse.baseDecode(data);
      })
      socket.on('error',function(err){
        console.log('err');
        console.log(err);
      })
      socket.on('connect',function(){
        log4js.debug('connect');
        // socket.write(request);
      })
      var request = parse.baseEncode([{"request":"getusrinfor"},{"sessionid":"A2899559CB00A9BABACE532552B78C4B9A1857476A0E73DD10B3BBF6C77BA884D12D697F3A3209A073E80298F28B8647CFBB382836725ADC685CD1467C78349F"}]);
  }
}