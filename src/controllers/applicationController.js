import { Op } from 'sequelize';
import Application from '../models/Application.js';
import { sendEmail } from '../services/emailService.js';
import { applicationNotificationTemplate, statusUpdateTemplate } from '../utils/emailTemplates.js';
import { exportToExcel, exportToCSV } from '../services/exportService.js';

// @desc    Submit new application
// @route   POST /api/applications/public
// @access  Public
export const submitApplication = async (req, res) => {
    try {
        const application = await Application.create(req.body);

        // Send admin notification
        await sendEmail(
            process.env.ADMIN_EMAIL,
            `New Application: ${application.playerName}`,
            applicationNotificationTemplate(application).html
        );

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: application.id
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Email address already has an active application' });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all applications (with filters, search, pagination)
// @route   GET /api/applications/protected
// @access  Private
export const getApplications = async (req, res) => {
    const { status, program, search, page = 1, limit = 20 } = req.query;

    const where = {};

    if (status) where.status = status;
    if (program) where.preferredProgram = program;
    if (search) {
        where[Op.or] = [
            { playerName: { [Op.like]: `%${search}%` } },
            { parentName: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } }
        ];
    }

    try {
        const offset = (page - 1) * limit;
        const { count, rows: applications } = await Application.findAndCountAll({
            where,
            order: [['createdAt', 'DESC']],
            limit: Number(limit),
            offset: Number(offset)
        });

        res.json({
            success: true,
            applications,
            page: Number(page),
            pages: Math.ceil(count / limit),
            total: count
        });
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({
            success: false,
            message: error.message,
            applications: [],
            total: 0
        });
    }
};

// @desc    Export applications to CSV/XLSX
// @route   GET /api/applications/export
// @access  Private
export const exportApplications = async (req, res) => {
    const { format = 'csv' } = req.query;

    try {
        const applications = await Application.findAll({
            order: [['createdAt', 'DESC']]
        });

        if (format === 'xlsx') {
            const buffer = await exportToExcel(applications);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=applications.xlsx');
            return res.send(buffer);
        } else {
            const csv = exportToCSV(applications);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=applications.csv');
            return res.send(csv);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get application by ID
// @route   GET /api/applications/:id
// @access  Private
export const getApplicationById = async (req, res) => {
    try {
        const application = await Application.findByPk(req.params.id);

        if (application) {
            res.json({ success: true, data: application });
        } else {
            res.status(404).json({ success: false, message: 'Application not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update application status
// @route   PATCH /api/applications/:id/status
// @access  Private
export const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const application = await Application.findByPk(req.params.id);

        if (application) {
            application.status = status;
            const updatedApplication = await application.save();

            // Send email to parent
            await sendEmail(
                application.email,
                `Update on ${application.playerName}'s Application`,
                statusUpdateTemplate(application, status).html
            );

            res.json({ success: true, data: updatedApplication });
        } else {
            res.status(404).json({ success: false, message: 'Application not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
