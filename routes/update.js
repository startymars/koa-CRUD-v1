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
    //更新資料：無法如期更新
    .post('/user/update/:id', async (ctx) => {
    const id = ctx.params.id;
    const { name, tel } = ctx.request.body;
    try {
        await connection.query(
            `UPDATE user.personal SET name = ?, tel = ? WHERE id = ?`,
            [name, tel, id]
        );
        ctx.status = 200;
        ctx.body = 'Member updated';
        console.log(ctx.request.body);
        } catch (err) {
        console.error(err);
        ctx.status = 500;
        ctx.body = 'Internal Server Error';
        }
    })

module.exports = router;      