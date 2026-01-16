import { connectDB } from './src/config/db.js';
import Admin from './src/models/Admin.js';
import Application from './src/models/Application.js';
import ContactMessage from './src/models/ContactMessage.js';
import Video from './src/models/Video.js';
import sequelize from './src/config/db.js';

const syncAll = async () => {
    try {
        await connectDB();
        console.log('Syncing all models...');
        await sequelize.sync({ alter: true });
        console.log('All models synced successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Sync failed:', error);
        process.exit(1);
    }
};

syncAll();
