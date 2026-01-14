import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
    console.log('Attempting to connect to MySQL:', process.env.DATABASE_URL);
    const sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'mysql',
        logging: false,
        dialectOptions: {
            ssl: {
                rejectUnauthorized: false, // Allow self-signed certificates
            }
        }
    });

    try {
        await sequelize.authenticate();
        console.log('SUCCESS: Connected to MySQL');
        process.exit(0);
    } catch (err) {
        console.error('ERROR MESSAGE:', err.message);
        process.exit(1);
    }
};

testConnection();
