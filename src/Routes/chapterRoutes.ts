import express from 'express'
import { isAdmin } from '../middleware/isAdmin';
import upload from '../middleware/multer';
import { postChapter } from '../controllers/postChapter';
import { getChapter } from '../controllers/getChapter';
import { getSingleChapter } from '../controllers/getSingleChapter';

const router = express.Router()

// Create a new chapter (Admin only, expects a file upload)
router.post('/', isAdmin, upload.single('file'), postChapter);

// Get all chapters with filters and pagination (supports caching)
router.get('/', getChapter);

// Get a single chapter by ID
router.get('/:id', getSingleChapter);

export default router;