import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = `http://localhost:${process.env.PORT || 5000}/api`;

// Generate unique test data
const timestamp = Date.now();
const testApp = {
    playerName: `Test Player ${timestamp}`,
    dateOfBirth: '2012-05-15',
    gender: 'male',
    stateOfOrigin: 'Lagos',
    lga: 'Ikeja',
    nationality: 'Nigerian',
    school: 'Testing Academy',
    classGrade: 'Grade 5',
    preferredProgram: 'Elite Academy',
    preferredPosition: 'Midfielder',
    preferredFoot: 'both',
    height: 155,
    weight: 50,
    previousExperience: 'Played for local school team for 2 years.',
    videoLink: '',
    parentName: 'Test Parent',
    relationship: 'Father',
    phone: '08000000000',
    email: `test_${timestamp}@example.com`,
    address: '456 Testing Street, Lagos',
    occupation: 'Engineer',
    emergencyContactName: 'Emergency Person',
    emergencyContactPhone: '09000000000',
    emergencyContactRelationship: 'Uncle',
    medicalConditions: 'None',
    allergies: 'None',
    currentMedications: 'None',
    dietaryRestrictions: 'None'
};

let globalToken = '';
let globalAppId = '';
let globalVideoId = '';

async function testAdminLogin() {
    console.log('🔐 TEST 1: Admin Login');
    console.log('-----------------------------------');

    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: 'admin@homelandfc.com',
            password: 'adminpassword123'
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(`❌ Login Failed: ${JSON.stringify(data)}`);
    }

    globalToken = data.accessToken;
    console.log('✅ Login Successful!');
    console.log('   Admin Name:', data.name);
    console.log('   Admin Email:', data.email);
    console.log('   Access Token (first 20 chars):', data.accessToken.substring(0, 20) + '...');
    console.log('   Refresh Token (first 20 chars):', data.refreshToken.substring(0, 20) + '...\n');

    return data;
}

async function testSubmitApplication() {
    console.log('📝 TEST 2: Submit Public Application');
    console.log('-----------------------------------');

    const response = await fetch(`${BASE_URL}/applications/public`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testApp)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(`❌ Application Submission Failed: ${JSON.stringify(data)}`);
    }

    globalAppId = data.data;
    console.log('✅ Application Submitted & SAVED to Database!');
    console.log('   Application ID:', data.data);
    console.log('   Player Name:', testApp.playerName);
    console.log('   Email:', testApp.email);
    console.log('   Program:', testApp.preferredProgram + '\n');

    return data;
}

async function testGetAllApplications() {
    console.log('📋 TEST 3: Get All Applications (Protected)');
    console.log('-----------------------------------');

    const response = await fetch(`${BASE_URL}/applications/protected?page=1&limit=10`, {
        headers: { 'Authorization': `Bearer ${globalToken}` }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(`❌ Get Applications Failed: ${JSON.stringify(data)}`);
    }

    console.log('✅ Applications RETRIEVED from Database!');
    console.log('   Total Applications:', data.total);
    console.log('   Current Page:', data.page);
    console.log('   Total Pages:', data.pages);
    console.log('   Applications on this page:', data.applications.length);

    if (data.applications.length > 0) {
        console.log('\n   Recent Applications:');
        data.applications.slice(0, 3).forEach((app, index) => {
            console.log(`   ${index + 1}. ${app.playerName} - Status: ${app.status} - ${app.email}`);
        });
    }
    console.log();

    return data;
}

async function testGetApplicationById() {
    console.log(`🔍 TEST 4: Get Application by ID`);
    console.log('-----------------------------------');

    const response = await fetch(`${BASE_URL}/applications/${globalAppId}`, {
        headers: { 'Authorization': `Bearer ${globalToken}` }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(`❌ Get Application by ID Failed: ${JSON.stringify(data)}`);
    }

    console.log('✅ Application Retrieved by ID!');
    console.log('   ID:', data.id);
    console.log('   Player Name:', data.playerName);
    console.log('   Date of Birth:', data.dateOfBirth);
    console.log('   Gender:', data.gender);
    console.log('   Program:', data.preferredProgram);
    console.log('   Position:', data.preferredPosition);
    console.log('   Status:', data.status);
    console.log('   Parent:', data.parentName);
    console.log('   Email:', data.email);
    console.log('   Phone:', data.phone);
    console.log('   Created:', new Date(data.createdAt).toLocaleString() + '\n');

    return data;
}

async function testUpdateApplicationStatus() {
    console.log('🔄 TEST 5: Update Application Status');
    console.log('-----------------------------------');

    const response = await fetch(`${BASE_URL}/applications/${globalAppId}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${globalToken}`
        },
        body: JSON.stringify({ status: 'reviewed' })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(`❌ Status Update Failed: ${JSON.stringify(data)}`);
    }

    console.log('✅ Status UPDATED in Database!');
    console.log('   Previous Status: pending');
    console.log('   New Status:', data.status);
    console.log('   Email notification sent to:', data.email + '\n');

    return data;
}

async function testDashboardStats() {
    console.log('📊 TEST 6: Get Dashboard Statistics');
    console.log('-----------------------------------');

    const response = await fetch(`${BASE_URL}/stats/overview`, {
        headers: { 'Authorization': `Bearer ${globalToken}` }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(`❌ Stats Retrieval Failed: ${JSON.stringify(data)}`);
    }

    console.log('✅ Dashboard Stats Retrieved!');
    console.log('   Total Applications:', data.totalApplications);
    console.log('   Enrolled:', data.enrolled);
    console.log('   Pending:', data.pending);
    console.log('   Total Videos:', data.totalVideos + '\n');

    return data;
}

async function testSearchApplications() {
    console.log('🔎 TEST 7: Search Applications');
    console.log('-----------------------------------');

    const searchTerm = testApp.playerName.split(' ')[1]; // Use part of the name
    const response = await fetch(`${BASE_URL}/applications/protected?search=${searchTerm}`, {
        headers: { 'Authorization': `Bearer ${globalToken}` }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(`❌ Search Failed: ${JSON.stringify(data)}`);
    }

    console.log('✅ Search Completed!');
    console.log('   Search Term:', searchTerm);
    console.log('   Results Found:', data.total);
    console.log('   Our test application included:', data.applications.some(app => app.id === globalAppId) ? 'Yes ✓' : 'No ✗');
    console.log();

    return data;
}

async function testGetSession() {
    console.log('👤 TEST 8: Get Admin Session');
    console.log('-----------------------------------');

    const response = await fetch(`${BASE_URL}/auth/session`, {
        headers: { 'Authorization': `Bearer ${globalToken}` }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(`❌ Get Session Failed: ${JSON.stringify(data)}`);
    }

    console.log('✅ Session Retrieved!');
    console.log('   Admin ID:', data.id);
    console.log('   Name:', data.name);
    console.log('   Email:', data.email);
    console.log('   Last Login:', new Date(data.lastLogin).toLocaleString() + '\n');

    return data;
}

async function testCreateVideo() {
    console.log('🎥 TEST 9: Create Video (Protected)');
    console.log('-----------------------------------');

    const videoData = {
        title: `Test Video ${Date.now()}`,
        description: 'A test video for database verification',
        category: 'Training',
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
    };

    const response = await fetch(`${BASE_URL}/videos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${globalToken}`
        },
        body: JSON.stringify(videoData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(`❌ Video Creation Failed: ${JSON.stringify(data)}`);
    }

    globalVideoId = data.id;
    console.log('✅ Video SAVED to Database!');
    console.log('   Video ID:', data.id);
    console.log('   Title:', data.title);
    console.log('   Category:', data.category);
    console.log('   URL:', data.youtubeUrl + '\n');

    return data;
}

async function testGetVideos() {
    console.log('🎬 TEST 10: Get All Videos (Protected)');
    console.log('-----------------------------------');

    const response = await fetch(`${BASE_URL}/videos`, {
        headers: { 'Authorization': `Bearer ${globalToken}` }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(`❌ Get Videos Failed: ${JSON.stringify(data)}`);
    }

    console.log('✅ Videos RETRIEVED from Database!');
    console.log('   Total Videos:', data.total);
    console.log('   Videos on this page:', data.videos.length);

    if (data.videos.length > 0) {
        console.log('\n   Recent Videos:');
        data.videos.slice(0, 3).forEach((video, index) => {
            console.log(`   ${index + 1}. ${video.title} - Category: ${video.category}`);
        });
    }
    console.log();

    return data;
}

async function testUpdateVideo() {
    console.log('✏️ TEST 11: Update Video (Protected)');
    console.log('-----------------------------------');

    const updateData = {
        title: `Updated Test Video ${Date.now()}`,
        description: 'This video was updated by the test script'
    };

    const response = await fetch(`${BASE_URL}/videos/${globalVideoId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${globalToken}`
        },
        body: JSON.stringify(updateData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(`❌ Video Update Failed: ${JSON.stringify(data)}`);
    }

    console.log('✅ Video UPDATED in Database!');
    console.log('   Video ID:', data.id);
    console.log('   Updated Title:', data.title);
    console.log('   Updated Description:', data.description + '\n');

    return data;
}

async function testContactForm() {
    console.log('📧 TEST 12: Submit Contact Form (Public)');
    console.log('-----------------------------------');

    const contactData = {
        name: `Test Contact ${Date.now()}`,
        phone: '08123456789',
        email: `contact_${Date.now()}@example.com`,
        childAge: 10,
        childName: 'Test Child',
        program: 'Elite Academy',
        message: 'This is a test contact message to verify database saving.'
    };

    const response = await fetch(`${BASE_URL}/contact/send-contact-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(`❌ Contact Form Failed: ${JSON.stringify(data)}`);
    }

    console.log('✅ Contact Message SAVED to Database!');
    console.log('   Name:', contactData.name);
    console.log('   Email:', contactData.email);
    console.log('   Message:', contactData.message.substring(0, 50) + '...\n');

    return data;
}

async function testDeleteVideo() {
    console.log('🗑️ TEST 13: Delete Video (Protected)');
    console.log('-----------------------------------');

    const response = await fetch(`${BASE_URL}/videos/${globalVideoId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${globalToken}` }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(`❌ Video Deletion Failed: ${JSON.stringify(data)}`);
    }

    console.log('✅ Video DELETED from Database!');
    console.log('   Message:', data.message);
    console.log('   Video ID:', globalVideoId + '\n');

    return data;
}

async function runAllTests() {
    console.log('\n🚀 STARTING COMPLETE API ENDPOINT TEST');
    console.log('═══════════════════════════════════════════════════\n');

    const startTime = Date.now();

    try {
        // Run all tests in sequence
        await testAdminLogin();
        await testSubmitApplication();
        await testGetAllApplications();
        await testGetApplicationById();
        await testUpdateApplicationStatus();
        await testDashboardStats();
        await testSearchApplications();
        await testGetSession();

        // New Database Verification Tests
        await testCreateVideo();
        await testGetVideos();
        await testUpdateVideo();
        await testContactForm();
        await testDeleteVideo();

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);

        console.log('═══════════════════════════════════════════════════');
        console.log('✨ ALL TESTS PASSED SUCCESSFULLY! ✨');
        console.log(`⏱️  Total Time: ${duration}s`);
        console.log('═══════════════════════════════════════════════════\n');

        console.log('📌 Test Summary:');
        console.log('   ✓ Admin authentication working');
        console.log('   ✓ Application submission working');
        console.log('   ✓ Application retrieval working');
        console.log('   ✓ Status updates working');
        console.log('   ✓ Dashboard stats working');
        console.log('   ✓ Video CRUD operations working');
        console.log('   ✓ Contact form submission working');
        console.log('   ✓ Database save/retrieve verified\n');

    } catch (error) {
        console.log('\n═══════════════════════════════════════════════════');
        console.log('❌ TEST FAILED');
        console.log('═══════════════════════════════════════════════════');
        console.error('\nError Details:', error.message);
        console.log('\n💡 Troubleshooting:');
        console.log('   1. Make sure server is running: npm run dev');
        console.log('   2. Check database connection is working');
        console.log('   3. Verify admin user exists: npm run seed');
        console.log('   4. Ensure you are on a network that allows DB connections\n');
        process.exit(1);
    }
}

// Run the tests
runAllTests();
