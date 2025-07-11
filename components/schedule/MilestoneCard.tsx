import { Milestones } from '@/types/study_schedule';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MilestoneCardProps {
  milestones: Milestones[];
  loading: boolean;
  expanded: boolean;
  onToggleExpanded: () => void;
}

export const MilestoneCard: React.FC<MilestoneCardProps> = ({
  milestones,
  loading,
  expanded,
  onToggleExpanded,
}) => {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="hourglass-outline" size={24} color="#8A84FF" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  if (!milestones || milestones.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="flag-outline" size={32} color="#C0C0CF" />
        <Text style={styles.emptyText}>Chưa có mục tiêu nào</Text>
      </View>
    );
  }

  const milestonesToShow = expanded ? milestones : [milestones[0]];

  return (
    <TouchableOpacity style={styles.container} onPress={onToggleExpanded} activeOpacity={0.8}>
      <View style={styles.header}>
        <Text style={styles.title}>Mục tiêu của bạn</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{milestones.length}</Text>
        </View>
      </View>

      {milestonesToShow.map((milestone, index) => (
        <View key={milestone.id} style={styles.milestoneItem}>
          <View style={styles.milestoneHeader}>
            <View style={styles.milestoneNumber}>
              <Text style={styles.milestoneNumberText}>{milestone.id}</Text>
            </View>
            <View style={styles.milestoneContent}>
              <Text style={styles.milestoneDescription} numberOfLines={2}>
                {milestone.description}
              </Text>
              <Text style={styles.milestoneDate}>
                {milestone.target_completion}
              </Text>
            </View>
          </View>
        </View>
      ))}

      <View style={styles.toggleContainer}>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#737AA8"
        />
        <Text style={styles.toggleText}>
          {expanded ? 'Thu gọn' : `Xem tất cả (${milestones.length})`}
        </Text>
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
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#353859',
  },
  badge: {
    backgroundColor: '#FCC89B',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    color: '#353859',
    fontSize: 12,
    fontWeight: 'bold',
  },
  milestoneItem: {
    marginBottom: 12,
  },
  milestoneHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  milestoneNumber: {
    backgroundColor: '#E6E7F4',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  milestoneNumberText: {
    color: '#737AA8',
    fontWeight: 'bold',
    fontSize: 16,
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneDescription: {
    fontSize: 15,
    color: '#353859',
    lineHeight: 20,
    marginBottom: 4,
  },
  milestoneDate: {
    fontSize: 13,
    color: '#FCC89B',
    fontWeight: '500',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  toggleText: {
    color: '#737AA8',
    fontSize: 13,
    marginLeft: 4,
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
