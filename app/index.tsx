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
    title: 'Calculate more quickly and precisely',
    description: 'Tối ưu hoá việc học tập với kỹ thuật Pomodoro'
  },
  {
    id: '2',
    image: require('../assets/images/DTTT.jpg'),
    title: 'Strengthen your focus while reading',
    description: 'Tránh phân tâm và tạo thói quen học tập hiệu quả'
  },
  {
    id: '3',
    image: require('../assets/images/KNCDHT.jpg'),
    title: 'Connect with study community',
    description: 'Học tập cùng cộng đồng và chia sẻ thành tích'
  },
];

export default function Index() {
  const [loggedInUser, setLoggedInUser] =
    useState<Models.User<Models.Preferences> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

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
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      
      setTimeout(() => {
        setCurrentSlideIndex(currentSlideIndex + 1);
      }, 200);
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
        <ActivityIndicator color="#737AA8" size="large" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fc" />
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
        // Onboarding slides
        <View style={styles.onboardingContainer}>
          {/* Progress bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${((currentSlideIndex + 1) / slides.length) * 100}%` }
                ]} 
              />
            </View>
          </View>

          {/* Skip button */}
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={handleSkip}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>

          {/* Slide content */}
          <Animated.View style={[styles.slideContent, { opacity: fadeAnim }]}>
            <View style={styles.imageContainer}>
              <Image
                source={slides[currentSlideIndex].image}
                style={styles.slideImage}
                resizeMode="contain"
              />
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.slideTitle}>
                {slides[currentSlideIndex].title}
              </Text>
              <Text style={styles.slideDescription}>
                {slides[currentSlideIndex].description}
              </Text>
            </View>
          </Animated.View>

          {/* Bottom buttons */}
          <View style={styles.bottomButtons}>
            <TouchableOpacity 
              style={styles.noButton}
              onPress={handleSkip}
            >
              <Text style={styles.noButtonText}>No</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.yesButton}
              onPress={handleNext}
            >
              <Text style={styles.yesButtonText}>Yes</Text>
            </TouchableOpacity>
          </View>

          {/* Page indicator */}
          <View style={styles.pageIndicator}>
            <View style={styles.indicatorLine} />
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
  onboardingContainer: {
    flex: 1,
    backgroundColor: "#f8f9fc",
    paddingTop: 20,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
  },
  progressFill: {
    height: 4,
    backgroundColor: "#4a4a4a",
    borderRadius: 2,
  },
  skipButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
  },
  skipText: {
    fontSize: 16,
    color: "#666",
  },
  slideContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  slideImage: {
    width: width * 0.7,
    height: width * 0.7,
    maxHeight: 300,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 32,
  },
  slideDescription: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 40,
    marginBottom: 30,
  },
  noButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 25,
    minWidth: 100,
    alignItems: "center",
  },
  noButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  yesButton: {
    backgroundColor: "#4a4a4a",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 25,
    minWidth: 100,
    alignItems: "center",
  },
  yesButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  pageIndicator: {
    alignItems: "center",
    paddingBottom: 20,
  },
  indicatorLine: {
    width: 134,
    height: 5,
    backgroundColor: "#4a4a4a",
    borderRadius: 2.5,
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


