import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Pressable, useSx } from 'dripsy';
import { ButtonLink, TextButton } from 'app/components/Button';
import { useAuth } from 'app/context/AuthContext';
import { useRouter } from 'solito/router';
import {
  fetchRestaurants,
  savePromotion,
  fetchPromotions,
  fetchReservations,
} from 'app/utils/firebaseUtils';

const AccountScreen = () => {
  const { currentUser, userDetails } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const[reservations, setReservations] = useState([]);

  useEffect(() => {
    // Fetch user-specific data based on the user type (diner or restaurant owner)
    if (currentUser && userDetails) {
      if (userDetails?.accountType === 'Diner') {
        fetchReservations(currentUser.uid)
          .then((myReservations) => {
            setReservations(myReservations);
          })
          .catch((error) => {
            console.error('Error fetching reservations: ', error);
          });
        // Fetch diner-specific data
        // For example, fetch name, phone number, and email
      } else if (userDetails?.accountType === 'Restaurant Owner') {
        // Fetch restaurant owner-specific data
        // For example, fetch name, phone number, email, and list of restaurants
        fetchRestaurants(currentUser.uid)
          .then((ownedRestaurants) => {
            setRestaurants(ownedRestaurants);
          })
          .catch((error) => {
            console.error('Error fetching restaurants: ', error);
          });
      }
    }
  }, [currentUser, userDetails]);

  return (
    <View sx={styles.container}>
      <Text sx={styles.header}>Account Information</Text>

      {/* Display common user information */}
      <View sx={styles.infoContainer}>
        <Text sx={styles.label}>Name:</Text>
        <Text>{userDetails?.firstName} {userDetails?.lastName}</Text>
      </View>

      <View sx={styles.infoContainer}>
        <Text sx={styles.label}>Email:</Text>
        <Text>{currentUser.email}</Text>
      </View>

      <View sx={styles.infoContainer}>
        <Text sx={styles.label}>Phone Number:</Text>
        <Text>{userDetails?.phone}</Text>
      </View>

      {/* If the user is a restaurant owner, display restaurant information */}
      {userDetails?.accountType === 'Restaurant Owner' && (
        <>
          <Text sx={styles.subheader}>Your Restaurants:</Text>
          {/* Display list of restaurants */}
          
        </>
      )}

      {userDetails?.accountType === 'Diner' && (
        <>
          <Text sx={styles.subheader}>Your Reservations:</Text>
          {Object.values(reservations).map((reservation) => {
            <Text>{reservation.id}</Text>
          })}
        </>
      )}

      {/* Allow users to change password */}
      <TextButton sx={styles.changePasswordButton}>Change Password</TextButton>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subheader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoContainer: {
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  restaurantCard: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  changePasswordButton: {
    marginTop: 20,
  },
};

export default AccountScreen;
