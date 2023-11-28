import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UserDashboardScreen from 'app/features/userdash/screen';
import AccountScreen from 'app/features/account/screen';
import DateTimePicker from '../components/DateTimePicker';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons'; 



const Tab = createBottomTabNavigator();

const screen = (props: any) => {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
  })}
  >
      <Tab.Screen
        name="userdash"
        options={{ 
        tabBarLabel: 'Home',
        tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),    
        }}
        component={UserDashboardScreen}
      />
      <Tab.Screen
        name="login"
        options={{ 
            tabBarLabel: 'Reservations',
            tabBarIcon: ({ color, size }) => (
                <FontAwesome5 name="clipboard-list" color={color} size={size} />
              ),    
            }}
        component={AccountScreen}
      />
      <Tab.Screen
        name="account"
        options={{ 
            tabBarLabel: 'Account',
            tabBarIcon: ({ color, size }) => (
                <FontAwesome5 name="user" color={color} size={size} />
              ),    
            }}
        component={AccountScreen}
      />
    </Tab.Navigator>
  );
};

export default screen;