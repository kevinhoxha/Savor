import { auth, db } from './firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import {
  doc,
  setDoc,
  addDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  getDocs,
  where,
  increment,
} from 'firebase/firestore'

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
    )

    const user = userCredential.user

    // Save additional user details in Firestore
    const userRef = doc(db, 'users', user.uid)
    await setDoc(userRef, {
      email,
      firstName,
      lastName,
      phone,
      accountType,
    })

    return { user }
  } catch (error) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        console.log(`Email address ${email} already in use. Logging in...`)
        return { user: null }
      case 'auth/invalid-email':
        console.log(`Email address ${email} is invalid.`)
        break
      case 'auth/operation-not-allowed':
        console.log(`Error during sign up.`)
        break
      case 'auth/weak-password':
        console.log(
          'Password is not strong enough. Add additional characters including special characters and numbers.'
        )
        break
      default:
        console.error('Error registering:', error.message)
        break
    }

    throw error
  }
}

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )
    const user = userCredential.user

    // Retrieve user type from Firestore
    const userRef = doc(db, 'users', user.uid) // Adjusted this
    const userDoc = await getDoc(userRef) // Adjusted this
    const userDetails = userDoc.data()

    return { user, userDetails }
  } catch (error) {
    console.error('Error logging in:', error.message)
    throw error
  }
}

export const signOutUser = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error('Error signing out:', error.message)
    throw error
  }
}

async function fetchCollection(collectionRef, isSubCollection = false) {
  try {
    const querySnapshot = await getDocs(collectionRef)
    let collection = {}

    for (const docRef of querySnapshot.docs) {
      if (isSubCollection) {
        const doc = await getDoc(docRef.data().ref)
        if (doc.exists()) {
          collection[doc.id] = doc.data()
        }
      } else {
        collection[docRef.id] = docRef.data()
      }
    }

    return collection
  } catch (error) {
    console.error('Error fetching collection:', error.message)
    throw error
  }
}

async function saveDocumentWithSubCollection(
  mainCollectionRef,
  data,
  subCollectionRefs
) {
  try {
    const docRef = await addDoc(mainCollectionRef, data)
    for (const subCollectionRef of subCollectionRefs) {
      await setDoc(doc(subCollectionRef, docRef.id), {
        ref: docRef,
      })
    }

    return docRef
  } catch (error) {
    console.error('Error saving document:', error)
    throw error
  }
}

export const saveRestaurant = async (ownerUid, restaurantData) => {
  const restaurantRef = collection(db, 'restaurants')
  const ownerRestaurantsRef = collection(
    db,
    'users',
    ownerUid,
    'ownedRestaurants'
  )

  return await saveDocumentWithSubCollection(restaurantRef, restaurantData, [
    ownerRestaurantsRef,
  ])
}

export const fetchRestaurantsByUser = async (userId) => {
  const ownerRestaurantsRef = collection(
    db,
    'users',
    userId,
    'ownedRestaurants'
  )

  return await fetchCollection(ownerRestaurantsRef, true)
}

export const savePromotion = async (promotionData) => {
  const promotionRef = collection(db, 'promotions')
  console.log(promotionData)
  const restaurantPromotionsRef = collection(
    db,
    'restaurants',
    promotionData.restaurantId,
    'promotions'
  )

  return await saveDocumentWithSubCollection(promotionRef, promotionData, [
    restaurantPromotionsRef,
  ]).id
}

export const updatePromotion = async (promotionId, promotionData) => {
  const promotionRef = doc(db, 'promotions', promotionId)
  await setDoc(promotionRef, promotionData, { merge: true })
}

export const saveReservation = async (reservationData) => {
  const reservationRef = collection(db, 'reservations')
  const restaurantReservationsRef = collection(
    db,
    'restaurants',
    reservationData.restaurantId,
    'reservations'
  )
  const promotionReservationsRef = collection(
    db,
    'promotions',
    reservationData.promotionId,
    'reservations'
  )
  const userReservationsRef = collection(
    db,
    'users',
    reservationData.createdBy,
    'reservations'
  )

  return await saveDocumentWithSubCollection(reservationRef, reservationData, [
    restaurantReservationsRef,
    promotionReservationsRef,
    userReservationsRef,
  ]).id
}

export const fetchReservationsByUserWithRestaurantData = async (userId) => {
  const reservations = await fetchReservationsByUser(userId)

  const updatedReservations = {}
  for (const [id, reservation] of Object.entries(reservations)) {
    const restaurantRef = doc(db, 'restaurants', reservation.restaurantId)
    const restaurantSnap = await getDoc(restaurantRef)
    if (restaurantSnap.exists()) {
      updatedReservations[id] = {
        ...reservation,
        restaurantData: restaurantSnap.data(),
      }
    } else {
      updatedReservations[id] = { ...reservation }
    }
  }

  return updatedReservations
}

export const fetchReservationsByPromotion = async (promotionId) => {
  const reservationsRef = collection(
    db,
    'promotions',
    promotionId,
    'reservations'
  )
  return await fetchCollection(reservationsRef, true)
}

export const fetchRestaurants = async () => {
  const restaurantsRef = collection(db, 'restaurants')
  return await fetchCollection(restaurantsRef)
}

export const fetchPromotionsByRestaurant = async (restaurantId) => {
  const promotionsRef = collection(
    db,
    'restaurants',
    restaurantId,
    'promotions'
  )

  return await fetchCollection(promotionsRef, true)
}

export const fetchRestaurantsWithPromotions = async () => {
  const fetchedRestaurants = await fetchRestaurants()

  const allPromotions = await Promise.all(
    Object.entries(fetchedRestaurants).map(
      async ([restaurant, restaurantData]) => {
        const restaurantPromotions = await fetchPromotionsByRestaurant(
          restaurant
        )
        return [
          restaurant,
          { ...restaurantData, promotions: restaurantPromotions },
        ]
      }
    )
  )

  return Object.fromEntries(allPromotions)
}

export const fetchReservationsByUser = async (userId) => {
  const reservationsRef = collection(db, 'users', userId, 'reservations')
  return await fetchCollection(reservationsRef, true)
}

export const updateReservation = async (reservationId, reservationData) => {
  try {
    const reservationRef = doc(db, 'reservations', reservationId)
    await updateDoc(reservationRef, reservationData)
  } catch (error) {
    console.error('Error cancelling reservation:', error)
    throw error
  }
}

export const cancelReservation = async (reservationId, reservationData) => {
  await updateReservation(reservationId, { cancelled: true })
  // Update quantity of promotion to reflect cancellation of party
  await updatePromotion(reservationData.promotionId, {
    quantityAvailable: increment(reservationData.partySize),
  })
}
