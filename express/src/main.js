/**模块化路由，开启服务器 */
const express = require('express')
const path =require('path')
const router =require('./router')

/**利用express开启服务器 */
const app = express()

app.use(express.static(path.join(__dirname,'../public')))

// 数据接口
app.use('/api',router)





/**开启监听端口 */
app.listen(7777,()=>{
    console.log('眼镜官网，7777')
})