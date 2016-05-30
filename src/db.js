/* 
 * 作者：龙仕云  http://www.mrlong.cn  写库
 *
 */


var mssql = require('mssql');
var config = require('./config.js');


//读取库的内容
//查询sql
// cb = function(err,data); 其中data是返回值
//
exports.query = function(sql,cb){
  
  var connection = new mssql.Connection(config.mssql, function(err) {
    if(!err){
      var request = new mssql.Request(connection); 
      request.query(sql,function(err,recordset){
        if(!err){
          if(cb) cb(null,recordset); 
          connection.close();
        }
        else{
          connection.close();
          if(cb) cb(err);
        }
      });
    }
    else{
      if(cb) cb(err);
    }
  });
};


//写入请求的数据，中间的转换过程。
//   datastr 的格式：*16+00.02434
exports.writeREQ = function(sbcode,datastr,log){
  var connection = new mssql.Connection(config.mssql);
  connection.connect(function(err) {
    if(!err){
      var vals = datastr.split('+');
      if(vals.length != 2){
        log && log.error('客户端返回参数出错! ' + datastr);
        connection.close();
        return false;  
      };
      
      var myvol = parseFloat(vals[1]).toFixed(3);
      //xs,#1001
      var mycode = sbcode.replace('xs,#','');
      
      var sqltxt = "insert into TB_SB_REQ(ZCODE,ZVOL,ZSTR,ZDATE) values('" + 
              mycode +"'," +
              myvol + ",'" +
              sbcode + ' ' + datastr + "',GETDATE())";
      
      var transaction = new mssql.Transaction(connection);
      transaction.begin(function(err) {
        if(!err){
          var request = new mssql.Request(transaction);
          request.query(sqltxt,function(err){
            if(!err){
              transaction.commit(function(err, recordset) {
                connection.close();
              });
            }
            else{ 
              log && log.error('执行sql出错'+err);
              connection.close();
            }
          });
        }
        else{
          log && log.error('库事务出错。');
          connection.close();
        }
      });
    }
    else{
      log && log.error('连接数据库出错');
    }
  });
};

