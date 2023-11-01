// pages/login.js

import React, { useState } from 'react';
import Link from 'next/link';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native-web';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Logic to handle login
    // e.g., API call to backend
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Savor</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        style={styles.input}
        keyboardType="email-address"
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        style={styles.input}
        secureTextEntry
      />

      <Button title="Login" onPress={handleLogin} />

      <View style={styles.linksContainer}>
        <Link href="/forgot-password">
          <Text style={styles.linkText}>Forgot Password?</Text>
        </Link>
        <Link href="/register">
          <Text style={styles.linkText}>Don't have an account? Register</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  linksContainer: {
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkText: {
    marginTop: 10,
    color: 'blue',
  },
});

export default LoginPage;
