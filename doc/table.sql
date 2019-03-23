/*
/* 龙仕云  2016-5-12
/*
/*


/*文件树目录结构*/ 
if exists (select * from dbo.sysobjects 
   where id = object_id(N'[dbo].[TB_SB_REQ]') 
   and OBJECTPROPERTY(id, N'IsUserTable') = 1) 
 drop table [dbo].[TB_SB_REQ] 
go 
 
 
create table TB_SB_REQ( 
 	ZID	int IDENTITY (1, 1) not null,   /*ID并自动产生编号*/ 
 	ZCODE   varchar(50)  not null ,     /*设备编号*/ 
 	ZSTR	varchar(200) not null,      /*接收串*/ 
 	ZVOL	varchar(200),               /*温度*/ 
    ZDATE  datetime                     /*创建时间*/


 	constraint TB_SB_REQ_PK primary key(ZID) 
 ) 
 go 
 
 
 create table TB_USER( 
 	ZID	int IDENTITY (1, 1) not null,   /*ID并自动产生编号*/ 
 	ZNAME   varchar(50)  not null ,     /*登录名*/ 
 	ZPASSWD	varchar(50) not null,       /*密码*/ 
 	ZSBLIST	varchar(200)                /*设备列表，以,号分开*/ 

 	constraint PK_TB_USER primary key(ZID) 
 ) 
 go 


 /*新的扩展版本*/
 create table TB_SB_REQ2( 
 	ZID	int IDENTITY (1, 1) not null,   /*ID并自动产生编号*/ 
 	ZCODE   varchar(50)  not null ,     /*设备编号*/ 
 	ZSTR	text not null,              /*接收串 16进制字符串*/ 

 	Z1      int,  /*年份*/
	Z2      int,  /*月*/
	Z3      int,  /*日*/
	Z4      int , /*分*/
	Z5      int , /*秒*/
	Z6      float,  /*Vx*/
	Z7      float , /*Vy*/
	Z8      float,  /*水位*/
	Z9      float,  /*Vx标准误差*/
	Z10     float , /*Vy标准误差*/
	Z11     float,  /*水位标准误差*/
	Z12     float,  /*Vx信号强度*/
	Z13     float,  /*Vy信号强度*/
	Z14     float,  /*完好比率*/
	Z15     float,  /*艘向*/
	Z16     float,  /*Pitch*/
	Z17     float,  /*Roll*/
	Z18     float,  /*艘向标准偏差*/
	Z19     float,  /*Pitch标准偏差*/
	Z20     float,  /*Roll标准偏差*/
	Z21     float,  /*平均温度*/
	Z22     float,  /*平均压力*/
	Z23     float,  /*压力标准偏差*/
	Z24     float,  /*电压*/
	Z25     float,  /*采样开始位置*/
	Z26     float,  /*采样开始位置*/
    Z27     float,  /*采样结束位置*/
	Z28     float,  /*波束1噪音*/
	Z29     float,  /*波束2噪音*/
	Z30     float,  /*波束3噪音*/
	Z31     float,  /*流量*/
	Z32     float,  /*断面面积*/
	Z33     float,

	ZDATE  datetime        /*操作系统时间*/


 	constraint TB_SB_REQ2_PK primary key(ZID) 
 ) 
 go 


 
 
