import ProtectedRoute from '@/components/ProtectedRoute';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { StatusBar } from 'react-native';
import AIAssist from './ai-assist';
import Dashboard from './dashboard';
import Leaderboard from './leaderboard';
import PaymentProcess from './payment-process';
import Pomodoro from './pomodoro';
import Premium from './premium';
import Profile from './profile';
import Schedule from './schedule';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Wrapper components for protected routes
const ProtectedSchedule = () => (
  <ProtectedRoute>
    <Schedule />
  </ProtectedRoute>
);

const ProtectedAIAssist = () => (
  <ProtectedRoute>
    <AIAssist />
  </ProtectedRoute>
);

const ProtectedLeaderboard = () => (
  <ProtectedRoute>
    <Leaderboard />
  </ProtectedRoute>
);

function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Pomodoro"
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
        component={ProtectedSchedule}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          tabBarLabel: 'Lịch học',
        }}
      />
      <Tab.Screen
        name="AIAssist"
        component={ProtectedAIAssist}
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
        component={ProtectedLeaderboard}
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
  );
}

export default function AuthenticatedLayout() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={TabNavigator} />
        <Stack.Screen name="premium" component={Premium} />
        <Stack.Screen name="dashboard" component={Dashboard} />
        <Stack.Screen name="payment-process" component={PaymentProcess} />
      </Stack.Navigator>
    </>
  );
}
