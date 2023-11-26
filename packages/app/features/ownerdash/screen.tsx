'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'solito/router'
import { Text, View, TextInput, useSx, Row } from 'dripsy'
import { Picker } from '@react-native-picker/picker'
import { CrossPlatformDateTimePicker } from 'app/types/dateTimePicker'
import Modal from 'app/components/Modal'
import { ButtonLink, TextButton } from 'app/components/Button'
import moment from 'moment'
import {
  fetchRestaurantsByUser,
  savePromotion,
  fetchPromotionsByRestaurant,
  fetchReservationsByPromotion,
  cancelReservation,
} from 'app/utils/firebaseUtils'
import { useAuth } from 'app/context/AuthContext'
import { Restaurant, Promotion, Reservation } from 'app/types/schema'
import { formatDate } from 'app/utils/helperFunctions'

const RestaurantDashboard = ({
  DateTimePicker,
}: {
  DateTimePicker: CrossPlatformDateTimePicker
}) => {
  const [currentRestaurant, setCurrentRestaurant] = useState('')
  const [promoCurrentRestaurant, setPromoCurrentRestaurant] = useState('')
  const [restaurants, setRestaurants] = useState<Record<string, Restaurant>>({})
  const [reservations, setReservations] = useState<Record<string, Reservation>>(
    {}
  )
  const [modalVisible, setModalVisible] = useState(false)
  const [reservationsModalVisible, setReservationsModalVisible] =
    useState(false)
  const [promotionTitle, setPromotionTitle] = useState('')
  const [discountPercentage, setDiscountPercentage] = useState(10)
  const [discountQuantity, setDiscountQuantity] = useState(1)
  const [promotionStartTime, setPromotionStartTime] = useState(new Date())
  const [promotionEndTime, setPromotionEndTime] = useState(new Date())
  const [promotions, setPromotions] = useState<Record<string, Promotion>>({})
  const { currentUser, userDetails } = useAuth()
  const router = useRouter()
  const sx = useSx()

  useEffect(() => {
    if (!currentUser) {
      console.error('No current user found. User must be logged in')
      router.push('/login')
      return
    }

    fetchRestaurantsByUser(currentUser.uid)
      .then((ownedRestaurants) => {
        // If there are no restaurants, prompt owner to make one.
        if (Object.keys(ownedRestaurants).length === 0) {
          router.push('/register-restaurant')
        }

        const sortedRestaurants = Object.fromEntries(
          Object.entries(ownedRestaurants).sort((a, b) =>
            a[1].name.localeCompare(b[1].name)
          )
        )

        setRestaurants(sortedRestaurants)
        const firstRestaurant = Object.keys(sortedRestaurants)[0]!

        setCurrentRestaurant(firstRestaurant)
        setPromoCurrentRestaurant(firstRestaurant)
      })
      .catch((error) => {
        console.error('Error fetching restaurants: ', error)
      })
  }, [currentUser])

  useEffect(() => {
    if (currentRestaurant) {
      fetchPromotionsByRestaurant(currentRestaurant)
        .then((fetchedPromotions) => {
          setPromotions(fetchedPromotions as Record<string, Promotion>)
        })
        .catch((error) => {
          console.error('Error fetching promotions: ', error)
        })
    }
  }, [currentRestaurant])

  const handleSavePromotion = async () => {
    const promotion = {
      restaurantId: promoCurrentRestaurant,
      title: promotionTitle,
      discountPercentage,
      quantityAvailable: discountQuantity,
      startTime: promotionStartTime,
      endTime: promotionEndTime,
      createdBy: currentUser.uid,
    }

    try {
      await savePromotion(promotion)
      alert('Promotion saved successfully!')
      setPromotionTitle('')
      setDiscountPercentage(10)
      setDiscountQuantity(1)
      setPromotionStartTime(new Date())
      setPromotionEndTime(new Date())
      // Close the modal
      setModalVisible(false)

      const fetchedPromotions = await fetchPromotionsByRestaurant(
        promoCurrentRestaurant
      )
      setPromotions(fetchedPromotions as Record<string, Promotion>)
      setCurrentRestaurant(promoCurrentRestaurant)
    } catch (error) {
      console.error('Error saving promotion:', error)
      alert('Failed to save promotion')
    }
  }

  const handleViewReservations = async (promotionId) => {
    try {
      const fetchedReservations = await fetchReservationsByPromotion(
        promotionId
      )
      setReservations(fetchedReservations as Record<string, Reservation>)
      setReservationsModalVisible(true)
    } catch (error) {
      console.error('Error fetching reservations:', error)
      alert('Failed to fetch reservations')
    }
  }

  const handleCancelReservation = async (reservationId, reservation) => {
    try {
      const { promotionId, restaurantId, createdBy } = reservation
      await cancelReservation(
        reservationId,
        restaurantId,
        promotionId,
        createdBy
      )
      alert('Reservation cancelled successfully')
      // Update reservations list
      setReservations((prevReservations: Record<string, Reservation>) =>
        prevReservations
          ? Object.fromEntries(
              Object.entries(prevReservations).filter(
                ([id, reservation]) => id !== reservationId
              )
            )
          : {}
      )
    } catch (error) {
      console.error('Error cancelling reservation:', error)
      alert('Failed to cancel reservation')
    }
  }

  return (
    <View sx={styles.container}>
      <Row sx={styles.header}>
        <View sx={styles.pickerContainer}>
          {/* @ts-ignore */}
          <Picker
            selectedValue={currentRestaurant}
            onValueChange={(itemValue, itemIndex) => {
              setCurrentRestaurant(itemValue)
              setPromoCurrentRestaurant(itemValue)
            }}
            style={styles.restaurantSelector}
            mode="dropdown"
            itemStyle={styles.restaurantSelector}
            placeholder="Restaurant Select"
          >
            {Object.entries(restaurants).map(([restaurant, data], index) => (
              <Picker.Item key={index} label={data.name} value={restaurant} />
            ))}
          </Picker>
        </View>
        <View sx={styles.headerButtonContainer}>
          <ButtonLink href="/account">My Account</ButtonLink>
          <TextButton onPress={() => setModalVisible(true)}>
            New Promotion
          </TextButton>
          <ButtonLink href="/register-restaurant">
            Register Restaurant
          </ButtonLink>
        </View>
      </Row>

      <View sx={styles.chartContainer}>
        <Text>Chart Placeholder</Text>
        {/* Placeholder for the chart */}
      </View>

      <Text sx={styles.sectionTitle}>Current Promotions</Text>
      {promotions &&
        Object.entries(promotions).map(([promotionId, promo], index) => {
          const isPastPromotion =
            promo.quantityAvailable === 0 ||
            new Date(promo.endTime.seconds * 1000) <= new Date()
          if (!isPastPromotion) {
            return (
              <View key={index} style={styles.restaurantCard}>
                <View sx={styles.cardHeader}>
                  <Text sx={styles.restaurantName}>{promo.title}</Text>
                  <Text sx={styles.discount}>
                    {promo.quantityAvailable} Remaining
                  </Text>
                </View>
                <Text>
                  Start Date:{' '}
                  {moment(promo.startTime.seconds * 1000).format(
                    'MMMM Do YYYY, h:mm a'
                  )}
                </Text>
                <Text>
                  End Date:{' '}
                  {moment(promo.endTime.seconds * 1000).format(
                    'MMMM Do YYYY, h:mm a'
                  )}
                </Text>
                <Text>Discount: {promo.discountPercentage}%</Text>
                <TextButton
                  style={styles.viewReservationsButton}
                  onPress={() => handleViewReservations(promotionId)}
                >
                  View Reservations
                </TextButton>
              </View>
            )
          }
          return null
        })}

      <Text sx={styles.sectionTitle}>Past Promotions</Text>
      {promotions &&
        Object.entries(promotions).map(([promotionId, promo], index) => {
          const isPastPromotion =
            promo.quantityAvailable === 0 ||
            new Date(promo.endTime.seconds * 1000) <= new Date()
          if (isPastPromotion) {
            return (
              <View key={index} style={styles.restaurantCard}>
                <View sx={styles.cardHeader}>
                  <Text sx={styles.restaurantName}>{promo.title}</Text>
                  <Text sx={styles.discountExpired}>
                    {promo.quantityAvailable} Remaining
                  </Text>
                </View>
                <Text>
                  Start Date:{' '}
                  {moment(promo.startTime.seconds * 1000).format(
                    'MMMM Do YYYY, h:mm a'
                  )}
                </Text>
                <Text>
                  End Date:{' '}
                  {moment(promo.endTime.seconds * 1000).format(
                    'MMMM Do YYYY, h:mm a'
                  )}
                </Text>
                <Text>Discount: {promo.discountPercentage}%</Text>
                <TextButton
                  style={styles.viewReservationsButton}
                  onPress={() => handleViewReservations(promotionId)}
                >
                  View Reservations
                </TextButton>
              </View>
            )
          }
          return null
        })}

      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
        sx={styles.modal}
      >
        <View sx={styles.modalView}>
          <Text sx={styles.inputLabel}>Restaurant</Text>
          <Picker
            selectedValue={promoCurrentRestaurant}
            onValueChange={(itemValue, itemIndex) =>
              setPromoCurrentRestaurant(itemValue)
            }
            //@ts-ignore
            style={styles.restaurantSelector}
          >
            {Object.entries(restaurants).map(([restaurant, data], index) => (
              <Picker.Item key={index} label={data.name} value={restaurant} />
            ))}
          </Picker>

          <Text sx={styles.inputLabel}>Promotion Title</Text>
          <TextInput
            placeholder="Enter title"
            placeholderTextColor="black"
            value={promotionTitle}
            onChangeText={setPromotionTitle}
            sx={styles.textInput}
          />

          <Text sx={styles.inputLabel}>Discount Percentage</Text>
          <Picker
            selectedValue={discountPercentage}
            onValueChange={(itemValue, itemIndex) =>
              setDiscountPercentage(itemValue)
            }
            // style={styles.picker}
          >
            <Picker.Item label="10%" value={10} />
            <Picker.Item label="20%" value={20} />
            <Picker.Item label="30%" value={30} />
            <Picker.Item label="40%" value={40} />
          </Picker>

          <Text sx={styles.inputLabel}>Discount Quantity</Text>
          <TextInput
            placeholder="Enter quantity"
            placeholderTextColor="black"
            value={discountQuantity.toString()}
            onChangeText={(text) => setDiscountQuantity(Number(text))}
            keyboardType="numeric"
            sx={styles.textInput}
          />

          <Text sx={styles.inputLabel}>Promotion Date and Time</Text>

          <DateTimePicker
            date={new Date(promotionStartTime)}
            mode="datetime"
            onChange={setPromotionStartTime}
          />

          <DateTimePicker
            date={new Date(promotionEndTime)}
            mode="datetime"
            onChange={setPromotionEndTime}
          />

          <TextButton onPress={handleSavePromotion}>Save Promotion</TextButton>

          <TextButton
            title="Cancel"
            onPress={() => {
              setModalVisible(false)
              setPromotionTitle('')
              setDiscountPercentage(10)
              setDiscountQuantity(1)
              setPromotionStartTime(new Date())
              setPromotionEndTime(new Date())
            }}
          >
            Cancel
          </TextButton>
        </View>
      </Modal>

      {reservationsModalVisible && (
        <Modal
          visible={reservationsModalVisible}
          onRequestClose={() => setReservationsModalVisible(false)}
        >
          <View sx={styles.modalView}>
            <Text sx={styles.titleText}>Reservations for Promotion</Text>
            {Object.entries(reservations).map(
              ([reservationId, reservation], index) => (
                <View key={index} sx={styles.reservationCard}>
                  <View sx={styles.reservationDetails}>
                    <Text>Party Size: {reservation.partySize}</Text>
                    <Text>
                      Time: {formatDate(reservation.reservationTime.toDate())}
                    </Text>
                  </View>
                  <TextButton
                    onPress={() =>
                      handleCancelReservation(reservationId, reservation)
                    }
                    style={styles.cancelButton}
                    textProps={{ style: styles.cancelButtonText }}
                  >
                    Cancel
                  </TextButton>
                </View>
              )
            )}
            <TextButton
              onPress={() => setReservationsModalVisible(false)}
              style={styles.viewReservationsButton}
            >
              Close
            </TextButton>
          </View>
        </Modal>
      )}
    </View>
  )
}

const styles = {
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    // height: 54,
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
  viewReservationsButton: {
    marginTop: 20,
  },
  reservationCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: 'white',
    padding: 10,
    marginTop: 10,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  reservationDetails: {
    flex: 1, // Take up available space, leaving room for the button
    paddingRight: 10, // Add some padding to separate from the button
  },

  cancelButton: {
    backgroundColor: '#ff6347', // Tomato color for cancel button
    padding: 8,
    borderRadius: 5,
  },

  cancelButtonText: {
    color: 'white',
    fontSize: 14,
  },
  pickerContainer: {
    flex: 1, // Allows the picker container to take up available space
    minWidth: 150, // Minimum width for smaller screens
    width: '100%',
    height: 54,
    justifyContent: 'center', // Center the picker vertically
    backgroundColor: 'white', // Background color for picker
  },
  headerButtonContainer: {
    flexDirection: 'row', // Keep buttons in a row
    flexWrap: 'wrap', // Allow buttons to wrap
    justifyContent: 'flex-end', // Push buttons to the right
    alignItems: 'center', // Align buttons vertically
    flexGrow: 1, // Allow this container to expand
  },
  button: {
    marginRight: 10,
  },
  restaurantSelector: {
    borderWidth: 1,
    borderRadius: 5,
    maxWidth: 200, // Max width for the picker
    height: '100%', // Make the picker fill the height of its container
    backgroundColor: 'white',
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  promotionCard: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
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
  inputLabel: {
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    width: '100%',
  },
  datePicker: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 4,
    marginBottom: 15,
  },
  modal: {
    // Add any specific styles for the modal here
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
  discountExpired: {
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold',
  },
}

export default RestaurantDashboard
