import { fn, col, literal } from 'sequelize';
import Application from '../models/Application.js';
import Video from '../models/Video.js';

// @desc    Get dashboard overview stats
// @route   GET /api/stats/overview
// @access  Private
export const getOverview = async (req, res) => {
    try {
        const totalApplications = await Application.count();
        const enrolled = await Application.count({ where: { status: 'enrolled' } });
        const pending = await Application.count({ where: { status: 'pending' } });
        const totalVideos = await Video.count();

        res.json({
            totalApplications,
            enrolled,
            pending,
            totalVideos
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get applications count grouped by program
// @route   GET /api/stats/applications-by-program
// @access  Private
export const getApplicationsByProgram = async (req, res) => {
    try {
        const stats = await Application.findAll({
            attributes: [
                ['preferredProgram', 'program'],
                [fn('COUNT', col('id')), 'count']
            ],
            group: ['preferredProgram']
        });

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get monthly application trend
// @route   GET /api/stats/monthly-trend
// @access  Private
export const getMonthlyTrend = async (req, res) => {
    // MySQL specific month extraction
    try {
        const stats = await Application.findAll({
            attributes: [
                [fn('MONTH', col('createdAt')), 'month'],
                [fn('COUNT', col('id')), 'count']
            ],
            group: [fn('MONTH', col('createdAt'))],
            order: [[fn('MONTH', col('createdAt')), 'ASC']]
        });

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get age distribution of applicants
// @route   GET /api/stats/age-distribution
// @access  Private
export const getAgeDistribution = async (req, res) => {
    try {
        // MySQL age calculation: YEAR(CURDATE()) - YEAR(dateOfBirth)
        const stats = await Application.findAll({
            attributes: [
                [literal(`
          CASE 
            WHEN (YEAR(CURDATE()) - YEAR(dateOfBirth)) < 10 THEN '<10'
            WHEN (YEAR(CURDATE()) - YEAR(dateOfBirth)) BETWEEN 10 AND 13 THEN '10-13'
            WHEN (YEAR(CURDATE()) - YEAR(dateOfBirth)) BETWEEN 14 AND 17 THEN '14-17'
            ELSE '18+'
          END
        `), 'range'],
                [fn('COUNT', col('id')), 'count']
            ],
            group: ['range']
        });

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
