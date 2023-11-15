import { auth, db } from "./firebase";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, addDoc, getDoc, collection, query, getDocs, updateDoc, arrayUnion } from "firebase/firestore";

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
        

        // Add a new restaurant document with auto-generated ID
        const restaurantRef = await addDoc(collection(db, "restaurants"), {
            ...restaurantData,
        });

		const ownerRestaurantsRef = collection(
            db,
            "users",
            ownerUid,
            "ownedRestaurants"
        );

		await setDoc(doc(ownerRestaurantsRef, restaurantRef.id), {
            ref: restaurantRef // Store the reference to the restaurant
        });

        // The restaurantData should include fields such as name, address, cuisine, etc.
        console.log("Restaurant registered with ID: ", restaurantRef.id);

        return { id: restaurantRef.id, restaurantData }; // Return the new restaurant's ID
    } catch (error) {
        console.error("Error registering restaurant:", error.message);
        throw error;
    }
};

export const fetchRestaurants = async (userId) => {
    const ownerRestaurantsRef = collection(db, 'users', userId, 'ownedRestaurants');
    const q = query(ownerRestaurantsRef);
    const querySnapshot = await getDocs(q);
    let ownedRestaurants = new Map();

    for (const docRef of querySnapshot.docs) {
        const ref = docRef.data().ref;
        const restaurantDoc = await getDoc(ref);
        if (restaurantDoc.exists()) {
			console.log(ref.id)
            ownedRestaurants[restaurantDoc.data().name] = ref.id;
        }
    }

    return ownedRestaurants;
};


export const savePromotion = async (promotionData) => {
    try {
        // Add promotion to 'promotions' collection
        const promotionRef = await addDoc(collection(db, "promotions"), promotionData);
		console.log(promotionData)

		const restaurantRef = collection(
            db,
            "restaurants",
            promotionData.restaurantId,
            "promotions"
        );

		await setDoc(doc(restaurantRef, promotionRef.id), {
			ref: promotionRef // Store the reference to the promotion
		});
		
        // // Update the restaurant document with a reference to the new promotion
        // await updateDoc(restaurantRef, {
        //     promotions2: arrayUnion(promotionRef.id)
        // });

		// await setDoc(doc(db, "restaurants", promotionData.restaurantId), {
		// 	ref: promotionRef
        // });

        return promotionRef.id;
    } catch (error) {
        console.error("Error saving promotion:", error);
        throw error;
    }
};