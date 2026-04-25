import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyMockKeyForDevelopmentOnlyPleaseReplace",
  authDomain: "mock-safety-app.firebaseapp.com",
  projectId: "mock-safety-app",
  storageBucket: "mock-safety-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:mockappid12345"
};

let app;
let db: any = null;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (e) {
  console.warn("Firebase initialization failed, using mock DB mode", e);
}

// Helper wrapper to ensure the prototype works perfectly without real credentials.
// It tries to use real Firebase, but falls back to localStorage if it fails or if offline.
export const addDocument = async (collectionName: string, data: any) => {
  const enrichedData = { ...data, id: Date.now().toString() };
  try {
    // Try real firebase (will likely fail with mock config)
    if (db && navigator.onLine) {
      await addDoc(collection(db, collectionName), data);
      return enrichedData;
    }
  } catch (e) {
    console.warn("Using local storage fallback for addDoc");
  }
  
  // Local storage fallback for offline/mock demo
  const existing = JSON.parse(localStorage.getItem(`mock_${collectionName}`) || "[]");
  localStorage.setItem(`mock_${collectionName}`, JSON.stringify([...existing, enrichedData]));
  return enrichedData;
};

export const getDocuments = async (collectionName: string) => {
  try {
    if (db && navigator.onLine) {
      const querySnapshot = await getDocs(collection(db, collectionName));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  } catch (e) {
    console.warn("Using local storage fallback for getDocs");
  }
  
  return JSON.parse(localStorage.getItem(`mock_${collectionName}`) || "[]");
};

export const deleteDocument = async (collectionName: string, id: string) => {
  try {
    if (db && navigator.onLine) {
      await deleteDoc(doc(db, collectionName, id));
    }
  } catch (e) {
    console.warn("Using local storage fallback for deleteDoc");
  }
  
  const existing = JSON.parse(localStorage.getItem(`mock_${collectionName}`) || "[]");
  const updated = existing.filter((item: any) => item.id !== id);
  localStorage.setItem(`mock_${collectionName}`, JSON.stringify(updated));
};

export { app, db };
