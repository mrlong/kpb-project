/* 
 * 作者：龙仕云  http://www.mrlong.cn  写库
 *
 */


var sql = require('mssql');
var config = require('./config.js');

//写入请求的数据，中间的转换过程。
//   datastr 的格式：*16+00.02434
exports.writeREQ = function(sbcode,datastr,log){
  var connection = new sql.Connection(config.mssql);
  connection.connect(function(err) {
    if(!err){
      var vals = datastr.split('+');
      if(vals.length != 2){
        log && log.error('客户端返回参数出错! ' + datastr);
        connection.close();
        return false;  
      };
      
      var myvol = parseFloat(vals[1]).toFixed(3);
      
      var sqltxt = "insert into TB_SB_REQ(ZCODE,ZVOL,ZSTR,ZDATE) values('" + 
              sbcode +"'," +
              myvol + ",'" +
              datastr + "',GETDATE())";
      
      var transaction = new sql.Transaction(connection);
      transaction.begin(function(err) {
        if(!err){
          var request = new sql.Request(transaction);
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

