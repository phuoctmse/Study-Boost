import { getLeaderboardByScore, getLeaderboardByStreak } from '@/api/leaderboard/leaderboard';
import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const PLACEHOLDER_AVATAR = 'https://via.placeholder.com/60';

const LeaderboardScreen = () => {
  const [activeTab, setActiveTab] = useState<'point' | 'streak'>('point');
  const [fadeAnim] = useState(new Animated.Value(1));
  const [pointRankings, setPointRankings] = useState<any[]>([]);
  const [streakRankings, setStreakRankings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const points = await getLeaderboardByScore();
        const streaks = await getLeaderboardByStreak();
        setPointRankings(points.documents || []);
        setStreakRankings(streaks.documents || []);
      } catch (err) {
        // Optionally handle error
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Animation for tab change
  const handleTabChange = (tab: 'point' | 'streak') => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setActiveTab(tab);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  // Select correct rankings
  const rankings = activeTab === 'point' ? pointRankings : streakRankings;

  // Always show 10 users, fill with "None" if missing
  const filledRankings = [
    ...rankings,
    ...Array.from({ length: Math.max(0, 10 - rankings.length) }, (_, i) => ({
      $id: `none-${i}`,
      userName: 'None',
      score: 0,
      streak: 0,
    })),
  ].slice(0, 10);

  // Display value for each tab
  const getDisplayValue = (user: any) => {
    if (user.userName === 'None') return '-';
    return activeTab === 'point'
      ? user.score?.toString() || '0'
      : `${user.streak || 0} days`;
  };

  // Label for each tab
  const getLabel = () => (activeTab === 'streak' ? 'Streak' : 'Points');

  // Tabs
  const renderTabs = () => (
    <View style={styles.tabContainer}>
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

  // Top 3
  const renderTopThree = () => (
    <View style={styles.topThreeContainer}>
      {/* 2nd Place */}
      <View style={[styles.topThreeCard, { marginTop: 20 }]}>
        <Text style={styles.rankText}>2ND</Text>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: PLACEHOLDER_AVATAR }}
            style={styles.avatar}
          />
          <Text style={styles.username}>{filledRankings[1]?.userName}</Text>
        </View>
        <Text style={styles.timeLabel}>{getLabel()}</Text>
        <Text style={styles.timeValue}>{getDisplayValue(filledRankings[1])}</Text>
        <TouchableOpacity style={styles.profileButton} disabled={filledRankings[1]?.userName === 'None'}>
          <Text style={styles.profileButtonText}>Profile</Text>
        </TouchableOpacity>
      </View>
      {/* 1st Place */}
      <View style={[styles.topThreeCard, { marginTop: 0 }]}>
        <Text style={[styles.rankText, { color: '#daa520' }]}>1ST</Text>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: PLACEHOLDER_AVATAR }}
            style={styles.avatar}
          />
          <Text style={styles.username}>{filledRankings[0]?.userName}</Text>
        </View>
        <Text style={styles.timeLabel}>{getLabel()}</Text>
        <Text style={styles.timeValue}>{getDisplayValue(filledRankings[0])}</Text>
        <TouchableOpacity style={styles.profileButton} disabled={filledRankings[0]?.userName === 'None'}>
          <Text style={styles.profileButtonText}>Profile</Text>
        </TouchableOpacity>
      </View>
      {/* 3rd Place */}
      <View style={[styles.topThreeCard, { marginTop: 40 }]}>
        <Text style={[styles.rankText, { color: '#cd7f32' }]}>3RD</Text>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: PLACEHOLDER_AVATAR }}
            style={styles.avatar}
          />
          <Text style={styles.username}>{filledRankings[2]?.userName}</Text>
        </View>
        <Text style={styles.timeLabel}>{getLabel()}</Text>
        <Text style={styles.timeValue}>{getDisplayValue(filledRankings[2])}</Text>
        <TouchableOpacity style={styles.profileButton} disabled={filledRankings[2]?.userName === 'None'}>
          <Text style={styles.profileButtonText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Ranks 4-10
  const renderRankingList = () => (
    <View style={styles.rankingListContainer}>
      {filledRankings.slice(3).map((user, index) => (
        <View key={user.$id || `none-${index + 4}`} style={styles.rankingItem}>
          <Text style={styles.rankingNumber}>{index + 4}</Text>
          <View style={styles.rankingAvatar}>
            <Image
              source={{ uri: PLACEHOLDER_AVATAR }}
              style={styles.smallAvatar}
            />
          </View>
          <Text style={styles.rankingUsername}>{user.userName}</Text>
          <Text style={styles.rankingTime}>{getDisplayValue(user)}</Text>
          <TouchableOpacity style={styles.smallProfileButton} disabled={user.userName === 'None'}>
            <Text style={styles.smallProfileButtonText}>Profile</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Leaderboard</Text>
        {renderTabs()}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#fff' }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

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