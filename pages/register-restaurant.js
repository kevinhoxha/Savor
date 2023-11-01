// pages/registerrestaurant.js

import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native-web';

function RegisterRestaurantPage() {
  const [restaurantName, setRestaurantName] = useState('');
  const [address, setAddress] = useState('');
  const [cuisine, setCuisine] = useState('');

  const handleFinishRegistration = () => {
    // Logic to handle registration for Restaurant Owners
    // e.g., API call to backend
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
