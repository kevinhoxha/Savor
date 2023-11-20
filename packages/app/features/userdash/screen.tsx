"use client";

import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'solito/router';
import { Picker } from '@react-native-picker/picker'
import moment from 'moment';
import Modal from 'app/components/Modal'
import { Text, View, TextInput } from 'dripsy';
import { getRestaurants, getPromotions, saveReservation } from 'app/utils/firebaseUtils';
import { Restaurant } from 'app/types/schema';
import { useAuth } from "app/context/AuthContext";
import { TextButton } from 'app/components/Button'; // Replace with your TextButton component
import DateTimePicker from '../../../../apps/next/components/DateTimePicker';


function UserDashboardScreen() {
  const [location, setLocation] = useState('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [restaurantPromotions, setRestaurantPromotions] = useState(new Map());
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRestaurant, setCurrentRestaurant] = useState('')
  const [partySize, setPartySize] = useState(1)
  const [reservationTime, setReservationTime] = useState(new Date())
  const [currentPromotion, setCurrentPromotion] = useState('')


  const { currentUser, userDetails } = useAuth();
  const router = useRouter();

  function handleReserveButton(restaurant, promotion) {
    setModalVisible(true)
    setCurrentRestaurant(restaurant)
    setCurrentPromotion(promotion)
  }

  const handleConfirmReservation = async () => {
    const reservation = {
      restaurantId: currentRestaurant.id,
      reservationTime: Date.parse(reservationTime) / 1000,
      partySize: partySize,
      createdBy: currentUser.uid,
      discount: currentPromotion.discountPercentage,
    }
    try {
      await saveReservation(reservation)
      alert('Reservation created successfully!')
      setPartySize(1);
      setReservationTime(new Date());
      currentPromotion.quantityAvailable -= 1;
      // Close the modal
      setModalVisible(false);
    } catch (error) {
      console.error('Error saving reservation:', error)
      alert('Failed to create reservation')
    }
  }

  const handleDateTimeChange = (selectedDate) => {
    if (selectedDate >= new Date(moment(currentPromotion.startTime.seconds * 1000)) && selectedDate <= new Date(moment(currentPromotion.endTime.seconds * 1000)) && selectedDate >= new Date()) {
      setReservationTime(selectedDate);
    }
    else {  
      alert('Please select a future time between ' + moment(currentPromotion.startTime.seconds * 1000).format('MMMM Do YYYY, h:mm a') + ' and ' + moment(currentPromotion.endTime.seconds * 1000).format('MMMM Do YYYY, h:mm a'))
    }
  };


  useEffect(() => {
    const fetchDashboardData = async () => {
      const fetchedRestaurants = await getRestaurants();
      setRestaurants(fetchedRestaurants);

        const allPromotions = await Promise.all(
          fetchedRestaurants.map(async (restaurant) => {
            const restaurantPromotions = await getPromotions(restaurant.id);
            return [restaurant.id, restaurantPromotions];
          })
        );
        setRestaurantPromotions(new Map(allPromotions));
    };

    fetchDashboardData();
  }, [currentUser, userDetails]);

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

      {restaurants.map((restaurant, index) => {
        if (restaurantPromotions.has(restaurant.id) && restaurantPromotions.get(restaurant.id).length > 0) {
            return <View key={index} sx={styles.restaurantCard}>
                <View sx={styles.cardHeader}>
                    <Text sx={styles.restaurantName}>{restaurant.name}</Text>
                    <Text sx={styles.discount}>{restaurant.discount}</Text>
                </View>
                <Text sx={styles.restaurantInfo}>{restaurant.address}</Text>
                <Text sx={styles.restaurantInfo}>{restaurant.cuisine}</Text>

                {/* Display active promotions for the current restaurant */}
                {restaurantPromotions.has(restaurant.id) && (
                    <View>
                        {restaurantPromotions.get(restaurant.id).map((promotion, promoIndex) => {
                            const isPastPromotion = promotion.quantityAvailable === 0 || new Date(promotion.endTime.seconds * 1000) <= new Date();
                            if (!isPastPromotion) {
                              return (
                                <View key={promoIndex} sx={styles.promotionCard}>
                                  <View sx={styles.promotionLeft}>
                                    <Text>{promotion.title}</Text>
                                    <Text>{promotion.discountPercentage}% off</Text>
                                    <Text sx={styles.discount}>{promotion.quantityAvailable} Remaining</Text>
                                  </View>

                                  <View sx={styles.promotionRight}>
                                    <TextButton onPress={() => handleReserveButton(restaurant, promotion)}>Reserve</TextButton>
                                  </View>
                            </View>
                              );
                            }
                            return null;
                        })}
                    </View>
                )}
            </View>
        }
        return null;
    })}

<Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View sx={styles.modalView}>
          <Text sx={styles.titleText}>Reservation Details</Text>

          <Text sx={styles.reservationText}>Restaurant Name: {currentRestaurant.name}</Text>

          <Text sx={styles.reservationText}>{currentPromotion.discountPercentage}% off</Text>

          <View sx={styles.partySizeContainer}>
          <Text sx={styles.reservationText}>Party Size: </Text>
          <TouchableOpacity onPress={() => setPartySize(Math.max(1, partySize - 1))}>
            <Text sx={styles.plusMinusButton}>-</Text>
          </TouchableOpacity>
          <TextInput
            sx={styles.partySizeInput}
            value={partySize.toString()}
            onChangeText={(text) => setPartySize(parseInt(text))}
            keyboardType="numeric"
          />
          <TouchableOpacity onPress={() => setPartySize(Math.min(8, partySize + 1))}>
            <Text sx={styles.plusMinusButton}>+</Text>
          </TouchableOpacity>
        </View>

        <Text sx={styles.reservationText}>Reservation Time:</Text>

        <DateTimePicker
            date={new Date(reservationTime)}
            mode="datetime"
            onChange={(date) => handleDateTimeChange(date)}
          />

        <TextButton onPress={handleConfirmReservation}>Confirm Reservation</TextButton>

          <TextButton
            title="Cancel"
            onPress={() => {
              setModalVisible(false)
            }}
          >
            Cancel
          </TextButton>
        </View>
      </Modal>
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
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reservationText: {
    fontSize: 16,
    marginBottom: 10,
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
  promotionCard: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row', // Set flexDirection to 'row' to display left and right sides
    justifyContent: 'space-between', // Align left and right sides
  },
  promotionLeft: {
      flex: 1, // Take up the available space on the left side
  },
  promotionRight: {
      marginLeft: 10, // Add some margin to separate left and right sides
      justifyContent: 'center', // Vertically center content
      alignItems: 'flex-end', // Align items to the end (right side)
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  partySizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  partySizeInput: {
    marginLeft: 1,
    marginRight: 1,
    fontSize: 16,
    minWidth: 40,
    textAlign: 'center',
    marginBottom: 10,
  },
  plusMinusButton: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 1,
    marginBottom: 10,
  },
};

export default UserDashboardScreen;