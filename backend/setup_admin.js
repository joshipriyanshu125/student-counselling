const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function setupAdmin() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/S-C-S');
        console.log('Connected to MongoDB');
        
        const User = mongoose.connection.collection('users');
        
        const password = 'admin123';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const result = await User.updateOne(
            { email: 'admin@gmail.com' },
            { 
                $set: { 
                    password: hashedPassword,
                    role: 'admin',
                    isApproved: true
                },
                $setOnInsert: {
                    fullName: 'Admin User'
                }
            },
            { upsert: true }
        );
        
        if (result.upsertedCount > 0) {
            console.log('Admin user created successfully.');
        } else {
            console.log('Admin user password updated successfully.');
        }
        
        process.exit(0);
    } catch (err) {
        console.error('Setup failed:', err);
        process.exit(1);
    }
}

setupAdmin();
