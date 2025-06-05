import { Request, Response } from "express";
import Chapter from "../models/chapter";
import mongoose from "mongoose";

export const getSingleChapter = async (req: Request, res: Response) => {


    // Extract chapter ID from route parameters
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
            success: false,
            message: "Invalid Chapter ID",
        });
        return
    }

    try {

        // Find chapter by ID in database
        const chapter = await Chapter.findById(id);


        // Handle case when chapter not found
        if (!chapter) {
            res.status(404).json({
                success: false,
                message: 'Chapter Not Found'
            })
            return;
        }

        // Return the found chapter
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