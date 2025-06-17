import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { forgotPassword, login } from "../api/auth";
import LoadingScreen from "../components/LoadingScreen";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState<string | null>(null);

  async function handleLogin() {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // For Appwrite authentication, password must be at least 8 characters
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      // Use the Appwrite login function from the API
      await login(email, password);

      // Navigate to the authenticated layout with pomodoro page
      router.replace("/(authenticated)/pomodoro");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(
        err.message || "Failed to login. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    
    setForgotPasswordLoading(true);
    setForgotPasswordMessage(null);
    setError(null);
    
    try {
      await forgotPassword(email);
      setForgotPasswordMessage("Password recovery email sent! Please check your inbox.");
    } catch (err: any) {
      setError(err.message || "Failed to send recovery email. Please try again.");
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && <LoadingScreen message="Logging in..." />}
      
      {/* Back Arrow Button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.replace("/")}
      >
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.loginContent}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/icon.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.welcomeText}>Welcome back!</Text>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={20} color="#d32f2f" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#99A"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#99A"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#99A"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.troubleRow}>
            <Text style={styles.troubleText}>
              Please enter your login credentials
            </Text>
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#353859" />
            ) : (
              <Text style={styles.loginButtonText}>Sign in</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don`t have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/register")}>
              <Text style={styles.registerLink}>Register Now</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Forgot password? </Text>
            <TouchableOpacity onPress={handleForgotPassword} disabled={forgotPasswordLoading}>
              <Text style={styles.registerLink}>
                {forgotPasswordLoading ? "Sending..." : "Click here"}
              </Text>
            </TouchableOpacity>
          </View>
          {forgotPasswordMessage && (
            <Text style={styles.successMessage}>{forgotPasswordMessage}</Text>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4D4F75",
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 50,
    left: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  keyboardView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loginContent: {
    width: "100%",
    maxWidth: 350,
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 60,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffebee",
    padding: 10,
    borderRadius: 6,
    marginBottom: 20,
    width: "100%",
  },
  errorText: {
    color: "#d32f2f",
    marginLeft: 10,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 16,
    position: "relative",
  },
  input: {
    backgroundColor: "#FFFFFF",
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    color: "#333",
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    top: 15,
  },
  troubleRow: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 4,
  },
  troubleText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#FCC89B",
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
    width: "100%",
  },
  loginButtonText: {
    color: "#353859",
    fontSize: 16,
    fontWeight: "600",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  registerText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  registerLink: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  successMessage: {
    color: "#4CAF50",
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
  },
});
