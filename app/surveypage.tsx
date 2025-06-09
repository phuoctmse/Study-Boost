import { router } from "expo-router";
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { account } from "../api/index";
import { getSurveyQuestions } from "../api/survey/survey";
import { SurveyQuestion } from "../types/survey_question";

export default function Survey() {
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch user ID and survey questions when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // First try to get the current user
        let user;
        try {
          user = await account.get();
          setUserId(user.$id);
        } catch (err) {
          // If getting user fails, redirect to login
          console.error("Authentication error:", err);
          router.replace("/login");
          return;
        }

        // Only fetch survey questions if we have a valid user
        if (user) {
          const response = await getSurveyQuestions();
          if (response?.documents) {
            // Map the documents to match SurveyQuestion type
            const mappedQuestions: SurveyQuestion[] = response.documents.map(doc => ({
              id: doc.$id,
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

  const handleOptionSelect = async (optionValue: string) => {
    if (!currentQuestion || !userId) return;

    setSubmitting(true);
    try {
      // Save the user's response
      // await saveSurveyResponse({
      //   userId,
      //   question_id: currentQuestion.id || "",
      //   response: optionValue,
      //   submited_at: new Date(),
      // });

      // Move to the next question or finish the survey
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // All questions answered, navigate to the authenticated route
        router.replace("/(authenticated)/pomodoro");
      }
    } catch (err: any) {
      console.error("Error saving response:", err);
      setError("Failed to save your answer. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
        <TouchableOpacity style={styles.retryButton} onPress={() => router.replace("/surveypage" as any)}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        {currentQuestion ? (
          <>
            <Text style={styles.questionText}>
              {currentQuestion.question_text}
            </Text>
            
            <View style={styles.optionsContainer}>
              {currentQuestion.options?.map((option, index) => (
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
});
