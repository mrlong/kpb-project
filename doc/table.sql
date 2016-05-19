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
