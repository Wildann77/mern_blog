/**
 * Server Configuration
 * Centralized configuration for backend environment variables
 */

import dotenv from 'dotenv';
dotenv.config();

export const config = {
    // Server Configuration
    server: {
        port: process.env.PORT || 3000,
        env: process.env.NODE_ENV || 'development',
        isDevelopment: process.env.NODE_ENV !== 'production',
        isProduction: process.env.NODE_ENV === 'production',
    },

    // Client Configuration
    client: {
        url: process.env.CLIENT_URL || 'http://localhost:5173',
    },

    // Database Configuration
    database: {
        mongoUri: process.env.MONGO,
    },

    // JWT Configuration
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: '7d', // 7 days
        cookieMaxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    },

    // Cookie Configuration
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    },
};

// Validate required environment variables
const validateConfig = () => {
    const required = {
        MONGO: config.database.mongoUri,
        JWT_SECRET: config.jwt.secret,
    };

    const missing = Object.entries(required)
        .filter(([, value]) => !value)
        .map(([key]) => key);

    if (missing.length > 0) {
        console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
        console.error('Please check your .env file');
        process.exit(1);
    }
};

// Run validation
validateConfig();

export default config;
