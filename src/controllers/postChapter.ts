import { Request, Response } from "express";
import Chapter, { IChapter } from "../models/chapter";
import { clearChapterCache } from "../utils/redisHelper";

export const postChapter = async (req: Request, res: Response) => {

    if (!req.file) {
        res.status(400).json({
            message: 'JSON file is required',
            success: false
        })
        return;
    }

    let chaptersArray: any[];

    try {
        chaptersArray = JSON.parse(req.file.buffer.toString());
        if (!Array.isArray(chaptersArray)) {
            res.status(400).json({
                message: "Uploaded JSON must be an array of chapters.",
                success: false
            });
            return;
        }
    } catch (error: any) {
        res.status(400).json({
            message: "Invalid JSON file.",
            error: error.message,
            success: false
        });
        return;
    }

    const failedUploads: any[] = [];
    const successUploads: IChapter[] = []

    for (const chapterData of chaptersArray) {
        try {

            const chapter = new Chapter(chapterData);
            await chapter.validate();

            const saved = await chapter.save();
            successUploads.push(saved);

        } catch (error: any) {
            failedUploads.push({ chapterData, error: error.message });
        }
    }

    // clears redis after new upload

    await clearChapterCache();

    res.status(201).json({
        message: "Upload Complete",
        success: true,
        successCount: successUploads.length,
        failedCount: failedUploads.length,
        failedUploads,
    })
}