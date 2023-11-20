import { auth, db } from "./firebase";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, addDoc, getDoc, collection, query, getDocs, where } from "firebase/firestore";

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
			ref: promotionRef
		});

        return promotionRef.id;
    } catch (error) {
        console.error("Error saving promotion:", error);
        throw error;
    }
};

export const saveReservation = async (reservationData) => {
    try {
        // Add reservation to 'reservations' collection
        const reservationRef = await addDoc(collection(db, "reservations"), reservationData);
		console.log(reservationData)
        return reservationRef.id;
    } catch (error) {
        console.error("Error saving reservation:", error);
        throw error;
    }
};

export const fetchReservations = async (userId) => {
    try {
        const querySnapshot = await getDocs(collection(db, "reservations"));
        let reservations = [];

        querySnapshot.forEach((doc) => {
            const reservationData = doc.data();
            if (reservationData.createdBy === userId) {
                reservations.push({ id: doc.id, refId: doc.ref.id, ...reservationData });
            }
        });
        return reservations;
    } catch (error) {
        console.error("Error fetching reservations:", error.message);
        throw error;
    }
};

export const getRestaurants = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "restaurants"));
        let restaurants = [];

        querySnapshot.forEach((doc) => {
            const restaurantData = doc.data();
            restaurants.push({ id: doc.id, refId: doc.ref.id, ...restaurantData });
        });

        return restaurants;
    } catch (error) {
        console.error("Error getting restaurants:", error.message);
        throw error;
    }
};

export const getPromotions = async (restaurantId) => {
    try {
        // Reference to the restaurant's promotions subcollection
        const restaurantPromotionsRef = collection(db, "restaurants", restaurantId, "promotions");

        // Get all promotions for the specified restaurant
        const querySnapshot = await getDocs(restaurantPromotionsRef);

        let promotions = [];

        for (const doc of querySnapshot.docs) {
            const ref = doc.data().ref;
            const promotionDoc = await getDoc(ref);
            if (promotionDoc.exists()) {
                promotions.push(promotionDoc.data());
            }
        }
    
        return promotions;
    } catch (error) {
        console.error("Error getting promotions:", error.message);
        throw error;
    }
};

export const fetchPromotions = async (restaurantId) => {
    const promotionsRef = collection(db, 'restaurants', restaurantId, 'promotions');
    const q = query(promotionsRef);
    const querySnapshot = await getDocs(q);
    let promotions = new Map();

    for (const doc of querySnapshot.docs) {
        const ref = doc.data().ref;
        const promotionDoc = await getDoc(ref);
        if (promotionDoc.exists()) {
            promotions[ref.id] = promotionDoc.data();
        }
    }

    return promotions;
};
