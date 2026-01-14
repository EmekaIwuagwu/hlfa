import Admin from '../models/Admin.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';

// @desc    Auth admin & get tokens
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ where: { email } });

    if (admin && (await admin.matchPassword(password))) {
        const accessToken = generateAccessToken(admin.id);
        const refreshToken = generateRefreshToken(admin.id);

        admin.refreshToken = refreshToken;
        admin.lastLogin = new Date();
        await admin.save();

        res.json({
            id: admin.id,
            name: admin.name,
            email: admin.email,
            accessToken,
            refreshToken
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refresh = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh Token is required' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const admin = await Admin.findByPk(decoded.id);

        if (!admin || admin.refreshToken !== refreshToken) {
            return res.status(403).json({ message: 'Invalid Refresh Token' });
        }

        const accessToken = generateAccessToken(admin.id);
        const newRefreshToken = generateRefreshToken(admin.id);

        admin.refreshToken = newRefreshToken;
        await admin.save();

        res.json({
            accessToken,
            refreshToken: newRefreshToken
        });
    } catch (error) {
        res.status(403).json({ message: 'Refresh Token expired or invalid' });
    }
};

// @desc    Logout & invalidate refresh token
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
    const admin = await Admin.findByPk(req.admin.id);

    if (admin) {
        admin.refreshToken = null;
        await admin.save();
        res.json({ message: 'Logged out successfully' });
    } else {
        res.status(404).json({ message: 'Admin not found' });
    }
};

// @desc    Get current admin session
// @route   GET /api/auth/session
// @access  Private
export const getSession = async (req, res) => {
    const admin = await Admin.findByPk(req.admin.id, {
        attributes: { exclude: ['password', 'refreshToken'] }
    });
    if (admin) {
        res.json(admin);
    } else {
        res.status(404).json({ message: 'Admin not found' });
    }
};
