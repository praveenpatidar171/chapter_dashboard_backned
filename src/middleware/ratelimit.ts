import { Request, Response, NextFunction } from "express";
import redisClient from "../config/redis"

const WINDOW_SIZE_IN_SECONDS = 60; // 1 minute window
const MAX_WINDOW_REQUEST_COUNT = 30; // max 30 requests per window

export const rateLimit = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get client IP address
        const ip = req.ip;

        //  Redis key for this IP
        const redisKey = `rate_limit:${ip}`;

        //  Get current request count from Redis
        const currentRequests = await redisClient.get(redisKey);

        if (currentRequests === null) {
            // First request from this IP - set key with expiration and initialize counter with 1
            await redisClient.set(redisKey, "1",
                "EX", WINDOW_SIZE_IN_SECONDS,
            );
            next();
            return
        }

        const requestsCount = parseInt(currentRequests);

        if (requestsCount >= MAX_WINDOW_REQUEST_COUNT) {
            // Limit exceeded
            res.status(429).json({
                success: false,
                message: `Rate limit exceeded. Max ${MAX_WINDOW_REQUEST_COUNT} requests per ${WINDOW_SIZE_IN_SECONDS} seconds.`,
            });
            return
        }

        // Increment request count
        await redisClient.incr(redisKey);

        next();
    } catch (error) {
        console.error("Rate limiting middleware error:", error);
        next();
    }
};
