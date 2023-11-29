'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'solito/router'
import { Text, View, TextInput, useSx, Row, ScrollView, SafeAreaView } from 'dripsy'
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
} from 'app/utils/firebaseUtils'
import { useAuth } from 'app/context/AuthContext'
import { Restaurant, Promotion, Reservation } from 'app/types/schema'
import { formatDate } from 'app/utils/helperFunctions'

const CreatePromotionScreen = ({
  DateTimePicker,
}: {
  DateTimePicker: CrossPlatformDateTimePicker
}) => {
  const [promoCurrentRestaurant, setPromoCurrentRestaurant] = useState('')
  const [restaurants, setRestaurants] = useState<Record<string, Restaurant>>({})
  const [promotionTitle, setPromotionTitle] = useState('')
  const [discountPercentage, setDiscountPercentage] = useState(10)
  const [discountQuantity, setDiscountQuantity] = useState(1)
  const [promotionStartTime, setPromotionStartTime] = useState(new Date())
  const [promotionEndTime, setPromotionEndTime] = useState(new Date())
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

        setPromoCurrentRestaurant(firstRestaurant)
      })
      .catch((error) => {
        console.error('Error fetching restaurants: ', error)
      })
  }, [currentUser])


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
    } catch (error) {
      console.error('Error saving promotion:', error)
      alert('Failed to save promotion')
    }
  }

  return (
    <SafeAreaView sx={{ flex: 1, backgroundColor: '#ddf4fa' }}>
        <View sx={styles.modalView}>
        <Text sx={styles.restaurantName}>Create Promotion</Text>
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
                marginBottom: 15,
                backgroundColor: 'white',
                borderColor: 'gray',
                borderWidth: 1,
                textAlign: 'left',
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
                marginBottom: 15,
                borderWidth: 1,
                textAlign: 'left',
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

            <Text sx={styles.inputLabel}>Start Time</Text>
            <View sx={{ marginBottom: 15 }}>
              <DateTimePicker
                date={new Date(promotionStartTime)}
                mode="datetime"
                onChange={setPromotionStartTime}
                sx = {styles.datePicker}
              />
            </View>
            <Text sx={styles.inputLabel}>End Time</Text>
            <DateTimePicker
              date={new Date(promotionEndTime)}
              mode="datetime"
              onChange={setPromotionEndTime}
              sx = {styles.datePicker}
            />

          <View sx={{marginTop: 25,  marginBottom: 10 }}>
            <TextButton onPress={handleSavePromotion}>
              Save Promotion
            </TextButton>
          </View>
        </View>
        
    </SafeAreaView>
  )
}

const styles = {
  container: {
    flex: 1,
    padding: 20,
  },
  scrollview: {
    flex: 1,
    paddingTop: 20,
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
    backgroundColor: '#ddf4fa',
    padding: 35,
    alignItems: 'center',
  },
  inputLabel: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    width: '100%',
    backgroundColor: 'white',
  },
  datePicker: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 4,
    marginBottom: 15,
    backgroundColor: 'white',
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
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

export default CreatePromotionScreen
