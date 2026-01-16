import express from 'express';
import {
    getVideos,
    getVideoById,
    createVideo,
    updateVideo,
    deleteVideo
} from '../controllers/videoController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { videoSchema, videoUpdateSchema } from '../middleware/validators.js';

const router = express.Router();

// Public routes for gallery
router.get('/public', getVideos);

router.use(protect); // Protected Admin routes below

router.route('/')
    .get(getVideos)
    .post(validate(videoSchema), createVideo);

router.route('/:id')
    .get(getVideoById)
    .patch(validate(videoUpdateSchema), updateVideo)
    .delete(deleteVideo);

export default router;
