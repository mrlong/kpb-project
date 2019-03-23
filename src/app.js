/*
 *  作者：龙仕云  http://www.mrlong.cn
 *  2016-5-12
 *
 */

var net = require('net');
var log4js = require('log4js');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length; //cpu核数
var config = require('./config.js');
var server = require('./server2.js');


log4js.configure(config.logger);
var log = log4js.getLogger("cheese");  

//多核处理，提高性能。
if(cluster.isMaster){  
  for (var i = 0; i < numCPUs; i++) {
    var worker = cluster.fork();
    worker.on('online', function() {
      log.info('on line wid:' + worker.process.pid);
    });
  }
  log.info('cluster.isMaster');
  cluster.on('exit', function(worker, code, signal) {
    log.info('worker ' + worker.process.pid + ' died ('+ (signal || code) +'). restarting...');
    cluster.fork();
  });
}
else if(cluster.isWorker){
  server(log);
}; //end worker





