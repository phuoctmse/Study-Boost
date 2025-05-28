import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {  const navigateToPremium = () => {
    router.push('/(authenticated)/premium');
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={toggleSidebar}>
        <Ionicons name="menu-outline" size={24} color="#353859"/>
      </TouchableOpacity>
        <TouchableOpacity 
        style={styles.titleContainer}
        onPress={() => router.push('/(authenticated)/pomodoro')}
      >
        <Image
          source={require('../assets/images/icon.png')}
          style={styles.headerIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.premiumButton} onPress={navigateToPremium}>
        <Ionicons name="star" size={18} color="#353859" />
        <Text style={styles.premiumText}>Premium</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#737AA8',

  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 120,  
    height: 40, 
  },
  premiumButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCC89B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  premiumText: {
    marginLeft: 5,
    color: '#353859',
    fontWeight: '600',
  },
});

export default Navbar;