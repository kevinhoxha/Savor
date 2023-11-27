'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'solito/router'
import Modal from 'app/components/Modal'
import { Text, View, TextInput, ScrollView } from 'dripsy'
import {
  saveReservation,
  fetchRestaurantsWithPromotions,
  updatePromotion,
} from 'app/utils/firebaseUtils'
import { Restaurant } from 'app/types/schema'
import { useAuth } from 'app/context/AuthContext'
import { TextButton } from 'app/components/Button'
import { CrossPlatformDateTimePicker } from 'app/types/dateTimePicker'
import { formatDate } from 'app/utils/helperFunctions'

const UserDashboardScreen = ({
  DateTimePicker,
}: {
  DateTimePicker: CrossPlatformDateTimePicker
}) => {
  const [location, setLocation] = useState('')
  const [restaurants, setRestaurants] = useState<Record<string, Restaurant>>({})
  const [modalVisible, setModalVisible] = useState(false)
  const [partySize, setPartySize] = useState(1)
  const [reservationTime, setReservationTime] = useState(new Date())
  const [currentRestaurant, setCurrentRestaurant] = useState('')
  const [currentPromotion, setCurrentPromotion] = useState('')
  const { currentUser, userDetails } = useAuth()
  const router = useRouter()

  function handleReserveButton(restaurant, promotion) {
    setModalVisible(true)
    setCurrentRestaurant(restaurant)
    setCurrentPromotion(promotion)
  }

  const handleConfirmReservation = async () => {
    const reservation = {
      restaurantId: currentRestaurant,
      promotionId: currentPromotion,
      reservationTime: reservationTime,
      partySize: partySize,
      createdBy: currentUser.uid,
      discount:
        restaurants[currentRestaurant]!.promotions![currentPromotion]!
          .discountPercentage,
    }
    try {
      await saveReservation(reservation)
      const newPromotionData = {
        ...restaurants[currentRestaurant]!.promotions![currentPromotion]!,
        quantityAvailable:
          restaurants[currentRestaurant]!.promotions![currentPromotion]!
            .quantityAvailable - partySize,
      }

      restaurants[currentRestaurant]!.promotions![currentPromotion] = newPromotionData

      await updatePromotion(currentPromotion, newPromotionData)

      setPartySize(1)
      setReservationTime(new Date())
      setModalVisible(false)
      alert('Reservation created successfully!')
    } catch (error) {
      console.error('Error saving reservation:', error)
      alert('Failed to create reservation')
    }
  }

  const handleDateTimeChange = (selectedDate) => {
    const currPromotionData =
      restaurants[currentRestaurant]!.promotions![currentPromotion]!

    const startDate = currPromotionData.startTime.toDate()
    const endDate = currPromotionData.endTime.toDate()

    if (
      selectedDate >= startDate &&
      selectedDate >= new Date() &&
      selectedDate <= endDate
    ) {
      setReservationTime(selectedDate)
    } else {
      alert(
        `Please select a future time between ${formatDate(
          startDate
        )} and ${formatDate(endDate)}`
      )
    }
  }

  useEffect(() => {
    if (!currentUser) {
      console.error('No current user found. User must be logged in')
      router.push('/login')
      return
    }

    fetchRestaurantsWithPromotions()
      .then((restaurantsWithPromotions) => {
        setRestaurants(restaurantsWithPromotions)
      })
      .catch((error) => {
        console.error('Error fetching restaurants: ', error)
      })
  }, [currentUser, userDetails])

  return (
    <ScrollView sx={styles.container}>
      <View sx={styles.header}>
        <TextInput
          value={location}
          onChangeText={setLocation}
          placeholder="Choose location"
          sx={styles.locationInput}
        />
        <TextButton onPress={() => router.push('/account')}>
          My Account
        </TextButton>
      </View>

      <View>
        {Object.entries(restaurants)
          .filter(([restaurant, data]) => data.promotions)
          .map(([restaurant, data], index) => (
            <View key={index} sx={styles.restaurantCard}>
              <View sx={styles.cardHeader}>
                <Text sx={styles.restaurantName}>{data.name}</Text>
                {/* <Text sx={styles.discount}>{data.discount}</Text> */}
              </View>
              <Text sx={styles.restaurantInfo}>{data.address}</Text>
              <Text sx={styles.restaurantInfo}>{data.cuisine}</Text>

              {/* Display active promotions for the current restaurant */}
              {restaurants[restaurant]?.promotions && (
                <View>
                  {Object.entries(restaurants[restaurant]!.promotions!).map(
                    ([promotionId, promotion], promoIndex) => {
                      const isPastPromotion =
                        promotion.quantityAvailable === 0 ||
                        new Date(promotion.endTime.seconds * 1000) <= new Date()

                      if (!isPastPromotion) {
                        return (
                          <View key={promoIndex} sx={styles.promotionCard}>
                            <View sx={styles.promotionLeft}>
                              <Text>{promotion.title}</Text>
                              <Text>{promotion.discountPercentage}% off</Text>
                              <Text sx={styles.discount}>
                                {promotion.quantityAvailable} Remaining
                              </Text>
                            </View>

                            <View sx={styles.promotionRight}>
                              <TextButton
                                onPress={() =>
                                  handleReserveButton(restaurant, promotionId)
                                }
                              >
                                Reserve
                              </TextButton>
                            </View>
                          </View>
                        )
                      }
                    }
                  )}
                </View>
              )}
            </View>
          ))}
      </View>

      {modalVisible && (
        <Modal
          visible={modalVisible}
          onRequestClose={() => setModalVisible(!modalVisible)}
        >
          <View sx={styles.modalView}>
            <Text sx={styles.titleText}>Reservation Details</Text>

            <Text sx={styles.reservationText}>
              Restaurant Name: {restaurants[currentRestaurant]!.name}
            </Text>

            <Text sx={styles.reservationText}>
              {
                restaurants[currentRestaurant]!.promotions![currentPromotion]!
                  .discountPercentage
              }
              % off
            </Text>

            <View sx={styles.partySizeContainer}>
              <Text sx={styles.reservationText}>Party Size: </Text>
              <TextButton
                onPress={() => setPartySize(Math.max(1, partySize - 1))}
              >
                -
              </TextButton>
              <TextInput
                sx={styles.partySizeInput}
                value={partySize ? partySize.toString() : ''}
                onChangeText={(text) => setPartySize(parseInt(text))}
                keyboardType="numeric"
              />
              <TextButton
                onPress={() =>
                  setPartySize(
                    Math.min(
                      8,
                      partySize + 1,
                      restaurants[currentRestaurant]!.promotions![currentPromotion]!.quantityAvailable
                    )
                  )
                }
              >
                +
              </TextButton>
            </View>

            <Text sx={styles.reservationText}>Reservation Time:</Text>

            <DateTimePicker
              date={restaurants[currentRestaurant]!.promotions![
                currentPromotion
              ]!.startTime.toDate()}
              mode="datetime"
              onChange={(date) => handleDateTimeChange(date)}
            />

            <TextButton onPress={handleConfirmReservation}>
              Confirm Reservation
            </TextButton>

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
      )}
    </ScrollView>
  )
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
}

export default UserDashboardScreen
