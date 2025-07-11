import { sendSurveyToN8n } from "@/api/study-schedule/study_schedule";
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { getSurveyQuestions } from "../api/survey/survey";
import LoadingSurvey from '../components/LoadingSurvey';
import SurveyTransition from '../components/SurveyTransition';
import { SurveyQuestion } from "../types/survey_question";

const { width } = Dimensions.get('window');

export default function Survey() {
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [textResponse, setTextResponse] = useState<string>("");
  const [surveyCompleted, setSurveyCompleted] = useState<boolean>(false);
  const [responses, setResponses] = useState<{ questionId: string; response: string }[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showTransition, setShowTransition] = useState(false);
  const [transitionIndex, setTransitionIndex] = useState(0);
  const { user_id: userIdParam } = useLocalSearchParams();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (typeof userIdParam === "string") {
          setUserId(userIdParam);
        } else if (Array.isArray(userIdParam)) {
          setUserId(userIdParam[0]);
        } else {
          setUserId(null);
          router.replace("/login" as any);
          return;
        }

        const response = await getSurveyQuestions();
        if (response?.documents) {
          const mappedQuestions: SurveyQuestion[] = response.documents.map(doc => ({
            id: doc.$id, // Ensure $id is always a string
            question_text: doc.question_text,
            question_type: doc.question_type,
            category: doc.category,
            created_at: new Date(doc.created_at),
            updated_at: new Date(doc.updated_at),
            options: doc.options,
            question_no: doc.question_no
          }));
          setQuestions(mappedQuestions);
        }
      } catch (err: any) {
        console.error("Error fetching survey data:", err);
        setError("Failed to load survey. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Animation effect when question changes
  useEffect(() => {
    // Reset animations
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    
    // Set progress value based on current question
    const progressValue = questions.length > 0 ? 
      (currentQuestionIndex + 1) / questions.length : 0;
    
    // Run animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic)
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic)
      }),
      Animated.timing(progressAnim, {
        toValue: progressValue,
        duration: 600,
        useNativeDriver: false,
        easing: Easing.inOut(Easing.cubic)
      })
    ]).start();
  }, [currentQuestionIndex, questions]);

  const currentQuestion = questions[currentQuestionIndex];
  
  const getQuestionIcon = () => {
    if (!currentQuestion) return "help-circle";
    
    // Choose icon based on question content
    if (currentQuestion.question_text.toLowerCase().includes("time") || 
        currentQuestion.question_text.toLowerCase().includes("hour") ||
        currentQuestion.question_text.toLowerCase().includes("when")) {
      return "time";
    } else if (currentQuestion.question_text.toLowerCase().includes("goal") ||
              currentQuestion.question_text.toLowerCase().includes("target") ||
              currentQuestion.question_text.toLowerCase().includes("aim")) {
      return "flag";
    } else if (currentQuestion.question_text.toLowerCase().includes("subject") ||
              currentQuestion.question_text.toLowerCase().includes("learn") ||
              currentQuestion.question_text.toLowerCase().includes("study")) {
      return "book";
    } else if (currentQuestion.question_text.toLowerCase().includes("preference") ||
              currentQuestion.question_text.toLowerCase().includes("like")) {
      return "heart";
    }
    
    return "help-circle";
  };

  const handleSubmit = async (response: string) => {
    if (!currentQuestion || !userId || userId.trim() === "") {
      setError("Invalid user ID or question data. Please try again.");
      router.replace("/login" as any);
      return;
    }

    if (!currentQuestion.id) {
      setError("Invalid question ID. Please try again.");
      return;
    }

    setSubmitting(true);

    try {
      const newResponse = { questionId: currentQuestion.id, response };
      const updatedResponses = [...responses, newResponse];

      if (currentQuestionIndex < questions.length - 1) {
        setResponses(updatedResponses);
        setTransitionIndex(currentQuestionIndex);
        setShowTransition(true);
        
        // The transition component will call this function when complete
        const proceedToNextQuestion = () => {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setTextResponse("");
          setShowTransition(false);
        };
        
        // Or directly set timeout if you don't want to use the component
        // setTimeout(proceedToNextQuestion, 2000);
      } else {
        setIsSaving(true);
        try {
          console.log("Final survey responses:", {
            userId,
            totalResponses: updatedResponses.length,
            responses: updatedResponses
          });

          const data = await sendSurveyToN8n(userId, updatedResponses);
          console.log('N8N Response:', data);

          setResponses([]);
          setSurveyCompleted(true);
        } catch (error: any) {
          console.error("Error sending to n8n:", error);
          setError(`Failed to process survey: ${error.message}`);
        } finally {
          setIsSaving(false);
        }
      }
    } catch (err: any) {
      console.error("Error processing response:", err);
      setError("Failed to submit survey response. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOptionSelect = (optionValue: string) => {
    handleSubmit(optionValue);
  };

  const handleTextSubmit = () => {
    if (textResponse.trim().length === 0) {
      return;
    }
    handleSubmit(textResponse);
  };

  const navigateToPomodoroTimer = () => {
    router.replace("/(authenticated)/pomodoro");
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Image 
          source={require('../assets/images/icon.png')} 
          style={styles.loadingLogo} 
          resizeMode="contain"
        />
        <ActivityIndicator size="large" color="#FCC89B" />
        <Text style={styles.loadingText}>Preparing your survey...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.replace("surveypage" as any)}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (isSaving) {
    return (
      <LoadingSurvey loading={true} message="Chờ AI tạo lịch học cho bạn" />
    );
  }

  if (surveyCompleted) {
    return (
      <LoadingSurvey 
        loading={false} 
        onCheckSchedule={() => router.replace('/(authenticated)/schedule')} 
      />
    );
  }

  if (showTransition) {
    return (
      <SurveyTransition 
        index={transitionIndex + 1}
        total={questions.length}
        onComplete={() => {
          setCurrentQuestionIndex(transitionIndex + 1);
          setTextResponse("");
          setShowTransition(false);
        }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with progress */}
      <View style={styles.header}>
        <View style={styles.progressBarContainer}>
          <Animated.View 
            style={[
              styles.progressBar, 
              { width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%']
              }) }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {currentQuestionIndex + 1} of {questions.length}
        </Text>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.pageTitle}>
          Let's personalize your learning experience
        </Text>

        {currentQuestion ? (
          <Animated.View 
            style={[
              styles.questionCard,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <View style={styles.questionIconContainer}>
              <Ionicons name={getQuestionIcon() as any} size={32} color="#737AA8" />
            </View>
            
            <Text style={styles.questionNumber}>Question {currentQuestionIndex + 1}</Text>
            <Text style={styles.questionText}>
              {currentQuestion.question_text}
            </Text>

            {currentQuestion.options && currentQuestion.options.length > 0 ? (
              <View style={styles.optionsContainer}>
                {currentQuestion.options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.optionButton}
                    onPress={() => handleOptionSelect(option)}
                    disabled={submitting}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                    <AntDesign name="right" size={18} color="rgba(255,255,255,0.6)" />
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Type your answer here..."
                  placeholderTextColor="#AAAAAA"
                  value={textResponse}
                  onChangeText={setTextResponse}
                  multiline={true}
                  numberOfLines={4}
                  maxLength={200}
                />
                <View style={styles.characterCounter}>
                  <Text style={styles.characterCounterText}>{textResponse.length}/200</Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    {opacity: textResponse.trim().length === 0 ? 0.7 : 1}
                  ]}
                  onPress={handleTextSubmit}
                  disabled={submitting || textResponse.trim().length === 0}
                >
                  {submitting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Text style={styles.submitButtonText}>Submit</Text>
                      <Ionicons name="paper-plane" size={18} color="#FFFFFF" />
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        ) : (
          <View style={styles.noQuestionsCard}>
            <MaterialCommunityIcons name="alert-circle-outline" size={60} color="#FCC89B" />
            <Text style={styles.noQuestionsText}>
              No survey questions available.
            </Text>
          </View>
        )}
        
        <View style={styles.surveyInfo}>
          <MaterialCommunityIcons name="shield-lock-outline" size={16} color="#FFFFFF" />
          <Text style={styles.surveyInfoText}>
            Your answers help us create a personalized learning plan
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#737AA8",
    paddingTop:70,
  },
  header: {
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FCC89B',
    borderRadius: 4,
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'right',
    opacity: 0.8,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    paddingTop: 10,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  questionCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
    paddingTop: 45,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    position: 'relative',
  },
  questionIconContainer: {
    position: 'absolute',
    top: -25,
    left: '50%',
    marginLeft: -25,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionNumber: {
    fontSize: 14,
    color: '#737AA8',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '600',
  },
  questionText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#353859",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 30,
  },
  optionsContainer: {
    width: "100%",
    marginVertical: 10,
  },
  optionButton: {
    backgroundColor: "#EEAD78", 
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'space-between',
    width: "100%",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  optionText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  textInputContainer: {
    width: "100%",
    marginVertical: 10,
  },
  textInput: {
    backgroundColor: "rgba(240, 240, 240, 0.8)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    color: "#333333",
    fontSize: 16,
    textAlignVertical: "top",
    minHeight: 120,
    width: "100%",
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  characterCounter: {
    alignSelf: 'flex-end',
    marginTop: 6,
  },
  characterCounterText: {
    color: '#777777',
    fontSize: 12,
  },
  submitButton: {
    backgroundColor: "#EEAD78",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    marginRight: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#737AA8",
  },
  loadingLogo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 15,
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: '500',
  },
  noQuestionsCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noQuestionsText: {
    color: "#353859",
    fontSize: 18,
    textAlign: "center",
    marginTop: 15,
  },
  surveyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(53, 56, 89, 0.3)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  surveyInfoText: {
    color: "#FFFFFF",
    fontSize: 14,
    marginLeft: 8,
    opacity: 0.9,
  },
  errorContainer: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#737AA8",
  padding: 30,
},
errorText: {
  color: "#FFFFFF",
  fontSize: 18,
  textAlign: "center",
  marginBottom: 24,
  lineHeight: 26,
},
retryButton: {
  backgroundColor: "#EEAD78",
  paddingVertical: 14,
  paddingHorizontal: 32,
  borderRadius: 12,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.15,
  shadowRadius: 5,
  elevation: 3,
},
retryButtonText: {
  color: "#FFFFFF",
  fontSize: 16,
  fontWeight: "600",
},
});
