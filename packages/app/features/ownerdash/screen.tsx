'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'solito/router'
import { Text, View, TextInput, useSx, Row, ScrollView } from 'dripsy'
import RNPickerSelect from 'react-native-picker-select'
import { TouchableOpacity } from 'react-native'
import { Bars4Icon } from 'react-native-heroicons/outline'
import { CrossPlatformDateTimePicker } from 'app/types/dateTimePicker'
import Modal from 'app/components/Modal'
import { TextButton } from 'app/components/Button'
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
  const [isButtonsVisible, setIsButtonsVisible] = useState(false)
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

  const handleCancelReservation = async (reservationId, reservationData) => {
    try {
      await cancelReservation(reservationId, reservationData)
      alert('Reservation cancelled successfully')
      setReservations((prevState) => ({
        ...prevState,
        [reservationId]: {...reservationData, cancelled: true},
      }))
    } catch (error) {
      console.error('Error cancelling reservation:', error)
      alert('Failed to cancel reservation')
    }
  }

  return (
    <ScrollView sx={styles.container}>
      <View sx={{ flexDirection: 'row', alignItems: 'center' }}>
        <View sx={{ flex: 1, marginRight: 10 }}>
          {/* @ts-ignore */}
          <RNPickerSelect
            onValueChange={(value) => setCurrentRestaurant(value)}
            items={Object.entries(restaurants).map(([key, restaurant]) => ({
              label: restaurant.name,
              value: key,
              key: key,
            }))}
            value={currentRestaurant}
            style={{
              inputIOS: sx({
                color: 'black',
                fontSize: 16,
                paddingVertical: 12,
                paddingHorizontal: 10,
                borderRadius: 4,
                backgroundColor: 'white',
                borderColor: 'gray',
                borderWidth: 1,
                textAlign: 'center',
              }),
            }}
            placeholder={{
              label: 'Select a Restaurant',
              value: null,
            }}
          />
        </View>

        <TouchableOpacity onPress={() => setIsButtonsVisible(true)}>
          <Bars4Icon height={24} width={24} color="black" />
        </TouchableOpacity>

        <Modal
          animationType="slide"
          visible={isButtonsVisible}
          onRequestClose={() => setIsButtonsVisible(false)}
        >
          <View
            sx={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            <View
              sx={{
                width: 300,
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 10,
              }}
            >
              <View sx={{ marginBottom: 20 }}>
                <TextButton
                  onPress={() => {
                    setIsButtonsVisible(false)
                    router.push('/account')
                  }}
                >
                  My Account
                </TextButton>
              </View>
              <View sx={{ marginBottom: 20 }}>
                <TextButton
                  onPress={() => {
                    setIsButtonsVisible(false)
                    setModalVisible(true)
                  }}
                >
                  New Promotion
                </TextButton>
              </View>
              <View sx={{ marginBottom: 20 }}>
                <TextButton
                  onPress={() => {
                    setIsButtonsVisible(false)
                    router.push('/register-restaurant')
                  }}
                >
                  Register Restaurant
                </TextButton>
              </View>
              <TextButton onPress={() => setIsButtonsVisible(false)}>
                Close
              </TextButton>
            </View>
          </View>
        </Modal>
      </View>

      <Text sx={styles.sectionTitle}>Current Promotions</Text>
      {promotions &&
        Object.entries(promotions).map(([promotionId, promo], index) => {
          const isPastPromotion =
            promo.quantityAvailable === 0 ||
            new Date(promo.endTime.seconds * 1000) <= new Date()
          if (!isPastPromotion) {
            return (
              <View key={`promo-${index}`} style={styles.restaurantCard}>
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
          <RNPickerSelect
            onValueChange={(value) => setPromoCurrentRestaurant(value)}
            items={Object.entries(restaurants).map(([key, restaurant]) => ({
              label: restaurant.name,
              value: key,
              key: key,
            }))}
            value={promoCurrentRestaurant}
            style={{
              inputIOS: sx({
                color: 'black',
                fontSize: 16,
                paddingVertical: 12,
                paddingHorizontal: 10,
                borderRadius: 4,
                backgroundColor: 'white',
                borderColor: 'gray',
                borderWidth: 1,
                textAlign: 'center',
              }),
            }}
            placeholder={{
              label: 'Select a Restaurant',
              value: null,
            }}
          />

          <Text sx={styles.inputLabel}>Promotion Title</Text>
          <TextInput
            placeholder="Enter title"
            placeholderTextColor="black"
            value={promotionTitle}
            onChangeText={setPromotionTitle}
            sx={styles.textInput}
          />

          <Text sx={styles.inputLabel}>Discount Percentage</Text>
          <RNPickerSelect
            onValueChange={(value) => setDiscountPercentage(value)}
            items={[
              { label: '10%', value: 10 },
              { label: '20%', value: 20 },
              { label: '30%', value: 30 },
              { label: '40%', value: 40 },
              { label: '50%', value: 50 },
            ]}
            value={discountPercentage}
            style={{
              inputIOS: sx({
                color: 'black',
                fontSize: 16,
                paddingVertical: 12,
                paddingHorizontal: 10,
                borderRadius: 4,
                backgroundColor: 'white',
                borderColor: 'gray',
                borderWidth: 1,
                textAlign: 'center',
              }),
            }}
            placeholder={{
              label: 'Select a Discount',
              value: null,
            }}
          />

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
          <View sx={{ marginBottom: 10 }}>
            <Text sx={{ marginBottom: 10 }}>Start Time</Text>
            <View sx={{ marginBottom: 10 }}>
              <DateTimePicker
                date={new Date(promotionStartTime)}
                mode="datetime"
                onChange={setPromotionStartTime}
              />
            </View>
            <Text sx={{ marginBottom: 10 }}>End Time</Text>
            <DateTimePicker
              date={new Date(promotionEndTime)}
              mode="datetime"
              onChange={setPromotionEndTime}
            />
          </View>

          <View sx={{ marginBottom: 10 }}>
            <TextButton onPress={handleSavePromotion}>
              Save Promotion
            </TextButton>
          </View>

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
                <View
                  key={`reservation-${index}`}
                  sx={styles.reservationCard}
                  style={{
                    backgroundColor: reservation.cancelled
                      ? '#ffcccc'
                      : 'white',
                  }} // Change background color if cancelled
                >
                  <View sx={styles.reservationDetails}>
                    <Text>Party Size: {reservation.partySize}</Text>
                    <Text>
                      Time: {formatDate(reservation.reservationTime.toDate())}
                    </Text>
                    {reservation.cancelled && (
                      <Text sx={styles.cancelledText}>Cancelled</Text> // Indicate cancelled
                    )}
                  </View>
                  {!reservation.cancelled && (
                    <TextButton
                      onPress={() =>
                        handleCancelReservation(reservationId, reservation)
                      }
                      style={styles.cancelButton}
                      textProps={{ style: styles.cancelButtonText }}
                    >
                      Cancel
                    </TextButton>
                  )}
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
    flexWrap: 'wrap',
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
    margin: 10,
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
  cancelledText: {
    color: 'red', // Red text color for cancelled reservation
    fontStyle: 'italic', // Optional: Italicize text to emphasize
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
