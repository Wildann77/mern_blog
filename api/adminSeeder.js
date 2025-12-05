import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/user.model.js';

dotenv.config();

// Use environment variable for MongoDB connection
const MONGO_URI = process.env.MONGO;

const seedAdmin = async () => {
    // Validate MONGO_URI
    if (!MONGO_URI) {
        console.error('❌ MONGO environment variable is not set!');
        console.error('Please check your .env file');
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB connected...');

        // Cek apakah user dengan email atau username ini sudah ada
        const existingUser = await User.findOne({ $or: [{ email: 'admin@gmail.com' }, { username: 'admin' }] });
        if (existingUser) {
            console.log(`ℹ️ User already exists (Username: ${existingUser.username}, Email: ${existingUser.email})`);
            if (!existingUser.isAdmin) {
                existingUser.isAdmin = true;
                await existingUser.save();
                console.log('✅ Updated existing user to be admin');
            } else {
                console.log('✅ User is already an admin');
            }
            process.exit();
        }


        // Hash password
        const hashedPassword = bcryptjs.hashSync('admin123', 10);

        // Buat user admin baru
        const adminUser = new User({
            username: 'admin',
            email: 'admin@gmail.com',
            password: hashedPassword,
            isAdmin: true,
            profilePicture: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
        });

        await adminUser.save();
        console.log('✅ Admin user created successfully');
        console.log('📧 Email: admin@gmail.com');
        console.log('🔑 Password: admin123');

        process.exit();
    } catch (err) {
        console.error('❌ Error creating admin user:', err);
        process.exit(1);
    }
};

seedAdmin();
