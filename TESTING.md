# Homeland FC Backend API - Complete Testing Guide

## 🎯 What This Tester Does

The `tester.js` script performs a complete end-to-end test of your API by:

1. **Logging in as Admin** - Tests authentication and retrieves JWT token
2. **Submitting an Application** - Creates a new player application in the database
3. **Fetching All Applications** - Retrieves paginated list of all applications
4. **Getting by ID** - Fetches the specific application we just created
5. **Updating Status** - Changes application status and triggers email
6. **Dashboard Stats** - Gets analytics from the database
7. **Search Function** - Tests the search/filter capability
8. **Session Info** - Verifies the admin session is valid

**All data is saved to and retrieved from your MySQL database!**

## 📋 Prerequisites

Before running the test, you need:

1. ✅ MySQL database connection working (Aiven or local)
2. ✅ Admin user seeded in database
3. ✅ Server running on port 5000

## 🚀 How to Run the Complete Test

### Step 1: Fix Database Connection Issue

Your current network is blocking database ports. You have 2 options:

**Option A: Use Mobile Hotspot (Recommended)**
1. Enable hotspot on your phone
2. Connect your computer to the hotspot
3. The database ports should now be accessible

**Option B: Use VPN**
1. Install a VPN (ProtonVPN, Surfshark, etc.)
2. Connect to the VPN
3. Try connecting again

### Step 2: Seed the Admin User

Once your database connection works, run:
```bash
npm run seed
```

Expected output:
```
MySQL Connected successfully.
Database models synced.
Admin user created successfully
```

### Step 3: Start the Server

In one terminal window:
```bash
npm run dev
```

Wait for:
```
MySQL Connected successfully.
Database models synced.
Server running in development mode on port 5000
```

### Step 4: Run the Tester

Open a **NEW** terminal window (keep server running) and run:
```bash
node tester.js
```

## 📊 Expected Output

You should see detailed output like:

```
🚀 STARTING COMPLETE API ENDPOINT TEST
═══════════════════════════════════════════════════

🔐 TEST 1: Admin Login
-----------------------------------
✅ Login Successful!
   Admin Name: Super Admin
   Admin Email: admin@homelandfc.com
   Access Token (first 20 chars): eyJhbGciOiJIUzI1NiIs...

📝 TEST 2: Submit Public Application
-----------------------------------
✅ Application Submitted Successfully!
   Application ID: 550e8400-e29b-41d4-a716-446655440000
   Player Name: Test Player 1736846732123
   Email: test_1736846732123@example.com

... (continues with all 8 tests)

═══════════════════════════════════════════════════
✨ ALL TESTS PASSED SUCCESSFULLY! ✨
⏱️  Total Time: 2.34s
═══════════════════════════════════════════════════
```

## 🐛 Troubleshooting

### Error: "connect ETIMEDOUT"
- **Problem**: Database connection blocked by network
- **Solution**: Switch to mobile hotspot or VPN

### Error: "Invalid email or password"
- **Problem**: Admin user not created yet
- **Solution**: Run `npm run seed`

### Error: "ECONNREFUSED 127.0.0.1:5000"
- **Problem**: Server not running
- **Solution**: Start server with `npm run dev` in separate terminal

### Error: "Application already exists" (email duplicate)
- **Problem**: Test data already in database
- **Solution**: This is normal - the script generates unique emails each time. Just run it again.

## 📝 Manual Testing Alternative

If you can't run the automated test, you can test endpoints manually using these curl commands:

### 1. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@homelandfc.com","password":"adminpassword123"}'
```

### 2. Get Applications (replace TOKEN)
```bash
curl http://localhost:5000/api/applications/protected \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Submit Application
```bash
curl -X POST http://localhost:5000/api/applications/public \
  -H "Content-Type: application/json" \
  -d '{
    "playerName": "John Doe",
    "dateOfBirth": "2012-05-15",
    "gender": "male",
    "stateOfOrigin": "Lagos",
    "lga": "Ikeja",
    "nationality": "Nigerian",
    "school": "Test School",
    "classGrade": "Grade 5",
    "preferredProgram": "Elite Academy",
    "preferredPosition": "Forward",
    "preferredFoot": "right",
    "height": 155,
    "weight": 50,
    "previousExperience": "2 years",
    "parentName": "Jane Doe",
    "relationship": "Mother",
    "phone": "08012345678",
    "email": "john.doe@example.com",
    "address": "123 Street",
    "occupation": "Doctor",
    "emergencyContactName": "Emergency Contact",
    "emergencyContactPhone": "08087654321",
    "emergencyContactRelationship": "Uncle"
  }'
```

## 🎓 What the Test Proves

When the test passes, it confirms:

- ✅ **Database Connectivity**: MySQL connection is working
- ✅ **Authentication**: JWT generation and validation working
- ✅ **Data Persistence**: Records are saving to database
- ✅ **Data Retrieval**: Data can be fetched from database
- ✅ **CRUD Operations**: Create, Read, Update all functional
- ✅ **Security**: Protected routes require valid tokens
- ✅ **Validation**: Input validation is working
- ✅ **Email Integration**: Email service is configured (may fail silently if SMTP has issues)

## 📞 Next Steps After Successful Test

Once all tests pass:
1. Your backend is ready for frontend integration
2. You can deploy to production (Render, Railway, etc.)
3. Update frontend to use your API endpoints
4. Configure CORS for your frontend domain
