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

router
    //刪除資料
    .post('/user/delete', async (ctx) => {
    const { id } = ctx.request.body;   
    try {
        await new Promise((resolve, reject) => {
            connection.query('DELETE FROM user.personal WHERE id = ?', [id], function (err, result) {
                if (err) {
                reject(err);
                } else {
                resolve(result);
                }
            });
            });
            ctx.body = `成功！刪除一筆id為${id}的資料`;
        } catch (err) {
        console.log('查詢錯誤', err);
        ctx.body = { error: '查詢錯誤' };
        }
    });

module.exports = router;      