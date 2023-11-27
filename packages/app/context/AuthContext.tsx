'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { registerUser, loginUser, signOutUser } from 'app/utils/firebaseUtils'
import { DocumentData } from '@firebase/firestore'

type User = any

interface UserDetails {
  email: string
  firstName: string
  lastName: string
  phone: string
  accountType: string
}

// Define the context type
interface AuthContextType {
  currentUser: User | null
  userDetails: UserDetails | DocumentData | null | undefined
  handleLogin: (
    email: string,
    password: string
  ) => Promise<{
    user: User | null
    userDetails: UserDetails | DocumentData | null
  }>
  handleRegister: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone: string,
    accountType: string
  ) => Promise<void>
  handleSignOut: () => Promise<void>
  loading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userDetails: null,
  handleLogin: async () => ({ user: null, userDetails: null }),
  handleRegister: async () => {},
  handleSignOut: async () => {},
  loading: true,
  error: null,
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userDetails, setUserDetails] = useState<
    UserDetails | DocumentData | null | undefined
  >(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    let userVal, userDetailsVal

    try {
      const { user, userDetails } = await loginUser(email, password)
      userVal = user
      userDetailsVal = userDetails
      setCurrentUser(user)
      setUserDetails(userDetails)
    } catch (error) {
      console.error('Login Error:', error.message)
      setError(error.message)
    } finally {
      setLoading(false)
    }

    return { user: userVal, userDetails: userDetailsVal }
  }

  const handleRegister = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone: string,
    accountType: string
  ) => {
    try {
      setLoading(true)
      setError(null)
      const { user } = await registerUser({
        email,
        password,
        firstName,
        lastName,
        phone,
        accountType,
      })

      if (!user) {
        handleLogin(email, password)
      }

      setCurrentUser(user)
      setUserDetails({
        email,
        firstName,
        lastName,
        phone,
        accountType,
      })
    } catch (error) {
      console.error('Registration Error:', error.message)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOutUser();
      setCurrentUser(null);
      setUserDetails(null);
    } catch (error) {
      console.error('Sign Out Error:', error.message);
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
    setLoading(false)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userDetails,
        handleLogin,
        handleRegister,
        handleSignOut,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
