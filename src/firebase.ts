import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { AppData } from "./types";

const firebaseConfig = {
  apiKey: "AIzaSyA7IiIWVpl-BNBorrXjSMT8PujscxUTi_s",
  authDomain: "basecamp67-f1fcd.firebaseapp.com",
  projectId: "basecamp67-f1fcd",
  storageBucket: "basecamp67-f1fcd.firebasestorage.app",
  messagingSenderId: "43424379354",
  appId: "1:43424379354:web:809688d0667943fe3590e3",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const docRef = doc(db, "users", "main");

export async function loadData(defaultData: AppData): Promise<AppData> {
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return snapshot.data() as AppData;
  } else {
    await setDoc(docRef, defaultData);
    return defaultData;
  }
}

export async function saveData(data: AppData): Promise<void> {
  await setDoc(docRef, data);
}
