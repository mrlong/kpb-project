var mod = {};

mod.get = function(req,res){
  
  req.session.loginname = null;
  
  res.statusCode = 302;
  res.setHeader("Location", "/login");
  res.end();
};

module.exports=mod;