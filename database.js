const mysql = require('mysql');
require('dotenv').config({ path: '.env-local' });

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    db: process.env.DB_NAME,
    port: process.env.PORT,
    // 無可用連線時是否等待pool連線釋放(預設為true)
    waitForConnections: true,
    // 連線池可建立的總連線數上限(預設最多為10個連線數)
    connectionLimit: 10
});

// 取得連線池的連線
connection.getConnection(function (err, conn) {
    if (err) {
        console.log("哭啊連線錯誤！ ミ●﹏☉ミ", err)
    }
    else {
        // 成功取得可用連線
        console.log("成功取得連線!( ´ ▽ ` )ﾉ");
    }
});

module.exports = connection;
