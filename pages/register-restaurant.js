"use client";

import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native-web';
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { registerRestaurant } from '../utils/firebaseUtils';

function RegisterRestaurantPage() {
  const [restaurantName, setRestaurantName] = useState('');
  const [address, setAddress] = useState('');
  const [cuisine, setCuisine] = useState('');
  const router = useRouter();
  const { currentUser } = useAuth(); 

  const handleFinishRegistration = async () => {
    if (currentUser) {
      const restaurantData = {
        ownerId: currentUser.uid,
        name: restaurantName,
        address: address,
        cuisine: cuisine,
      };

      try {
        // Call the registerRestaurant function with the current user's UID and restaurant data
        await registerRestaurant(currentUser.uid, restaurantData);
        console.log('Restaurant registration successful');
        router.push('/ownerdash');
        // Handle post-registration logic, such as redirecting to the dashboard
      } catch (error) {
        console.error('Error registering restaurant:', error);
        // Handle the error, possibly by showing an alert or message to the user
      }
    } else {
      console.error('No current user found. User must be logged in to register a restaurant.');
      // Prompt user to log in
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restaurant Account Details</Text>

      <TextInput
        value={restaurantName}
        onChangeText={setRestaurantName}
        placeholder="Restaurant Name"
        style={styles.input}
      />

      <TextInput
        value={address}
        onChangeText={setAddress}
        placeholder="Address"
        style={styles.input}
      />

      <TextInput
        value={cuisine}
        onChangeText={setCuisine}
        placeholder="Cuisine"
        style={styles.input}
      />

      <Button title="Finish Account Creation" onPress={handleFinishRegistration} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  },
});

export default RegisterRestaurantPage;
