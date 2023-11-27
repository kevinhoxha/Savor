import React, { useState } from 'react'
import { View, TextInput, Text, Pressable, useSx } from 'dripsy'
import { ButtonLink, TextButton } from 'app/components/Button'
import { useAuth } from 'app/context/AuthContext'
import { useRouter } from 'solito/router'

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
    <View sx={styles.container}>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor="black"
        sx={styles.input}
      />
      <TextInput
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor="black"
        sx={styles.input}
      />
      <View sx={{ flexDirection: 'row' }}>
        <View sx={{marginRight: 20}}>
          <TextButton onPress={onLoginPress}>Login</TextButton>
        </View>
        <ButtonLink href="/register">Register</ButtonLink>
      </View>
    </View>
  )
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
}

export default LoginScreen
