import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    ImageBackground,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const backgrounds = [
  '#737AA8', // Default - matches login page color
  '#3a506b', // Dark blue
  '#5e548e', // Purple
  '#606c38', // Green
  '#bc4749', // Red
];

const backgroundImages = [
  require('../../assets/images/background-1.jpg'),
  require('../../assets/images/background-2.jpg'),
];

// Time preset options in minutes
const timeOptions = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

const PomodoroScreen = () => {
  // Timer states
  const [timeSelected, setTimeSelected] = useState(25); // in minutes
  const [timeLeft, setTimeLeft] = useState(timeSelected * 60); // in seconds
  const [isActive, setIsActive] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  
  // UI states
  const [backgroundColor, setBackgroundColor] = useState(backgrounds[0]);
  const [backgroundImageIndex, setBackgroundImageIndex] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showVerification, setShowVerification] = useState(true);
  
  // Study goal
  const [dailyGoal] = useState(4 * 60); // 4 hours in minutes
  const [studiedToday, setStudiedToday] = useState(45); // minutes already studied today
  
  // Timer interval reference
  const timerRef = useRef<number | null>(null);
  // Reference for scrollview
  const scrollViewRef = useRef<ScrollView>(null);

  // Effect for timer countdown
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            if (timerRef.current !== null) {
              clearInterval(timerRef.current);
            }
            setIsActive(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000) as unknown as number;
    } else if (timeLeft === 0) {
      // Timer finished
      setIsActive(false);
      if (focusMode) {
        setFocusMode(false);
        // Update studied time when timer completes successfully
        setStudiedToday(prev => prev + timeSelected);
      }
    }
    
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, timeLeft]);

  // Effect to scroll to the currently selected time when component mounts
  useEffect(() => {
    if (scrollViewRef.current) {
      const selectedIndex = timeOptions.indexOf(timeSelected);
      if (selectedIndex >= 0) {
        // Scroll to position of selected time with some offset for centering
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            x: selectedIndex * 70 - width / 2 + 35,
            animated: false
          });
        }, 100);
      }
    }
  }, []);

  // Format time for display (MM:SS)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start the timer
  const startTimer = () => {
    setTimeLeft(timeSelected * 60);
    setIsActive(true);
    if (!focusMode) {
      setFocusMode(true);
    }
  };

  // Stop the timer with confirmation
  const stopTimer = () => {
    if (timeLeft > 0) {
      setShowConfirmation(true);
    } else {
      resetTimer();
    }
  };

  // Reset timer state
  const resetTimer = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
    }
    setIsActive(false);
    setFocusMode(false);
    setTimeLeft(timeSelected * 60);
  };

  // Select time option
  const selectTimeOption = (time: number) => {
    setTimeSelected(time);
    setTimeLeft(time * 60);
  };

  // Increment or decrement time
  const adjustTime = (increment: boolean) => {
    const currentIndex = timeOptions.indexOf(timeSelected);
    let newIndex;
    
    if (increment) {
      newIndex = Math.min(currentIndex + 1, timeOptions.length - 1);
    } else {
      newIndex = Math.max(currentIndex - 1, 0);
    }
    
    selectTimeOption(timeOptions[newIndex]);
    
    // Scroll to the new option
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: newIndex * 70 - width / 2 + 35,
        animated: true
      });
    }
  };

  // Change background image in focus mode
  const changeBackground = () => {
    setBackgroundImageIndex((backgroundImageIndex + 1) % backgroundImages.length);
  };

  // Calculate time left for daily goal
  const timeLeftForGoal = () => {
    const remaining = dailyGoal - studiedToday;
    if (remaining <= 0) return "Goal completed!";
    
    const hours = Math.floor(remaining / 60);
    const minutes = remaining % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m left to reach your daily goal`;
    }
    return `${minutes}m left to reach your daily goal`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {showVerification && (
        <View style={styles.verificationContainer}>
          <View style={styles.verificationContent}>
            <Ionicons name="checkmark-circle" size={40} color="#4CAF50" />
            <Text style={styles.verificationText}>Your account is verified, enjoy using app!</Text>
            <TouchableOpacity 
              style={styles.verificationButton}
              onPress={() => setShowVerification(false)}
            >
              <Text style={styles.verificationButtonText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {!focusMode ? (
        // Regular mode UI
        <View style={styles.content}>
          <Text style={styles.title}>Study with StudyBoost!</Text>
          
          <View style={styles.timerCard}>
            <TouchableOpacity 
              style={styles.timerDisplay} 
              onPress={startTimer}
            >
              <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            </TouchableOpacity>
            
            <View style={styles.timeAdjusterContainer}>
              <TouchableOpacity 
                style={styles.timeAdjustButton}
                onPress={() => adjustTime(false)}
              >
                <Ionicons name="chevron-back" size={24} color="#353859" />
              </TouchableOpacity>
              
              <View style={styles.timeScrollContainer}>
                <Text style={styles.timeLabel}>{timeSelected} minutes</Text>
                <ScrollView
                  ref={scrollViewRef}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.timeOptionsContainer}
                  decelerationRate="fast"
                  snapToInterval={70} // Each item width + margin
                >
                  {timeOptions.map((time) => (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.timeOption,
                        timeSelected === time && styles.selectedTimeOption
                      ]}
                      onPress={() => selectTimeOption(time)}
                    >
                      <Text 
                        style={[
                          styles.timeOptionText,
                          timeSelected === time && styles.selectedTimeText
                        ]}
                      >
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              
              <TouchableOpacity 
                style={styles.timeAdjustButton}
                onPress={() => adjustTime(true)}
              >
                <Ionicons name="chevron-forward" size={24} color="#353859" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.goalCard}>
            <Text style={styles.goalTitle}>Daily Study Goal</Text>
            <View style={styles.goalProgressContainer}>
              <View 
                style={[
                  styles.goalProgress, 
                  { width: `${(studiedToday / dailyGoal) * 100}%` }
                ]}
              />
            </View>
            <Text style={styles.goalText}>
              {studiedToday} / {dailyGoal} minutes
            </Text>
            <Text style={styles.goalRemaining}>
              {timeLeftForGoal()}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.startButton} 
            onPress={startTimer}
          >
            <Ionicons name="play" size={24} color="#fff" />
            <Text style={styles.startButtonText}>Start Focus Session</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Focus mode UI
        <ImageBackground 
          source={backgroundImages[backgroundImageIndex]}
          style={styles.focusModeContainer}
          resizeMode="contain"
        >
          <View style={styles.focusOverlay}>
            <Text style={styles.focusTimerText}>{formatTime(timeLeft)}</Text>
            <Text style={styles.focusMessage}>Stay focused with your study</Text>
            
            <View style={styles.focusButtonsRow}>
              <TouchableOpacity 
                style={styles.focusButton} 
                onPress={changeBackground}
              >
                <Ionicons name="image-outline" size={24} color="#fff" />
                <Text style={styles.focusButtonText}>Change Background</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.focusButton, styles.stopButton]} 
                onPress={stopTimer}
              >
                <Ionicons name="stop" size={24} color="#fff" />
                <Text style={styles.focusButtonText}>Stop</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      )}
      
      {/* Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showConfirmation}
        onRequestClose={() => setShowConfirmation(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Stop Timer?</Text>
            <Text style={styles.modalText}>
              You have not studied for the required time. Are you sure you want to stop?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.noButton]}
                onPress={() => setShowConfirmation(false)}
              >
                <Text style={styles.modalButtonText}>No, Continue</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.yesButton]}
                onPress={() => {
                  setShowConfirmation(false);
                  resetTimer();
                }}
              >
                <Text style={styles.modalButtonText}>Yes, Stop</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 30,
    textAlign: 'center',
  },
  timerCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timerDisplay: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  timerText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#353859',
  },
  timeAdjusterContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  timeAdjustButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeScrollContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  timeLabel: {
    color: '#353859',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timeOptionsContainer: {
    paddingHorizontal: width / 3, // Add padding to center the options
    alignItems: 'center',
  },
  timeOption: {
    width: 50,
    height: 50,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
  },
  selectedTimeOption: {
    backgroundColor: '#737AA8',
    transform: [{ scale: 1.1 }],
  },
  timeOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#353859',
  },
  selectedTimeText: {
    color: '#ffffff',
  },
  goalCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#353859',
    marginBottom: 15,
  },
  goalProgressContainer: {
    height: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 10,
    overflow: 'hidden',
  },
  goalProgress: {
    height: '100%',
    backgroundColor: '#737AA8',
    borderRadius: 5,
  },
  goalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#353859',
    marginBottom: 5,
  },
  goalRemaining: {
    fontSize: 14,
    color: '#777',
  },
  startButton: {
    flexDirection: 'row',
    backgroundColor: '#737AA8',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  // Focus mode styles
  focusModeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  focusTimerText: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  focusMessage: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 50,
    textAlign: 'center',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  focusButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  focusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(115, 122, 168, 0.8)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    justifyContent: 'center',
  },
  stopButton: {
    backgroundColor: 'rgba(188, 71, 73, 0.8)',
  },
  focusButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#353859',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    width: '45%',
  },
  noButton: {
    backgroundColor: '#737AA8',
  },
  yesButton: {
    backgroundColor: '#bc4749',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  verificationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  verificationContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    width: '80%',
    maxWidth: 400,
  },
  verificationText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#353859',
    textAlign: 'center',
    marginVertical: 15,
  },
  verificationButton: {
    backgroundColor: '#737AA8',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
  },
  verificationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default PomodoroScreen;
