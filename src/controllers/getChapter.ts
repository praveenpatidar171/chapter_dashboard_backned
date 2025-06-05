import { Request, Response } from "express";
import Chapter from "../models/chapter";
import redis from "../config/redis";

export const getChapter = async (req: Request, res: Response) => {

    try {

        const {
            class: classFilter,
            unit,
            status,
            weakChapters,
            subject,
            page = "1",
            limit = "10"
        } = req.query;

        const filter: any = {}

        if (classFilter) filter.class = classFilter;
        if (unit) filter.unit = unit;
        if (status) filter.status = status;
        if (subject) filter.subject = subject;
        if (weakChapters !== undefined) {
            filter.isWeakChapter = weakChapters === 'true';
        }

        const pageNumber = Number(page) || 1

        const limitNumber = Number(limit) || 10

        const skip = (pageNumber - 1) * limitNumber;

        // Generate a Redis cache key based on the query
        const redisKey = `chapters:${JSON.stringify(req.query)}`;

        const cachedData = await redis.get(redisKey);

        if (cachedData) {
            console.log("Cache hit:", redisKey);
            res.status(200).json(JSON.parse(cachedData));
            return
        }

        //total documents matching the filter
        const total = await Chapter.countDocuments(filter);

        //paginated documents 

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