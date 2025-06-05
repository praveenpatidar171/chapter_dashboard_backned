import { Request, Response } from "express";
import Chapter from "../models/chapter";
import redis from "../config/redis";

export const getChapter = async (req: Request, res: Response) => {

    try {

        // Extract and parse filters and pagination params from query string
        const {
            class: classFilter,
            unit,
            status,
            weakChapters,
            subject,
            page = "1",
            limit = "10"
        } = req.query;


        // Build filter object dynamically based on query params
        const filter: any = {}
        if (classFilter) filter.class = classFilter;
        if (unit) filter.unit = unit;
        if (status) filter.status = status;
        if (subject) filter.subject = subject;
        if (weakChapters !== undefined) {
            filter.isWeakChapter = weakChapters === 'true';
        }


        // Parse pagination parameters with defaults
        const pageNumber = Number(page) || 1
        const limitNumber = Number(limit) || 10
        const skip = (pageNumber - 1) * limitNumber;

        // Sort query keys to create consistent Redis cache key
        const sortedQuery = Object.keys(req.query)
            .sort()
            .reduce((acc: any, key) => {
                acc[key] = req.query[key];
                return acc;
            }, {});
        const redisKey = `chapters:${JSON.stringify(sortedQuery)}`;


        // Try to get cached response from Redis
        const cachedData = await redis.get(redisKey);
        if (cachedData) {
            res.status(200).json(JSON.parse(cachedData));
            return
        }

        // Fetch total number of chapters matching filter (for pagination info)
        const total = await Chapter.countDocuments(filter);

        // Fetch paginated chapter data from DB
        const chapters = await Chapter.find(filter).skip(skip).limit(limitNumber).exec();


        const responsePayload = {
            success: true,
            totalMatchingChapters: total,
            page: pageNumber,
            limit: limitNumber,
            chapters
        }

        // Save to Redis for 1 hour (3600 seconds)
        await redis.set(redisKey, JSON.stringify(responsePayload), "EX", 3600);

        res.status(200).json(responsePayload)



    } catch (error: any) {
        console.error(error.message)
        res.status(500).json({ success: false, message: error.message });
    }


}