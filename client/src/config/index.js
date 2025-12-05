/**
 * Application Configuration
 * Centralized configuration for environment variables
 * All configs are loaded from .env file
 */

export const config = {
    // API Configuration
    api: {
        baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    },

    // Firebase Configuration
    firebase: {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
    },

    // Supabase Configuration
    supabase: {
        url: import.meta.env.VITE_SUPABASE_URL,
        anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    },

    // App Metadata
    app: {
        name: 'MERN Blog',
        version: '1.0.0',
        environment: import.meta.env.MODE,
        isDevelopment: import.meta.env.DEV,
        isProduction: import.meta.env.PROD,
    },
};

// Validate required environment variables
const validateConfig = () => {
    const required = {
        'VITE_API_BASE_URL': config.api.baseURL,
        'VITE_FIREBASE_API_KEY': config.firebase.apiKey,
        'VITE_SUPABASE_URL': config.supabase.url,
    };

    const missing = Object.entries(required)
        .filter(([, value]) => !value)
        .map(([key]) => key);

    if (missing.length > 0) {
        console.warn(
            `⚠️ Missing environment variables: ${missing.join(', ')}\n` +
            `Please check your .env file and ensure all required variables are set.`
        );
    }
};

// Run validation in development
if (config.app.isDevelopment) {
    validateConfig();
}

export default config;
