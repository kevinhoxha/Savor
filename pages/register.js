// pages/register.js

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native-web';

function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [accountType, setAccountType] = useState('Diner');
  const router = useRouter();

  const handleRegister = () => {
    if (accountType === 'Diner') {
      // Logic to handle registration for Diners
      // e.g., API call to backend
    } else if (accountType === 'Restaurant Owner') {
      // Redirect to registerrestaurant page for additional information
      router.push('/register-restaurant');
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
          style={styles.picker}
        >
          <option value="Diner">Diner</option>
          <option value="Restaurant Owner">Restaurant Owner</option>
        </select>
      </View>

      <Button title="Register" onPress={handleRegister} />

      <View style={styles.linksContainer}>
        <Link href="/login">
          <Text style={styles.linkText}>Already have an account? Login</Text>
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
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: 'blue',
  },
});

export default RegisterPage;
