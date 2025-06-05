import redisClient from '../config/redis'

export const clearChapterCache = async () => {
    try {
        const keys = await redisClient.keys("chapters:*");
        if (keys.length > 0) {
            await redisClient.del(keys);
            console.log(`Cleared ${keys.length} cached chapter keys.`);
        }
    } catch (error) {
        console.error("Failed to clear chapter cache:", error);
    }
};