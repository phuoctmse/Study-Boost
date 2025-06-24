import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

  useEffect(() => {
    if (loading) {
      intervalRef.current = setInterval(() => {
        setDot(prev => (prev + 1) % 4);
      }, 400);
    } else {
      clearInterval(intervalRef.current);
      setDot(0);
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
        <ActivityIndicator size="large" color="#737AA8" style={{ marginBottom: 30 }} />
        <Text style={styles.loadingText}>
          {message || 'Đang chờ AI tạo lịch học cá nhân cho bạn'}
          <Text style={styles.dot}>{dot > 0 ? '.' : ' '}</Text>
          <Text style={styles.dot}>{dot > 1 ? '.' : ' '}</Text>
          <Text style={styles.dot}>{dot > 2 ? '.' : ' '}</Text>
        </Text>
      </View>
    );
  }

  // Success state with milestones
  return (
    <View style={styles.container}>
      <Ionicons name="checkmark-circle" size={80} color="#FCC89B" style={{ marginBottom: 20 }} />
      <Text style={styles.successTitle}>Tạo lịch học thành công!</Text>
      <Text style={styles.successText}>Dưới đây là các mốc (milestone) của bạn:</Text>
      <View style={{ width: '100%', marginBottom: 24 }}>
        {milestones && milestones.length > 0 ? (
          milestones.map((ms, idx) => (
            <Animated.View
              key={ms.id}
              style={{
                opacity: showMilestones[idx] ? 1 : 0,
                transform: [{ translateY: showMilestones[idx] ? 0 : 20 }],
                marginBottom: 16,
                backgroundColor: '#fff',
                borderRadius: 14,
                padding: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 3,
                elevation: 2,
              }}
            >
              <Text style={{ color: '#737AA8', fontWeight: 'bold', fontSize: 16 }}>Mốc {ms.id}</Text>
              <Text style={{ color: '#353859', fontSize: 15, marginTop: 4 }}>{ms.description}</Text>
              <Text style={{ color: '#FCC89B', fontSize: 14, marginTop: 4 }}>Hoàn thành trước: {ms.target_completion}</Text>
            </Animated.View>
          ))
        ) : (
          <Text style={{ color: '#fff', fontStyle: 'italic', textAlign: 'center' }}>Không có mốc nào.</Text>
        )}
      </View>
      <TouchableOpacity style={styles.button} onPress={onCheckSchedule}>
        <Text style={styles.buttonText}>Xem lịch học</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#737AA8',
    padding: 30,
  },
  loadingText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    letterSpacing: 0.2,
  },
  dot: {
    fontSize: 28,
    color: '#FCC89B',
    fontWeight: 'bold',
    marginLeft: 2,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  successText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 18,
    opacity: 0.95,
  },
  button: {
    backgroundColor: '#FCC89B',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: '#353859',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default LoadingSurvey; 