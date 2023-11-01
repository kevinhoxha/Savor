// pages/reservations.js

import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native-web';
import Link from 'next/link';

function ReservationsPage() {
  const [location, setLocation] = useState('');

  // Sample hardcoded restaurant data
  const restaurants = [
    {
      name: 'Pasta Palace',
      address: '123 Noodle St, Food City',
      cuisine: 'Italian',
      starRating: 4.5,
      reservations: ['6:00 PM', '6:30 PM', '7:00 PM'],
      discount: '20% off entire bill'
    },
    {
      name: 'Sushi Central',
      address: '456 Fish Ln, Food City',
      cuisine: 'Japanese',
      starRating: 4.7,
      reservations: ['7:00 PM', '8:00 PM'],
      discount: 'Free Appetizers'
    }
  ];

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
          <Text style={styles.restaurantInfo}>Rating: {restaurant.starRating} stars</Text>

          <View style={styles.reservationButtons}>
            {restaurant.reservations.map((time, idx) => (
              <Button key={idx} title={time} onPress={() => {/* handle reservation logic */}} style={styles.reservationButton} />
            ))}
          </View>
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
  reservationButtons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  reservationButton: {
    marginHorizontal: 5,
    marginRight: 10,
  },
});

export default ReservationsPage;
