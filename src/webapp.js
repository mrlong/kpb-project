//
// 作者：龙仕云  2016-5-14  http://www.mrlong.cn
// web 显示结果  
//

var fs = require("fs");
var http = require("http");
var url = require("url");
var path = require('path');
var ejs = require('ejs');
var qs = require('querystring');
var getRawBody = require('raw-body');
var sysconfig = require('./config.js');
var session = require('./session.js');

var config = {
  //index:'',
  port:8082,
  srcdir: __dirname + '/webcontrollers',
  html: __dirname + '/webcontent',
  staticdir:'./webcontent/public'     //静态文件目录
};


//静态文件处理。
var staticResHandler=  function (localPath, ext, res) {
  fs.readFile(localPath, "binary", function (err, file) {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Server Error:" + error);
      } else {  
        ext = ext.toLowerCase();
        var htmltype = 'text/plain';
        if (ext === '.htm' || ext === '.html')
          htmltype = 'text/html';
        else if (ext === '.js')
          htmltype = 'application/x-javascript';
        else if (ext === '.css')
          htmltype = 'text/css';
        else if (ext === '.jpe' || ext === '.jpeg' || ext === '.jpg')
          htmltype = 'image/jpeg';
        else if (ext === '.png')
          htmltype = 'image/png';
        else if (ext === '.ico')
          htmltype = 'image/x-icon';
        else if (ext === '.zip')
          htmltype = 'application/zip';
        else if (ext === '.doc')
          htmltype = 'application/msword';
        else
          htmltype = 'text/plain';

        res.writeHead(200, { "Content-Type": htmltype});
        res.end(file, "binary");
      }
  });
};


//创建服务
http.createServer(function(req,res,next){
  var pathname = url.parse(req.url).pathname;
  
  if (pathname === '/') {
    pathname += config.index || 'index' //默认页面
  };
  
  var ext = path.extname(pathname);
  var localPath = '';    //本地相对路径
  var staticres = false; //是否是静态资源
  if (ext.length > 0) {
    localPath = path.resolve(__dirname, config.staticdir + pathname);
    staticRes = true;
  } else {
    localPath =  config.srcdir + pathname + '.js';
    staticRes = false;
  };
  
  //禁止访问后端js
  if (staticRes && localPath.indexOf(config.srcdir) >= 0) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403:Deny access to this page');
    return true;
  };
  
  fs.exists(localPath, function (exists) {
    if(exists){
      
      if (staticRes) {
        staticResHandler(localPath, ext, res); //静态资源
      } else {
        try {
          req.session = session.start(req, res);
          if(!req.session.loginname){localPath= config.srcdir + '/login.js';}
          var handler = require(localPath);
          if (handler) {
              
              res.loadview = function(filename,data){
                var localfilename = path.resolve(__dirname,config.html + '/' + filename);
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(ejs.render(
                  fs.readFileSync(localfilename).toString(),
                  data||{},
                  {filename:localfilename})
                );
              };
              
              var getQuery = url.parse(req.url).query;
              getQuery?req.query = qs.parse(getQuery):req.query={};
            
              //get,post处理
              if(req.method == 'GET' && handler.get && typeof handler.get === 'function' ){
                handler.get(req,res);  
              }
              else if(req.method == 'POST' && handler.post && typeof handler.post === 'function'){
                getRawBody(req,{
                  length: req.headers['content-length'],
                  limit: '1mb',
                  encoding: 'utf-8' 
                }, function (err, bodystr) {
                  if (!err) {
                    try{
                      req.body = qs.parse(bodystr); 
                      handler.post(req,res);
                    }catch(e){
                      req.body = {};  
                      handler.post(req,res);
                    };
                  }
                  else{
                    req.body ={};
                    handler.post(req,res);
                  }
                });
              }
              else{
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end('404:路由出错');  
              };
              
            
          } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404:Handle Not found');
          }
        } catch (exception) {
          console.error('error::url:' + req.url + ' msg:' + exception);
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Server Error:" + exception);
        }; 
      }
    }
    else{
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404:File Not found');  
    }
    
  });
   
}).listen(config.port,function(){console.log('web服务已启动,窗口关闭则服务无效。:'+config.port)});




