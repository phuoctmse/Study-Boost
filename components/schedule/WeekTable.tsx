import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface WeekTableProps {
  dailySessions: any[];
  activities: any[];
  loading: boolean;
  onActivityPress: (activity: any) => void;
}

const daysOfWeek = [
  { short: 'Mon', full: 'Thứ 2' },
  { short: 'Tue', full: 'Thứ 3' },
  { short: 'Wed', full: 'Thứ 4' },
  { short: 'Thu', full: 'Thứ 5' },
  { short: 'Fri', full: 'Thứ 6' },
  { short: 'Sat', full: 'Thứ 7' },
  { short: 'Sun', full: 'CN' }
];

const activityColors = [
  '#FFE6CC', // Orange light
  '#E6F3FF', // Blue light
  '#F0E6FF', // Purple light
  '#E6FFE6', // Green light
  '#FFE6F0', // Pink light
  '#FFF0E6', // Peach light
];

export const WeekTable: React.FC<WeekTableProps> = ({
  dailySessions,
  activities,
  loading,
  onActivityPress,
}) => {
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingIcon}>
            <Ionicons name="calendar-outline" size={32} color="#737AA8" />
          </View>
          <Text style={styles.loadingText}>Đang tải lịch học...</Text>
          <View style={styles.loadingDots}>
            <View style={[styles.dot, styles.dot1]} />
            <View style={[styles.dot, styles.dot2]} />
            <View style={[styles.dot, styles.dot3]} />
          </View>
        </View>
      </View>
    );
  }

  if (dailySessions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Lịch học trong tuần</Text>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Ionicons name="calendar-clear-outline" size={48} color="#C0C0CF" />
          </View>
          <Text style={styles.emptyTitle}>Chưa có lịch học</Text>
          <Text style={styles.emptySubtitle}>Hãy tạo kế hoạch học tập để bắt đầu</Text>
        </View>
      </View>
    );
  }

  // Map activities to days with color assignment
  const dayToActivities: { [day: string]: any[] } = {};
  daysOfWeek.forEach(day => { dayToActivities[day.short] = []; });

  dailySessions.forEach(ds => {
    (ds.study_days || []).forEach((day: string) => {
      if (Array.isArray(ds.activities_id)) {
        ds.activities_id.forEach((actId: string) => {
          const act = activities.find(a => a.$id === actId);
          if (act) {
            const dayKey = day.substring(0, 3);
            if (dayToActivities[dayKey]) {
              dayToActivities[dayKey].push(act);
            }
          }
        });
      }
    });
  });

  const getActivityColor = (index: number) => {
    return activityColors[index % activityColors.length];
  };

  const getCurrentDay = () => {
    const today = new Date().getDay();
    const dayMap = [6, 0, 1, 2, 3, 4, 5]; // Sunday = 6, Monday = 0, etc.
    return dayMap[today];
  };

  const currentDayIndex = getCurrentDay();

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Lịch học trong tuần</Text>
        <View style={styles.titleIcon}>
          <Ionicons name="calendar" size={20} color="#737AA8" />
        </View>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.tableContainer}>
          {daysOfWeek.map((day, dayIndex) => {
            const isToday = dayIndex === currentDayIndex;
            const dayActivities = dayToActivities[day.short] || [];
            
            return (
              <View key={day.short} style={[
                styles.dayColumn,
                isToday && styles.todayColumn
              ]}>
                <View style={[
                  styles.headerCell,
                  isToday && styles.todayHeader
                ]}>
                  <Text style={[
                    styles.headerText,
                    isToday && styles.todayHeaderText
                  ]}>
                    {day.full}
                  </Text>
                  {isToday && (
                    <View style={styles.todayIndicator}>
                      <Ionicons name="ellipse" size={8} color="#4CAF50" />
                    </View>
                  )}
                </View>
                
                <View style={[
                  styles.dayCell,
                  isToday && styles.todayCell
                ]}>
                  {dayActivities.length === 0 ? (
                    <View style={styles.emptyDay}>
                      <Ionicons name="leaf-outline" size={24} color="#C0C0CF" />
                      <Text style={styles.emptyDayText}>Nghỉ ngơi</Text>
                    </View>
                  ) : (
                    <ScrollView 
                      style={styles.activitiesScroll}
                      showsVerticalScrollIndicator={false}
                    >
                      {dayActivities.map((activity, idx) => (
                        <TouchableOpacity
                          key={activity.$id + idx}
                          style={[
                            styles.activityChip,
                            { backgroundColor: getActivityColor(idx) }
                          ]}
                          onPress={() => onActivityPress(activity)}
                          activeOpacity={0.7}
                        >
                          <View style={styles.activityHeader}>
                            <Text style={styles.activityName} numberOfLines={2}>
                              {activity.name}
                            </Text>
                            <View style={styles.activityDurationBadge}>
                              <Ionicons name="time-outline" size={10} color="#737AA8" />
                              <Text style={styles.activityDuration}>
                                {activity.duration_minutes}p
                              </Text>
                            </View>
                          </View>
                          
                          {activity.techniques && activity.techniques.length > 0 && (
                            <View style={styles.techniquePreview}>
                              <Text style={styles.techniqueText} numberOfLines={1}>
                                {activity.techniques[0]}
                              </Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#353859',
  },
  titleIcon: {
    padding: 4,
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
  tableContainer: {
    flexDirection: 'row',
    minWidth: 700,
  },
  dayColumn: {
    width: 100,
    marginRight: 8,
  },
  todayColumn: {
    transform: [{ scale: 1.02 }],
  },
  headerCell: {
    backgroundColor: '#F5F6FA',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
    minHeight: 50,
    justifyContent: 'center',
  },
  todayHeader: {
    backgroundColor: '#E8F5E8',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  headerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#737AA8',
    textAlign: 'center',
  },
  todayHeaderText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  todayIndicator: {
    marginTop: 4,
  },
  dayCell: {
    backgroundColor: '#FAFBFC',
    borderRadius: 16,
    padding: 8,
    minHeight: 200,
    borderWidth: 1,
    borderColor: '#F0F0F5',
  },
  todayCell: {
    backgroundColor: '#F8FFF8',
    borderColor: '#4CAF50',
    borderWidth: 1.5,
  },
  emptyDay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.6,
  },
  emptyDayText: {
    color: '#C0C0CF',
    fontSize: 11,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  activitiesScroll: {
    flex: 1,
  },
  activityChip: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  activityHeader: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  activityName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#353859',
    lineHeight: 16,
    marginBottom: 6,
  },
  activityDurationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  activityDuration: {
    fontSize: 10,
    color: '#737AA8',
    fontWeight: '600',
    marginLeft: 2,
  },
  techniquePreview: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.6)',
  },
  techniqueText: {
    fontSize: 10,
    color: '#666',
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F5',
    backgroundColor: '#FAFBFC',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#737AA8',
    fontWeight: '500',
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#E6E7F4',
  },
  footerButtonText: {
    fontSize: 12,
    color: '#737AA8',
    fontWeight: '600',
    marginLeft: 4,
  },
  loadingContainer: {
    padding: 48,
    alignItems: 'center',
  },
  loadingIcon: {
    marginBottom: 16,
  },
  loadingText: {
    color: '#737AA8',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 20,
  },
  loadingDots: {
    flexDirection: 'row',
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: '#737AA8',
    borderRadius: 4,
    marginHorizontal: 2,
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
  emptyContainer: {
    padding: 48,
    alignItems: 'center',
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#353859',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#C0C0CF',
    textAlign: 'center',
  },
});