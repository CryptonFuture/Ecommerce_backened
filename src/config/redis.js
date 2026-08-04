const { createClient } = require("redis");

const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST || "localhost",
        port: process.env.REDIS_PORT || 6379,
    },
});

redisClient.on("connect", () => {
    console.log("✅ Redis Connected");
});

redisClient.on("ready", () => {
    console.log("🚀 Redis Ready");
});

redisClient.on("error", (err) => {
    console.error("❌ Redis Error:", err);
});

async function connectRedis() {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
}

module.exports = {
    redisClient,
    connectRedis,
};