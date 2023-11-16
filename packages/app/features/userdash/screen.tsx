"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'solito/router';
import { Text, View, TextInput } from 'dripsy';
import { getRestaurants } from 'app/utils/firebaseUtils';
import { Restaurant } from 'app/types/schema';
import { useAuth } from "app/context/AuthContext";
import { TextButton } from 'app/components/Button'; // Replace with your TextButton component

function UserDashboardScreen() {
const [location, setLocation] = useState('');
const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
const { currentUser, userDetails } = useAuth();
const router = useRouter();

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
    <View sx={styles.container}>
      <View sx={styles.header}>
        <TextInput
          value={location}
          onChangeText={setLocation}
          placeholder="Choose location"
          sx={styles.locationInput}
        />
        <TextButton onPress={() => router.push('/account')}>My Account</TextButton>
      </View>

      {restaurants.map((restaurant, index) => (
        <View key={index} sx={styles.restaurantCard}>
          <View sx={styles.cardHeader}>
            <Text sx={styles.restaurantName}>{restaurant.name}</Text>
            <Text sx={styles.discount}>{restaurant.discount}</Text>
          </View>
          <Text sx={styles.restaurantInfo}>{restaurant.address}</Text>
          <Text sx={styles.restaurantInfo}>{restaurant.cuisine}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = {
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
};

export default UserDashboardScreen;