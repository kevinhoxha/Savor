import { StyleSheet, Text, View, Image, Button } from 'react-native'
import Link from 'next/link';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 325, // Adjust the dimensions as per your logo's aspect ratio
    height: 325,
    marginBottom: 50,
    resizeMode: 'contain',
    borderRadius: 15,
  },
  registerButton: {
    marginTop: 10,
  },
  loginButton: {
    marginBottom: 10,
  },
});

export default function App(props) {
  return (
    <View style={styles.container}>
      <Image source="/logo.jpg" style={styles.logo} />

      <Link href="/login" style={styles.loginButton} >
        <Button title="Login"/>
      </Link>

      <Link href="/register"  style={styles.registerButton}>
        <Button title="Register"/>
      </Link>
    </View>
  );
}
