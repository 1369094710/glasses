const superagent = require('superagent')
const cheerio = require('cheerio')
const mysql = require('mysql')
const fs = require('fs')
const path = require('path')

// 连接池
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'luosifen',
});




superagent.get('https://www.ou-le.com/lens-min0-max0-attr0-6-sales_volume-DESC/')
    // .query({
    //     min:0,
    //     max0,-attr0-${i}-sales_volume-DESC/
    // })
    .set({
        // :authority: www.ou-le.com
        // :method: GET
        // :path: /api/order_remind.php?_=1634366830406
        // :scheme: https
        accept: 'text/plain, */*; q=0.01',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'zh-CN,zh;q=0.9',
        cookie: 'real_ipd=113.119.6.188; 53revisit=1634212528754; 53gid2=11392655520009; ECS[display]=grid; ECS[history]=385%2C250%2C647%2C15%2C251; ECS_ID=3353b011550a29225ee6e437135f8202b18bcc5e; visitor_type=old; 53gid0=11392655520009; 53kf_72185915_from_host=www.ou-le.com; 53kf_72185915_land_page=https%253A%252F%252Fwww.ou-le.com%252F; kf_72185915_land_page_ok=1; Hm_lvt_eaa57ca47dacb4ad4f5a257001a3457c=1634710002,1634715921,1634727188,1634777351; 53uvid=1; onliner_zdfq72185915=0; 53kf_72185915_keyword=https%3A%2F%2Fwww.ou-le.com%2F; 53gid1=11392655520009; Hm_lpvt_eaa57ca47dacb4ad4f5a257001a3457c=1634781189',
        referer: 'https://www.ou-le.com/lens',
        'sec-ch-ua': '"Chromium";v="94", "Google Chrome";v="94", ";Not A Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': "Windows",
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36'
    })
    .then(res => {
        // console.log(res.text);
        //获取html结构
        const $ = cheerio.load(res.text)

        let sql = `insert into jingpian(name,price,img_url,category) values`

        // console.log($);

        const goodslist = []
        // 筛选需要的结构
        $('.goods_item').each((idx, el) => {

            //提取.goods_item里的数据
            const $li = $(el);

            let img_url = $li.find('.item_img .img_box a img').attr('data-original')
            img_url = (!img_url.startsWith('https') ? 'https:' : '') + img_url

            // 获取图片路径
            const {
                pathname
            } = new URL(img_url)
            const filename = path.basename(pathname)

            const goods = {
                img_url: filename,
                price: $li.find('.inner_box .price_box font').text().replace(/[,￥]/g, '') * 1,
                name: $li.find('.pname h3 a').text(),
                category: '眼镜片'

            }
            console.log('img:',img_url);
            console.log('f:',filename);

            goodslist.push(goods)

            superagent.get(img_url).then(result => {
                // 获取到图片信息，利用fs模块并保存到本地
                // console.log('result=',result.body)



                fs.writeFile('../../src/assets/img/index_img' + filename, result.body, function (err, res) {
                    if (!err)
                        console.log('图片写入成功')
                    else
                        console.log('err', err)
                })
            })

        })

        console.log('goodslist', goodslist);

        sql += goodslist.map(item => {
            const {
                name,
                price,
                img_url,
                category
            } = item;
            return `('${name}','${price}','${img_url}','${category}')`
        }).join(',')


        pool.query(sql, (err, result) => {
            if (err) {
                console.log('err', err)
                return
            }

            console.log('数据插入成功', result)
        })
    })