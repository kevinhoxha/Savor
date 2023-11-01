import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: "savor-d1443.firebaseapp.com",
	databaseURL: "https://savor-d1443-default-rtdb.firebaseio.com",
	projectId: "savor-d1443",
	storageBucket: "savor-d1443.appspot.com",
	messagingSenderId: "881355166385",
	appId: "1:881355166385:web:a9ec8241e3f3edbfb44890",
};

let auth;
let db;

if (typeof window !== "undefined") {
    const app = initializeApp(firebaseConfig);  // Initialize Firebase app
    auth = getAuth(app);  // Initialize auth service
    db = getFirestore(app);  // Initialize firestore service
}

export { auth, db };
