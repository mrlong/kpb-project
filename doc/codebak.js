
var url=require('url');
var ejs = require('ejs');
//var querystring=require('querystring');

exports.processRequest = function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  var qs= querystring.parse(url.parse(req.url).query);
  if(qs.key){
      delete req.cache[qs.key];
  }
  res.write('<html><head></head><body>');
  for(var key in req.cache){
      res.write('<a href="?key=' + key + '">' + key + '</a><br/>');
  }
  res.write('<a href="?">View</a><br/>');
  res.end('</body></html>');
};

