import { sendSurveyToN8n } from "@/api/study-schedule/study_schedule";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { getSurveyQuestions } from "../api/survey/survey";
import { SurveyQuestion } from "../types/survey_question";

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
  const { user_id: userIdParam } = useLocalSearchParams();

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

  const currentQuestion = questions[currentQuestionIndex];

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
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTextResponse("");
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
          
          setTimeout(() => {
            router.replace("/(authenticated)/pomodoro");
          }, 2000);

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
        <ActivityIndicator size="large" color="#E68E56" />
        <Text style={styles.loadingText}>Loading survey...</Text>
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

  if (surveyCompleted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.congratsContainer}>
          <Text style={styles.pageTitle}>
            Before you start learning, let us know a bit about you
          </Text>
          <Ionicons name="checkmark-circle" size={80} color="#EEAD78" />
          <Text style={styles.congratsTitle}>Congratulations!</Text>
          <Text style={styles.congratsText}>
            You`ve completed the survey. Thank you for sharing about yourself!
          </Text>
          <Text style={styles.congratsDescription}>
            Let`s start your learning journey! We`ve prepared some great study tools for you.
          </Text>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={navigateToPomodoroTimer}
          >
            <Text style={styles.continueButtonText}>Continue to App</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.pageTitle}>
          Before you start learning, let us know a bit about you
        </Text>

        {currentQuestion ? (
          <>
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
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your answer..."
                  placeholderTextColor="#CCCCCC"
                  value={textResponse}
                  onChangeText={setTextResponse}
                  multiline={true}
                  numberOfLines={4}
                  maxLength={200}
                />
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleTextSubmit}
                  disabled={submitting || textResponse.trim().length === 0}
                >
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>
                Question {currentQuestionIndex + 1} of {questions.length}
              </Text>
            </View>
          </>
        ) : (
          <Text style={styles.noQuestionsText}>
            No survey questions available.
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#737AA8", // Dark purple background from the image
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  questionText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 40,
  },
  optionsContainer: {
    width: "100%",
    marginVertical: 20,
  },
  optionButton: {
    backgroundColor: "#EEAD78", // Orange color for buttons from the image
    borderRadius: 25,
    padding: 15,
    marginVertical: 8,
    alignItems: "center",
    width: "100%",
  },
  optionText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  textInputContainer: {
    width: "100%",
    marginVertical: 20,
  },
  textInput: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    padding: 15,
    color: "#333333",
    fontSize: 16,
    textAlignVertical: "top",
    minHeight: 120,
    width: "100%",
  },
  submitButton: {
    backgroundColor: "#EEAD78",
    borderRadius: 25,
    padding: 15,
    marginTop: 15,
    alignItems: "center",
    width: "100%",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  progressContainer: {
    marginTop: 40,
  },
  progressText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#737AA8",
  },
  loadingText: {
    marginTop: 15,
    color: "#FFFFFF",
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#737AA8",
    padding: 20,
  },
  errorText: {
    color: "#FFFFFF",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#E68E56",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  noQuestionsText: {
    color: "#FFFFFF",
    fontSize: 18,
    textAlign: "center",
  },
  // Congratulations screen styles
  congratsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  congratsTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 20,
    marginBottom: 15,
  },
  congratsText: {
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 15,
  },
  congratsDescription: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 40,
    opacity: 0.9,
  },
  continueButton: {
    backgroundColor: "#EEAD78",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: "center",
    marginTop: 20,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
