import Video from '../models/Video.js';

// @desc    Get all videos
// @route   GET /api/videos
// @access  Private
export const getVideos = async (req, res) => {
    const { category, page = 1, limit = 10 } = req.query;
    const where = category ? { category } : {};

    try {
        const offset = (page - 1) * limit;
        const { count, rows: videos } = await Video.findAndCountAll({
            where,
            order: [['createdAt', 'DESC']],
            limit: Number(limit),
            offset: Number(offset)
        });

        res.json({
            videos,
            page: Number(page),
            pages: Math.ceil(count / limit),
            total: count
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single video
// @route   GET /api/videos/:id
// @access  Private
export const getVideoById = async (req, res) => {
    const video = await Video.findByPk(req.params.id);
    if (video) {
        res.json(video);
    } else {
        res.status(404).json({ message: 'Video not found' });
    }
};

// @desc    Create a video
// @route   POST /api/videos
// @access  Private
export const createVideo = async (req, res) => {
    try {
        const video = await Video.create(req.body);
        res.status(201).json(video);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a video
// @route   PATCH /api/videos/:id
// @access  Private
export const updateVideo = async (req, res) => {
    try {
        const video = await Video.findByPk(req.params.id);
        if (video) {
            Object.assign(video, req.body);
            const updatedVideo = await video.save();
            res.json(updatedVideo);
        } else {
            res.status(404).json({ message: 'Video not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a video
// @route   DELETE /api/videos/:id
// @access  Private
export const deleteVideo = async (req, res) => {
    try {
        const video = await Video.findByPk(req.params.id);
        if (video) {
            await video.destroy();
            res.json({ message: 'Video removed' });
        } else {
            res.status(404).json({ message: 'Video not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
