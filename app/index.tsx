import { getSurveyQuestions } from "@/api/survey/survey";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
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
    title: 'Đặt thời gian tập trung',
    description: 'Tránh phân tâm và tạo thói quen học tập hiệu quả'
  },
  {
    id: '3',
    image: require('../assets/images/KNCDHT.jpg'),
    title: 'Kết nối cộng đồng học tập',
    description: 'Học tập cùng cộng đồng và chia sẻ thành tích'
  },
];

export default function Index() {
  const [loggedInUser, setLoggedInUser] =
    useState<Models.User<Models.Preferences> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

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

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -width,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentSlideIndex(currentSlideIndex + 1);
        slideAnim.setValue(width);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
    } else {
      // Last slide - navigate to login
      router.push("/login");
    }
  };

  const handleSkip = () => {
    router.push("/login");
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#4D4F75" size="large" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const getButtonText = () => {
    if (currentSlideIndex === slides.length - 1) {
      return 'Get Started';
    }
    return 'Next';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      {loggedInUser ? (
        // If user is logged in, redirect to pomodoro page
        (() => {
          setTimeout(() => router.replace("/pomodoro"), 100);
          return (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#4D4F75" size="large" />
              <Text style={styles.redirectText}>
                Redirecting to Pomodoro Timer...
              </Text>
            </View>
          );
        })()
      ) : (
        // Onboarding slides
        <View style={styles.onboardingContainer}>
          {/* Header with progress and skip */}
          <View style={styles.header}>
            <View style={styles.progressContainer}>
              <View style={styles.progressTrack}>
                <Animated.View 
                  style={[
                    styles.progressBar,
                    { 
                      width: `${((currentSlideIndex + 1) / slides.length) * 100}%` 
                    }
                  ]} 
                />
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.skipButton}
              onPress={handleSkip}
              activeOpacity={0.7}
            >
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>

          {/* Logo section */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Main content */}
          <View style={styles.contentContainer}>
            <Animated.View 
              style={[
                styles.slideContent, 
                { 
                  opacity: fadeAnim,
                  transform: [{ translateX: slideAnim }]
                }
              ]}
            >
              {/* Image section */}
              <View style={styles.imageSection}>
                <Image
                  source={slides[currentSlideIndex].image}
                  style={styles.slideImage}
                  resizeMode="contain"
                />
              </View>

              {/* Text section */}
              <View style={styles.textSection}>
                <Text style={styles.slideTitle}>
                  {slides[currentSlideIndex].title}
                </Text>
                <Text style={styles.slideDescription}>
                  {slides[currentSlideIndex].description}
                </Text>
              </View>
            </Animated.View>
          </View>

          {/* Bottom section */}
          <View style={styles.bottomSection}>
            {/* Action buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.skipBottomButton}
                onPress={handleSkip}
                activeOpacity={0.8}
              >
                <Text style={styles.skipBottomButtonText}>Skip</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.nextButton,
                  currentSlideIndex === slides.length - 1 && styles.getStartedButton
                ]}
                onPress={handleNext}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.nextButtonText,
                  currentSlideIndex === slides.length - 1 && styles.getStartedButtonText
                ]}>
                  {getButtonText()}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Page indicators */}
            <View style={styles.indicatorContainer}>
              {slides.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    {
                      backgroundColor: index === currentSlideIndex ? '#4D4F75' : '#e5e7eb',
                      width: index === currentSlideIndex ? 24 : 8,
                    }
                  ]}
                />
              ))}
            </View>

            {/* Bottom safe area */}
            <View style={styles.bottomSafeArea} />
          </View>
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
    backgroundColor: "#ffffff",
  },
  loadingText: {
    marginTop: 16,
    color: "#6b7280",
    fontSize: 16,
    fontWeight: '500',
  },
  redirectText: {
    marginTop: 16,
    color: "#6b7280",
    fontSize: 16,
    fontWeight: '500',
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  onboardingContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingTop: 8,
  },
  progressContainer: {
    flex: 1,
    marginRight: 16,
  },
  progressTrack: {
    height: 3,
    backgroundColor: "#f3f4f6",
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: "#4D4F75",
    borderRadius: 1.5,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  skipText: {
    fontSize: 16,
    color: "#9ca3af",
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  slideContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imageSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 20,
  },
  slideImage: {
    width: width * 0.85,
    height: width * 0.85,
    maxHeight: 400,
  },
  textSection: {
    alignItems: "center",
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 36,
  },
  slideDescription: {
    fontSize: 17,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 26,
    fontWeight: '400',
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    gap: 16,
  },
  skipBottomButton: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: 'center',
  },
  skipBottomButtonText: {
    fontSize: 17,
    color: "#374151",
    fontWeight: "600",
  },
  nextButton: {
    flex: 1,
    backgroundColor: "#4D4F75",
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: 17,
    color: "#ffffff",
    fontWeight: "600",
  },
  getStartedButton: {
    backgroundColor: "#FCC89B",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  getStartedButtonText: {
    fontSize: 18,
    color: "#4D4F75",
    fontWeight: "700",
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  bottomSafeArea: {
    height: 16,
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  logo: {
    width: 120,
    height: 80,
  },
});