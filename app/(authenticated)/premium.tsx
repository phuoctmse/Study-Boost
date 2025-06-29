import { getCurrentUser } from '@/api/auth';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PremiumPage = () => {
  const router = useRouter();

  const handlePurchase = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        router.push('/login');
        return;
      }
      // Navigate to payment-process page instead of opening a URL
      router.push('/payment-process');
    } catch (error) {
      console.error('Purchase error:', error);
      Alert.alert(
        'Purchase Error',
        'Please make sure you are logged in to purchase premium.',
        [
          { text: 'OK', onPress: () => router.push('/login') }
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>      
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Chọn gói học</Text>
        <Text style={styles.subtitle}>
          Dù bạn chọn gói nào, hãy trải nghiệm miễn phí cho đến khi bạn thực sự yêu thích việc học!
        </Text>

        <View style={styles.plansContainerVertical}>
          {/* Default Plan */}
          <View style={styles.planCard}>
            <View style={styles.planHeader}>
              <View style={styles.planTitleContainer}>
                <Text style={styles.planTitleEmoji}>🆓</Text>
                <Text style={styles.planTitle}>Miễn phí (Gói mặc định)</Text>
              </View>
              <Text style={styles.planPrice}>
                <Text style={styles.priceAmount}>0đ</Text>
                <Text style={styles.pricePeriod}>/tháng</Text>
              </Text>
            </View>

            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle-outline" size={18} color="#353859" />
                <Text style={styles.featureText}>Truy cập bộ thẻ ghi nhớ cơ bản</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle-outline" size={18} color="#353859" />
                <Text style={styles.featureText}>Giới hạn số lượng câu hỏi mỗi ngày</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle-outline" size={18} color="#353859" />
                <Text style={styles.featureText}>Theo dõi chuỗi ngày học cơ bản</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle-outline" size={18} color="#353859" />
                <Text style={styles.featureText}>Nhắc nhở học tập cơ bản</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle-outline" size={18} color="#353859" />
                <Text style={styles.featureText}>Giới hạn số lượng môn học</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle-outline" size={18} color="#353859" />
                <Text style={styles.featureText}>Tham gia cộng đồng học tập</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle-outline" size={18} color="#353859" />
                <Text style={styles.featureText}>Xem lịch sử tiến độ (7 ngày gần nhất)</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.currentButton}>
              <Text style={styles.currentButtonText}>Đang sử dụng</Text>
            </TouchableOpacity>
          </View>

          {/* Students Plan */}
          <View style={[styles.planCard, styles.premiumCard]}>
            <View style={styles.popularTag}>
              <Text style={styles.popularText}>Phổ biến nhất</Text>
            </View>
            <View style={styles.planHeader}>
              <View style={styles.planTitleContainer}>
                <Text style={[styles.planTitleEmoji, styles.premiumEmoji]}>🏅</Text>
                <Text style={[styles.planTitle, styles.premiumTitle]}>Students</Text>
              </View>
              <Text style={[styles.planPrice, styles.premiumPrice]}>
                <Text style={styles.priceAmount2}>150.000 VNĐ</Text>
                <Text style={styles.pricePeriod2}>/tháng</Text>
              </Text>
            </View>

            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <Text style={[styles.planTitleEmoji, styles.premiumEmoji, {marginRight: 5}]}>🌟</Text>
                <Text style={[styles.featureText, styles.premiumFeatureText]}>Tạo thẻ ghi nhớ không giới hạn</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={[styles.planTitleEmoji, styles.premiumEmoji, {marginRight: 5}]}>🌟</Text>
                <Text style={[styles.featureText, styles.premiumFeatureText]}>Câu hỏi luyện tập do AI tạo ra</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={[styles.planTitleEmoji, styles.premiumEmoji, {marginRight: 5}]}>🌟</Text>
                <Text style={[styles.featureText, styles.premiumFeatureText]}>Ôn tập thông minh (Lặp lại ngắt quãng)</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={[styles.planTitleEmoji, styles.premiumEmoji, {marginRight: 5}]}>🌟</Text>
                <Text style={[styles.featureText, styles.premiumFeatureText]}>Truy cập bộ đề học nâng cao</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={[styles.planTitleEmoji, styles.premiumEmoji, {marginRight: 5}]}>🌟</Text>
                <Text style={[styles.featureText, styles.premiumFeatureText]}>Học offline không cần mạng</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={[styles.planTitleEmoji, styles.premiumEmoji, {marginRight: 5}]}>🌟</Text>
                <Text style={[styles.featureText, styles.premiumFeatureText]}>Phân tích hiệu suất nâng cao</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={[styles.planTitleEmoji, styles.premiumEmoji, {marginRight: 5}]}>🌟</Text>
                <Text style={[styles.featureText, styles.premiumFeatureText]}>Tùy chỉnh kế hoạch học tập</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={[styles.planTitleEmoji, styles.premiumEmoji, {marginRight: 5}]}>🌟</Text>
                <Text style={[styles.featureText, styles.premiumFeatureText]}>Hỗ trợ ưu tiên</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={[styles.planTitleEmoji, styles.premiumEmoji, {marginRight: 5}]}>🌟</Text>
                <Text style={[styles.featureText, styles.premiumFeatureText]}>Không quảng cáo</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={[styles.planTitleEmoji, styles.premiumEmoji, {marginRight: 5}]}>🌟</Text>
                <Text style={[styles.featureText, styles.premiumFeatureText]}>Trải nghiệm sớm các tính năng mới</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.purchaseButton}
              onPress={handlePurchase}
            >
              <Text style={styles.purchaseButtonText}>Nâng cấp ngay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    paddingBottom: 90,
    marginTop: 65,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#353859',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  plansContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  plansContainerVertical: {
    flexDirection: 'column',
    gap: 30,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  premiumCard: {
    backgroundColor: '#353859',
  },
  popularTag: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: '#4CAF50',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  popularText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  planHeader: {
    marginBottom: 20,
  },
  planTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  planTitleEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  premiumEmoji: {
    color: '#fff',
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#353859',
    marginBottom: 8,
  },
  premiumTitle: {
    color: '#fff',
  },
  planPrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceAmount: {
    fontSize: 22,
    fontWeight: '700',
    color: '#353859',
  },
  premiumPrice: {
    color: '#fff',
  },
  pricePeriod: {
    fontSize: 14,
    color: '#666',
    marginLeft: 2,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#555',
  },
  premiumFeatureText: {
    color: '#eee',
  },
  currentButton: {
    backgroundColor: '#ededed',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  currentButtonText: {
    color: '#353859',
    fontWeight: '600',
    fontSize: 16,
  },
  purchaseButton: {
    backgroundColor: '#FCC89B',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  pricePeriod2: {
    fontSize: 14,
    color: '#ffffff',
    marginLeft: 2,
  },
  priceAmount2: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
});

export default PremiumPage;
