import React, { useState, useEffect } from 'react'
import { View, Text, useSx, ScrollView, SafeAreaView} from 'dripsy'
import { ButtonLink, TextButton } from 'app/components/Button'
import { useAuth } from 'app/context/AuthContext'
import { useRouter } from 'solito/router'
import {
  fetchRestaurantsByUser,
  fetchReservations,
  cancelReservation,
} from 'app/utils/firebaseUtils'
import { Reservation, Restaurant } from 'app/types/schema'
import { formatDate } from 'app/utils/helperFunctions'

const AccountScreen = () => {
  const { currentUser, userDetails } = useAuth()
  const [restaurants, setRestaurants] = useState<Record<string, Restaurant>>({})
  const [reservations, setReservations] = useState<Record<string, Reservation>>(
    {}
  )
  const sx = useSx()
  const router = useRouter()

  useEffect(() => {
    if (!currentUser) {
      console.error('No current user found. User must be logged in')
      router.push('/login')
      return
    }

    fetchReservations(currentUser.uid)
      .then((myReservations) => {
        setReservations(myReservations as Record<string, Reservation>)
      })
      .catch((error) => {
        console.error('Error fetching reservations: ', error)
      })
    if (userDetails?.accountType === 'Restaurant Owner') {
      fetchRestaurantsByUser(currentUser.uid)
        .then((ownedRestaurants) => {
          setRestaurants(ownedRestaurants as Record<string, Restaurant>)
        })
        .catch((error) => {
          console.error('Error fetching restaurants: ', error)
        })
    }
  }, [currentUser, userDetails])

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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ddf4fa' }}>
    <ScrollView sx={styles.container}>
      <Text sx={styles.header}>Account Information</Text>

      <View sx={styles.infoContainer}>
        <Text sx={styles.label}>Name:</Text>
        <Text>
          {userDetails?.firstName} {userDetails?.lastName}
        </Text>
      </View>

      <View sx={styles.infoContainer}>
        <Text sx={styles.label}>Email:</Text>
        <Text>{currentUser?.email}</Text>
      </View>

      <View sx={styles.infoContainer}>
        <Text sx={styles.label}>Phone Number:</Text>
        <Text>{userDetails?.phone}</Text>
      </View>

      {userDetails?.accountType === 'Restaurant Owner' && (
        <View>
          <Text sx={styles.subheader}>Your Restaurants:</Text>
          {Object.entries(restaurants).map(([id, restaurant], index) => (
            <View key={index} sx={styles.restaurantCard}>
              <Text>{restaurant.name}</Text>
              <Text>{restaurant.address}</Text>
            </View>
          ))}
        </View>
      )}

      <View>
        <Text sx={styles.subheader}>Your Reservations:</Text>
        {Object.entries(reservations).map(([id, reservation], index) => (
          <View
            key={index}
            sx={styles.reservationCard}
            style={{
              backgroundColor: reservation.cancelled ? '#ffcccc' : 'white',
            }}
          >
            <Text>Restaurant ID: {reservation.restaurantId}</Text>
            <Text>Promotion ID: {reservation.promotionId}</Text>
            <Text>Discount: {reservation.discount}%</Text>
            <Text>Party Size: {reservation.partySize}</Text>
            <Text>
              {`Reservation Time: ${formatDate(
                reservation.reservationTime.toDate()
              )}`}
            </Text>
            {reservation.cancelled ? (
              <Text sx={styles.cancelledText}>Cancelled</Text>
            ) : (
              <TextButton
                onPress={() => handleCancelReservation(id, reservation)}
                sx={styles.cancelButton}
                textProps={{ style: styles.cancelButtonText }}
              >
                Cancel Reservation
              </TextButton>
            )}
          </View>
        ))}
      </View>

      <TextButton
        onPress={() => {
          /* Logic to change password */
        }}
        sx={styles.changePasswordButton}
      >
        Change Password
      </TextButton>
    </ScrollView>
    </SafeAreaView>
  )
}

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
  reservationCard: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  changePasswordButton: {
    marginTop: 20,
  },
  cancelledText: {
    color: 'red',
    fontStyle: 'italic',
  },
  cancelButton: {
    backgroundColor: '#ff6347', // Tomato color for cancel button
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 14,
  },
}

export default AccountScreen
