import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

interface SidebarProps {
  isOpen: boolean;
  sidebarAnimation: Animated.Value;
  toggleSidebar: () => void;
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, sidebarAnimation, toggleSidebar, onLogout }) => {
  
  const handleLogout = () => {
    toggleSidebar(); // Close sidebar first
    
    // Use the provided logout function if available
    if (onLogout) {
      onLogout();
    } else {
      // Default logout behavior - navigate to index
      setTimeout(() => {
        router.replace('/');
      }, 300); // Slight delay to allow sidebar animation to complete
    }
  };
  
  return (
    <>
      {/* Sidebar */}      <Animated.View style={[
        styles.sidebar, 
        { transform: [{ translateX: sidebarAnimation }] }
      ]}>        
        <View style={styles.sidebarHeader}>
          <TouchableOpacity onPress={toggleSidebar} style={styles.closeButton}>
            <Ionicons name="close-outline" size={24} color="#6B7FB9" />
          </TouchableOpacity>          <TouchableOpacity onPress={() => {
            toggleSidebar(); // Close sidebar first
            setTimeout(() => router.push('/(authenticated)/pomodoro'), 300); // Add delay to allow sidebar to close
          }}>
            <Image
              source={require('../assets/images/icon.png')}
              style={styles.sidebarLogo}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>        <View>
          <Text style={styles.sectionHeader}>STUDY</Text>
          
          <TouchableOpacity 
            style={styles.sidebarItem} 
            onPress={() => router.push('/(authenticated)/pomodoro')}
          >
            <Ionicons name="grid-outline" size={22} color="#444" />
            <Text style={styles.sidebarItemText}>Dashboard</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.sidebarItem, styles.sidebarItemActive]} 
            onPress={() => router.push('/(authenticated)/pomodoro')}
          >
            <Ionicons name="calendar-outline" size={22} color="#444" />
            <Text style={[styles.sidebarItemText, styles.sidebarItemActiveText]}>Study Session</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.sidebarItem}>
            <Ionicons name="people-outline" size={22} color="#444" />
            <Text style={styles.sidebarItemText}>Community</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.sidebarItem}>
            <Ionicons name="calendar-outline" size={22} color="#444" />
            <Text style={styles.sidebarItemText}>Schedule</Text>
          </TouchableOpacity>
            <Text style={styles.sectionHeader}>ADDITION</Text>
          
          <TouchableOpacity style={styles.sidebarItem}>
            <Ionicons name="trophy-outline" size={22} color="#444" />
            <Text style={styles.sidebarItemText}>Leaderboard</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.sidebarItem}
            onPress={() => router.push('/(authenticated)/pomodoro')}
          >
            <Ionicons name="timer-outline" size={22} color="#444" />
            <Text style={styles.sidebarItemText}>Pomodoro Timer</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.sidebarItem}>
            <Ionicons name="bulb-outline" size={22} color="#444" />
            <Text style={styles.sidebarItemText}>AI Assist</Text>
          </TouchableOpacity>
          
          {/* Logout Button - Added as last sidebar item */}
          <TouchableOpacity 
            style={[styles.sidebarItem, styles.logoutItem]} 
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="#FF6B6B" />
            <Text style={[styles.sidebarItemText, styles.logoutText]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      
      {/* Backdrop when sidebar is open */}
      {isOpen && (
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={toggleSidebar} 
        />
      )}
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
    paddingTop: 50,
    zIndex: 200,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7FB9',
    marginLeft: 20,
    marginTop: 25,
    marginBottom: 10,
    letterSpacing: 1,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 4,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  sidebarItemActive: {
    backgroundColor: '#FCC89B',
  },  sidebarItemText: {
    fontSize: 14,
    color: '#444',
    marginLeft: 15,
    fontWeight: '500',
  },  sidebarItemActiveText: {
    color: '#444',
    fontWeight: '600',
  },
  sidebarIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: width * 0.7,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 150,
  },  logoutItem: {
    marginTop: 20,
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