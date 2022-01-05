const express = require('express');
const router = express.Router()
module.exports = router;
const mysql = require('mysql')
//===================================
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'luosifen'
})

con.connect()

//========查询数据================
//get请求  /api/user/login

router.get('/login',  (req, res) => {
    const {
        username,
        password
    } = req.query
  
      con.query(`select * from user where username='${username}' and password='${password}'`, (err, data) => {
     if(data[0]){
         res.send({code:200,msg:"登陆成功",info:data})
     }else{
         res.send({code:400,msg:"登录失败",info:err})
     }
    console.log( 'username,password', username, password);
    })
})
//================== 添加数据=======================================
//post 请求 /api/user/reg
router.post('/reg', (req, res) => {
    const {
        username,
        password
    } = req.body
     console.log('reqbody',req.body);
    let sql =`insert into user(username,password) values('${username}','${password}')`
    con.query(sql,(err,data)=>{
        if(err){
            res.send({code:400,msg:"注册失败"})
            return;
        }
        res.send({code:200,msg:"注册成功"})
    })
})

router.delete("/:id",(req,res)=>{
    const {id}= req.params
    let sql =`delete from user where id='${id}'`;
    con.query(sql,(err,data)=>{
        if(err){
            res.send({code:400,msg:"删除失败"})
        }else{
            res.send({code:200,msg:"删除成功"})
        }
    })
})

router.get("/:id",(req,res)=>{
    const {id}= req.params
    let sql =`select * from user where id='${id}'`;
    con.query(sql,(err,data)=>{
        if(data[0]){
            res.send({code:200,msg:"搜索成功"})
        }else{
            res.send({code:400,msg:"搜索失败"})
        }
    })
})