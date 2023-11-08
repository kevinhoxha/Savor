// "use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { StyleSheet, Text, View, TextInput, Button } from "react-native-web";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [password, setPassword] = useState("");
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("");
	const [accountType, setAccountType] = useState("Diner");
	const { handleRegister } = useAuth(); 
	const router = useRouter();

	const onRegisterPress = async () => {
		try {
			await handleRegister(
				email,
				password,
				firstName,
				lastName,
				phone,
				accountType,
			);

			// Redirect the user based on account type
			if (accountType === "Diner") {
				router.push("/login");
			} else if (accountType === "Restaurant Owner") {
				router.push("/register-restaurant");
			}
		} catch (error) {
			// Handle and display error messages to the user.
			console.log("Registration error:", error);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Create an Account</Text>

			<TextInput
				value={firstName}
				onChangeText={setFirstName}
				placeholder="First Name"
				style={styles.input}
			/>

			<TextInput
				value={lastName}
				onChangeText={setLastName}
				placeholder="Last Name"
				style={styles.input}
			/>

			<TextInput
				value={password}
				onChangeText={setPassword}
				placeholder="Password"
				style={styles.input}
				secureTextEntry={true} // This will obscure the password input
			/>

			<TextInput
				value={phone}
				onChangeText={setPhone}
				placeholder="Phone Number"
				style={styles.input}
				keyboardType="phone-pad"
			/>

			<TextInput
				value={email}
				onChangeText={setEmail}
				placeholder="Email"
				style={styles.input}
				keyboardType="email-address"
			/>

			<View style={styles.pickerContainer}>
				<Text style={styles.label}>Account Type: </Text>
				<select
					value={accountType}
					onChange={(e) => setAccountType(e.target.value)}
					style={styles.picker}>
					<option value="Diner">Diner</option>
					<option value="Restaurant Owner">Restaurant Owner</option>
				</select>
			</View>

			<Button title="Register" onPress={onRegisterPress} />

			<View style={styles.linksContainer}>
				<Link href="/login">
					<Text style={styles.linkText}>
						Already have an account? Login
					</Text>
				</Link>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	title: {
		fontSize: 24,
		marginBottom: 20,
	},
	input: {
		width: "100%",
		padding: 10,
		marginBottom: 10,
		borderWidth: 1,
		borderRadius: 5,
	},
	pickerContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 10,
	},
	label: {
		marginRight: 10,
	},
	picker: {
		height: 40,
		padding: 10,
		borderWidth: 1,
		borderRadius: 5,
	},
	linksContainer: {
		marginTop: 20,
	},
	linkText: {
		marginTop: 10,
		color: "blue",
	},
});

export default RegisterPage;
