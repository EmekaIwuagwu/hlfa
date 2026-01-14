import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false,
        }
    }
});

async function checkDatabase() {
    try {
        await sequelize.authenticate();
        console.log('\n✅ Connected to MySQL Database\n');
        console.log('═════════════════════════════════════════════════════');
        console.log('📊 DIRECT DATABASE QUERY - PROOF OF DATA PERSISTENCE');
        console.log('═════════════════════════════════════════════════════\n');

        // Query Applications table
        const [applications] = await sequelize.query('SELECT * FROM Applications ORDER BY createdAt DESC LIMIT 5');
        console.log('📝 APPLICATIONS TABLE:');
        console.log('─────────────────────────────────────────────────────');
        if (applications.length === 0) {
            console.log('   No applications found in database');
        } else {
            console.log(`   Total Records: ${applications.length} (showing latest 5)`);
            applications.forEach((app, index) => {
                console.log(`\n   ${index + 1}. Player: ${app.playerName}`);
                console.log(`      ID: ${app.id}`);
                console.log(`      Email: ${app.email}`);
                console.log(`      Program: ${app.preferredProgram}`);
                console.log(`      Status: ${app.status}`);
                console.log(`      Parent: ${app.parentName}`);
                console.log(`      Created: ${new Date(app.createdAt).toLocaleString()}`);
                console.log(`      Updated: ${new Date(app.updatedAt).toLocaleString()}`);
            });
        }

        // Query Admins table
        console.log('\n\n👤 ADMINS TABLE:');
        console.log('─────────────────────────────────────────────────────');
        const [admins] = await sequelize.query('SELECT id, name, email, lastLogin, createdAt FROM Admins');
        if (admins.length === 0) {
            console.log('   No admins found in database');
        } else {
            console.log(`   Total Records: ${admins.length}`);
            admins.forEach((admin, index) => {
                console.log(`\n   ${index + 1}. Name: ${admin.name}`);
                console.log(`      ID: ${admin.id}`);
                console.log(`      Email: ${admin.email}`);
                console.log(`      Last Login: ${admin.lastLogin ? new Date(admin.lastLogin).toLocaleString() : 'Never'}`);
                console.log(`      Created: ${new Date(admin.createdAt).toLocaleString()}`);
            });
        }

        // Query Videos table
        console.log('\n\n🎥 VIDEOS TABLE:');
        console.log('─────────────────────────────────────────────────────');
        const [videos] = await sequelize.query('SELECT * FROM Videos ORDER BY createdAt DESC LIMIT 10');
        if (videos.length === 0) {
            console.log('   ⚠️  No videos found in database');
        } else {
            console.log(`   Total Records: ${videos.length}`);
            videos.forEach((video, index) => {
                console.log(`\n   ${index + 1}. Title: ${video.title}`);
                console.log(`      ID: ${video.id}`);
                console.log(`      Category: ${video.category}`);
                console.log(`      URL: ${video.youtubeUrl}`);
                console.log(`      Created: ${new Date(video.createdAt).toLocaleString()}`);
            });
        }

        // Query ContactMessages table
        console.log('\n\n📧 CONTACT MESSAGES TABLE:');
        console.log('─────────────────────────────────────────────────────');
        const [contacts] = await sequelize.query('SELECT * FROM ContactMessages ORDER BY createdAt DESC LIMIT 5');
        if (contacts.length === 0) {
            console.log('   No contact messages found in database');
        } else {
            console.log(`   Total Records: ${contacts.length} (showing latest 5)`);
            contacts.forEach((contact, index) => {
                console.log(`\n   ${index + 1}. Name: ${contact.name}`);
                console.log(`      Email: ${contact.email}`);
                console.log(`      Phone: ${contact.phone}`);
                console.log(`      Message: ${contact.message.substring(0, 50)}...`);
                console.log(`      Created: ${new Date(contact.createdAt).toLocaleString()}`);
            });
        }

        // Summary counts
        console.log('\n\n📊 DATABASE SUMMARY:');
        console.log('═════════════════════════════════════════════════════');
        const [appCount] = await sequelize.query('SELECT COUNT(*) as count FROM Applications');
        const [adminCount] = await sequelize.query('SELECT COUNT(*) as count FROM Admins');
        const [videoCount] = await sequelize.query('SELECT COUNT(*) as count FROM Videos');
        const [contactCount] = await sequelize.query('SELECT COUNT(*) as count FROM ContactMessages');

        console.log(`   Applications:     ${appCount[0].count} records`);
        console.log(`   Admins:           ${adminCount[0].count} records`);
        console.log(`   Videos:           ${videoCount[0].count} records`);
        console.log(`   Contact Messages: ${contactCount[0].count} records`);
        console.log('═════════════════════════════════════════════════════\n');

        await sequelize.close();
        process.exit(0);

    } catch (error) {
        console.error('❌ Database Error:', error.message);
        process.exit(1);
    }
}

checkDatabase();
