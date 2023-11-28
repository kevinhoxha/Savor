import { Provider } from 'app/provider'
import { Stack } from 'expo-router'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

export default function Root() {
  return (
    <Provider>
      <Stack screenOptions={{headerShown: false}}/>
    </Provider>
  )
}
