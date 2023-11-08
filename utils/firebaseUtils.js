import { auth, db } from "./firebase";
import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, addDoc, getDoc, collection } from "firebase/firestore";

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

		return { user, userDetails };
	} catch (error) {
		console.error("Error logging in:", error.message);
		throw error;
	}
};

export const registerRestaurant = async (ownerUid, restaurantData) => {
	try {
	  // Reference to the owner's restaurant subcollection
	  const ownerRestaurantsRef = collection(db, "users", ownerUid, "ownedRestaurants");
  
	  // Add a new restaurant document with auto-generated ID
	  const restaurantRef = await addDoc(ownerRestaurantsRef, restaurantData);
  
	  // The restaurantData should include fields such as name, address, cuisine, etc.
	  console.log("Restaurant registered with ID: ", restaurantRef.id);
  
	  return { id: restaurantRef.id, restaurantData }; // Return the new restaurant's ID
	} catch (error) {
	  console.error("Error registering restaurant:", error.message);
	  throw error;
	}
  };  