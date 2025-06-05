import mongoose from "mongoose";
const MONGO_URI = process.env.MONGO_URI as string;


export const connectDB = async () => {

    try {
        const conn = await mongoose.connect(MONGO_URI);
        console.log(`db connected at: ${conn.connection.host}`)
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error : ${error.message}`)
        }
        else {
            console.error('Unknown Error :', error)
        }

        process.exit()
    }

}

