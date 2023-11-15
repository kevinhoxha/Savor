"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
    StyleSheet,
    Text,
    View,
    Button,
    Modal,
    TextInput,
    Picker,
} from "react-native-web";
import DateTimePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Link from "next/link";
import { fetchRestaurants, savePromotion } from "../utils/firebaseUtils";
import { useAuth } from "../context/AuthContext";

function RestaurantDashboard() {
    const [currentRestaurant, setCurrentRestaurant] = useState("");
	const [promoCurrentRestaurant, setPromoCurrentRestaurant] = useState("");
    const [restaurants, setRestaurants] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [promotionTitle, setPromotionTitle] = useState("");
    const [discountPercentage, setDiscountPercentage] = useState(10);
    const [discountQuantity, setDiscountQuantity] = useState(1);
    const [promotionStartTime, setPromotionStartTime] = useState(
        new Date().toISOString()
    );
    const [promotionEndTime, setPromotionEndTime] = useState(
        new Date().toISOString()
    );
    const { currentUser, userDetails } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (currentUser) {
            fetchRestaurants(currentUser.uid)
                .then((ownedRestaurants) => {
                    setRestaurants(ownedRestaurants);
                })
                .catch((error) => {
                    console.error("Error fetching restaurants: ", error);
                });
        }
    }, [currentUser]);

	const handleSavePromotion = async () => {
		const promotion = {
			restaurantId: restaurants[promoCurrentRestaurant],
			title: promotionTitle,
			discountPercentage,
			quantityAvailable: discountQuantity,
			startTime: promotionStartTime,
			endTime: promotionEndTime,
			createdBy: currentUser.uid
		};
	
		try {
			await savePromotion(promotion);
			alert("Promotion saved successfully!");
			// You might want to reset form fields and close the modal here
		} catch (error) {
			console.error("Error saving promotion:", error);
			alert("Failed to save promotion");
		}
	};

    // Sample promotion data
    const currentPromotions = [
        {
            discount: "20% off entire bill",
            reservations: 15,
        },
    ];

    const pastPromotions = [
        {
            discount: "Free Appetizers",
            reservations: 25,
        },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <select
                    value={currentRestaurant}
                    onChange={(e) => setCurrentRestaurant(e.target.value)}
                    style={styles.restaurantSelector}
                >
                    {Object.keys(restaurants).sort((a,b) => a.localeCompare(b)).map((restaurant, index) => (
                        <option key={index} value={restaurant}>
                            {restaurant}
                        </option>
                    ))}
                </select>
                <Link href="/account">
                    <Button title="My Account" />
                </Link>
                <Button
                    title="New Promotion"
                    onPress={() => {
                        setModalVisible(true);
                    }}
                />
                <Button
                    title="Register Restaurant"
                    onPress={() => router.push("/register-restaurant")}
                />
            </View>

            <View style={styles.chartContainer}>
                <Text>Chart Placeholder</Text>
                {/* Placeholder for the chart */}
            </View>

            <View style={styles.promotionsSection}>
                <Text style={styles.sectionTitle}>Current Promotions</Text>
                {currentPromotions.map((promo, index) => (
                    <View key={index} style={styles.promotionCard}>
                        <Text>{promo.discount}</Text>
                        <Text>{promo.reservations} reservations booked</Text>
                    </View>
                ))}
            </View>

            <View style={styles.promotionsSection}>
                <Text style={styles.sectionTitle}>Past Promotions</Text>
                {pastPromotions.map((promo, index) => (
                    <View key={index} style={styles.promotionCard}>
                        <Text>{promo.discount}</Text>
                        <Text>{promo.reservations} reservations booked</Text>
                    </View>
                ))}
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalView}>
                    <Text style={styles.inputLabel}>Restaurant</Text>
                    <select
                        value={promoCurrentRestaurant}
                        onChange={(e) => setPromoCurrentRestaurant(e.target.value)}
                        style={styles.restaurantSelector}
                    >
                        {Object.keys(restaurants).sort((a,b) => a.localeCompare(b)).map((restaurant, index) => (
                            <option key={index} value={restaurant}>
                                {restaurant}
                            </option>
                        ))}
                    </select>

                    <Text style={styles.inputLabel}>Promotion Title</Text>
                    <TextInput
                        placeholder="Enter title"
                        value={promotionTitle}
                        onChangeText={setPromotionTitle}
                        style={styles.textInput}
                    />

                    <Text style={styles.inputLabel}>Discount Percentage</Text>
                    <Picker
                        selectedValue={discountPercentage}
                        onValueChange={(itemValue, itemIndex) =>
                            setDiscountPercentage(itemValue)
                        }
                        style={styles.picker}
                    >
                        <Picker.Item label="10%" value={10} />
                        <Picker.Item label="20%" value={20} />
                        <Picker.Item label="30%" value={30} />
                        <Picker.Item label="40%" value={40} />
                    </Picker>

                    <Text style={styles.inputLabel}>Discount Quantity</Text>
                    <TextInput
                        placeholder="Enter quantity"
                        value={discountQuantity.toString()}
                        onChangeText={(text) =>
                            setDiscountQuantity(Number(text))
                        }
                        keyboardType="numeric"
                        style={styles.textInput}
                    />
                    <Text style={styles.inputLabel}>
                        Promotion Date and Time
                    </Text>
                    <DateTimePicker
                        selected={new Date(promotionStartTime)}
                        mode="datetime"
                        is24Hour={true}
                        display="default"
                        showTimeSelect
                        dateFormat={"MM/dd/yyyy h:mm aa"}
                        onChange={(date) => setPromotionStartTime(date)}
                    />

                    <DateTimePicker
                        selected={new Date(promotionEndTime)}
                        mode="datetime"
                        is24Hour={true}
                        display="default"
                        showTimeSelect
                        dateFormat={"MM/dd/yyyy h:mm aa"}
                        onChange={(date) => setPromotionEndTime(date)}
                    />
                    <Button
                        title="Save Promotion"
                        onPress={() => {
                            handleSavePromotion();
                        }}
                    />
                    <Button
                        title="Cancel"
                        onPress={() => {
                            setModalVisible(false); // Close the modal
                            setPromotionTitle(""); // Reset the title
                            setDiscountPercentage(10); // Reset to default discount percentage
                            setDiscountQuantity(1); // Reset to default discount quantity
                            setPromotionStartTime(new Date().toISOString()); // Reset to current date and time
                            setPromotionEndTime(new Date().toISOString()); // Reset to current date and time
                        }}
                    />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    restaurantSelector: {
        flex: 1,
        marginRight: 10,
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
    },
    chartContainer: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        alignItems: "center",
    },
    promotionsSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
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
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    inputLabel: {
        alignSelf: "flex-start",
        marginBottom: 5,
    },
    textInput: {
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 5,
        padding: 10,
        marginBottom: 15, // Increase space between text inputs
        width: "100%", // You might want to adjust the width as per your design
    },
    datePicker: {
        width: "100%", // Ensure it takes up the full width
        padding: 10,
        borderWidth: 1,
        borderColor: "#cccccc",
        borderRadius: 4,
        marginBottom: 15,
    },
});

export default RestaurantDashboard;
