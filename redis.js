const Redis = require("ioredis");
const redis = new Redis({
    host: "127.0.0.1",
    port: 6379,
  });

const keyName = "user"; // Redis Desktop Manager 中的键名
const data = { name: "Lisa", age: 20 }; // 要存储的数据

// 将数据存储到 Redis Desktop Manager 中的键中
redis.set(keyName, JSON.stringify(data), (err, result) => {
  if (err) {
    console.error("Failed to store data in Redis Desktop Manager:", err);
  } else {
    console.log("Data stored in Redis Desktop Manager:", result);
  }
});
