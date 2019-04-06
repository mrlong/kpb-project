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
      //有可能是 *33-00.00132 的格式。2016-6-15
      if(vals.length !=2){
        var vals = datastr.split('-');    
      };
      
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

var readfield=function(data,start,length){
	var s = data.slice(start,length).toString();
	var v = parseFloat(s);
	return isNaN(v) ? 0 : v;
};

//写入请求的数据，中间的转换过程。
exports.writeREQ2 = function(sbcode,chunk,log){
  var connection = new mssql.Connection(config.mssql);
  connection.connect(function(err) {
    if(!err){
      
      if(chunk.length < 195){
        log && log.error('客户端返回参数出错! ' + chunk.toString());
        connection.close();
        return false;  
      };
      
	  var z1  = readfield(chunk,0,4);
	  var z2  = readfield(chunk,4,4+3);
	  var z3  = readfield(chunk,7,7+3);
	  var z4  = readfield(chunk,10,10+3);
	  var z5  = readfield(chunk,13,13+3);
	  var z6  = readfield(chunk,16,16+3);
	  var z7  = readfield(chunk,19,19+8);
	  var z8  = readfield(chunk,27,27+8);
	  var z9  = readfield(chunk,35,35+8);
	  var z10 = readfield(chunk,43,43+6);
	  var z11 = readfield(chunk,49,49+6);
	  var z12 = readfield(chunk,55,55+6);
	  var z13 = readfield(chunk,61,61+4);
	  var z14 = readfield(chunk,65,65+4);
	  var z15 = readfield(chunk,69,69+4);
	  var z16 = readfield(chunk,73,73+4);
	  
	  var z17 = readfield(chunk,77,77+7);
	  var z18 = readfield(chunk,84,84+6);
	  var z19 = readfield(chunk,90,90+6);
	  var z20 = readfield(chunk,96,96+5);
	  var z21 = readfield(chunk,101,101+5);
	  var z22 = readfield(chunk,106,106+5);
	  var z23 = readfield(chunk,111,111+7);
	  var z24 = readfield(chunk,118,118+11);
	  var z25 = readfield(chunk,129,129+9);
	  var z26 = readfield(chunk,138,138+6);
	  var z27 = readfield(chunk,144,144+6);

	  var z28 = readfield(chunk,150,150+7);
	  var z29 = readfield(chunk,157,157+4);
	  var z30 = readfield(chunk,161,161+4);
	  var z31 = readfield(chunk,165,165+4);
	  var z32 = readfield(chunk,169,169+13);
	  var z33 = readfield(chunk,182,182+13);
	  

	  console.log('z2=' + z2 + ';z3=' + z3);

      var sqltxt = "insert into TB_SB_REQ2(ZCODE,ZSTR," +
		      "Z1,Z2,Z3,Z4,Z5,Z6,Z7,Z8,Z9,Z10,Z11,Z12,Z13,Z14,Z15,Z16,Z17,Z18,Z19,Z20,Z21,Z22,Z23,Z24,Z25,Z26," +
			  "Z27,Z28,Z29,Z30,Z31,Z32,Z33" +
		      ",ZDATE) values('" + 
              sbcode +"','" +
              chunk.toString('hex') + "'," +
			  z1 + "," + z2 + "," + z3 + "," + z4 + "," + z5 + "," + z6 + "," + z7 + "," + z8 + "," + z9 + "," + z10 + "," + 
			  z11 + "," + z12 + "," + z13 + "," + z14 + "," + z15 + "," + z16 + "," + z17 + "," + z18 + "," + z19 + "," + z20 + "," + 
		      z21 + "," + z22 + "," + z23 + "," + z24 + "," + z25 + "," + z26 + "," + z27 + "," + z28 + "," + z29 + "," + z30 + "," + 
		      z31 + "," + z32 + "," + z33 + "," + 
              "GETDATE())";

      //console.log(sqltxt);
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




