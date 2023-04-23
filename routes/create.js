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


//routers/user.js
const Router = require('koa-router');
const router = new Router();
const { validateColumnNames, isValidPhone } = require('../utils');
const connection = require('../database.js');

  
router
    //新增資料
    .post('/user',async(ctx) => {
        const { name, tel } = ctx.request.body;
        if(name==""||tel==""){
            ctx.status=400;
            ctx.body = { error: '資料格式錯誤' };
            return;
        }else  if (!validateColumnNames(ctx.request.body)) {  // 判斷資料欄位是否正確
            ctx.status = 400;
            ctx.body = { message: '資料欄位錯誤，請確認欄位名稱' };
            return;
        }else if(!isValidPhone(tel)){
            ctx.status = 400;
            ctx.body = { message: '手機格式輸入錯誤，請重新輸入' };
            return;
        }

        try {
            await connection.query(
                `INSERT INTO user.personal (name, tel) VALUES (?, ?)`,
                [name, tel]
            );
            ctx.status = 201;
            ctx.body = 'Member created';
            console.log(ctx.request.body);
          } catch (err) {
            console.error(err);
            ctx.status = 500;
            ctx.body = 'Internal Server Error';
          }

          // 資料存進redis
          try {
            const redisKey = 'user'; // Redis Desktop Manager 中的键名
            const data = { name: name, tel: tel }; // 要存储的数据
            const jsonData = JSON.stringify(data); // 將要存入 Redis 的資料轉為 JSON 格式
            redis.rpush(redisKey, jsonData, (err, result) => { // 儲存 JSON 格式的資料至 Redis 中
              if (err) {
                console.error("Failed to add new user to Redis:", err);
              } else {
                console.log("New user added to Redis:", result);
              }
            })
          } catch (err) {
            console.error('Failed to add new user to Redis:', err);
          }
    })

    module.exports = router;