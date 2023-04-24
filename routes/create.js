// index.js
const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const { koaBody } = require('koa-body');
app.use(koaBody());
app.use(bodyParser());

const Redis = require("ioredis");
const redis = new Redis({
    host: "127.0.0.1",
    port: 6379,
});


//routes
const Router = require('koa-router');
const router = new Router();
//utils.js
const { validateColumnNames, isValidPhone } = require('../utils');
//database.js
const connection = require('../database.js');


router
    //新增資料
    .post('/user', async (ctx) => {
        const { name, tel } = ctx.request.body; //取得從postman輸入的name和tel值
        if (name == "" || tel == "") {  //判斷輸入是否空值
            ctx.body = { error: '有資料未輸入值，請重新輸入 〳 ° ▾ ° 〵' };
            return;
        } else if (!validateColumnNames(ctx.request.body)) {  // 判斷資料欄位是否正確
            ctx.body = { error: '資料欄位錯誤，請確認欄位名稱 ༼✷ɷ✷༽' };
            return;
        } else if (!isValidPhone(tel)) { // 判斷手機格式是否正確
            ctx.body = { error: '手機格式輸入錯誤，請重新輸入 ヽ༼ಢ_ಢ༽ﾉ' };
            return;
        }

        try {
            await connection.query(`INSERT INTO user.personal (name, tel) VALUES (?, ?)`, [name, tel]); //將輸入的值新增至DB
            ctx.body = '成功將資料存入資料庫囉！(๑˘ ₃˘๑) ';
        } catch (err) {
            console.error(err);
            ctx.body = { error: 'Internal Server Error' };
        }

        // 將新增的資料存進redis
        try {
            const redisKey = 'user'; // Redis Desktop Manager 中的键名
            const data = { name: name, tel: tel }; // 要儲存的數據
            const jsonData = JSON.stringify(data); // 將要存入 Redis 的資料轉為 JSON 字串格式
            redis.rpush(redisKey, jsonData, (err, result) => { // 儲存 JSON 格式的資料至 Redis 中
                if (err) {
                    console.error("無法將資料存入redis:", err);
                } else {
                    console.log("已經將新資料存入到redis:", result);
                }
            })
        } catch (err) {
            console.error('無法將資料存入redis', err);
        }
    })

module.exports = router;