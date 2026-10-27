import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase leída desde variables de entorno o valores de desarrollo
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForGuessWhoDevelopment",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "adivina-quien-hp.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "adivina-quien-hp",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "adivina-quien-hp.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456"
};

// Inicialización de la aplicación Firebase (Singleton)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Instancia de Firestore
export const db = getFirestore(app);

export default app;
