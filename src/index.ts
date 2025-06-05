import dotenv from 'dotenv'
dotenv.config();

import express from 'express'
import cors from 'cors'
import chapterRoutes from './Routes/chapterRoutes'
import { connectDB } from './config/db';
import { rateLimit } from './middleware/ratelimit';

connectDB();
const PORT = process.env.PORT || 3000
const app = express();


// middlewares
app.use(cors())
app.use(express.json())

app.use(rateLimit);
app.use('/api/v1/chapters', chapterRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})


