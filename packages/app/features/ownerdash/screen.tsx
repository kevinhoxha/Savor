'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'solito/router'
import { Text, View, TextInput, useSx, Row } from 'dripsy'
import { Picker } from '@react-native-picker/picker'
import { CrossPlatformDateTimePicker } from 'app/types/dateTimePicker'
import Modal from 'app/components/Modal'
import { ButtonLink, TextButton } from 'app/components/Button'
import {
  fetchRestaurants,
  savePromotion,
  fetchPromotions,
} from 'app/utils/firebaseUtils'
import { useAuth } from 'app/context/AuthContext'

const RestaurantDashboard = ({
  DateTimePicker,
}: {
  DateTimePicker: CrossPlatformDateTimePicker
}) => {
  const [currentRestaurant, setCurrentRestaurant] = useState('')
  const [promoCurrentRestaurant, setPromoCurrentRestaurant] = useState('')
  const [restaurants, setRestaurants] = useState(new Map())
  const [modalVisible, setModalVisible] = useState(false)
  const [promotionTitle, setPromotionTitle] = useState('')
  const [discountPercentage, setDiscountPercentage] = useState(10)
  const [discountQuantity, setDiscountQuantity] = useState(1)
  const [promotionStartTime, setPromotionStartTime] = useState(new Date())
  const [promotionEndTime, setPromotionEndTime] = useState(new Date())
  const [promotions, setPromotions] = useState(new Map())
  const { currentUser, userDetails } = useAuth()
  const router = useRouter()
  const sx = useSx()

  useEffect(() => {
    if (currentUser) {
      fetchRestaurants(currentUser.uid)
        .then((ownedRestaurants) => {
          setRestaurants(ownedRestaurants)
        })
        .catch((error) => {
          console.error('Error fetching restaurants: ', error)
        })
    }
  }, [currentUser])

  useEffect(() => {
    if (currentRestaurant) {
      fetchPromotions(restaurants[currentRestaurant])
        .then((fetchedPromotions) => {
          console.log(fetchedPromotions)
          setPromotions(fetchedPromotions)
        })
        .catch((error) => {
          console.error('Error fetching promotions: ', error)
        })
    }
  }, [currentRestaurant])

  const handleSavePromotion = async () => {
    const promotion = {
      restaurantId: restaurants[promoCurrentRestaurant],
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
      // You might want to reset form fields and close the modal here
    } catch (error) {
      console.error('Error saving promotion:', error)
      alert('Failed to save promotion')
    }
  }

  const currentPromos = new Map(
    Object.entries(promotions).filter(
      ([id, promo]) => new Date(promo.endTime) > new Date()
    )
  )

  const pastPromos = new Map(
    Object.entries(promotions).filter(
      ([id, promo]) => new Date(promo.endTime) <= new Date()
    )
  )

  return (
    <View sx={styles.container}>
      <Row sx={styles.header}>
        <View sx={styles.pickerContainer}>
          {/* @ts-ignore */}
          <Picker
            selectedValue={currentRestaurant}
            onValueChange={(itemValue, itemIndex) =>
              setCurrentRestaurant(itemValue)
            }
            style={styles.restaurantSelector}
            mode="dropdown"
            itemStyle={styles.restaurantSelector}
            placeholder="Restaurant Select"
          >
            {Object.keys(restaurants)
              .sort((a, b) => a.localeCompare(b))
              .map((restaurant, index) => (
                <Picker.Item
                  key={index}
                  label={restaurant}
                  value={restaurant}
                />
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

      <Text>Current Promotions</Text>
      {Object.values(currentPromos).map((promo, index) => (
        <View key={index} style={styles.restaurantCard}>
          <View sx={styles.cardHeader}>
            <Text sx={styles.restaurantName}>{promo.title}</Text>
            <Text sx={styles.discount}>{promo.quantityAvailable}</Text>
          </View>
        </View>
      ))}

      <Text>Past Promotions</Text>
      {Object.values(pastPromos).map((promo, index) => (
        <View key={index} style={styles.restaurantCard}>
          <View sx={styles.cardHeader}>
            <Text sx={styles.restaurantName}>{promo.title}</Text>
            <Text sx={styles.discount}>{promo.quantityAvailable}</Text>
          </View>
        </View>
      ))}

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
            {Object.keys(restaurants)
              .sort((a, b) => a.localeCompare(b))
              .map((restaurant, index) => (
                <Picker.Item
                  key={index}
                  label={restaurant}
                  value={restaurant}
                />
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
    // flexGrow: 1, // Allow this container to expand
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
  button: {
    // Add any specific styles for buttons here
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
}

export default RestaurantDashboard
