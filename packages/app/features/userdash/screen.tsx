'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'solito/router'
import Modal from 'app/components/Modal'
import { Text, View, TextInput, ScrollView, SafeAreaView } from 'dripsy'
import {
  saveReservation,
  fetchRestaurantsWithPromotions,
  updatePromotion,
} from 'app/utils/firebaseUtils'
import { Promotion, Restaurant } from 'app/types/schema'
import { useAuth } from 'app/context/AuthContext'
import { TextButton } from 'app/components/Button'
import { CrossPlatformDateTimePicker } from 'app/types/dateTimePicker'
import {
  formatDate,
  groupRestaurantsByCuisine,
} from 'app/utils/helperFunctions'
import { SearchBar } from 'react-native-elements'
import RNPickerSelect from 'react-native-picker-select'
import { Image, TouchableOpacity } from 'react-native'
import { SolitoImage } from 'solito/image'

const UserDashboardScreen = ({
  DateTimePicker,
}: {
  DateTimePicker: CrossPlatformDateTimePicker
}) => {
  const [location, setLocation] = useState('')
  const [restaurantFilter, setRestaurantFilter] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('Atlanta, GA')
  const [uniqueLocations, setUniqueLocations] = useState<string[]>([])
  const [restaurants, setRestaurants] = useState<Record<string, Restaurant>>({})
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [restInfoModalVisible, setRestInfoModalVisible] =
    useState<boolean>(false)
  const [partySize, setPartySize] = useState<number>(1)
  const [reservationTime, setReservationTime] = useState<Date>(new Date())
  const [currentRestaurant, setCurrentRestaurant] = useState<string>('')
  const [currentPromotion, setCurrentPromotion] = useState<string>('')
  const { currentUser, userDetails } = useAuth()
  const router = useRouter()

  function handleReserveButton(restaurant, promotion) {
    setCurrentRestaurant(restaurant)
    setCurrentPromotion(promotion)
    setReservationTime(
      restaurants[restaurant]!.promotions![promotion]!.startTime.toDate()
    )
    setModalVisible(true)
  }

  function handleRestInfo(restaurant) {
    setCurrentRestaurant(restaurant)
    setRestInfoModalVisible(true)
  }

  function updateSearch(text: string) {
    setLocation(text)
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

      restaurants[currentRestaurant]!.promotions![currentPromotion] =
        newPromotionData

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
        const restaurantArray = Object.values(
          restaurantsWithPromotions as Record<string, Restaurant>
        )
        const locations = new Set(
          restaurantArray.map(
            (restaurant) =>
              restaurant.address.city + ', ' + restaurant.address.state
          )
        )
        setUniqueLocations(Array.from(locations))
      })
      .catch((error) => {
        console.error('Error fetching restaurants: ', error)
      })
  }, [currentUser, userDetails])

  const filteredRestaurants = Object.entries(restaurants).filter(
    ([restaurant, data]) =>
      data.address.city + ', ' + data.address.state === selectedLocation &&
      data.name.toLowerCase().includes(restaurantFilter.toLowerCase())
  )

  const groupedRestaurants = groupRestaurantsByCuisine(filteredRestaurants)

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView stickyHeaderIndices={[0]}>
        <View sx={styles.header}>
          <View
            sx={{
              flex: 1,
              flexDirection: 'row',
              width: '90%',
              justifyContent: 'space-evenly',
            }}
          >
            <Text sx={styles.welcomeText}>Hello, {userDetails?.firstName}! </Text>
            <View sx={styles.locationContainer}>
              <Text sx = {styles.locationText}>Location:  </Text>
              <RNPickerSelect
                onValueChange={(value) => setSelectedLocation(value)}
                items={uniqueLocations.map((location) => ({
                  label: location,
                  value: location,
                }))}
                style={{
                  inputIOS: ({
                    color: 'black',
                    fontSize: 14,
                    fontWeight: 'bold',
                    paddingVertical: 6,
                    textAlign: 'center',
                  }),
                }}
                placeholder={{ label: 'Select a location', value: null}}
                value={selectedLocation}
              />
            </View>
          </View>
          {/* @ts-ignore */}
          <SearchBar
            platform="ios" // or "android"
            placeholder="Search restaurants..."
            onChangeText={updateSearch as any}
            value={location}
            containerStyle={{
              backgroundColor: '#ddf4fa',
              borderBottomColor: 'transparent',
              borderTopColor: 'transparent',
              width: '100%',
            }}
            inputContainerStyle={{
              backgroundColor: 'white',
              borderRadius: 20,
            }}
            inputStyle={{
              color: 'black',
            }}
          />
        </View>
        <View sx={{ alignItems: 'center', gap: 15 }}>
          {groupedRestaurants &&
            Object.entries(groupedRestaurants).map(
              ([cuisine, restaurants]: [string, Restaurant[]]) => (
                <View
                  key={cuisine}
                  sx={{ flex: 1, paddingLeft: 10, paddingRight: 10 }}
                >
                  <Text sx={styles.cuisineHeader}>{cuisine}</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {restaurants.map((restaurant, index) => (
                      <View key={index} sx={styles.restaurantCard}>
                        {restaurant && ( // normally should be a uri link but this works for now
                          <SolitoImage
                            src={`./assets/restaurants/${restaurant.id}.jpg`}
                            style={styles.restaurantImage}
                            width={300}
                            height={200}
                            alt={restaurant.name}
                          />
                        )}
                        <View sx={styles.cardHeader}>
                          <TouchableOpacity
                            onPress={() => handleRestInfo(restaurant)}
                          >
                            <Text sx={styles.restaurantName}>
                              {restaurant.name}
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <Text sx={styles.restaurantInfo}>
                          {restaurant.address.city}
                        </Text>

                        {/* Display active promotions for the current restaurant */}
                        {restaurant.promotions && (
                          <View>
                            {Object.entries(
                              restaurant.promotions!
                            ).map(
                              (
                                [promotionId, promotion]: [string, Promotion],
                                promoIndex
                              ) => {
                                const isPastPromotion =
                                  promotion.quantityAvailable === 0 ||
                                  new Date(promotion.endTime.seconds * 1000) <=
                                    new Date()

                                if (!isPastPromotion) {
                                  return (
                                    <View
                                      key={promoIndex}
                                      sx={styles.promotionCard}
                                    >
                                      <View sx={styles.promotionLeft}>
                                        <Text>{promotion.title}</Text>
                                        <Text>
                                          {promotion.discountPercentage}% off
                                        </Text>
                                        <Text sx={styles.discount}>
                                          {promotion.quantityAvailable}{' '}
                                          Remaining
                                        </Text>
                                      </View>

                                      <View sx={styles.promotionRight}>
                                        <TextButton
                                          onPress={() =>
                                            handleReserveButton(
                                              restaurant.id!,
                                              promotionId
                                            )
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
                  </ScrollView>
                </View>
              )
            )}
        </View>

        {modalVisible && (
          <Modal
            visible={modalVisible}
            onRequestClose={() => setModalVisible(!modalVisible)}
          >
            <View sx={styles.modalView}>
              <Text sx={styles.titleText}>Reservation Details</Text>

              <Text sx={styles.reservationText}>
                {restaurants[currentRestaurant]!.name}
              </Text>

              <Text sx={styles.reservationText}>
                {
                  restaurants[currentRestaurant]!.promotions![currentPromotion]!
                    .discountPercentage
                }
                % off
              </Text>

              <View sx={styles.partySizeContainer}>
                <TextButton
                style = {{paddingX: 12, paddingY: 8, marginBottom: 10}}
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
                style = {{paddingX: 12, paddingY: 8, marginBottom: 10}}
                  onPress={() =>
                    setPartySize(
                      Math.min(
                        8,
                        partySize + 1,
                        restaurants[currentRestaurant]!.promotions![
                          currentPromotion
                        ]!.quantityAvailable
                      )
                    )
                  }
                >
                  +
                </TextButton>
              </View>

              <DateTimePicker
                style = {{marginBottom: 10, backgroundColor: 'white'}}
                date={reservationTime}
                mode="datetime"
                onChange={(date) => handleDateTimeChange(date)}
              />

              <TextButton style = {{marginBottom: 10}} onPress={handleConfirmReservation}>
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

        {restInfoModalVisible && (
          <Modal
            visible={restInfoModalVisible}
            onRequestClose={() =>
              setRestInfoModalVisible(!restInfoModalVisible)
            }
          >
            <View sx={styles.modalView}>
              <Text sx={styles.titleText}>Restaurant Information</Text>
              <View>
                <Text>Name: {restaurants[currentRestaurant]!.name}</Text>
              </View>
              <View>
                <Text>
                  Address:{' '}
                  {restaurants[currentRestaurant]!.address.address +
                    ' ' +
                    restaurants[currentRestaurant]!.address.city +
                    ', ' +
                    restaurants[currentRestaurant]!.address.state +
                    ', ' +
                    restaurants[currentRestaurant]!.address.zip}
                </Text>
              </View>
              <View>
                <Text>Cuisine: {restaurants[currentRestaurant]!.cuisine}</Text>
              </View>

              <TextButton
                title="Close"
                onPress={() => {
                  setRestInfoModalVisible(false)
                }}
              >
                Cancel
              </TextButton>
            </View>
          </Modal>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = {
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ddf4fa',
  },
  header: {
    zIndex: 1, // Ensure it stays above other elements
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#ddf4fa',
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
    marginRight: 15,
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
  cuisineHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  restaurantImage: {
    borderRadius: 10,
    marginBottom: 10,
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
  welcomeText: {
    fontSize: 14,
    paddingVertical: 6,
    fontWeight: 'bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    fontWeight: 'bold',
  },

}

export default UserDashboardScreen
