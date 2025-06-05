import { Request, Response } from "express";
import Chapter, { IChapter } from "../models/chapter";
import { clearChapterCache } from "../utils/redisHelper";

export const postChapter = async (req: Request, res: Response) => {

    // Check if a JSON file was uploaded
    if (!req.file) {
        res.status(400).json({
            message: 'JSON file is required',
            success: false
        })
        return;
    }

    let chaptersArray: any[];

    // Parse and validate the uploaded JSON file content
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

    // Process all chapters parallely, catching individual errors
    const processedResults = await Promise.all(
        chaptersArray.map(async (chapterData) => {
            try {
                const chapter = new Chapter(chapterData);
                await chapter.validate();
                const saved = await chapter.save();
                return { success: true, data: saved };
            } catch (error: any) {
                return { success: false, data: chapterData, error: error.message };
            }
        })
    );

    // Separate successes and failures
    const successUploads = processedResults
        .filter((r) => r.success)
        .map((r) => r.data);

    const failedUploads = processedResults
        .filter((r) => !r.success)
        .map(({ data, error }) => ({ chapterData: data, error }));


    // clear Redis cache since new chapters were added
    await clearChapterCache();

    res.status(201).json({
        message: "Upload Complete",
        success: true,
        successCount: successUploads.length,
        failedCount: failedUploads.length,
        failedUploads,
    })
}