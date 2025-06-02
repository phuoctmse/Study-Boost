import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LoadingScreen from './LoadingScreen';

const { width } = Dimensions.get('window');

interface SidebarProps {
  isOpen: boolean;
  sidebarAnimation: Animated.Value;
  toggleSidebar: () => void;
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, sidebarAnimation, toggleSidebar, onLogout }) => {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);

  const isRouteActive = (route: string): boolean => {
    return pathname.includes(route);
  };
  const handleLogout = () => {
    toggleSidebar();
    setIsLoading(true);
    if (onLogout) {
      onLogout();
      // Assuming onLogout is asynchronous, we keep the loading state
    } else {
      setTimeout(() => {
        router.replace('/');
        // Loading screen will be unmounted when navigation is complete
      }, 300);
    }
  };  return (
    <>
      {isLoading && <LoadingScreen message="Logging out..." />}
      <Animated.View style={[
        styles.sidebar,
        {
          transform: [{ translateX: sidebarAnimation }]
        }
      ]}>
        <View style={styles.content}>
          <View style={[
            styles.sidebarHeader,
            { paddingTop: insets.top > 0 ? insets.top : 10 }
          ]}>
            <TouchableOpacity onPress={toggleSidebar} style={styles.closeButton}>
              <Ionicons name="close-outline" size={24} color="#6B7FB9" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              toggleSidebar();
              setTimeout(() => router.push('/(authenticated)/dashboard'), 300);
            }}>
              <Image
                source={require('../assets/images/icon.png')}
                style={styles.sidebarLogo}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <View>
            <Text style={styles.sectionHeader}>STUDY</Text>
            <TouchableOpacity
              style={[styles.sidebarItem, isRouteActive('/dashboard') && styles.sidebarItemActive]}
              onPress={() => {
                toggleSidebar(); // Close sidebar first
                setTimeout(() => router.push('/(authenticated)/dashboard'), 300);
              }}
            >
              <Ionicons name="grid-outline" size={22} color="#444" />
              <Text style={[
                styles.sidebarItemText,
                isRouteActive('/dashboard') && styles.sidebarItemActiveText
              ]}>Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sidebarItem, isRouteActive('/pomodoro') && styles.sidebarItemActive]}
              onPress={() => {
                toggleSidebar(); // Close sidebar first
                setTimeout(() => router.push('/(authenticated)/pomodoro'), 300); // Navigate to pomodoro
              }}
            >
              <Ionicons name="calendar-outline" size={22} color="#444" />
              <Text style={[
                styles.sidebarItemText,
                isRouteActive('/pomodoro') && styles.sidebarItemActiveText
              ]}>Study Session</Text>
            </TouchableOpacity>            <TouchableOpacity
              style={[styles.sidebarItem, isRouteActive('/community') && styles.sidebarItemActive]}
              onPress={() => {
                toggleSidebar(); // Close sidebar first
                setTimeout(() => router.push('/(authenticated)/community'), 300); // Navigate to community
              }}
            >
              <Ionicons name="people-outline" size={22} color="#444" />
              <Text style={[
                styles.sidebarItemText,
                isRouteActive('/community') && styles.sidebarItemActiveText
              ]}>Community</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sidebarItem, isRouteActive('/schedule') && styles.sidebarItemActive]}
              onPress={() => {
                toggleSidebar(); // Close sidebar first
                setTimeout(() => router.push('/(authenticated)/schedule'), 300); // Navigate to schedule
              }}
            >
              <Ionicons name="calendar-outline" size={22} color="#444" />
              <Text style={[
                styles.sidebarItemText,
                isRouteActive('/schedule') && styles.sidebarItemActiveText
              ]}>Schedule</Text>
            </TouchableOpacity>
            <Text style={styles.sectionHeader}>ADDITION</Text>
            <TouchableOpacity
              style={[styles.sidebarItem, isRouteActive('/leaderboard') && styles.sidebarItemActive]}
              onPress={() => {
                toggleSidebar(); // Close sidebar first
                setTimeout(() => router.push('/(authenticated)/leaderboard'), 300); // Navigate to leaderboard
              }}
            >
              <Ionicons name="trophy-outline" size={22} color="#444" />
              <Text style={[
                styles.sidebarItemText,
                isRouteActive('/leaderboard') && styles.sidebarItemActiveText
              ]}>Leaderboard</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sidebarItem, isRouteActive('/ai-assist') && styles.sidebarItemActive]}
              onPress={() => {
                toggleSidebar(); // Close sidebar first
                setTimeout(() => router.push('/(authenticated)/ai-assist'), 300); // Navigate to ai-assist
              }}
            >
              <Ionicons name="bulb-outline" size={22} color="#444" />
              <Text style={[
                styles.sidebarItemText,
                isRouteActive('/ai-assist') && styles.sidebarItemActiveText
              ]}>AI Assist</Text>
            </TouchableOpacity>            <TouchableOpacity
              style={[styles.sidebarItem, isRouteActive('/premium') && styles.sidebarItemActive]}
              onPress={() => {
                toggleSidebar(); // Close sidebar first
                setTimeout(() => router.push('/(authenticated)/premium'), 300); // Navigate to premium
              }}
            >
              <Ionicons name="star-outline" size={22} color="#444" />
              <Text style={[
                styles.sidebarItemText,
                isRouteActive('/premium') && styles.sidebarItemActiveText
              ]}>Premium</Text>
            </TouchableOpacity>

            {/* Logout Button - Added as last sidebar item */}
            <TouchableOpacity
              style={[styles.sidebarItem, styles.logoutItem]}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={24} color="#FF6B6B" />
              <Text style={[styles.sidebarItemText, styles.logoutText]}>Logout</Text>          </TouchableOpacity>
          </View>
        </View>      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 0.7,
    height: '100%',
    backgroundColor: '#f5f5f7',
    zIndex: 200,
    paddingTop: 0,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  }, sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  sidebarLogo: {
    width: 100,
    height: 35,
    marginLeft: 15,
  },
  closeButton: {
    padding: 5,
  }, sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7FB9',
    marginLeft: 20,
    marginTop: 15,
    marginBottom: 10,
    letterSpacing: 1,
  }, sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 3,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  sidebarItemActive: {
    backgroundColor: '#FCC89B',
  }, sidebarItemText: {
    fontSize: 14,
    color: '#444',
    marginLeft: 15,
    fontWeight: '500',
  }, sidebarItemActiveText: {
    color: '#444',
    fontWeight: '600',
  },  sidebarIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  }, logoutItem: {
    marginTop: 15,
    paddingVertical: 15,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  logoutText: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
});

export default Sidebar;