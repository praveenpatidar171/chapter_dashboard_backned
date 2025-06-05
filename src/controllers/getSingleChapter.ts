import { Request, Response } from "express";
import Chapter from "../models/chapter";

export const getSingleChapter = async (req: Request, res: Response) => {

    const { id } = req.params

    try {

        const chapter = await Chapter.findById(id);

        if (!chapter) {
            res.status(404).json({
                success: false,
                message: 'Chapter Not Found'
            })
            return;
        }

        res.status(200).json({
            success: true,
            chapter
        })

    } catch (error: any) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: "Error in getting single Chapter",
            error: error.message
        });
    }
}