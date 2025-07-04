import { getCurrentUser } from '@/api/auth';
import { getPackages } from '@/api/package/package';
import { Package } from '@/types/package';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PremiumPage = () => {
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await getPackages();
        // Map Appwrite documents to Package type
        const pkgs = (res.documents || []).map((doc: any) => ({
          id: doc.$id || doc.id,
          name: doc.name,
          price: doc.price,
          duration: doc.duration,
          description: doc.description,
        }));
        setPackages(pkgs);
      } catch (e) {
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const handlePurchase = async (pkg: Package) => {
    console.log('Selected package:', pkg);
    try {
      const user = await getCurrentUser();
      if (!user) {
        router.push('/login');
        return;
      }
      // Pass package id and price to payment-process using query string
      router.push({
        pathname: '/payment-process',
        params: {
          price: pkg.price,
          packageId: pkg.id,
        },
      });
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
        {loading ? (
          <Text style={{ textAlign: 'center', marginTop: 30 }}>Đang tải gói...</Text>
        ) : (
          <View style={styles.plansContainerVertical}>
            {packages.map((pkg, idx) => (
              <View key={pkg.id || idx} style={[styles.planCard, pkg.name.toLowerCase() !== 'miễn phí' && styles.premiumCard]}>
                {pkg.name.toLowerCase() === 'student' && (
                  <View style={styles.popularTag}>
                    <Text style={styles.popularText}>Phổ biến nhất</Text>
                  </View>
                )}
                <View style={styles.planHeader}>
                  <View style={styles.planTitleContainer}>
                    <Text style={[styles.planTitleEmoji, pkg.name.toLowerCase() !== 'miễn phí' && styles.premiumEmoji]}>{pkg.name.toLowerCase() === 'miễn phí' ? '🆓' : '🏅'}</Text>
                    <Text style={[styles.planTitle, pkg.name.toLowerCase() !== 'miễn phí' && styles.premiumTitle]}>{pkg.name}</Text>
                  </View>
                  <Text style={[styles.planPrice, pkg.name.toLowerCase() !== 'miễn phí' && styles.premiumPrice]}>
                    <Text style={pkg.name.toLowerCase() !== 'miễn phí' ? styles.priceAmount2 : styles.priceAmount}>
                      {pkg.price === null || pkg.price === undefined
                        ? 'Liên hệ công ty'
                        : pkg.price === 0
                          ? '0đ'
                          : `${Number(pkg.price).toLocaleString()} VNĐ`}
                    </Text>
                    {(pkg.price !== null && pkg.price !== undefined) && (
                      <Text style={pkg.name.toLowerCase() !== 'miễn phí' ? styles.pricePeriod2 : styles.pricePeriod}>/tháng</Text>
                    )}
                  </Text>
                </View>
                <View style={styles.featuresContainer}>
                  {(Array.isArray(pkg.description)
                    ? pkg.description
                    : pkg.description.split(/\n|\r|\r\n|,|\u2028|\u2029|\n/g).map(item => item.trim()).filter(Boolean)
                  ).map((desc, i) => (
                    <View key={i} style={styles.featureItem}>
                      <Ionicons name="checkmark-circle-outline" size={18} color={pkg.name.toLowerCase() !== 'miễn phí' ? '#fff' : '#353859'} style={{marginRight: 6}} />
                      <Text style={[styles.featureText, pkg.name.toLowerCase() !== 'miễn phí' && styles.premiumFeatureText]}>{desc}</Text>
                    </View>
                  ))}
                </View>
                {pkg.name.trim().toLowerCase() === 'dài hạn' ? (
                  <TouchableOpacity
                    style={styles.purchaseButton}
                    onPress={() => {
                      Linking.openURL('https://www.facebook.com/profile.php?id=61576085227183');
                    }}
                  >
                    <Text style={styles.purchaseButtonText}>Liên hệ</Text>
                  </TouchableOpacity>
                ) : (
                  pkg.price === 0 ? (
                    <TouchableOpacity style={styles.currentButton}>
                      <Text style={styles.currentButtonText}>Đang sử dụng</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.purchaseButton}
                      onPress={() => handlePurchase(pkg)}
                    >
                      <Text style={styles.purchaseButtonText}>Nâng cấp ngay</Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            ))}
          </View>
        )}
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
