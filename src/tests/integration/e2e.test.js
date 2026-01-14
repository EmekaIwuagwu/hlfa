import request from 'supertest';
import app from '../../app.js';
import Admin from '../../models/Admin.js';
import Application from '../../models/Application.js';
import Video from '../../models/Video.js';
import ContactMessage from '../../models/ContactMessage.js';
import * as emailService from '../../services/emailService.js';
import jwt from 'jsonwebtoken';

// Mock Email Service
jest.mock('../../services/emailService.js', () => ({
    sendEmail: jest.fn().mockResolvedValue({ messageId: 'mock-id' })
}));

// Mock Sequelize Models
jest.mock('../../models/Admin.js');
jest.mock('../../models/Application.js');
jest.mock('../../models/Video.js');
jest.mock('../../models/ContactMessage.js');

describe('End-to-End API Integration Tests', () => {
    let adminToken;
    const mockAdminId = '550e8400-e29b-41d4-a716-446655440000';

    beforeAll(() => {
        adminToken = jwt.sign({ id: mockAdminId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    });

    describe('Authentication Endpoints', () => {
        it('POST /api/auth/login - should login successfully', async () => {
            Admin.findOne.mockResolvedValue({
                id: mockAdminId,
                name: 'Super Admin',
                email: 'admin@homelandfc.com',
                matchPassword: jest.fn().mockResolvedValue(true),
                save: jest.fn().mockResolvedValue(true)
            });

            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'admin@homelandfc.com', password: 'password123' });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('accessToken');
        });

        it('GET /api/auth/session - should return session info', async () => {
            Admin.findByPk.mockResolvedValue({
                id: mockAdminId,
                name: 'Super Admin',
                email: 'admin@homelandfc.com'
            });

            const res = await request(app)
                .get('/api/auth/session')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.email).toBe('admin@homelandfc.com');
        });
    });

    describe('Applications Endpoints', () => {
        const mockApp = {
            playerName: 'John Doe',
            dateOfBirth: '2010-01-01',
            gender: 'male',
            stateOfOrigin: 'Lagos',
            lga: 'Ikeja',
            nationality: 'Nigerian',
            school: 'Grace High',
            classGrade: 'SS1',
            preferredProgram: 'Pro Academy',
            preferredPosition: 'Forward',
            preferredFoot: 'right',
            height: 170,
            weight: 65,
            previousExperience: '3 years local club',
            parentName: 'Jane Doe',
            relationship: 'Mother',
            phone: '08012345678',
            email: 'john@example.com',
            address: '123 Street',
            occupation: 'Doctor',
            emergencyContactName: 'Jim Doe',
            emergencyContactPhone: '08087654321',
            emergencyContactRelationship: 'Uncle'
        };

        it('POST /api/applications/public - should submit application', async () => {
            Application.create.mockResolvedValue({ id: 'app-123', ...mockApp });

            const res = await request(app)
                .post('/api/applications/public')
                .send(mockApp);

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(emailService.sendEmail).toHaveBeenCalled();
        });

        it('GET /api/applications/protected - should list applications', async () => {
            Application.findAndCountAll.mockResolvedValue({
                count: 1,
                rows: [{ id: 'app-123', ...mockApp }]
            });

            const res = await request(app)
                .get('/api/applications/protected')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.applications).toHaveLength(1);
        });

        it('PATCH /api/applications/:id/status - should update status', async () => {
            const mockInstance = {
                ...mockApp,
                status: 'pending',
                save: jest.fn().mockResolvedValue({ ...mockApp, status: 'enrolled' })
            };
            Application.findByPk.mockResolvedValue(mockInstance);

            const res = await request(app)
                .patch('/api/applications/app-123/status')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ status: 'enrolled' });

            expect(res.statusCode).toBe(200);
            expect(emailService.sendEmail).toHaveBeenCalled();
        });
    });

    describe('Videos Endpoints', () => {
        it('POST /api/videos - should create video', async () => {
            const mockVideo = { title: 'Skills', category: 'Training', youtubeUrl: 'https://youtube.com/watch?v=123' };
            Video.create.mockResolvedValue({ id: 'vid-1', ...mockVideo });

            const res = await request(app)
                .post('/api/videos')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(mockVideo);

            expect(res.statusCode).toBe(201);
            expect(res.body.title).toBe('Skills');
        });

        it('DELETE /api/videos/:id - should delete video', async () => {
            const mockInstance = { destroy: jest.fn().mockResolvedValue(true) };
            Video.findByPk.mockResolvedValue(mockInstance);

            const res = await request(app)
                .delete('/api/videos/vid-1')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Video removed');
        });
    });

    describe('Stats Endpoints', () => {
        it('GET /api/stats/overview - should return totals', async () => {
            Application.count.mockResolvedValue(10);
            Video.count.mockResolvedValue(5);

            const res = await request(app)
                .get('/api/stats/overview')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.totalApplications).toBe(10);
            expect(res.body.totalVideos).toBe(5);
        });
    });

    describe('Contact Endpoints', () => {
        it('POST /api/contact/send-contact-email - should save and send', async () => {
            const mockContact = { name: 'Bob', email: 'bob@example.com', phone: '123', message: 'Hello' };
            ContactMessage.create.mockResolvedValue(mockContact);

            const res = await request(app)
                .post('/api/contact/send-contact-email')
                .send(mockContact);

            expect(res.statusCode).toBe(201);
            expect(emailService.sendEmail).toHaveBeenCalled();
        });
    });
});
