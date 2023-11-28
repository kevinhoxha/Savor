import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UserDashboardScreen from 'app/features/userdash/screen';
import AccountScreen from 'app/features/account/screen';
import DateTimePicker from '../components/DateTimePicker';
import { CrossPlatformDateTimePicker } from 'app/types/dateTimePicker'
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons'; 
import ReservationScreen from 'app/features/reservations/screen';



const Tab = createBottomTabNavigator();

const screen = (props: any) => {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
  })}
  >
      <Tab.Screen
        name="dashboard"
        options={{ 
        tabBarLabel: 'Home',
        tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),    
        unmountOnBlur: true,
        }}
      >
        {() => <UserDashboardScreen DateTimePicker={DateTimePicker}/>}
        </Tab.Screen>
      <Tab.Screen
        name="reservations"
        options={{ 
            tabBarLabel: 'Reservations',
            tabBarIcon: ({ color, size }) => (
                <FontAwesome5 name="clipboard-list" color={color} size={size} />
              ),
            unmountOnBlur: true,
            }}
        component={ReservationScreen}
        
      />
      <Tab.Screen
        name="account"
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
  );
};

export default screen;