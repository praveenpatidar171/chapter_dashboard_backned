import express from 'express'
import { isAdmin } from '../middleware/isAdmin';
import upload from '../middleware/multer';
import { postChapter } from '../controllers/postChapter';
import { getChapter } from '../controllers/getChapter';
import { getSingleChapter } from '../controllers/getSingleChapter';

const router = express.Router()

router.post('/', isAdmin, upload.single('file'), postChapter);
router.get('/', getChapter);
router.get('/:id', getSingleChapter);

export default router;