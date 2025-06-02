import { Stack } from "expo-router";
import React, { useState, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import LoadingScreen from "../components/LoadingScreen";

export default function RootLayout() {
  const [initialLoading, setInitialLoading] = useState(true);
  
  // Simulate app initialization loading
  useEffect(() => {
    // This simulates app initialization (could be data fetching, auth checking, etc.)
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1500); // Show loading screen for 1.5 seconds
    
    return () => clearTimeout(timer);
  }, []);
    return (
    <SafeAreaProvider style={{ backgroundColor: '#737AA8' }}>
      {initialLoading && <LoadingScreen message="Starting Study Boost..." />}
      <Stack 
        screenOptions={{
          headerShown: false, // This hides the header on all screens
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen 
          name="(authenticated)" 
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
