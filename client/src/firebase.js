// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'mern-blog-4e0d3.firebaseapp.com',
  projectId: 'mern-blog-4e0d3',
  storageBucket: 'mern-blog-4e0d3.firebasestorage.app',
  messagingSenderId: '300936514713',
  appId: '1:300936514713:web:c59dd3f5d9d3579adebc08',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
