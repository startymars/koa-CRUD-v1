// index.js
const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const { koaBody } = require('koa-body');
app.use(koaBody());
app.use(bodyParser());

//routers/user.js
const Router = require('koa-router');
const router = new Router();
const connection = require('../database.js');

const Redis = require("ioredis");
const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,
});

router
  //查詢資料
  .post('/user/query', async (ctx) => {
    try {
      const data = await new Promise((resolve, reject) => {   //將result結果回傳給予data變數
        connection.query('SELECT * FROM user.personal', function (err, result) {  //從DB資料庫中查詢所有資料
          if (err) {
            reject(err);
          } else {
            resolve(result);  //resolve後得到的結果會存入到result
            console.log(JSON.parse(JSON.stringify(result))); //用 JSON.stringify() 將物件或陣列轉換成字串，就可以正確顯示所有資料。而使用 JSON.parse() 將字串轉換回物件或陣列，就可以在程式碼中繼續操作該資料。
          }
        });
      });
      ctx.body = data;  
    } catch (err) {
      console.log('查詢錯誤', err);
      ctx.body = { error: '查詢錯誤' };
    }
  })
  //查詢特定id資料
  .post('/user/query/:id', async (ctx) => {
    try {
      const id = ctx.params.id;
      const redisKey = `member:${id}`; //給予redisk的key

      // 先查詢 Redis
      let member = await redis.get(redisKey);
      // 若 Redis 查無資料，再查詢 DB
      if (!member) {
        const rows = await new Promise((resolve, reject) => {  //從DB資料庫中查詢特定id資料
          connection.query('SELECT * FROM user.personal WHERE id = ?', [id], function (err, rows) {
            if (err) {
              reject(err);
            } else {
              resolve(rows);
              console.log(JSON.parse(JSON.stringify(rows)));
            }
          });
        });
        // 判断返回id是否空
        if (rows.length === 0) { 
          // 若 DB 也查無資料，回傳警告訊息
          ctx.body = { error: '查詢時ID為空，請重新確認並輸入 (ᗒᗣᗕ)՞' };
        } else {
          ctx.body = rows[0];
        }
        // 取出第一筆資料並轉成 JSON 格式
        member = JSON.stringify(rows[0]); 
        // 寫入 Redis 60 sec Timeout
        await redis.set(redisKey, member, 'EX', 60);

        //   await redis.setex(redisKey, 60, member, function(err, reply) {
        //     if (err) {
        //         console.error(err);
        //     } else {
        //         console.log(reply); // 输出 "OK"
        //     }
        // });
      }
    } catch (err) {
      console.log('查詢錯誤', err);
      ctx.body = { error: '查詢錯誤' };
    }
  })


module.exports = router;      