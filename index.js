// index.js
const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const { koaBody } = require('koa-body');
app.use(koaBody());
app.use(bodyParser());
const PORT = 3000;

//routes
const Router = require('koa-router');
const router = new Router();
const createRouter = require('./routes/create.js'); //匯入新增檔案
const readRouter = require('./routes/read.js');  //匯入讀取檔案
const updateRouter = require('./routes/update.js'); //匯入更新檔案
const deleteRouter = require('./routes/delete.js'); //匯入刪除檔案

app.use(createRouter.routes()); //使用新增檔案
app.use(readRouter.routes()); //使用讀取檔案
app.use(updateRouter.routes()); //使用更新檔案
app.use(deleteRouter.routes()); //使用刪除檔案
  

app.use(router.routes());
app.listen(PORT, () => console.log(`Server running on port:http://localhost:${PORT}`));