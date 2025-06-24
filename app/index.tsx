import { getSurveyQuestions } from "@/api/survey/survey";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Models } from "react-native-appwrite";
import { SafeAreaView } from "react-native-safe-area-context";
import { getCurrentUser, logout } from "../api/auth";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: '1',
    image: require('../assets/images/QLTG.jpg'),
    title: 'Quản lý thời gian',
    description: 'Tối ưu hoá việc học tập với kỹ thuật Pomodoro'
  },
  {
    id: '2',
    image: require('../assets/images/DTTT.jpg'),
    title: 'Duy trì tập trung',
    description: 'Tránh phân tâm và tạo thói quen học tập hiệu quả'
  },
  {
    id: '3',
    image: require('../assets/images/KNCDHT.jpg'),
    title: 'Kết nối',
    description: 'Học tập cùng cộng đồng và chia sẻ thành tích'
  },
];

export default function Index() {
  const [loggedInUser, setLoggedInUser] =
    useState<Models.User<Models.Preferences> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      try {
        const user = await getCurrentUser();
        console.log("Current User:", user);
        console.log(isLoading);
        setLoggedInUser(user);
      } catch (error) {
        console.log("No active session");
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
    getSurveyQuestions();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setLoggedInUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0]?.index || 0);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#737AA8" size="large" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#737AA8" />
      {loggedInUser ? (
        // If user is logged in, redirect to pomodoro page
        (() => {
          // Ensure we're using replace to avoid back navigation issues
          setTimeout(() => router.replace("/pomodoro"), 100);
          return (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#353859" size="large" />
              <Text style={{ marginTop: 10 }}>
                Redirecting to Pomodoro Timer...
              </Text>
            </View>
          );
        })()
      ) : (
        // User is not logged in - show redesigned app landing page
        <View style={styles.contentContainer}>
          {/* App Header */}
          <View style={styles.appHeader}>
            <Image
              source={require("../assets/images/icon.png")}
              style={styles.headerIcon}
              resizeMode="contain"
            />
          </View>
          
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Hero Section with Background */}
            <ImageBackground
              source={require("../assets/images/icon.png")}
              style={styles.heroBackground}
              imageStyle={{ opacity: 0.1 }}
            >
              <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>
                  Nâng cao hiệu quả học tập với AI & Gamification!
                </Text>
                <Text style={styles.heroSubtitle}>
                  Quản lý thời gian và duy trì tập trung hiệu quả
                </Text>
              </View>
            </ImageBackground>

            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity 
                style={styles.primaryActionButton}
                onPress={() => router.push("/register")}
              >
                <Text style={styles.primaryActionText}>Đăng ký ngay</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.secondaryActionButton}
                onPress={() => router.push("/login")}
              >
                <Text style={styles.secondaryActionText}>Đã có tài khoản? Đăng nhập</Text>
              </TouchableOpacity>
            </View>

            {/* Info Slide View with Dot Indicators */}
            <View style={styles.slideViewContainer}>
              <FlatList
                data={slides}
                renderItem={({ item }) => (
                  <View style={styles.slideItem}>
                    <Image
                      source={item.image}
                      style={styles.slideImage}
                      resizeMode="cover"
                    />
                    <Text style={styles.slideTitle}>{item.title}</Text>
                    <Text style={styles.slideDescription}>{item.description}</Text>
                  </View>
                )}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                bounces={false}
                keyExtractor={(item) => item.id}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                  { useNativeDriver: false }
                )}
                onViewableItemsChanged={viewableItemsChanged}
                viewabilityConfig={viewConfig}
                ref={slidesRef}
              />
              
              {/* Dot Indicators */}
              <View style={styles.dotIndicatorsContainer}>
                {slides.map((_, index) => {
                  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
                  
                  const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [8, 16, 8],
                    extrapolate: 'clamp'
                  });
                  
                  const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.3, 1, 0.3],
                    extrapolate: 'clamp'
                  });
                  
                  return (
                    <Animated.View
                      key={index.toString()}
                      style={[
                        styles.dot,
                        {
                          width: dotWidth,
                          opacity: opacity,
                          backgroundColor: index === currentIndex ? '#3a3b5c' : '#d4d4d4'
                        }
                      ]}
                    />
                  );
                })}
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Image
                source={require("../assets/images/icon.png")}
                style={styles.footerLogo}
                resizeMode="contain"
              />
              <Text style={styles.footerText}>© 2023 Study Boost</Text>
            </View>
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f6f8",
  },
  loadingText: {
    marginTop: 12,
    color: "#353859",
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
  },
  contentContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  appHeader: {
    backgroundColor: "#737AA8",
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    elevation: 4,
  },
  headerIcon: {
    width: 150,
    height: 40,
  },
  
  // Hero Section
  heroBackground: {
    backgroundColor: "#737AA8",
    padding: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
  },
  heroContent: {
    alignItems: "center",
    paddingVertical: 30,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    opacity: 0.9,
  },
  
  // Action Buttons
  actionButtonsContainer: {
    padding: 20,
    marginTop: -20,
  },
  primaryActionButton: {
    backgroundColor: "#3a3b5c",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  primaryActionText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 8,
  },
  secondaryActionButton: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryActionText: {
    color: "#353859",
    fontSize: 16,
  },
  
  // Info Slide View
  slideViewContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  slideItem: {
    width: width,
    alignItems: 'center',
    padding: 20,
  },
  slideImage: {
    width: width * 0.8,
    height: width * 0.6,
    borderRadius: 20,
    marginBottom: 20,
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#353859',
    marginBottom: 10,
    textAlign: 'center'
  },
  slideDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  dotIndicatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  
  // Final CTA Section
  finalCtaContainer: {
    backgroundColor: '#737AA8',
    borderRadius: 20,
    padding: 30,
    marginHorizontal: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  finalCtaTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 30,
  },
  ctaRegisterButton: {
    backgroundColor: "#fcc89b",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: 200,
    alignItems: "center",
    elevation: 3,
  },
  ctaRegisterText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  ctaLoginButton: {
    backgroundColor: "#3a3b5c",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: 200,
    alignItems: "center",
    elevation: 3,
  },
  ctaLoginText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  
  // Footer
  footer: {
    padding: 20,
    alignItems: "center",
    marginTop: 20,
  },
  footerLogo: {
    width: 100,
    height: 30,
    marginBottom: 10,
  },
  footerText: {
    color: "#666",
    fontSize: 14,
  },
  
  // Keep existing styles that might be used elsewhere
  headerButtons: {
    flexDirection: "row",
  },
  headerLoginButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "#fcc89b",
    borderColor: "#fff",
    marginRight: 10,
  },
  headerLoginText: {
    color: "#fff",
    fontWeight: "500",
  },
  headerSignupButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "#3a3b5c",
  },
  headerSignupText: {
    color: "#fff",
    fontWeight: "500",
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  actionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    width: "30%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  actionText: {
    marginTop: 10,
    color: "#333",
    fontWeight: "500",
  },
  studyTips: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#353859",
  },
  tipText: {
    color: "#555",
    lineHeight: 22,
  },
});


