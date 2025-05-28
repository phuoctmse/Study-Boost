import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

type DayInfo = {
  dayNumber: string;
  dayName: string;
};

type SessionInfo = {
  id: string;
  title: string;
  timeStart: string;
  timeEnd: string;
  dayIndex: number;
  hourStart: number;
  durationHours: number;
};

const ScheduleScreen = () => {
  const [currentWeekIndex, setCurrentWeekIndex] = useState<number>(0);
  const [selectedDay, setSelectedDay] = useState<number>(0);
  
  // Mock data - in a real app this would come from an API or local storage
  const days: DayInfo[] = [
    { dayNumber: '03', dayName: 'Monday' },
    { dayNumber: '03', dayName: 'Monday' },
    { dayNumber: '03', dayName: 'Monday' },
    { dayNumber: '03', dayName: 'Monday' },
    { dayNumber: '03', dayName: 'Monday' },
    { dayNumber: '03', dayName: 'Monday' },
    { dayNumber: '03', dayName: 'Monday' },
  ];
  
  const studySessions: SessionInfo[] = [
    { id: '1', title: 'Math', timeStart: '8:00', timeEnd: '8:00', dayIndex: 0, hourStart: 8, durationHours: 1 },
    { id: '2', title: 'Math', timeStart: '8:00', timeEnd: '8:00', dayIndex: 1, hourStart: 9, durationHours: 2 },
    { id: '3', title: 'Math', timeStart: '8:00', timeEnd: '8:00', dayIndex: 2, hourStart: 10, durationHours: 1 },
    { id: '4', title: 'Math', timeStart: '8:00', timeEnd: '8:00', dayIndex: 3, hourStart: 8, durationHours: 1 },
    { id: '5', title: 'Math', timeStart: '8:00', timeEnd: '8:00', dayIndex: 4, hourStart: 12, durationHours: 1 },
    { id: '6', title: 'Math', timeStart: '8:00', timeEnd: '8:00', dayIndex: 5, hourStart: 13, durationHours: 3 },
    { id: '7', title: 'Math', timeStart: '8:00', timeEnd: '8:00', dayIndex: 6, hourStart: 7, durationHours: 1 },
  ];
  
  const hours = Array.from({ length: 12 }, (_, i) => 8 + i);
  
  const navigateWeek = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentWeekIndex(currentWeekIndex + 1);
    } else {
      setCurrentWeekIndex(Math.max(0, currentWeekIndex - 1));
    }
  };
  
  const renderStats = () => {
    return (
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Time studied today</Text>
          <Text style={styles.statValue}>13 GIỜ</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Time studied this week</Text>
          <Text style={styles.statValue}>13 GIỜ</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Goal for this week</Text>
          <Text style={styles.statValue}>13 GIỜ</Text>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="pencil-outline" size={20} color="#555" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Challenge</Text>
          <Text style={styles.statValue}>13 GIỜ</Text>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="pencil-outline" size={20} color="#555" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  const renderCalendarHeader = () => {
    return (
      <View style={styles.calendarHeader}>
        <View style={styles.timeColumn}>
          <Ionicons name="time-outline" size={24} color="#555" />
        </View>
        
        {days.map((day, index) => (
          <TouchableOpacity 
            key={index}
            style={[
              styles.dayColumn, 
              selectedDay === index && styles.selectedDayColumn
            ]}
            onPress={() => setSelectedDay(index)}
          >
            <Text style={styles.dayNumber}>{day.dayNumber}</Text>
            <Text style={styles.dayName}>{day.dayName}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  
  const getSessionPosition = (session: SessionInfo) => {
    const topOffset = (session.hourStart - 8) * 45 + 45; // 45px per hour, 45px for header
    const height = session.durationHours * 45;
    return {
      top: topOffset,
      height,
      left: (session.dayIndex + 1) * (width / 8)
    };
  };
  
  const renderSessions = () => {
    return studySessions.map((session) => {
      const position = getSessionPosition(session);
      return (
        <View
          key={session.id}
          style={[
            styles.sessionItem,
            {
              top: position.top,
              height: position.height,
              left: position.left,
              width: width / 8 - 2,
            },
          ]}
        >
          <Text style={styles.sessionTitle}>{session.title}</Text>
          <Text style={styles.sessionTime}>
            {session.timeStart} - {session.timeEnd}
          </Text>
        </View>
      );
    });
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Study Session</Text>
      
      {renderStats()}
      
      <View style={styles.calendarContainer}>
        {renderCalendarHeader()}
        
        <ScrollView style={styles.timeGrid}>
          <View style={styles.timeSlotsContainer}>
            {hours.map((hour, index) => (
              <View key={index} style={styles.timeSlot}>
                <View style={styles.timeColumn}>
                  <Text style={styles.timeText}>{hour}.00</Text>
                </View>
                
                <View style={styles.timeSlotRow} />
              </View>
            ))}
            
            {/* Position the sessions absolutely over the time grid */}
            {renderSessions()}
          </View>
        </ScrollView>
        
        {/* <View style={styles.weekNavigator}>
          <TouchableOpacity onPress={() => navigateWeek('prev')} style={styles.weekButton}>
            <Ionicons name="chevron-back" size={24} color="#555" />
          </TouchableOpacity>
          
          <Text style={styles.weekText}>Tuần {currentWeekIndex + 1}</Text>
          
          <TouchableOpacity onPress={() => navigateWeek('next')} style={styles.weekButton}>
            <Ionicons name="chevron-forward" size={24} color="#555" />
          </TouchableOpacity>
        </View> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#737AA8',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 15,
    position: 'relative',
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#353859',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#353859',
  },
  editButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    padding: 5,
    backgroundColor: 'rgba(233, 233, 233, 0.5)',
    borderRadius: 15,
  },
  calendarContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  calendarHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f5',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  timeColumn: {
    width: width / 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  dayColumn: {
    width: width / 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  selectedDayColumn: {
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    borderRadius: 8,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#353859',
  },
  dayName: {
    fontSize: 12,
    color: '#777',
  },
  timeGrid: {
    flex: 1,
  },
  timeSlotsContainer: {
    position: 'relative',
  },
  timeSlot: {
    flexDirection: 'row',
    height: 45,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  timeSlotRow: {
    flex: 1,
    height: 45,
    flexDirection: 'row',
  },
  timeText: {
    fontSize: 12,
    color: '#555',
  },
  sessionItem: {
    position: 'absolute',
    backgroundColor: '#ebebf2',
    borderRadius: 6,
    padding: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#6c63ff',
  },
  sessionTitle: {
    fontWeight: '600',
    fontSize: 12,
    color: '#353859',
  },
  sessionTime: {
    fontSize: 10,
    color: '#777',
  },
  weekNavigator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  weekButton: {
    padding: 10,
  },
  weekText: {
    fontSize: 16,
    fontWeight: '500',
    marginHorizontal: 15,
    color: '#353859',
  },
});

export default ScheduleScreen;
