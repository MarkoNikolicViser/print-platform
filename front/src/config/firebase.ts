import { initializeApp } from "firebase/app"
import { getStorage } from "firebase/storage"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "serbian-copy-shop.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "serbian-copy-shop",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "serbian-copy-shop.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const storage = getStorage(app)
export const auth = getAuth(app)
export const db = getFirestore(app)

export default app
