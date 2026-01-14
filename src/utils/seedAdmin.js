import Admin from '../models/Admin.js';
import { connectDB } from '../config/db.js';

const seedAdmin = async () => {
    try {
        await connectDB();

        const adminExists = await Admin.findOne({ where: { email: 'admin@homelandfc.com' } });

        if (adminExists) {
            console.log('Admin already exists');
            process.exit();
        }

        await Admin.create({
            name: 'Super Admin',
            email: 'admin@homelandfc.com',
            password: 'adminpassword123',
        });

        console.log('Admin user created successfully');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedAdmin();
