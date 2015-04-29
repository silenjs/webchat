function dBin(){
  var getUInt = function(buffer,param){
    var buffer = new Buffer(4); 
    buffer.writeUInt32BE(typeof param==='string'?param.length:param,0);
    return buffer.toString('binary');
  }
  this.baseEncode = function(fieldArr){
    var encodeStr = null,buf = new Buffer(4);
    /*这里encodeStr不能为''，如果为''，发送数据的时候包头长度会比实际长度大4*/
    if(fieldArr&&fieldArr instanceof Array){
      for(var i=0,len=fieldArr.length;i<len;i++){
        var iobj = fieldArr[i],propArr = Object.getOwnPropertyNames(iobj);
        var str = '';
        for(var j=0,len2=propArr.length;j<len2;j++){
          var prop = propArr[j];
          str += getUInt(buf,prop)+prop+getUInt(buf,iobj[prop])+iobj[prop];  
        }
        encodeStr += getUInt(buf,str)+str;
      }
      encodeStr = getUInt(buf,encodeStr)+encodeStr;
      encodeStr = getUInt(buf,encodeStr.length+4)+encodeStr;
    }
    return encodeStr;
  }

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

  var getBodyLength = function(res){
    var buf = new Buffer(res.substring(0,4),'binary');
    return parseInt(buf.readUInt32BE(0));
  }
  var getRecords = function(res){
    var bodyLen = getBodyLength(res);
    var res = res.substring(4);
    var decodeLen = 4;  //已解码长度
    var recordArr = [];
    for(var i=0;decodeLen<bodyLen;i++){
      var len = getBodyLength(res);
      recordArr[i] = res.substring(4,len);
      decodeLen += 4+len;
      res = res.substring(res,len+4);
    }
    return recordArr;
  }
  var getRows = function(record){
    var recordLen = record.length;
    var decodeLen = 0;
    var rowArr = [];
    for(var i=0;decodeLen<recordLen;i++){
      var len = getBodyLength(record);
      rowArr[i] = record.substring(4,len);
      decodeLen += 4+len;
      record = record.substring(len+4);
    }
    return rowArr;
  }
  var getFields = function(row){
    var keyLen = getBodyLength(row);
    var key = row.substring(4,rowLen);
    var valLen = getBodyLength(row.substring(4+keyLen));
    var val = row.substring(4+keyLen+4);
    // 编码
    return {"key":key,"value":val};
  }
  this.baseDecode = function(response){
    var decodeArr = [];
    var recordArr = getRecords(response);
    if(recordArr.length){
      for(var i=0,len=recordArr.length;i<len;i++){
        var rowArr = getRows(recordArr[i]);
        if(rowArr.length){
          for(var j=0,len2=rowArr.length;j<len2;i++){
            var fieldObj = getFields(rowArr[j]);
            decodeArr[i][fieldObj['key']] = fieldObj['value'];
          }
        }
      }
    }
  }
  
}

//2*result200userno501
module.exports = new dBin();