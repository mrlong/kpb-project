
var url=require('url');
var Db = require('../db.js');

//var querystring=require('querystring');

exports.processRequest = function (req, res) {
  
  var page = 1;// req.query.page || 1;
  
  var mysqltxt;
  if(page==1){
    mysqltxt = 'select top 20 ZCODE,ZSTR,ZVOL,ZDATE from TB_SB_REQ order by ZDATE desc ';
  }
  else{
    mysqltxt = 'select TOP 20 ZCODE,ZSTR,ZVOL,ZDATE from TB_SB_REQ where ZID not in(' + 
              'select TOP ' + 20 * (page -1) + ' ZID from TB_SB_REQ order by ZDATE desc) order by ZDATE desc ';
  };
  
  
  Db.query(mysqltxt,function(err,rows){
  
    Db.query('select count(*) as myc from TB_SB_REQ',function(err2,rows2){
      res.loadview('index.html',{
        rows:!err&&rows?rows:[],
        curpage:page,
        rowcount:!err2 && rows2 ? rows2[0].myc:0
      });  
    });  
    
    
  });

  
  

  
};
