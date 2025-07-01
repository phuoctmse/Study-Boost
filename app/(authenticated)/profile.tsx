import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getCurrentUserProfile, getUserDocumentById, logout } from '../../api/auth';
import { getFeedbackByUserId } from '../../api/feedback/feedback';
import { getUserScoreAndStreak } from '../../api/leaderboard/leaderboard';
import FeedbackForm from '../../components/FeedbackForm';

const COLOR_BG = '#737AA8';
const COLOR_CARD = '#F5F5F7';
const COLOR_ACCENT = '#FCC89B';
const COLOR_TEXT = '#fff';
const COLOR_PRIMARY = '#353859';

export default function Profile() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [subscriptionPlan, setSubscriptionPlan] = useState('free');
  const [userStreak, setUserStreak] = useState<number>(0);
  const router = useRouter();
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userFeedback, setUserFeedback] = useState<any>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUserProfile();
        setName(user.name || '');
        setEmail(user.email || '');
        setUserId(user.$id);
        // Fetch user document for subscription_plan
        const userDoc = await getUserDocumentById(user.$id);
        setSubscriptionPlan((userDoc.subscription_plan || 'free').toLowerCase());
        // Fetch streak
        const { streak } = await getUserScoreAndStreak(user.$id);
        setUserStreak(streak || 0);
        // Fetch feedback
        setFeedbackLoading(true);
        const feedbacks = await getFeedbackByUserId(user.$id);
        const latest = feedbacks && feedbacks.length > 0
          ? feedbacks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
          : null;
        setUserFeedback(latest);
      } catch (err) {
        console.error('Error fetching user data:', err);
        Alert.alert('Lỗi', 'Không thể tải dữ liệu hồ sơ');
      } finally {
        setFeedbackLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (error: any) {
      Alert.alert(
        'Logout Failed',
        error.message || 'Failed to logout. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleUpgrade = () => {
    router.push('/(authenticated)/premium');
  };

  const handleOpenFeedback = () => {
    setFeedbackModalVisible(true);
  };
  const handleCloseFeedback = async () => {
    setFeedbackModalVisible(false);
    // Refresh feedback after closing modal
    if (userId) {
      setFeedbackLoading(true);
      try {
        const feedbacks = await getFeedbackByUserId(userId);
        const latest = feedbacks && feedbacks.length > 0
          ? feedbacks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
          : null;
        setUserFeedback(latest);
      } catch (err) {
        // ignore
      } finally {
        setFeedbackLoading(false);
      }
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLOR_BG }} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={styles.headerRow}>
       
      </View>
      <View style={styles.avatarSection}>
        <View style={styles.avatarGlow}>
          <Image
            source={avatar ? { uri: avatar } : require('../../assets/images/icon.png')}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.activeText}>
          {subscriptionPlan === 'premium' ? 'Gói Cao cấp' : subscriptionPlan === 'students' ? 'Gói Students' : 'Gói Free'}
        </Text>
        {/* Streak below package info */}
        <Text style={{
          color: '#FFD600',
          fontWeight: 'bold',
          fontSize: 20,
          marginTop: 2,
          marginBottom: 2,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          Streak: {userStreak} <Ionicons name="flame" size={16} color="#FFD600" style={{ marginLeft: 2, marginBottom: -2 }} />
        </Text>
        {subscriptionPlan !== 'premium' && subscriptionPlan !== 'students' && (
          <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
            <Text style={styles.upgradeButtonText}>Nâng cấp lên Students</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Thông tin cá nhân</Text>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Feather name="edit" size={18} color={COLOR_BG} />
            <Text style={styles.editText}> Chỉnh sửa</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="email-outline" size={20} color={COLOR_BG} style={styles.infoIcon} />
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Feather name="phone" size={20} color={COLOR_BG} style={styles.infoIcon} />
          <Text style={styles.infoLabel}>Số điện thoại</Text>
          <Text style={styles.infoValue}>{phone}</Text>
        </View>
        <View style={styles.infoRow}>
          <Feather name="globe" size={20} color={COLOR_BG} style={styles.infoIcon} />
          <Text style={styles.infoLabel}>Website</Text>
          <Text style={styles.infoValue}>{website}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={20} color={COLOR_BG} style={styles.infoIcon} />
          <Text style={styles.infoLabel}>Địa chỉ</Text>
          <Text style={styles.infoValue}>{location}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tiện ích</Text>
        <TouchableOpacity style={styles.utilityRow}>
          <Feather name="download" size={20} color={COLOR_BG} style={styles.utilityIcon} />
          <Text style={styles.utilityText}>Tải xuống</Text>
          <Ionicons name="chevron-forward" size={20} color={COLOR_BG} style={styles.utilityChevron} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.utilityRow}>
          <Feather name="bar-chart-2" size={20} color={COLOR_BG} style={styles.utilityIcon} />
          <Text style={styles.utilityText}>Phân tích sử dụng</Text>
          <Ionicons name="chevron-forward" size={20} color={COLOR_BG} style={styles.utilityChevron} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.utilityRow}>
          <Feather name="help-circle" size={20} color={COLOR_BG} style={styles.utilityIcon} />
          <Text style={styles.utilityText}>Hỗ trợ</Text>
          <Ionicons name="chevron-forward" size={20} color={COLOR_BG} style={styles.utilityChevron} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.utilityRow, { borderBottomWidth: 0 }]} onPress={handleLogout}>
          <Feather name="log-out" size={20} color={COLOR_ACCENT} style={styles.utilityIcon} />
          <Text style={[styles.utilityText, { color: COLOR_ACCENT }]}>Đăng xuất</Text>
          <Ionicons name="chevron-forward" size={20} color={COLOR_ACCENT} style={styles.utilityChevron} />
        </TouchableOpacity>
      </View>

      {/* Feedback Button */}
      <View style={{ alignItems: 'center', marginBottom: 24 }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#FCC89B',
            borderRadius: 20,
            paddingVertical: 14,
            paddingHorizontal: 40,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 3,
            elevation: 3,
            width: '80%',
          }}
          onPress={handleOpenFeedback}
          disabled={feedbackLoading || !userId}
        >
          <Text style={{ color: '#353859', fontWeight: 'bold', fontSize: 17 }}>
            {userFeedback ? 'Chỉnh sửa phản hồi' : 'Gửi phản hồi mới'}
          </Text>
        </TouchableOpacity>
      </View>
      <FeedbackForm
        visible={feedbackModalVisible}
        onClose={handleCloseFeedback}
        userId={userId || undefined}
        initialFeedback={userFeedback}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 50,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 18,
  },
  avatarGlow: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#FCC89B33',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#FCC89B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 18,
    elevation: 8,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#bfc3d9',
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLOR_TEXT,
    marginTop: 2,
  },
  activeText: {
    color: '#FFD6B0',
    fontSize: 13,
    marginTop: 2,
    marginBottom: 2,
  },
  card: {
    backgroundColor: COLOR_CARD,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLOR_BG,
  },
  editText: {
    color: COLOR_BG,
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 10,
  },
  infoIcon: {
    width: 24,
    textAlign: 'center',
    marginRight: 8,
  },
  infoLabel: {
    color: '#737AA8',
    fontWeight: 'bold',
    fontSize: 13,
    width: 90,
  },
  infoValue: {
    color: '#353859',
    fontSize: 15,
    flex: 1,
    textAlign: 'right',
    fontWeight: '600',
  },
  utilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 14,
    gap: 10,
  },
  utilityIcon: {
    marginRight: 2,
  },
  utilityText: {
    color: '#353859',
    fontWeight: 'bold',
    fontSize: 15,
    flex: 1,
  },
  utilityChevron: {
    marginLeft: 2,
  },
  upgradeButton: {
    backgroundColor: '#FFD600',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 28,
    marginTop: 10,
    marginBottom: 8,
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: '#FFD600',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  upgradeButtonText: {
    color: '#353859',
    fontWeight: 'bold',
    fontSize: 16,
  },
});