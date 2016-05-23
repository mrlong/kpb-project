/*
 * 作者:龙仕云   2016-5-12  http://www.mrlong.cn
 *
 *
 */

var net = require('net');
var config = require('./config.js');
var Db = require('./db.js');


module.exports = function(log){
  
  var server = net.createServer(function(c) {
    
    c.on('data',function(chunk){
     var mystr = chunk.toString();
     //重新建立连接。      
     if(mystr.indexOf('xs,')==0){
        c.sbcode = mystr; 
        c.write(new Buffer('24303052503033320D','hex'));
        c.pipe(c);
        log.info('first connected:' + mystr);
     }
     else{
        if(mystr == '$'){
          //客户的心跳  
        }
        else{
          Db.writeREQ(c.sbcode,mystr,log); //写库入 
          log.info('other:' + mystr);
        };
     }
    }); 

    c.on('end', function() {
      log.info('断开连接:' + c.sbcode);
    });

    setInterval(function(){
      c.write(new Buffer('24303052503033320D','hex'));
      c.pipe(c);
      log.info('发送指令到:' + c.sbcode);
    },1000*60*5) //5分钟
  
  });

  //出错。
  //server.setMaxListeners(10);
  //require('events').EventEmitter.prototype._maxListeners = 100;
  server.on('error', function (e) {
    log.error('Address in use, retrying...'+e);
  });

  server.listen(config.port, function() { 
    console.log('socket server by ' + config.port);
  });
  
}; 

