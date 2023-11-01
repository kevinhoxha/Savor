// pages/restaurantDashboard.js

import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native-web';
import Link from 'next/link';

function RestaurantDashboard() {
  const [currentRestaurant, setCurrentRestaurant] = useState('Pasta Palace');

  // Hardcoded restaurant data
  const restaurants = ['Pasta Palace', 'Sushi Central'];

  // Sample promotion data
  const currentPromotions = [
    {
      discount: '20% off entire bill',
      reservations: 15
    }
  ];

  const pastPromotions = [
    {
      discount: 'Free Appetizers',
      reservations: 25
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <select value={currentRestaurant} onChange={(e) => setCurrentRestaurant(e.target.value)} style={styles.restaurantSelector}>
          {restaurants.map((restaurant, index) => (
            <option key={index} value={restaurant}>{restaurant}</option>
          ))}
        </select>
        <Link href="/account">
          <Button title="My Account" />
        </Link>
        <Button title="New Promotion" onPress={() => {/* Logic for new promotion */}} />
      </View>

      <View style={styles.chartContainer}>
        <Text>Chart Placeholder</Text>
        {/* Placeholder for the chart */}
      </View>

      <View style={styles.promotionsSection}>
        <Text style={styles.sectionTitle}>Current Promotions</Text>
        {currentPromotions.map((promo, index) => (
          <View key={index} style={styles.promotionCard}>
            <Text>{promo.discount}</Text>
            <Text>{promo.reservations} reservations booked</Text>
          </View>
        ))}
      </View>

      <View style={styles.promotionsSection}>
        <Text style={styles.sectionTitle}>Past Promotions</Text>
        {pastPromotions.map((promo, index) => (
          <View key={index} style={styles.promotionCard}>
            <Text>{promo.discount}</Text>
            <Text>{promo.reservations} reservations booked</Text>
          </View>
        ))}
      </View>
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
  restaurantSelector: {
    flex: 1,
    marginRight: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  chartContainer: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  promotionsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  promotionCard: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
});

export default RestaurantDashboard;
