import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Dimensions, Easing, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

/**
 * @param {Object} props
 * @param {boolean} props.loading
 * @param {() => void=} props.onCheckSchedule
 * @param {string=} props.message
 * @param {Array=} props.milestones
 */
const LoadingSurvey = ({
  loading,
  onCheckSchedule = () => {},
  message = '',
  milestones = [],
}) => {
  const [dot, setDot] = useState(0);
  const [showMilestones, setShowMilestones] = useState([]);
  const intervalRef = useRef(null);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;
  
  // Rotating value for the loading spinner
  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });
  
  useEffect(() => {
    if (loading) {
      // Start the dot animation
      intervalRef.current = setInterval(() => {
        setDot(prev => (prev + 1) % 4);
      }, 400);
      
      // Start the continuous rotation animation for loading spinner
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true
        })
      ).start();
    } else {
      // When loading completes, animate the success view
      clearInterval(intervalRef.current);
      setDot(0);
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        })
      ]).start();
    }
    
    return () => clearInterval(intervalRef.current);
  }, [loading]);

  // Animate milestone appearance
  useEffect(() => {
    if (!loading && milestones && milestones.length > 0) {
      setShowMilestones(Array(milestones.length).fill(false));
      milestones.forEach((_, idx) => {
        setTimeout(() => {
          setShowMilestones(prev => {
            const next = [...prev];
            next[idx] = true;
            return next;
          });
        }, idx * 300);
      });
    }
  }, [loading, milestones]);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingCard}>
          {/* Circular rotating animation with the logo */}
          <View style={styles.spinnerContainer}>
            <Animated.View 
              style={[
                styles.spinner,
                { transform: [{ rotate: spin }] }
              ]}
            >
              <View style={styles.spinnerInner}>
                {/* You can replace this with a custom spinner image if needed */}
                <Image 
                  source={require('../assets/images/icon.png')} 
                  style={styles.spinnerImage}
                  resizeMode="contain"
                />
              </View>
            </Animated.View>
          </View>
          
          {/* AI Processing message */}
          <Text style={styles.processingText}>AI đang xử lý...</Text>
          
          <Text style={styles.loadingText}>
            {message || 'Đang chờ AI tạo lịch học cá nhân cho bạn'}
            <Text style={styles.dot}>{dot > 0 ? '.' : ' '}</Text>
            <Text style={styles.dot}>{dot > 1 ? '.' : ' '}</Text>
            <Text style={styles.dot}>{dot > 2 ? '.' : ' '}</Text>
          </Text>
          
          {/* Steps of AI Processing */}
          <View style={styles.stepsContainer}>
            <View style={[styles.stepItem, styles.stepCompleted]}>
              <Ionicons name="checkmark-circle" size={18} color="#FCC89B" />
              <Text style={styles.stepTextComplete}>Phân tích câu trả lời</Text>
            </View>
            <View style={[styles.stepItem, styles.stepActive]}>
              <View style={styles.stepDot}>
                <ActivityIndicator size="small" color="#FCC89B" />
              </View>
              <Text style={styles.stepTextActive}>Tạo lịch học cá nhân</Text>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepDot}></View>
              <Text style={styles.stepText}>Hoàn thiện lịch học</Text>
            </View>
          </View>
        </View>
        
        {/* Tips at bottom */}
        <View style={styles.tipContainer}>
          <Ionicons name="bulb-outline" size={20} color="#FCC89B" />
          <Text style={styles.tipText}>
            StudyBoost sẽ gợi ý lịch học phù hợp với thói quen của bạn
          </Text>
        </View>
      </View>
    );
  }

  // Success state with milestones
  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.successCard,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <View style={styles.successIconContainer}>
          <Ionicons name="checkmark-circle" size={80} color="#FCC89B" />
        </View>
        
        <Text style={styles.successTitle}>Tạo lịch học thành công!</Text>
        
        <Text style={styles.successDescription}>
          AI đã tạo lịch học cá nhân dựa trên thông tin bạn cung cấp. Bạn có thể xem và tùy chỉnh lịch học này ngay bây giờ.
        </Text>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={onCheckSchedule}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Xem lịch học</Text>
          <Ionicons name="arrow-forward" size={20} color="#353859" />
        </TouchableOpacity>
        
        <View style={styles.benefitsContainer}>
          <View style={styles.benefitItem}>
            <Ionicons name="time-outline" size={24} color="#737AA8" />
            <Text style={styles.benefitText}>Tối ưu thời gian</Text>
          </View>
          
          <View style={styles.benefitItem}>
            <Ionicons name="bar-chart-outline" size={24} color="#737AA8" />
            <Text style={styles.benefitText}>Nâng cao hiệu quả</Text>
          </View>
        </View>
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
  loadingCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 24,
    padding: 30,
    width: width * 0.85,
    maxWidth: 400,
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  spinnerContainer: {
    marginBottom: 30,
    height: 120,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'rgba(252, 200, 155, 0.5)',
    borderTopColor: '#FCC89B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  spinnerImage: {
    width: 60,
    height: 60,
  },
  processingText: {
    color: '#FCC89B',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    letterSpacing: 0.2,
    lineHeight: 26,
  },
  dot: {
    fontSize: 28,
    color: '#FCC89B',
    fontWeight: 'bold',
    marginLeft: 2,
  },
  stepsContainer: {
    width: '100%',
    alignItems: 'flex-start',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  stepCompleted: {
    opacity: 1,
  },
  stepActive: {
    opacity: 1,
  },
  stepDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    fontWeight: '500',
  },
  stepTextActive: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 10,
  },
  stepTextComplete: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 10,
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    opacity: 0.8,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginTop: 30,
    width: width * 0.85,
    maxWidth: 400,
  },
  tipText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
    opacity: 0.9,
  },
  
  // Success state styles
  successCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 30,
    width: width * 0.85,
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  successIconContainer: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FCC89B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 6,
    marginBottom: 20,
    marginTop: -65, // Position it partly outside the card
  },
  successTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#353859',
    marginBottom: 15,
    textAlign: 'center',
  },
  successDescription: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#FCC89B',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: '#FCC89B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#353859',
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 8,
  },
  benefitsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 25,
  },
  benefitItem: {
    alignItems: 'center',
    padding: 10,
  },
  benefitText: {
    color: '#737AA8',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
});

export default LoadingSurvey;