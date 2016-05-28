var url=require('url');
var Db = require('../db.js');
var config = require('../config.js');

var mod={}

mod.get = function(req,res){
  res.loadview('login.html');   
};

mod.post = function(req,res){
  
  res.setHeader("Set-Cookie", ["sid="+req.body.loginname]);
  res.statusCode = 302;
  res.setHeader("Location", "/index");
  res.end();
}


module.exports=mod;