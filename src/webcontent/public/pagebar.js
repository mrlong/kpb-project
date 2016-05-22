/**
 * 分页
 * 作者：龙仕云  2016-5-21
 * 
 */


//jquery 插件扩展。
(function($) {$.fn.extend({
  
  //
  // rowcount 为行总数
  // pageindex 为当前行
  // cb 为回调，可能是herf的string
  //
  pagebar: function(rowcount,pageindex,cb) {  //提示功能
    
    var pagecount = parseInt(rowcount/20);
                             
    if( rowcount > 20){
      if(rowcount % 20 > 0 ){
        pagecount++;
      };
    };
    
    var startpage,endpage;
    if(pagecount<9){
      startpage = 1;
      endpage = pagecount;
    }
    else{
      startpage = pageindex - 4;
      endpage = pageindex + 4;
      if(startpage<1){
        startpage = 1;
        endpage = 9;
      };
      
      if(endpage > pagecount){
        endpage = pagecount;
        startpage = pagecount -8;
      };
    };
    
    if(startpage != 1){
      var a = $('<a></a>');
      if(typeof cb =='string'){
        a.attr('href',cb.replace(/\$\$/g,1));
      }
      else{
        //onclcik 处理  
      };
      a.text('1');
      this.append(a);
      startpage !=2 && this.append($('<a href="javascript:;">...</a>'));
    };
    
    for(var i=startpage;i<=endpage;i++){
      var a = $('<a></a>');
      if(typeof cb =='string'){
        a.attr('href',cb.replace(/\$\$/g,i));
      }
      else{
        //onclcik 处理  
      };
      a.text(i);
      if(i==pageindex){
         a.addClass('active');
      };
      this.append(a);  
    };
    
    if(endpage != pagecount){
      var a = $('<a></a>');
      if(typeof cb =='string'){
        a.attr('href',cb.replace(/\$\$/g,pagecount));
      }
      else{
        //onclcik 处理  
      };
      a.text(pagecount);
      endpage != pagecount-1 &&  this.append($('<a href="javascript:;">...</a>'));
      this.append(a);  
    };
    
                
    this.append($('<span class="rowcount">记录数:'+ rowcount +'</span>'));
  
  }
  //
});})(jQuery); 



