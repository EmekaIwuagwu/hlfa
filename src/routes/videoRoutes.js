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

router.use(protect); // All video routes are protected as per requirements

router.route('/')
    .get(getVideos)
    .post(validate(videoSchema), createVideo);

router.route('/:id')
    .get(getVideoById)
    .patch(validate(videoUpdateSchema), updateVideo)
    .delete(deleteVideo);

export default router;
