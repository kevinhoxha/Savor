"use client";

import React, { useState } from 'react';
import { useRouter } from 'solito/router';
import { Text, View, TextInput } from 'dripsy';
import { useAuth } from "app/context/AuthContext";
import { saveRestaurant } from 'app/utils/firebaseUtils';
import { TextButton } from 'app/components/Button';

function RegisterRestaurantScreen() {
  const [restaurantName, setRestaurantName] = useState('');
  const [address, setAddress] = useState('');
  const [cuisine, setCuisine] = useState('');
  const { currentUser } = useAuth(); 
  const router = useRouter();

  const handleFinishRegistration = async () => {
    if (currentUser) {
      const restaurantData = {
        ownerId: currentUser.uid,
        name: restaurantName,
        address: address,
        cuisine: cuisine,
      };

      try {
        await saveRestaurant(currentUser.uid, restaurantData);
        console.log('Restaurant registration successful');
        router.push("/ownerdash")
      } catch (error) {
        console.error('Error registering restaurant:', error);
        // Handle the error
      }
    } else {
      console.error('No current user found. User must be logged in to register a restaurant.');
      // Redirect to login
      router.push('/login');
    }
  };

  return (
    <View sx={styles.container}>
      <Text sx={styles.title}>Restaurant Account Details</Text>

      <TextInput
        value={restaurantName}
        onChangeText={setRestaurantName}
        placeholder="Restaurant Name"
        placeholderTextColor='black'
        sx={styles.input}
      />

      <TextInput
        value={address}
        onChangeText={setAddress}
        placeholder="Address"
        placeholderTextColor='black'
        sx={styles.input}
      />

      <TextInput
        value={cuisine}
        onChangeText={setCuisine}
        placeholder="Cuisine"
        placeholderTextColor='black'
        sx={styles.input}
      />

      <TextButton onPress={handleFinishRegistration}>Register Restaurant</TextButton>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ddf4fa'
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
    backgroundColor: 'white'
  },
};

export default RegisterRestaurantScreen;