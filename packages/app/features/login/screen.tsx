import React, { useState } from 'react'
import { View, TextInput, Text, Pressable, useSx, SafeAreaView} from 'dripsy'
import { ButtonLink, TextButton } from 'app/components/Button'
import { useAuth } from 'app/context/AuthContext'
import { useRouter } from 'solito/router'
import {Image} from 'react-native'


function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { userDetails, handleLogin } = useAuth()
  const router = useRouter()
  const sx = useSx()
    

  const onLoginPress = async () => {
    try {
      const { user, userDetails } = await handleLogin(email, password) // Use the handleLogin method from AuthContext

      if (userDetails?.accountType === 'Diner') {
        router.push('/userdash')
      } else if (userDetails?.accountType === 'Restaurant Owner') {
        router.push('/ownerdash')
      }
    } catch (error) {
      // Handle and display error messages to the user.
      console.error('Login error:', error.message)
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
      <Text sx={styles.sectionTitle}>Sign In</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor="black"
        sx={styles.input}
        keyboardType='email-address'
      />
      <TextInput
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor="black"
        sx={styles.input}
      />
      <View sx={{ flexDirection: 'row', marginTop: 20 }}>
        <View sx={{marginRight: 20}}>
          <TextButton onPress={onLoginPress}>Login</TextButton>
        </View>
        <ButtonLink href="/register">Register</ButtonLink>
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
  input: {
    width: '90%',
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#014c73',
    marginBottom: 10,
  },
}

export default LoginScreen
