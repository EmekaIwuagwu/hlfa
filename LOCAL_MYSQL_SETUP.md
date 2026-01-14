# Use Local MySQL Database (No Network Issues!)

Since cloud databases are being blocked, let's use a local MySQL on your machine.

## Option 1: Using XAMPP (Easiest - Recommended)

### 1. Download & Install XAMPP
- Download from: https://www.apachefriends.org/download.html
- Install it (default settings are fine)
- Start XAMPP Control Panel

### 2. Start MySQL
- Click "Start" next to MySQL in XAMPP
- MySQL will run on port 3306

### 3. Create Database
- Click "Admin" next to MySQL (opens phpMyAdmin)
- Click "New" on the left sidebar
- Database name: `homelandfc`
- Click "Create"

### 4. Update .env
Replace your DATABASE_URL with:
```
DATABASE_URL=mysql://root:@localhost:3306/homelandfc
```

### 5. Run Everything
```bash
npm run seed     # Create admin user
npm run dev      # Start server
node tester.js   # Run tests (in new terminal)
```

## Option 2: Using MySQL Installer

### 1. Download MySQL
- Download from: https://dev.mysql.com/downloads/installer/
- Choose "mysql-installer-community"

### 2. Install
- Choose "Developer Default"
- Set root password: `password` (or leave blank)
- Finish installation

### 3. Create Database
Open MySQL Command Line and run:
```sql
CREATE DATABASE homelandfc;
```

### 4. Update .env
```
DATABASE_URL=mysql://root:password@localhost:3306/homelandfc
```
(If you left password blank, use `mysql://root:@localhost:3306/homelandfc`)

## Option 3: Use Docker (If you have Docker)

```bash
docker run --name homeland-mysql -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=homelandfc -p 3306:3306 -d mysql:8

# Then update .env:
DATABASE_URL=mysql://root:password@localhost:3306/homelandfc
```

## Quick Check
After setting up, test the connection:
```bash
node test-db.js
```

You should see "SUCCESS: Connected to MySQL"

Then proceed with the full test!
