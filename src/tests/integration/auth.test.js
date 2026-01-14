import request from 'supertest';
import { Sequelize } from 'sequelize';
import app from '../../app.js';
import Admin from '../../models/Admin.js';
import sequelize from '../../config/db.js';

// Mock DB for testing
const testDb = new Sequelize('sqlite::memory:', { logging: false });

beforeAll(async () => {
    // Overwrite models to use testDb if needed, but easier to just sync the existing sequelize 
    // if we can change its dialect to sqlite for tests.
    // For simplicity, we just sync the real models to the real DB or use a test env.
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

describe('Auth Endpoints', () => {
    let adminData = {
        name: 'Test Admin',
        email: 'test@example.com',
        password: 'password123'
    };

    beforeEach(async () => {
        await Admin.destroy({ where: {}, truncate: true });
        await Admin.create(adminData);
    });

    it('should login with correct credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: adminData.email,
                password: adminData.password
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('accessToken');
        expect(res.body).toHaveProperty('refreshToken');
    });

    it('should not login with wrong password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: adminData.email,
                password: 'wrongpassword'
            });

        expect(res.statusCode).toEqual(401);
    });
});
