var net = require('net');
var client = net.connect({port: 9300,host:''},
    function() { //'connect' listener
  console.log('connected to server!');
  client.write('xs,#1001');
});

client.on('data', function(data) {
  console.log(data.toString());
  //client.end();
  //if(data.toString() == '00RP032'){
    //client.write('*16+00.02535');    
  //}
  //else{
  //  console.log('进不去');
  //}
});

//setInterval(function(){client.write('$');},1000)  //1ms

client.on('end', function() {
  console.log('disconnected from server');
});