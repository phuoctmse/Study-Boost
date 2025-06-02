import { router, Stack } from "expo-router";
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import LoadingScreen from '../../components/LoadingScreen';
import { account } from '../../lib/appwrite';

const { width } = Dimensions.get('window');

export default function AuthenticatedLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const sidebarAnimation = useRef(new Animated.Value(-width * 0.7)).current;

  const toggleSidebar = () => {
    if (sidebarOpen) {
      // Close sidebar
      Animated.timing(sidebarAnimation, {
        toValue: -width * 0.7,
        duration: 300,
        useNativeDriver: true
      }).start(() => setSidebarOpen(false));
    } else {
      // Open sidebar
      setSidebarOpen(true);
      Animated.timing(sidebarAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start();
    }
  };
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await account.deleteSession('current');
      router.replace('/');
    } catch (error) {
      console.error("Logout failed", error);
      setIsLoading(false); // Only set to false on error as navigation will unmount this component on success
    }  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {isLoading && <LoadingScreen message="Logging out..." />}
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent" 
          translucent={true}
        />
        
        {/* Global Components for all authenticated pages */}
        <Navbar toggleSidebar={toggleSidebar} />
        
        <Sidebar 
          isOpen={sidebarOpen}
          sidebarAnimation={sidebarAnimation}
          toggleSidebar={toggleSidebar}
          onLogout={handleLogout}
        />
        
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen 
            name="dashboard"
            options={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen 
            name="pomodoro"
            options={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen 
            name="premium" 
            options={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen 
            name="leaderboard" 
            options={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen 
            name="schedule" 
            options={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          />
        </Stack>

      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
