import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Animated, PanResponder, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { usePomodoroStore } from '../lib/pomodoroStore';

export default function PomodoroWidget() {
  const navigation = useNavigation();
  const { secondsLeft, isRunning, formatTime } = usePomodoroStore();
  const pan = React.useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([
        null,
        { dx: pan.x, dy: pan.y },
      ], { useNativeDriver: false }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
      onPanResponderGrant: () => {
        pan.setOffset({ x: (pan.x as any)._value, y: (pan.y as any)._value });
      },
    })
  ).current;

  if (!isRunning) return null;

  return (
    <Animated.View
      style={[styles.widget, { transform: pan.getTranslateTransform() }]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity onPress={() => (navigation as any).navigate('(authenticated)/pomodoro')} style={styles.touchArea}>
        <Text style={styles.time}>{formatTime(secondsLeft)}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  widget: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 9999,
    backgroundColor: '#7c3aed',
    borderRadius: 20,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  touchArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
}); 