/* 
 * 作者：龙仕云  http://www.mrlong.cn  写库
 *
 */


var sql = require('mssql');
var config = require('./config.js');

module.exports = function(sbcode,datastr,log){
  var connection = new sql.Connection(config.mssql);
  connection.connect(function(err) {
    if(!err){
      var sqltxt = "insert into TB_SB_REQ(ZCODE,ZSTR,ZDATE) values('" + 
              sbcode +"','" +
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

