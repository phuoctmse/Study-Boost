import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, Text, View } from 'react-native';

interface SurveyTransitionProps {
  index: number;
  total: number;
  onComplete: () => void;
}

const { width } = Dimensions.get('window');

const SurveyTransition: React.FC<SurveyTransitionProps> = ({ index, total, onComplete }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5)),
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
        easing: Easing.inOut(Easing.cubic),
      }),
      Animated.delay(200),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onComplete();
    });
  }, []);
  
  // Calculate percentage
  const percentage = ((index + 1) / total) * 100;
  
  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.contentContainer,
          { 
            opacity: opacityAnim, 
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark" size={36} color="#FFFFFF" />
        </View>
        
        <Text style={styles.questionCountText}>Question {index} completed</Text>
        
        <Text style={styles.percentageText}>{Math.round(percentage)}% Complete</Text>
        
        <View style={styles.progressContainer}>
          <Animated.View 
            style={[
              styles.progressBar,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', `${percentage}%`],
                })
              }
            ]}
          />
        </View>
        
        <Text style={styles.nextQuestionText}>Loading next question...</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#737AA8',
    padding: 20,
  },
  contentContainer: {
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FCC89B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  questionCountText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  percentageText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  progressContainer: {
    width: '80%',
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 30,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FCC89B',
  },
  nextQuestionText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

export default SurveyTransition;
