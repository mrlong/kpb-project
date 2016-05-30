var url=require('url');
var Db = require('../db.js');
var config = require('../config.js');


var mod={}

mod.get = function(req,res){
  res.loadview('login.html',{msg:''});   
};

mod.post = function(req,res){
  
  var sqltxt = "select * from TB_USER where ZNAME ='" + req.body.loginname +
      "' and ZPASSWD='" + req.body.loginpaswd + "'";
  
  Db.query(sqltxt,function(err,rows){
    if(!err && rows && rows.length>0){
      
      req.session.loginname = req.body.loginname;
      req.session.sbs = rows[0].ZSBLIST; //记录用户的可用的设备，用 ,分开。
      res.statusCode = 302;
      res.setHeader("Location", "/index");
      res.end();
      
      
    }
    else{
      res.loadview('login.html',{msg:'登录出错'});  
    }
  });
  
  
}


module.exports=mod;