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
      //console.log('length='+chunk.length);
      //var mystr = chunk.toString();
	    //console.log(chunk);
	    //var mystr2 = new Buffer(chunk,"utf-8").toString('hex');
	    //console.log(mystr2);
      //console.log(chunk.slice(0, 4).toString());

     //重新建立连接。      
     if(chunk.slice(0, 2).toString()=='st'){
        c.sbcode = chunk.slice(4, 8).toString(); 
        //c.write(new Buffer('24303052503033320D','hex'));
        //c.pipe(c);
        log.info('first connected:' + c.sbcode);
		    //console.log('first connected:' + c.sbcode);
     }
     else{
        if(chunk.slice(0, 1).toString() == '$'){
          //客户的心跳  
          log.info(c.sbcode + 'heart');
        }
        else{
            if(c.sbcode){
              //console.log('data=' + mystr);
			        Db.writeREQ2(c.sbcode,chunk,log); //写库入 
            }
            else{
              log.error('收到的信息无法确定是哪台站点的。');
            }
        };
     }
    }); 

    c.on('end', function() {
      log.info('断开连接:' + c.sbcode);
    });

    //setInterval(function(){
    //  c.write(new Buffer('24303052503033320D','hex'));
    //  c.pipe(c);
    //  log.info('发送指令到:' + c.sbcode);
    //},1000*60*5) //5分钟
  
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

