'use client'

import { initializeApp, getApps, getApp } from 'firebase/app'
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth'
import { ReactNativeAsyncStorage } from '@react-native-async-storage/async-storage'
import { getFirestore } from 'firebase/firestore'
import { Platform } from 'react-native'

const firebaseConfig = {
  apiKey: 'AIzaSyAdC54dnNlEYZPAIh0LaTm9_JTVrHZD4d0',
  authDomain: 'savor-d1443.firebaseapp.com',
  databaseURL: 'https://savor-d1443-default-rtdb.firebaseio.com',
  projectId: 'savor-d1443',
  storageBucket: 'savor-d1443.appspot.com',
  messagingSenderId: '881355166385',
  appId: '1:881355166385:web:a9ec8241e3f3edbfb44890',
}

let app, auth, db

if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig)
    if (Platform.OS === 'web') {
      auth = getAuth(app)
    } else {
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage),
      })
    }
  } catch (error) {
    console.log('Error initializing app: ' + error)
  }
} else {
  app = getApp()
  auth = getAuth(app)
}

db = getFirestore(app) // Initialize firestore service

export { auth, db }
