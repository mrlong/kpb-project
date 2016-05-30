
var url=require('url');
var Db = require('../db.js');

//var querystring=require('querystring');

var mod ={};

mod.get = function (req, res) {
  
  var page = req.query.page || 1;
  var loginname = req.session.loginname; //登录名
  var sblist = req.session.sbs.split(','); //以 , 号分开
  var zcode = req.query.zcode;
  
  var mywhere2 = '(1=2';
  var mywhere = '(1=2';
  for(var i=0;i<sblist.length;i++){
    mywhere += " or ZCODE='" + sblist[i] + "'";
    mywhere2 += " or STCD='" + sblist[i] + "'";
  };
  
  mywhere += ')';
  mywhere2 += ')';
  
  if(zcode){
    mywhere += " and ZCODE='" + zcode + "'";
  };
  
  
  var mysqltxt;
  if(page==1){
    mysqltxt = 'select top 20 ZCODE,ZSTR,ZVOL,ZDATE,CONVERT(varchar(100), ZDATE, 20) as myd,b.NAME,ISNULL(b.BASE,0) as bv from TB_SB_REQ as a left join NAME as b on (a.ZCODE=b.STCD) where ' + mywhere +' order by ZDATE desc ';
  }
  else{
    mysqltxt = 'select TOP 20 ZCODE,ZSTR,ZVOL,ZDATE,CONVERT(varchar(100), ZDATE, 20) as myd,b.NAME,ISNULL(b.BASE,0) as bv  from TB_SB_REQ as a left join NAME as b on (a.ZCODE=b.STCD) where ZID not in(' + 
              'select TOP ' + 20 * (page -1) + ' ZID from TB_SB_REQ where ' + mywhere +  '  order by ZDATE desc) and '+ mywhere +' order by ZDATE desc ';
  };
  
  
  
  Db.query(mysqltxt,function(err,rows){
  
    Db.query('select count(*) as myc from TB_SB_REQ where' + mywhere ,function(err2,rows2){
      
      Db.query('select * from NAME where ' + mywhere2,function(err3,rows3){
      
      
        res.loadview('index.html',{
          rows:!err&&rows?rows:[],
          curpage:page,
          loginname :req.session.loginname,
          rowcount:!err2 && rows2 ? rows2[0].myc:0,
          sblist:!err3 && rows3 ? rows3 :[]

        });
        
      });
    });  
    
    
  });
  
  
  
  
  

  
};

module.exports=mod;
