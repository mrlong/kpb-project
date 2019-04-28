
var url=require('url');
var Db = require('../db.js');

//var querystring=require('querystring');

var mod ={};

mod.get = function (req, res) {
  
  var page = req.query.page || 1;
  var loginname = req.session.loginname; //登录名
  var sblist = req.session.sbs.split(','); //以 , 号分开
  var zcode = req.query.zcode;

  var mydate = req.query.date || (new Date().getFullYear() + '-' + (new Date().getMonth()+1 ) + '-' + new Date().getDate());
  
  
  var mywhere2 = '(1=1';
  var mywhere = '(1=1';
  //for(var i=0;i<sblist.length;i++){
  //  mywhere += " or ZCODE='" + sblist[i] + "'";
  //  mywhere2 += " or ZSTCD='" + sblist[i] + "'";
  //};
  
  mywhere += ')';
  mywhere2 += ')';
  
  //if(zcode){
  //  mywhere += " and ZCODE='" + zcode + "'";
  //};
  
  mywhere  += " and datediff(day,ZDATE,'" + mydate +"')=0";
//  mywhere2 += " and datediff(day,a.ZDATE,'" + mydate +"')=0";
  
  
  
  
  var mysqltxt;
  if(page==1){
    mysqltxt = 'select top 20 *,CONVERT(varchar(100), ZDATE, 20) as myd from TB_SB_REQ2  where ' + mywhere +' order by ZDATE desc ';
  }
  else{
    mysqltxt = 'select TOP ' + 20   +' *,CONVERT(varchar(100), ZDATE, 20) as myd from TB_SB_REQ2  where ZID not in(' + 
              'select TOP ' + 20 * (page -1) + ' ZID from TB_SB_REQ2  where ' + mywhere +  '  order by ZDATE desc) and '+ mywhere +' order by ZDATE desc ';
  };
  
  
  
  Db.query(mysqltxt,function(err,rows){
  
    Db.query('select count(*) as myc from TB_SB_REQ2 as a  where' + mywhere ,function(err2,rows2){
      
      Db.query('select * from TB_NAME2 where ' + mywhere2,function(err3,rows3){
        
        
        //计算当前日期的前一天与后一天
        var curdate  = new Date(mydate + ' 12:00');
        var preDate  = new Date(curdate - 24*60*60*1000);  //前一天
        var nextDate  = new Date( curdate.setDate(curdate.getDate()+1) );  // new Date(curdate + 24*60*60*1000);  //后一天
        var preDateStr = preDate.getFullYear() + '-' + (preDate.getMonth()+1 ) + '-' + preDate.getDate();
        var nextDateStr = nextDate.getFullYear() + '-' + (nextDate.getMonth()+1 ) + '-' + nextDate.getDate();
      
        res.loadview('index.html',{
          rows:!err&&rows?rows:[],
          curpage:page,
          loginname :req.session.loginname,
          rowcount:!err2 && rows2 ? rows2[0].myc:0,
          zcode:zcode,
          curdate:mydate,predate:preDateStr,nextdate:nextDateStr,
          sblist:!err3 && rows3 ? rows3 :[]

        });
        
      });
    });  
    
    
  });
  
  
//  res.loadview('index.html',{
//          rows:[],
//          curpage:1,
//          zcode:'',  
//          loginname :'mrlong',
//          rowcount:0,
//          sblist:[]
//
//        });
  
  
  
  
  

  
};

module.exports=mod;
