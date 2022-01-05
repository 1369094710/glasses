const express = require('express')
const router =express.Router()
module.exports = router
const mysql = require('mysql')
//===================================
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'luosifen'
})

con.connect()

//======================================================

//get /api/goods/goodslist    获取商品列表
router.get('/goodslist',(req,res)=>{
   let sql =`select * from goods`;
    con.query(sql,(err,data)=>{
        if(data[0]){
            res.send({code:200,msg:"搜索成功",info:data})
        }else{
            res.send({code:400,msg:"搜索成功",info:err})
        }
    })
}) 

//======================================================

//get /api/goods/goods    获取单个商品 
router.get('/:id',(req,res)=>{
    const {id}= req.params
    let sql =`select * from goods where id='${id}'`;
    con.query(sql,(err,data)=>{
        if(data[0]){
            res.send({code:200,msg:"搜索成功"})
        }else{
            res.send({code:400,msg:"搜索失败"})
        }
    })
})

//===============曾=======================================
/**
 * 增
 */
router.post('/',(req,res)=>{
    res.send('增加数据')
})
//===============删=======================================
/**
 * 删
 */
router.delete('/:id',(req,res)=>{
    const {id}= req.params
    let sql =`delete from goods where id='${id}'`;
    con.query(sql,(err,data)=>{
        if(err){
            res.send({code:400,msg:"删除失败"})
        }else{
            res.send({code:200,msg:"删除成功"})
        }
    })
})
//===============改=======================================
/**
 * 改
 */
 router.put('/update',(req,res)=>{
    const { id } = req.query;
    const {name,price,img} = req.body;
    con.query(`update goods set name='${name}',price='${price}',img='${img}' where id='${id}'`,(err,data)=>{
        if(err){
            res.send({code:400,msg:"更新失败",info:err})
        }else{
            res.send({code:200,msg:"更新成功"})
        }
    })
})