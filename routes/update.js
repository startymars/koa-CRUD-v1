// index.js
const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const { koaBody } = require('koa-body');
app.use(koaBody());
app.use(bodyParser());

//routes
const Router = require('koa-router');
const router = new Router();
//utils.js
const { validateColumnNames, isValidPhone } = require('../utils');
//database.js
const connection = require('../database.js');

router
    //更新資料
    .post('/user/update/:id', async (ctx) => {
        const id=ctx.params.id;
        const { name, tel } = ctx.request.body;
        if (name == "" || tel == "") {  //判斷輸入是否空值
            ctx.body = { error: '欲更新資料未輸入值，請重新輸入 〳 ° ▾ ° 〵' };
            return;
        } else if (!validateColumnNames(ctx.request.body)) {  // 判斷資料欄位是否正確
            ctx.body = { error: '更新資料欄位錯誤，請確認欄位名稱 ༼✷ɷ✷༽' };
            return;
        } else if (!isValidPhone(tel)) { // 判斷手機格式是否正確
            ctx.body = { error: '手機格式輸入錯誤，請重新輸入 ヽ༼ಢ_ಢ༽ﾉ' };
            return;
        }
        try {  //將postman欲更改的資料更新到對應的id資料
            await connection.query(`UPDATE user.personal SET name = ?, tel = ? WHERE id = ?`,[name, tel, id]);
            ctx.body = '資料更新完成 ʕ◕ ͜ʖ◕ʔ';
            console.log(ctx.request.body);
        } catch (err) {
            console.error(err);
            ctx.body = '資料更新錯誤 ლ(*꒪ヮ꒪*)ლ';
        }
    })
module.exports = router;      