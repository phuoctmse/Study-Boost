import { useState, useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator,
  Image,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { account } from '../lib/appwrite';
import { Ionicons } from '@expo/vector-icons';
import LoadingScreen from '../components/LoadingScreen';

export default function Login() {
  const [email, setEmail] = useState('user@example');
  const [password, setPassword] = useState('1234');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // Set default credentials on component mount
  useEffect(() => {
    setEmail('user@example');
    setPassword('1234');
  }, []);  async function handleLogin() {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    // Check for hardcoded credentials
    if (email === 'user@example' && password === '1234') {
      try {
        // If hardcoded credentials match, create an anonymous session
        // This is just for demo purposes - in a real app, always use secure authentication
        await account.createAnonymousSession();
        
        // Navigate to the authenticated layout with pomodoro page
        router.replace('/(authenticated)/pomodoro');
      } catch (err: any) {
        console.error("Login error:", err);
        setError(err.message || 'Failed to login. Please try again.');
      } finally {
        setIsLoading(false);
      }
      return;
    }
    
    // Regular login flow for other credentials
    try {
      // For regular credentials, ensure password meets Appwrite's requirements (min 8 chars)
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }
      
      await account.createEmailPasswordSession(email, password);
      router.replace('/(authenticated)/pomodoro');
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      {isLoading && <LoadingScreen message="Logging in..." />}
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.loginContent}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/images/icon.png')} 
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
              placeholder="Username"
              placeholderTextColor="#99A"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              defaultValue="user@example"
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
              defaultValue="1234"
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
          </View>          <View style={styles.troubleRow}>
            <Text style={styles.troubleText}>
              Demo credentials: user@example / 1234
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

          <TouchableOpacity style={styles.googleButton}>
            <Ionicons name="logo-google" size={20} color="#353859" style={styles.googleIcon} />
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.registerLink}>Register Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4D4F75',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loginContent: {
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 60,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 6,
    marginBottom: 20,
    width: '100%',
  },
  errorText: {
    color: '#d32f2f',
    marginLeft: 10,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
    position: 'relative',
  },
  input: {
    backgroundColor: '#FFFFFF',
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    color: '#333',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 15,
  },
  troubleRow: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 4,
  },
  troubleText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#FCC89B',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  loginButtonText: {
    color: '#353859',
    fontSize: 16,
    fontWeight: '600',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCC89B',
    borderRadius: 25,
    paddingVertical: 14,
    width: '100%',
    marginBottom: 24,
  },
  googleIcon: {
    marginRight: 8,
  },
  googleButtonText: {
    color: '#353859',
    fontSize: 16,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  registerText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  registerLink: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
