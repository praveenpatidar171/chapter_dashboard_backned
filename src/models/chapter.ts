import mongoose, { Schema, Document } from "mongoose";


export interface YearWiseQuestionCount {
    [year: string]: number;
}

export interface IChapter extends Document {
    subject: string;
    chapter: string;
    class: string;
    unit: string;
    yearWiseQuestionCount: YearWiseQuestionCount;
    questionSolved: number;
    status: "Not Started" | "In Progress" | "Completed";
    isWeakChapter: boolean;
}

const chapterSchema: Schema = new Schema<IChapter>({
    subject: {
        type: String,
        required: true
    },
    chapter: {
        type: String,
        required: true
    },
    class: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    yearWiseQuestionCount: {
        type: Schema.Types.Mixed,
        required: true
    },
    questionSolved: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["Not Started", "In Progress", "Completed"],
        default: "Not Started"
    },
    isWeakChapter: {
        type: Boolean,
        default: false
    },
},
    {
        timestamps: true
    });


const Chapter = mongoose.model<IChapter>('Chapter', chapterSchema);

export default Chapter;