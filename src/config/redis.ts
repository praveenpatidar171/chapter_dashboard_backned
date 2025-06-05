import Redis from "ioredis";

declare global {
    var redisClient: Redis | undefined;
}

if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL must be set in environment variables");
}

const redis = global.redisClient || new Redis(process.env.REDIS_URL);

console.log("Redis client instance:", global.redisClient);

redis.on("connect", () => {
    console.log("Redis connected");
});

redis.on("error", (err) => {
    console.error("Redis error:", err);
});

if (process.env.NODE_ENV !== "production") {
    global.redisClient = redis;
}

export default redis;
