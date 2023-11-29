'use client'

import React, { useState } from 'react'
import { useRouter } from 'solito/router'
import { Text, View, TextInput, ScrollView } from 'dripsy'
import { useAuth } from 'app/context/AuthContext'
import { saveRestaurant } from 'app/utils/firebaseUtils'
import { TextButton } from 'app/components/Button'
import { SolitoImage } from 'solito/image'
import ImagePicker from 'react-native-image-picker'

function RegisterRestaurantScreen() {
  const [restaurantName, setRestaurantName] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')
  const [cuisine, setCuisine] = useState('')
  const [imageUri, setImageUri] = useState('')
  const { currentUser } = useAuth()
  const router = useRouter()

  const selectImage = async () => {
    await ImagePicker.launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker')
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage)
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0]!.uri!
        setImageUri(uri)
      }
    })
  }

  const handleFinishRegistration = async () => {
    if (currentUser) {
      const restaurantData = {
        ownerId: currentUser.uid,
        name: restaurantName,
        address: {
          address: address,
          city: city,
          state: state,
          zip: zip,
        },
        cuisine: cuisine,
      }

      try {
        await saveRestaurant(currentUser.uid, restaurantData)
        console.log('Restaurant registration successful')
        setRestaurantName('')
        setAddress('')
        setCity('')
        setState('')
        setZip('')
        setCuisine('')
        router.push('/ownerdash')
      } catch (error) {
        console.error('Error registering restaurant:', error)
        // Handle the error
      }
    } else {
      console.error(
        'No current user found. User must be logged in to register a restaurant.'
      )
      // Redirect to login
      router.push('/login')
    }
  }

  return (
    <ScrollView contentContainerSx={styles.container}>
      <Text sx={styles.title}>Restaurant Account Details</Text>

      <TextInput
        value={restaurantName}
        onChangeText={setRestaurantName}
        placeholder="Restaurant Name"
        placeholderTextColor="black"
        sx={styles.input}
      />

      <TextInput
        value={address}
        onChangeText={setAddress}
        placeholder="Address"
        placeholderTextColor="black"
        sx={styles.input}
      />

      <TextInput
        value={city}
        onChangeText={setCity}
        placeholder="City"
        placeholderTextColor="black"
        sx={styles.input}
      />

      <TextInput
        value={state}
        onChangeText={setState}
        placeholder="State"
        placeholderTextColor="black"
        sx={styles.input}
      />

      <TextInput
        value={zip}
        onChangeText={setZip}
        placeholder="Zip"
        placeholderTextColor="black"
        sx={styles.input}
      />

      <TextInput
        value={cuisine}
        onChangeText={setCuisine}
        placeholder="Cuisine"
        placeholderTextColor="black"
        sx={styles.input}
      />

      <TextButton style={styles.fileInput} onPress={selectImage}>
        Upload Restaurant Image
      </TextButton>

      {imageUri && (
        <SolitoImage
          src={imageUri}
          width={100}
          height={100}
          alt="restaurant image"
          style={styles.imagePreview}
        />
      )}

      <TextButton onPress={handleFinishRegistration}>
        Register Restaurant
      </TextButton>
    </ScrollView>
  )
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ddf4fa',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  fileInput: {
    marginBottom: 10,
    // Add styles for file input
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginBottom: 10,
    // Adjust as needed
  },
}

export default RegisterRestaurantScreen
