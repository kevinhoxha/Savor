// pages/reservations.js

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native-web';
import Link from 'next/link';
import { getRestaurants } from '../utils/firebaseUtils';
import { useAuth } from "../context/AuthContext";

function ReservationsPage() {
  const [location, setLocation] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const { currentUser, userDetails } = useAuth();

  console.log(currentUser)
  console.log(userDetails)

  useEffect(() => {
    const fetchRestaurants = async () => {
      const fetchedRestaurants = await getRestaurants();
      setRestaurants(fetchedRestaurants);
    };

    fetchRestaurants();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          value={location}
          onChangeText={setLocation}
          placeholder="Choose location"
          style={styles.locationInput}
        />
        <Link href="/account">
          <Button title="My Account" />
        </Link>
      </View>

      {restaurants.map((restaurant, index) => (
        <View key={index} style={styles.restaurantCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <Text style={styles.discount}>{restaurant.discount}</Text>
          </View>
          <Text style={styles.restaurantInfo}>{restaurant.address}</Text>
          <Text style={styles.restaurantInfo}>{restaurant.cuisine}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationInput: {
    flex: 1,
    marginRight: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  restaurantCard: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  discount: {
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold',
  },
  restaurantInfo: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default ReservationsPage;
