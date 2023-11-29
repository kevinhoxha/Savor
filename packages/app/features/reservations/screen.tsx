import React, { useState, useEffect } from 'react'
import { View, Text, useSx, ScrollView, SafeAreaView } from 'dripsy'
import { ButtonLink, TextButton } from 'app/components/Button'
import { useAuth } from 'app/context/AuthContext'
import { useRouter } from 'solito/router'
import {
  fetchReservationsByUserWithRestaurantData,
  cancelReservation,
} from 'app/utils/firebaseUtils'
import { Reservation, Restaurant } from 'app/types/schema'
import { formatDate } from 'app/utils/helperFunctions'

const ReservationScreen = () => {
  const { currentUser, userDetails } = useAuth()
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

    fetchReservationsByUserWithRestaurantData(currentUser.uid)
      .then((myReservations) => {
        setReservations(myReservations as Record<string, Reservation>)
      })
      .catch((error) => {
        console.error('Error fetching reservations: ', error)
      })
  }, [currentUser])

  const handleCancelReservation = async (reservationId, reservationData) => {
    try {
      await cancelReservation(reservationId, reservationData)
      alert('Reservation cancelled successfully')
      setReservations((prevState) => ({
        ...prevState,
        [reservationId]: { ...reservationData, cancelled: true },
      }))
    } catch (error) {
      console.error('Error cancelling reservation:', error)
      alert('Failed to cancel reservation')
    }
  }

  return (
    <SafeAreaView sx={{ backgroundColor: '#ddf4fa', flex: 1 }}>
      <ScrollView style={{ backgroundColor: '#ddf4fa' }} sx={styles.container}>
        <View>
          <Text sx={styles.subheader}>Upcoming Reservations:</Text>
          {Object.entries(reservations).map(([id, reservation], index) => {
            const isPastReservation =
              reservation.reservationTime.toDate() <= new Date()
            if (isPastReservation) {
              return null
            }
            return (
              <View
                key={index}
                sx={styles.reservationCard}
                style={{
                  backgroundColor: reservation.cancelled ? '#ffcccc' : 'white',
                }}
              >
                <Text sx={{fontSize: 16, fontWeight: 'bold'}}>{reservation.restaurantData.name}</Text>
                <Text>
                  {`${formatDate(reservation.reservationTime.toDate())}`}
                </Text>
                <Text>
                  {reservation.discount}% Off | Party of {reservation.partySize}
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
            )
          })}
          <Text sx={styles.subheader}>Past Reservations:</Text>
          {Object.entries(reservations).map(([id, reservation], index) => {
            const isPastReservation =
              reservation.reservationTime.toDate() <= new Date()
            if (!isPastReservation) {
              return null
            }
            return (
              <View
                key={index}
                sx={styles.reservationCard}
                style={{
                  backgroundColor: reservation.cancelled ? '#ffcccc' : 'white',
                }}
              >
                <Text sx={{fontSize: 16, fontWeight: 'bold'}}>{reservation.restaurantData.name}</Text>
                <Text>
                  {`${formatDate(reservation.reservationTime.toDate())}`}
                </Text>
                <Text>
                  {reservation.discount}% Off | Party of {reservation.partySize}
                </Text>
                {reservation.cancelled && (
                  <Text sx={styles.cancelledText}>Cancelled</Text>
                )}
              </View>
            )
          })}
        </View>
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

export default ReservationScreen
