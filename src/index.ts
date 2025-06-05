import dotenv from 'dotenv'
dotenv.config();

import express from 'express'
import cors from 'cors'
import chapterRoutes from './Routes/chapterRoutes'
import { connectDB } from './config/db';
import { rateLimit } from './middleware/ratelimit';

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 3000
const app = express();


// middlewares
app.use(cors({ origin: "*" }))            // Enable Cross-Origin Resource Sharing
app.use(express.json())                  // Parse incoming JSON
app.use(rateLimit);                     // Apply rate limiting middleware

// Register routes
app.use('/api/v1/chapters', chapterRoutes);


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})


