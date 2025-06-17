import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StatusBar } from 'react-native';
import AIAssist from './ai-assist';
import Leaderboard from './leaderboard';
import Pomodoro from './pomodoro';
import Profile from './profile';
import Schedule from './schedule';

const Tab = createBottomTabNavigator();

export default function AuthenticatedLayout() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      <Tab.Navigator
        initialRouteName="Schedule"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#181818',
            borderTopWidth: 0,
            height: 64,
          },
          tabBarActiveTintColor: '#FFF',
          tabBarInactiveTintColor: '#AAA',
          tabBarLabelStyle: {
            fontSize: 12,
            marginBottom: 6,
          },
        })}
      >
        <Tab.Screen
          name="Schedule"
          component={Schedule}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
            tabBarLabel: 'Lịch học',
          }}
        />
        <Tab.Screen
          name="AIAssist"
          component={AIAssist}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="robot-outline" size={size} color={color} />
            ),
            tabBarLabel: 'AI Assist',
          }}
        />
        <Tab.Screen
          name="Pomodoro"
          component={Pomodoro}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="clock" size={size} color={color} />
            ),
            tabBarLabel: 'Pomodoro',
          }}
        />
        <Tab.Screen
          name="Leaderboard"
          component={Leaderboard}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="trophy-outline" size={size} color={color} />
            ),
            tabBarLabel: 'Bảng xếp hạng',
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-circle-outline" size={size} color={color} />
            ),
            tabBarLabel: 'Bạn',
          }}
        />
      </Tab.Navigator>
    </>
  );
}
