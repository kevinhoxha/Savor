import React from 'react'
import RestaurantScreen from 'app/features/ownerdash/screen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import AccountScreen from 'app/features/account/screen'
import DateTimePicker from '../components/DateTimePicker'
import { Ionicons } from '@expo/vector-icons'
import { FontAwesome5 } from '@expo/vector-icons'
import RegisterRestaurantScreen from 'app/features/register-restaurant/screen'
import CreatePromotionScreen from 'app/features/createpromo/screen'

const Tab = createBottomTabNavigator()

const screen = (props: any) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="restaurant"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
          unmountOnBlur: true,
        }}
      >
        {() => <RestaurantScreen DateTimePicker={DateTimePicker} />}
      </Tab.Screen>
      <Tab.Screen
        name="register-restaurant"
        options={{
          tabBarLabel: 'Add Restaurant',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="restaurant-outline" color={color} size={size} />
          ),
          unmountOnBlur: true,
        }}
        component={RegisterRestaurantScreen}
      />
      <Tab.Screen
        name="create-promotion"
        options={{
          tabBarLabel: 'Create Promotion',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" color={color} size={size} />
          ),
          unmountOnBlur: true,
        }}
      >
        {() => <CreatePromotionScreen DateTimePicker={DateTimePicker} />}
      </Tab.Screen>
      <Tab.Screen
        name="owner-account"
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user" color={color} size={size} />
          ),
          unmountOnBlur: true,
        }}
        component={AccountScreen}
      />
    </Tab.Navigator>
  )
}

export default screen
