import { WeeklyPlan } from '@/types/study_schedule';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface WeeklyPlanCardProps {
  weeklyPlans: WeeklyPlan[];
  loading: boolean;
  onPress: (plan: WeeklyPlan) => void;
}

export const WeeklyPlanCard: React.FC<WeeklyPlanCardProps> = ({
  weeklyPlans,
  loading,
  onPress,
}) => {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="time-outline" size={24} color="#8A84FF" />
        <Text style={styles.loadingText}>Đang tải kế hoạch...</Text>
      </View>
    );
  }

  if (weeklyPlans.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="calendar-outline" size={32} color="#C0C0CF" />
        <Text style={styles.emptyText}>Chưa có kế hoạch học tập</Text>
      </View>
    );
  }

  // Calculate current week number based on 'created' of the first plan
  function getCurrentWeekNumber(startDate: string): number {
    const start = new Date(startDate);
    const now = new Date();
    const diffInMs = now.getTime() - start.getTime();
    const diffInWeeks = Math.floor(diffInMs / (7 * 24 * 60 * 60 * 1000));
    return diffInWeeks + 1; // +1 because week numbers are usually 1-based
  }

  const firstPlan = weeklyPlans[0] as WeeklyPlan & { created: string };
const currentWeekNumber = getCurrentWeekNumber(firstPlan.created);
const currentPlan = weeklyPlans.find(plan => plan.week === currentWeekNumber) || firstPlan;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(currentPlan)}
      activeOpacity={0.9}
    >
      <View style={styles.header}>
        <View style={styles.weekBadge}>
          <Text style={styles.weekText}>TUẦN {currentPlan.week}</Text>
        </View>
        <View style={styles.detailButton}>
          <Text style={styles.detailText}>Chi tiết</Text>
          <Ionicons name="chevron-forward" size={16} color="#6C63FF" />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.focusSection}>
          <View style={styles.labelContainer}>
            <Ionicons name="flag-outline" size={16} color="#6C63FF" />
            <Text style={styles.label}>TRỌNG TÂM</Text>
          </View>
          <Text style={styles.focusText}>{currentPlan.focus}</Text>
        </View>

        <View style={styles.objectiveSection}>
          <Text style={styles.objectiveText} numberOfLines={2}>
            {currentPlan.objective}
          </Text>
        </View>

        {Array.isArray(currentPlan.topics) && currentPlan.topics.length > 0 && (
          <View style={styles.topicsSection}>
            <View style={styles.topicsBadge}>
              <Text style={styles.topicsCount}>{currentPlan.topics.length}</Text>
            </View>
            <Text style={styles.topicsText}>chủ đề trong tuần</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  loadingContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    backgroundColor: '#E6E7F4',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  weekBadge: {
    backgroundColor: '#737AA8',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  weekText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCC89B',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  detailText: {
    color: '#353859',
    fontWeight: '600',
    fontSize: 12,
    marginRight: 4,
  },
  content: {
    padding: 16,
  },
  focusSection: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#737AA8',
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  focusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#353859',
    backgroundColor: '#E6E7F4',
    padding: 12,
    borderRadius: 12,
  },
  objectiveSection: {
    marginBottom: 16,
  },
  objectiveText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 12,
  },
  topicsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  topicsBadge: {
    backgroundColor: '#737AA8',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  topicsCount: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  topicsText: {
    color: '#666',
    fontSize: 13,
  },
  loadingText: {
    color: '#737AA8',
    marginTop: 8,
    fontSize: 14,
  },
  emptyText: {
    color: '#C0C0CF',
    marginTop: 8,
    fontSize: 14,
  },
});
