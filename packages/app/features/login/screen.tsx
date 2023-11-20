import React, { useState } from 'react';
import { View, TextInput, Text, Pressable, useSx } from 'dripsy';
import { ButtonLink, TextButton } from 'app/components/Button';
import { useAuth } from 'app/context/AuthContext';
import { useRouter } from 'solito/router'

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin } = useAuth();
  const router = useRouter();
  const sx = useSx();

  const onLoginPress = async () => {
    try {
        const { user, userDetails } = await handleLogin(email, password); // Use the handleLogin method from AuthContext

        console.log(userDetails);
        // Redirect based on accountType which should now be updated in context
        if (userDetails?.accountType === "Diner") {
            router.push("/userdash");
        } else if (userDetails?.accountType === "Restaurant Owner") {
            router.push("/ownerdash");
        }
    } catch (error) {
        // Handle and display error messages to the user.
        console.error("Login error:", error.message);
    }
};

  return (
    <View sx={styles.container}>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor='black'
        sx={styles.input}
      />
      <TextInput
        secureTextEntry={true} 
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor='black'
        sx={styles.input}
      />
      <TextButton onPress={onLoginPress}>Login</TextButton>
      <Text>Don't have an account? <ButtonLink href="/register">Register</ButtonLink></Text>
    </View>
  );
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
  }
};

export default LoginScreen;