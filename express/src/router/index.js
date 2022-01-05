const express = require('express')
const router = express.Router()
module.exports = router;
/**接入分支接口 */
const goodsRoute = require('./goods')
const userRouter = require('./user')


//========================================================
// CORS跨域

// 白名单
const whilelist = ['http://localhost:8080', 'http://localhost:3000']
router.use(function (req, res, next) {
    // 获取请求源（从哪发起的请求）
    const Origin = req.get('Origin')

    // 判断请求源是否在白名单中
    if (whilelist.includes(Origin)) {
        res.set({
            'Access-Control-Allow-Origin': Origin
        })
    }

    // 处理复杂跨域中的预检请求
    if (req.method == "OPTIONS") {
        res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
        res.header("Access-Control-Allow-Methods", "PUT,POST,GET,PATCH,DELETE,OPTIONS");
        res.sendStatus(200); /*让options请求快速返回*/
    } else {

        next();
    }

})
//==============================================================================
// 数据接口（路由）请求体代码
router.use(express.urlencoded(), express.json())


/**             需要在前端设置请求头  send发送请求数据时  
 *   // 设置content-type请求头
            xhr.setRequestHeader('Content-Type','x-www-form-urlencoded') */

// /api/goods
router.use('/goods', goodsRoute)

// /api/user
router.use('/user', userRouter)