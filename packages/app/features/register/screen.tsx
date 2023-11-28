// "use client";

import React, { useState } from 'react'
import { useRouter } from 'solito/router'
import { Text, View, TextInput, useSx, SafeAreaView } from 'dripsy'
import { useAuth } from 'app/context/AuthContext'
import { Picker } from '@react-native-picker/picker'
import { ButtonLink, TextButton } from 'app/components/Button'
import {Image} from 'react-native'

function RegisterPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [accountType, setAccountType] = useState('Diner')
  const { handleRegister } = useAuth()
  const router = useRouter()
  const sx = useSx()

  const onRegisterPress = async () => {
    try {
      await handleRegister(
        email,
        password,
        firstName,
        lastName,
        phone,
        accountType
      )

      // Redirect the user based on account type
      if (accountType === 'Diner') {
        router.push('/userdash')
      } else if (accountType === 'Restaurant Owner') {
        router.push('/register-restaurant')
      }
    } catch (error) {
      // Handle and display error messages to the user.
      console.log('Registration error:', error)
    }
  }

  return (
    <SafeAreaView sx={styles.container}>
      <Image
        source={{ uri: 'https://i.imgur.com/J2ojaVm.jpeg' }}
        width={325}
        height={325}
        onLayout={() => {}}
        style={{ marginBottom: 10, borderRadius: 15 }}
        alt="logo"
      />
      <TextInput
        value={firstName}
        onChangeText={setFirstName}
        placeholder="First Name"
        placeholderTextColor="black"
        sx={styles.input}
      />
      <TextInput
        value={lastName}
        onChangeText={setLastName}
        placeholder="Last Name"
        placeholderTextColor="black"
        sx={styles.input}
      />
      <TextInput
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        placeholder="Phone Number"
        placeholderTextColor="black"
        sx={styles.input}
      />
      <TextInput
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholder="Email"
        placeholderTextColor="black"
        sx={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor="black"
        sx={styles.input}
        secureTextEntry
      />
      <View sx={styles.pickerContainer}>
        <Text style={styles.label}>Account Type:</Text>
        <Picker
          style={styles.picker}
          selectedValue={accountType}
          onValueChange={(itemValue) => setAccountType(itemValue)}
        >
          <Picker.Item label="Diner" value="Diner" />
          <Picker.Item label="Restaurant Owner" value="Restaurant Owner" />
        </Picker>
      </View>
      <TextButton onPress={onRegisterPress}>Register</TextButton>
      <View sx={styles.loginCotainer}>
        <Text>Already have an account?</Text>
        <ButtonLink href="/login">Login</ButtonLink>
      </View>
    </SafeAreaView>
  )
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'top',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ddf4fa',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '90%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
    backgroundColor: 'white',
  },
  linksContainer: {
    marginTop: 20,
  },
  linkText: {
    marginTop: 10,
    color: 'blue',
  },
  loginCotainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    gap: 10,
  },
}

export default RegisterPage
