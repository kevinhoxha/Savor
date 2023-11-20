// Import necessary modules
import React, { useState } from 'react';
import { View, Text, TextInput } from 'dripsy';
import { TextButton } from 'app/components/Button';
import { useAuth } from 'app/context/AuthContext';

// Define the ConfirmReservationScreen component
function ReserveScreen(props) {
    // Extract the reservation details from the route params
    const { data } = props.location.state


    // State for user input
    const [numberOfGuests, setNumberOfGuests] = useState('');

    // Access the current user
    const { currentUser } = useAuth();

    // Function to handle reservation confirmation
    const handleConfirmReservation = () => {
        // Perform actions to confirm the reservation (e.g., update database)

        // After confirmation, navigate to a success screen or any desired destination
    };

    return (
        <View sx={styles.container}>
            <Text sx={styles.title}>Confirm Reservation</Text>

            <Text sx={styles.info}>
                You are about to make a reservation at {data} for the promotion: {data}.
            </Text>

            <Text sx={styles.label}>Number of Guests:</Text>
            <TextInput
                value={numberOfGuests}
                onChangeText={setNumberOfGuests}
                placeholder="Enter number of guests"
                keyboardType="numeric"
                sx={styles.input}
            />

            <TextButton onPress={handleConfirmReservation}>Confirm Reservation</TextButton>
        </View>
    );
}

// Define styles
const styles = {
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    info: {
        fontSize: 16,
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
    },
    input: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
    },
};

export default ReserveScreen;