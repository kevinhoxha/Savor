"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { registerUser, loginUser } from "../utils/firebaseUtils";

const AuthContext = createContext({
	currentUser: null,
	userDetails: null,
	handleLogin: async () => {},
	handleRegister: async () => {},
	loading: true,
	error: null, 
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const [userDetails, setUserDetails] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const handleLogin = async (email, password) => {
		setLoading(true);
		setError(null);

		let userVal, userDetailsVal;

		try {
		  const { user, userDetails } = await loginUser({ email, password });
		  userVal = user;
		  userDetailsVal = userDetails;
		  setCurrentUser(user);
		  setUserDetails(userDetails);
		} catch (error) {
		  console.error("Login Error:", error.message);
		  setError(error.message);
		} finally {
			setLoading(false);
		}

		return { currentUser: userVal, userDetails: userDetailsVal };
	  };

	const handleRegister = async (
		email,
		password,
		firstName,
		lastName,
		phone,
		accountType
	) => {
		try {
			setLoading(true);
			setError(null);
			const { user } = await registerUser({
				email,
				password,
				firstName,
				lastName,
				phone,
				accountType,
			});
			setCurrentUser(user);
			setUserDetails({
				email,
				firstName,
				lastName,
				phone,
				accountType,
			});
		} catch (error) {
			console.error("Registration Error:", error.message);
			setError(error.message); 
		} finally {
			setLoading(false);
		}
	};

	// Add an effect to handle the initial loading state
	useEffect(() => {
		// Simulate a check for current authentication session here
		// For now, we'll just set loading to false
		// This is where you might check for a token, etc.
		setLoading(false);
	}, []);

	return (
		<AuthContext.Provider
			value={{
				currentUser,
				userDetails,
				handleLogin,
				handleRegister,
				loading,
				error,
			}}>
			{children}
		</AuthContext.Provider>
	);
};
