import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Animated, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface UserRanking {
  id: number;
  username: string;
  studyTime: string;
  streakDays: number;
  points: number;
  rank?: number;
}

const LeaderboardScreen = () => {
  const [activeTab, setActiveTab] = useState<'monthly' | 'point' | 'streak'>('monthly');
  const [fadeAnim] = useState(new Animated.Value(1));
  const router = useRouter();
  
  // Add animation when switching tabs
  const handleTabChange = (tab: 'monthly' | 'point' | 'streak') => {
    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      // Change tab
      setActiveTab(tab);
      
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };
    // Mock data - in a real app, you would fetch this from your backend
  const rankings: UserRanking[] = [
    { id: 1, username: 'User123', studyTime: '15H', streakDays: 5, points: 600, rank: 1 },
    { id: 2, username: 'User123', studyTime: '14H', streakDays: 4, points: 580, rank: 2 },
    { id: 3, username: 'User123', studyTime: '13H', streakDays: 3, points: 540, rank: 3 },
    { id: 4, username: 'User123', studyTime: '11H', streakDays: 3, points: 520 },
    { id: 5, username: 'User123', studyTime: '11H', streakDays: 2, points: 480 },
    { id: 6, username: 'User123', studyTime: '11H', streakDays: 2, points: 450 },
    { id: 7, username: 'User123', studyTime: '11H', streakDays: 1, points: 420 },
    { id: 8, username: 'User123', studyTime: '11H', streakDays: 1, points: 400 },
    { id: 9, username: 'User123', studyTime: '10H', streakDays: 1, points: 380 },
    { id: 10, username: 'User123', studyTime: '9H', streakDays: 1, points: 350 },
  ];
  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'monthly' && styles.activeTab]} 
        onPress={() => handleTabChange('monthly')}
      >
        <Text style={[styles.tabText, activeTab === 'monthly' && styles.activeTabText]}>Monthly lessons</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'point' && styles.activeTab]} 
        onPress={() => handleTabChange('point')}
      >
        <Text style={[styles.tabText, activeTab === 'point' && styles.activeTabText]}>Point</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'streak' && styles.activeTab]} 
        onPress={() => handleTabChange('streak')}
      >
        <Text style={[styles.tabText, activeTab === 'streak' && styles.activeTabText]}>Streak</Text>
      </TouchableOpacity>
    </View>
  );
  // Get display value based on active tab
  const getDisplayValue = (user: UserRanking) => {
    switch (activeTab) {
      case 'monthly':
        return user.studyTime;
      case 'streak':
        return `${user.streakDays} days`;
      case 'point':
        return user.points.toString();
      default:
        return user.studyTime;
    }
  };

  // Get label based on active tab
  const getLabel = () => {
    switch (activeTab) {
      case 'monthly':
        return 'Times';
      case 'streak':
        return 'Streak';
      case 'point':
        return 'Points';
      default:
        return 'Times';
    }
  };

  const renderTopThree = () => (
    <View style={styles.topThreeContainer}>
      {/* 2nd Place */}
      <View style={[styles.topThreeCard, { marginTop: 20 }]}>
        <Text style={styles.rankText}>2ND</Text>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/60' }} 
            style={styles.avatar}
          />
          <Text style={styles.username}>{rankings[1].username}</Text>
        </View>
        <Text style={styles.timeLabel}>{getLabel()}</Text>
        <Text style={styles.timeValue}>{getDisplayValue(rankings[1])}</Text>
        <TouchableOpacity style={styles.profileButton}>
          <Text style={styles.profileButtonText}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* 1st Place */}
      <View style={[styles.topThreeCard, { marginTop: 0 }]}>
        <Text style={[styles.rankText, { color: '#daa520' }]}>1ST</Text>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/60' }} 
            style={styles.avatar}
          />
          <Text style={styles.username}>{rankings[0].username}</Text>
        </View>
        <Text style={styles.timeLabel}>{getLabel()}</Text>
        <Text style={styles.timeValue}>{getDisplayValue(rankings[0])}</Text>
        <TouchableOpacity style={styles.profileButton}>
          <Text style={styles.profileButtonText}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* 3rd Place */}
      <View style={[styles.topThreeCard, { marginTop: 40 }]}>
        <Text style={[styles.rankText, { color: '#cd7f32' }]}>3RD</Text>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/60' }} 
            style={styles.avatar}
          />
          <Text style={styles.username}>{rankings[2].username}</Text>
        </View>
        <Text style={styles.timeLabel}>{getLabel()}</Text>
        <Text style={styles.timeValue}>{getDisplayValue(rankings[2])}</Text>
        <TouchableOpacity style={styles.profileButton}>
          <Text style={styles.profileButtonText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  const renderRankingList = () => (
    <View style={styles.rankingListContainer}>
      {rankings.slice(3).map((user, index) => (
        <View key={user.id} style={styles.rankingItem}>
          <Text style={styles.rankingNumber}>{index + 4}</Text>
          <View style={styles.rankingAvatar}>
            <Image 
              source={{ uri: 'https://via.placeholder.com/40' }} 
              style={styles.smallAvatar}
            />
          </View>
          <Text style={styles.rankingUsername}>{user.username}</Text>
          <Text style={styles.rankingTime}>{getDisplayValue(user)}</Text>
          <TouchableOpacity style={styles.smallProfileButton}>
            <Text style={styles.smallProfileButtonText}>Profile</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Leaderboard</Text>
      {renderTabs()}
      <ScrollView style={styles.content}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {renderTopThree()}
          {renderRankingList()}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#737AA8',
    paddingTop: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    color: 'white',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#353859',
  },
  content: {
    flex: 1,
  },
  topThreeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  topThreeCard: {
    width: width * 0.28,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  rankText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#353859',
    marginBottom: 5,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#353859',
  },
  username: {
    color: '#353859',
    fontWeight: 'bold',
    marginTop: 5,
  },
  timeLabel: {
    color: '#777',
    fontSize: 12,
  },
  timeValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#353859',
  },
  profileButton: {
    backgroundColor: '#353859',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
  },
  profileButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 12,
  },
  rankingListContainer: {
    paddingHorizontal: 10,
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  rankingNumber: {
    width: 30,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#353859',
    textAlign: 'center',
  },
  rankingAvatar: {
    marginRight: 10,
  },
  smallAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#353859',
  },
  rankingUsername: {
    flex: 1,
    fontWeight: '500',
    color: '#353859',
  },
  rankingTime: {
    fontWeight: 'bold',
    color: '#353859',
    marginRight: 10,
  },
  smallProfileButton: {
    backgroundColor: '#353859',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  smallProfileButtonText: {
    color: 'white',
    fontSize: 11,
  }
});

export default LeaderboardScreen;
