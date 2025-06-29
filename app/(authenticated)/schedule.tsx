import { getCurrentUser } from '@/api/auth';
import { getActivitiesByIds, getDailySessionsByIds, getMilestonesByIds, getStudySchedulesByUserId, getWeeklyPlansByIds } from '@/api/study-schedule/study_schedule';
import { MilestoneCard } from '@/components/schedule/MilestoneCard';
import { WeeklyPlanCard } from '@/components/schedule/WeeklyPlanCard';
import { WeekTable } from '@/components/schedule/WeekTable';
import { Milestones, WeeklyPlan } from '@/types/study_schedule';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ScheduleScreen = () => {
  const [weeklyPlans, setWeeklyPlans] = useState<WeeklyPlan[]>([]);
  const [selectedWeeklyPlan, setSelectedWeeklyPlan] = useState<WeeklyPlan | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [studySchedules, setStudySchedules] = useState<any[]>([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const [loadingSchedules, setLoadingSchedules] = useState(true);
  const [dailySessions, setDailySessions] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);
  const [activityModalVisible, setActivityModalVisible] = useState(false);
  const [milestones, setMilestones] = useState<Milestones[]>([]);
  const [loadingMilestones, setLoadingMilestones] = useState(true);
  const [milestoneExpanded, setMilestoneExpanded] = useState(false);

  useEffect(() => {
    // Separate fetch functions
    const fetchStudySchedules = async (userId: string) => {
      return await getStudySchedulesByUserId(userId);
    };

    const fetchWeeklyPlans = async (weeklyPlanIds: string[]) => {
      const plans = await getWeeklyPlansByIds(weeklyPlanIds);
      return plans.map((doc: any) => ({
        study_schedule_id: doc.study_schedule_id,
        week: doc.week,
        focus: doc.focus,
        topics: doc.topics,
        objective: doc.objective
      }));
    };

    const fetchDailySessions = async (dailySessionIds: string[]) => {
      return await getDailySessionsByIds(dailySessionIds);
    };

    const fetchActivities = async (dailySessionsRes: any[]) => {
      let allActivityIds: string[] = [];
      dailySessionsRes.forEach((ds: any) => {
        if (Array.isArray(ds.activities_id)) {
          allActivityIds = allActivityIds.concat(ds.activities_id);
        }
      });
      return await getActivitiesByIds(allActivityIds);
    };

    const fetchMilestones = async (milestoneIds: any) => {
      let ids = [];
      if (Array.isArray(milestoneIds)) {
        ids = milestoneIds;
      } else if (typeof milestoneIds === 'string') {
        ids = [milestoneIds];
      }
      if (ids.length > 0) {
        const milestoneDocs = await getMilestonesByIds(ids);
        return milestoneDocs.map((doc: any) => ({
          id: typeof doc.id === 'number' ? doc.id : parseInt(doc.id),
          description: doc.description,
          target_completion: doc.target_completion,
          study_schedule_id: doc.study_schedule_id,
        }));
      } else {
        return [];
      }
    };

    const fetchSchedulesAndPlans = async () => {
      setLoadingSchedules(true);
      setLoading(true);
      try {
        const user = await getCurrentUser();
        const schedules = await fetchStudySchedules(user.$id);
        setStudySchedules(schedules);
        if (schedules.length > 0) {
          setSelectedScheduleId(schedules[0].$id);
          // Weekly plans
          const weeklyPlanIds = Array.isArray(schedules[0].weekly_plan_id) ? schedules[0].weekly_plan_id : [];
          const mappedPlans = await fetchWeeklyPlans(weeklyPlanIds);
          setWeeklyPlans(mappedPlans);
          // Daily sessions
          const dailySessionIds = Array.isArray(schedules[0].daily_session_id) ? schedules[0].daily_session_id : [schedules[0].daily_session_id];
          const dailySessionsRes = await fetchDailySessions(dailySessionIds);
          setDailySessions(dailySessionsRes);
          // Activities
          const activitiesRes = await fetchActivities(dailySessionsRes);
          setActivities(activitiesRes);
          // Milestones
          setLoadingMilestones(true);
          const mappedMilestones = await fetchMilestones(schedules[0].milestones_id);
          setMilestones(mappedMilestones);
          setLoadingMilestones(false);
        } else {
          setWeeklyPlans([]);
          setDailySessions([]);
          setActivities([]);
          setMilestones([]);
          setLoadingMilestones(false);
        }
      } catch (error) {
        console.error('Error fetching schedules or daily sessions:', error);
        setWeeklyPlans([]);
        setStudySchedules([]);
        setDailySessions([]);
        setActivities([]);
        setMilestones([]);
        setLoadingMilestones(false);
      } finally {
        setLoading(false);
        setLoadingSchedules(false);
      }
    };
    fetchSchedulesAndPlans();
  }, []);
  
  const handleWeeklyPlanPress = (plan: WeeklyPlan) => {
    setSelectedWeeklyPlan(plan);
    setModalVisible(true);
  };

  const handleActivityPress = (activity: any) => {
    setSelectedActivity(activity);
    setActivityModalVisible(true);
  };

  const renderWeeklyPlanModal = () => {
    if (!selectedWeeklyPlan) return null;
    
    const topicsArray = Array.isArray(selectedWeeklyPlan.topics) ? 
      selectedWeeklyPlan.topics : [];

    return (
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Kế hoạch tuần {selectedWeeklyPlan.week}</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#353859" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Trọng tâm</Text>
                <Text style={styles.modalText}>{selectedWeeklyPlan.focus}</Text>
              </View>
              
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Mục tiêu</Text>
                <Text style={styles.modalText}>{selectedWeeklyPlan.objective}</Text>
              </View>
              
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Chủ đề</Text>
                {topicsArray.length > 0 ? (
                  <View style={styles.topicsContainer}>
                    {topicsArray.map((topic, idx) => (
                      <View key={idx} style={styles.topicChip}>
                        <Text style={styles.topicText}>{topic}</Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.noTopicsText}>Không có chủ đề nào</Text>
                )}
              </View>
            </ScrollView>
            
            <TouchableOpacity 
              style={styles.closeModalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeModalButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const renderActivityModal = () => {
    if (!selectedActivity) return null;
    
    return (
      <Modal
        visible={activityModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setActivityModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chi tiết hoạt động</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setActivityModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#353859" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <Text style={styles.activityName}>{selectedActivity.name}</Text>
              <Text style={styles.activityDuration}>{selectedActivity.duration_minutes} phút</Text>
              <Text style={styles.activityDescription}>{selectedActivity.description}</Text>
              
              {Array.isArray(selectedActivity.techniques) && selectedActivity.techniques.length > 0 && (
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Kỹ thuật</Text>
                  <View style={styles.techniquesContainer}>
                    {selectedActivity.techniques.map((tech: string, idx: number) => (
                      <View key={idx} style={styles.techniqueChip}>
                        <Text style={styles.techniqueText}>{tech}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </ScrollView>
            
            <TouchableOpacity 
              style={styles.closeModalButton}
              onPress={() => setActivityModalVisible(false)}
            >
              <Text style={styles.closeModalButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Lịch học của tôi</Text>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <MilestoneCard 
          milestones={milestones}
          loading={loadingMilestones}
          expanded={milestoneExpanded}
          onToggleExpanded={() => setMilestoneExpanded(!milestoneExpanded)}
        />
        
        <WeeklyPlanCard 
          weeklyPlans={weeklyPlans}
          loading={loading || loadingSchedules}
          onPress={handleWeeklyPlanPress}
        />
        
        <WeekTable 
          dailySessions={dailySessions}
          activities={activities}
          loading={loading || loadingSchedules}
          onActivityPress={handleActivityPress}
        />
      </ScrollView>
      
      {renderWeeklyPlanModal()}
      {renderActivityModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#737AA8',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#353859',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 20,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#737AA8',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalText: {
    fontSize: 16,
    color: '#353859',
    lineHeight: 24,
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  topicChip: {
    backgroundColor: '#E6E7F4',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  topicText: {
    color: '#737AA8',
    fontSize: 14,
    fontWeight: '500',
  },
  noTopicsText: {
    color: '#999',
    fontStyle: 'italic',
  },
  activityName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#353859',
    marginBottom: 8,
  },
  activityDuration: {
    fontSize: 16,
    color: '#FCC89B',
    fontWeight: '600',
    marginBottom: 12,
  },
  activityDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 16,
  },
  techniquesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  techniqueChip: {
    backgroundColor: '#FCC89B',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  techniqueText: {
    color: '#353859',
    fontSize: 14,
    fontWeight: '500',
  },
  closeModalButton: {
    backgroundColor: '#737AA8',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    margin: 20,
    marginTop: 0,
  },
  closeModalButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ScheduleScreen;