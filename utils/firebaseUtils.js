import { auth, db } from "./firebase";
import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc, collection } from "firebase/firestore";

export const registerUser = async ({
	email,
	password,
	firstName,
	lastName,
	phone,
	accountType,
}) => {
	try {
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		const user = userCredential.user;

		// Save additional user details in Firestore
		const userRef = doc(db, "users", user.uid);
		await setDoc(userRef, {
			email,
			firstName,
			lastName,
			phone,
			accountType,
		});

		return { user };
	} catch (error) {
		console.error("Error registering:", error.message);
		throw error;
	}
};

export const loginUser = async ({ email, password }) => {
	try {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);
		const user = userCredential.user;

		// Retrieve user type from Firestore
		const userRef = doc(db, "users", user.uid); // Adjusted this
		const userDoc = await getDoc(userRef); // Adjusted this
		const userDetails = userDoc.data();

		return { user, userDetails: userDetails };
	} catch (error) {
		console.error("Error logging in:", error.message);
		throw error;
	}
};
