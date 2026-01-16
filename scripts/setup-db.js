import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

/**
 * DATABASE SETUP & SEED SCRIPT
 * ----------------------------
 * 1. Creates the 'homelandfc' database if it doesn't exist.
 * 2. Connects to the database and syncs all models (creates tables).
 * 3. Seeds the initial Super Admin user.
 */

const setupDatabase = async () => {
    const dbUrl = process.env.DATABASE_URL;
    const baseUrl = dbUrl.substring(0, dbUrl.lastIndexOf('/'));
    const dbName = 'homelandfc';

    console.log(`\n🔗 Connecting to database server: ${baseUrl}...`);

    // Step 1: Create Database
    const rootSequelize = new Sequelize(baseUrl, {
        dialect: 'mysql',
        logging: false,
    });

    try {
        await rootSequelize.authenticate();
        console.log('✅ Connected to MySQL server.');

        console.log(`⚙️  Checking/Creating database "${dbName}"...`);
        await rootSequelize.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        await rootSequelize.close();
        console.log(`✅ Database "${dbName}" is ready.`);

        // Step 2: Initialize Sequelize with the specific database
        const fullUrl = `${baseUrl}/${dbName}`;
        const sequelize = new Sequelize(fullUrl, {
            dialect: 'mysql',
            logging: false,
        });

        // Define Models locally to avoid circular dependency / config path issues in script
        const Admin = sequelize.define('Admin', {
            id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
            name: { type: DataTypes.STRING, allowNull: false },
            email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
            password: { type: DataTypes.STRING, allowNull: false },
            refreshToken: { type: DataTypes.TEXT, allowNull: true },
            lastLogin: { type: DataTypes.DATE, allowNull: true }
        }, {
            hooks: {
                beforeSave: async (admin) => {
                    if (admin.changed('password')) {
                        const salt = await bcrypt.genSalt(10);
                        admin.password = await bcrypt.hash(admin.password, salt);
                    }
                }
            }
        });

        const Application = sequelize.define('Application', {
            id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
            playerName: { type: DataTypes.STRING, allowNull: false },
            email: { type: DataTypes.STRING, allowNull: false },
            status: { type: DataTypes.STRING, defaultValue: 'pending' }
        });

        const Video = sequelize.define('Video', {
            id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
            title: { type: DataTypes.STRING, allowNull: false },
            youtubeUrl: { type: DataTypes.STRING, allowNull: false }
        });

        const ContactMessage = sequelize.define('ContactMessage', {
            id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
            name: { type: DataTypes.STRING, allowNull: false },
            email: { type: DataTypes.STRING, allowNull: false },
            message: { type: DataTypes.TEXT, allowNull: false }
        });

        // Step 3: Migration (Sync)
        console.log('🔄 Syncing models (creating tables)...');
        await sequelize.sync({ alter: true });
        console.log('✅ Tables created/updated successfully.');

        // Step 4: Seed Admin
        console.log('🌱 Seeding initial admin...');
        const adminExists = await Admin.findOne({ where: { email: 'admin@homelandfc.com' } });

        if (!adminExists) {
            await Admin.create({
                name: 'Super Admin',
                email: 'admin@homelandfc.com',
                password: 'adminpassword123',
            });
            console.log('✅ Admin user created: admin@homelandfc.com / adminpassword123');
        } else {
            console.log('ℹ️ Admin already exists, skipping seed.');
        }

        await sequelize.close();
        console.log('\n🚀 SETUP COMPLETE! YOU ARE READY TO GO.');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Setup failed:', error.message);
        process.exit(1);
    }
};

setupDatabase();
