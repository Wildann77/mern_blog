// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'mern-blog-e6eab.firebaseapp.com',
  projectId: 'mern-blog-e6eab',
  storageBucket: 'mern-blog-e6eab.firebasestorage.app',
  messagingSenderId: '343859933606',
  appId: '1:343859933606:web:f4dbe98fa4d71c3fa3a058',
};

// Initialize Firebase
// @ts-ignore
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;
