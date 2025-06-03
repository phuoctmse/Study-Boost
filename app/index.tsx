import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Models } from 'react-native-appwrite';
import { SafeAreaView } from "react-native-safe-area-context";
import { getCurrentUser, logout } from '../api/auth';

const { width } = Dimensions.get('window');

export default function Index() {
  const [loggedInUser, setLoggedInUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      try {
        const user = await getCurrentUser();
        setLoggedInUser(user);
      } catch (error) {
        console.log("No active session");
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setLoggedInUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }
    return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#737AA8' }]}>
      <StatusBar barStyle="light-content" backgroundColor="#737AA8" />
      {loggedInUser ? (
        // If user is logged in, redirect to pomodoro page
        (() => {
          // Ensure we're using replace to avoid back navigation issues
          setTimeout(() => router.replace('/pomodoro'), 100);
          return (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#353859" size="large" />
              <Text style={{ marginTop: 10 }}>Redirecting to Pomodoro Timer...</Text>
            </View>
          );
        })()
      ) : (
        // User is not logged in - show homepage inspired by the web version
        <>
          <View style={styles.homeHeader}>
            <View style={styles.titleContainer}>
              <Image
                source={require('../assets/images/icon.png')}
                style={styles.headerIcon}
                resizeMode="contain"
              />
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity
                style={styles.headerLoginButton}
                onPress={() => router.push('/login')}
              >
                <Text style={styles.headerLoginText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerSignupButton}
                onPress={() => router.push('/register')}
              >
                <Text style={styles.headerSignupText}>Sign Up</Text>
              </TouchableOpacity>
            </View>          </View>

          <ScrollView style={styles.scrollView} contentContainerStyle={{ backgroundColor: '#f4f6f8' }}>
            {/* Hero Section */}
            <View style={styles.heroSection}>
              <View style={styles.heroContent}>
                <View style={styles.heroTextContainer}>
                  <Text style={styles.heroTitle}>
                    Nâng cao hiệu quả{'\n'}
                    học tập với{'\n'}
                    AI &{'\n'}
                    Gamification!
                  </Text>
                  <View style={styles.ctaButtons}>
                    <TouchableOpacity style={styles.trialButton}>
                      <Text style={styles.trialButtonText}>Dùng thử miễn phí</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.registerButton}
                      onPress={() => router.push('/register')}
                    >
                      <Text style={styles.registerButtonText}>Đăng ký ngay</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            {/* Features Section */}
            <View style={styles.featuresSection}>
              <View style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <Ionicons name="time-outline" size={40} color="#353859" />
                </View>
                <Text style={styles.featureTitle}>Quản lý thời gian</Text>
              </View>

              <View style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <Ionicons name="eye-outline" size={40} color="#353859" />
                </View>
                <Text style={styles.featureTitle}>Duy trì tập trung</Text>
              </View>

              <View style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <Ionicons name="people-outline" size={40} color="#353859" />
                </View>
                <Text style={styles.featureTitle}>Kết nối</Text>
              </View>
            </View>

            {/* Laptop/App Preview Section */}
            <View style={styles.laptopSection}>
              <View style={styles.laptopContainer}>
                <View style={styles.laptopScreen}>                  <Image
                  source={require('../assets/images/icon.png')}
                  style={[styles.appPreviewImage, { width: '70%', height: '70%' }]}
                  resizeMode="contain"
                />
                </View>
              </View>

              <View style={styles.bottomCta}>
                <Text style={styles.bottomCtaText}>Dùng thử miễn phí / Đăng ký ngay</Text>
                <View style={styles.bottomCtaButtons}>
                  <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => router.push('/login')}
                  >
                    <Text style={styles.loginButtonText}>Đăng nhập</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.registerButton, styles.bottomRegisterButton]}
                    onPress={() => router.push('/register')}
                  >
                    <Text style={styles.registerButtonText}>Đăng ký</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    // Removing backgroundColor here as we set it directly in the SafeAreaView
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  homeHeader: {
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
    width: 150,
    height: 50,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#353859',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerLoginButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#fcc89b',
    borderColor: '#fff',
    marginRight: 10,
  },
  headerLoginText: {
    color: '#fff',
    fontWeight: '500',
  },
  headerSignupButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#3a3b5c',
  },
  headerSignupText: {
    color: '#fff',
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  // Hero Section
  heroSection: {
    backgroundColor: '#737AA8',
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 100,
    marginTop: 0, // Ensure no gap between header and hero section
  },
  heroContent: {
    flexDirection: 'column', // Column layout for mobile
    alignItems: 'center',
  },
  heroTextContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  heroTitle: {
    fontSize: 38,  // Increased from 32
    fontWeight: 'bold',
    color: '#353859',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 46,  // Increased from 40
  },
  ctaButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    flexWrap: 'wrap',
  },
  trialButton: {
    backgroundColor: '#fcc89b',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    minWidth: 150,
  },
  trialButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: '#3a3b5c',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 10,
    minWidth: 150,
  },
  registerButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  heroImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  heroImage: {
    width: 250,  // Increased from 200
    height: 250, // Increased from 200
  },

  // Features Section
  featuresSection: {
    flexDirection: 'row',  // Changed from 'column' to 'row'
    flexWrap: 'wrap',      // Added to wrap items if needed
    justifyContent: 'space-between', // Added to distribute items evenly
    padding: 30,
    backgroundColor: '#fff',
  },
  featureCard: {
    alignItems: 'center',
    marginBottom: 30,
    width: '30%',  // Added to make cards take up approximately 1/3 of the width
  },
  featureIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#353859',
    textAlign: 'center',
  },

  // Laptop Section
  laptopSection: {
    backgroundColor: '#7c7db8',
    padding: 30,
    alignItems: 'center',
  },
  laptopContainer: {
    width: '90%',
    maxWidth: 350,
    backgroundColor: '#222',
    borderRadius: 20,
    padding: 15,
    paddingBottom: 0,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  laptopScreen: {
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    aspectRatio: 16 / 10,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appPreviewImage: {
    width: '50%',
    height: '50%',
  },
  bottomCta: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  bottomCtaText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  bottomCtaButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  loginButton: {
    backgroundColor: '#fcc89b',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  bottomRegisterButton: {
    marginRight: 0,
  },

  // Logged in user styles
  dashboardContainer: {
    flex: 1,
    padding: 20,
  },
  welcomeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeText: {
    fontSize: 18,
    marginLeft: 15,
    color: '#333',
  },
  userName: {
    fontWeight: 'bold',
    color: '#353859',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#333',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  actionText: {
    marginTop: 10,
    color: '#333',
    fontWeight: '500',
  },
  studyTips: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#353859',
  },
  tipText: {
    color: '#555',
    lineHeight: 22,
  },
});

