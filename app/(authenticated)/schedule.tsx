import { getCurrentUser } from '@/api/auth';
import { getActivitiesByIds, getDailySessionsByIds, getMilestonesByIds, getStudySchedulesByUserId, getWeeklyPlansByIds } from '@/api/study-schedule/study_schedule';
import { Milestones, WeeklyPlan } from '@/types/study_schedule';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const ScheduleScreen = () => {
  const [currentWeekIndex, setCurrentWeekIndex] = useState<number>(0);
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [weeklyPlans, setWeeklyPlans] = useState<WeeklyPlan[]>([]);
  const [selectedWeeklyPlan, setSelectedWeeklyPlan] = useState<WeeklyPlan | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [studySchedules, setStudySchedules] = useState<any[]>([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const [loadingSchedules, setLoadingSchedules] = useState(true);
  const [cardScale] = useState(new Animated.Value(1));
  const router = useRouter();
  const [dailySessions, setDailySessions] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);
  const [activityModalVisible, setActivityModalVisible] = useState(false);
  const [milestones, setMilestones] = useState<Milestones[]>([]);
  const [loadingMilestones, setLoadingMilestones] = useState(true);
  const [milestoneExpanded, setMilestoneExpanded] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestones | null>(null);
  const [milestoneModalVisible, setMilestoneModalVisible] = useState(false);
  
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
  
  const navigateWeek = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentWeekIndex(currentWeekIndex + 1);
    } else {
      setCurrentWeekIndex(Math.max(0, currentWeekIndex - 1));
    }
  };

  const handleWeeklyPlanPress = (plan: WeeklyPlan) => {
    setSelectedWeeklyPlan(plan);
    setModalVisible(true);
  };
  
  // Add animation for card press effect
  const handleCardPressIn = () => {
    Animated.spring(cardScale, {
      toValue: 0.98,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const handleCardPressOut = () => {
    Animated.spring(cardScale, {
      toValue: 1,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const renderWeeklyPlanCard = () => {
    if (loadingSchedules) {
      return (
        <View style={styles.weeklyPlanCardLoading}>
          <View style={styles.loadingContainer}>
            <Ionicons name="time-outline" size={30} color="#8A84FF" />
            <Text style={styles.loadingText}>Đang tải lịch học...</Text>
          </View>
        </View>
      );
    }
    if (studySchedules.length === 0) {
      return (
        <View style={styles.weeklyPlanCardEmpty}>
          <View style={styles.emptyStateContainer}>
            <Ionicons name="calendar-outline" size={50} color="#8A84FF" />
            <Text style={styles.noPlanText}>Không có lịch học nào</Text>
          </View>
        </View>
      );
    }
    if (loading) {
      return (
        <View style={styles.weeklyPlanCardLoading}>
          <View style={styles.loadingContainer}>
            <Ionicons name="reload-outline" size={30} color="#8A84FF" />
            <Text style={styles.loadingText}>Đang tải kế hoạch tuần...</Text>
          </View>
        </View>
      );
    }
    if (weeklyPlans.length === 0) {
      return (
        <View style={styles.weeklyPlanCardEmpty}>
          <View style={styles.emptyStateContainer}>
            <Ionicons name="document-text-outline" size={50} color="#8A84FF" />
            <Text style={styles.noPlanText}>Không có kế hoạch tuần nào</Text>
          </View>
        </View>
      );
    }
    
    const currentPlan = weeklyPlans.find(plan => plan.week === 1) || weeklyPlans[0];
    console.log('Current WeeklyPlan:', currentPlan);

    if (!currentPlan) {
      return (
        <View style={styles.weeklyPlanCardEmpty}>
          <View style={styles.emptyStateContainer}>
            <Ionicons name="document-text-outline" size={50} color="#8A84FF" />
            <Text style={styles.noPlanText}>Không có kế hoạch tuần nào</Text>
          </View>
        </View>
      );
    }

    return (
      <Animated.View 
        style={[
          styles.weeklyPlanCardWrapper,
          { transform: [{ scale: cardScale }] }
        ]}
      >
        <TouchableOpacity 
          style={styles.weeklyPlanCard}
          onPress={() => handleWeeklyPlanPress(currentPlan)}
          onPressIn={handleCardPressIn}
          onPressOut={handleCardPressOut}
          activeOpacity={0.9}
        >
          <View style={styles.weeklyPlanHeader}>
            <View style={styles.weekBadge}>
              <Text style={styles.weekNumber}>TUẦN {currentPlan.week}</Text>
            </View>
            <View style={styles.viewDetailsButton}>
              <Text style={styles.viewDetailsText}>Xem chi tiết</Text>
              <Ionicons name="chevron-forward" size={18} color="#6C63FF" />
            </View>
          </View>

          <View style={styles.planContent}>
            <View style={styles.focusSection}>
              <View style={styles.sectionLabelContainer}>
                <Ionicons name="flashlight-outline" size={16} color="#6C63FF" style={styles.sectionIcon} />
                <Text style={styles.sectionLabel}>TRỌNG TÂM</Text>
              </View>
              <View style={styles.focusContainer}>
                <Text style={styles.focusText}>{currentPlan.focus}</Text>
              </View>
            </View>

            <View style={styles.objectiveSection}>
              <View style={styles.sectionLabelContainer}>
                <Ionicons name="flag-outline" size={16} color="#6C63FF" style={styles.sectionIcon} />
                <Text style={styles.sectionLabel}>MỤC TIÊU</Text>
              </View>
              <Text style={styles.objectiveText} numberOfLines={2}>
                {currentPlan.objective}
              </Text>
            </View>
            
            {Array.isArray(currentPlan.topics) && currentPlan.topics.length > 0 && (
              <View style={styles.topicsPreviewSection}>
                <View style={[styles.topicCountBadge, { backgroundColor: '#737AA8' }] }>
                  <Text style={[styles.topicCountText, { color: '#fff' }] }>
                    {currentPlan.topics.length}
                  </Text>
                </View>
                <Text style={styles.topicsPreviewText}>
                  {currentPlan.topics.length} chủ đề trong tuần này
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderTopicsModal = () => {
    if (!selectedWeeklyPlan) return null;
    
    const topicsArray = Array.isArray(selectedWeeklyPlan.topics) ? 
      selectedWeeklyPlan.topics : [];

    return (
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View style={[styles.modalWeekBadge, { backgroundColor: '#737AA8' }] }>
                <Text style={styles.modalWeekBadgeText}>WEEK {selectedWeeklyPlan.week}</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#353859" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalTitle}>Chi tiết kế hoạch tuần</Text>
            
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>TRỌNG TÂM</Text>
              <View style={styles.modalFocusContainer}>
                <Text style={styles.modalFocusText}>{selectedWeeklyPlan.focus}</Text>
              </View>
            </View>
            
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>MỤC TIÊU</Text>
              <View style={styles.modalObjectiveContainer}>
                <Text style={styles.modalObjectiveText}>{selectedWeeklyPlan.objective}</Text>
              </View>
            </View>
            
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>CHỦ ĐỀ</Text>
              
              {topicsArray.length > 0 ? (
                <View style={styles.topicsContainer}>
                  {topicsArray.map((topic, idx) => (
                    <View key={idx} style={styles.topicChip}>
                      <Text style={styles.topicText}>{topic}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.noTopicsText}>Không có chủ đề nào cho tuần này</Text>
              )}
            </View>
            
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

  // Render week table for daily sessions and activities
  const renderWeekTable = () => {
    if (loadingSchedules || loading) {
      return (
        <View style={styles.weekTableLoading}>
          <Ionicons name="hourglass-outline" size={30} color="#8A84FF" />
          <Text style={styles.loadingText}>Đang tải các buổi học...</Text>
        </View>
      );
    }
    if (dailySessions.length === 0) {
      return (
        <View style={styles.weekTableEmpty}>
          <Ionicons name="calendar-outline" size={40} color="#8A84FF" />
          <Text style={styles.noPlanText}>Không có buổi học nào</Text>
        </View>
      );
    }
    // Map day to activities
    const dayToActivities: { [day: string]: any[] } = {};
    daysOfWeek.forEach(day => { dayToActivities[day] = []; });
    dailySessions.forEach(ds => {
      (ds.study_days || []).forEach((day: string) => {
        if (Array.isArray(ds.activities_id)) {
          ds.activities_id.forEach((actId: string) => {
            const act = activities.find(a => a.$id === actId);
            if (act) dayToActivities[day].push({ ...act, session_title: ds.session_title });
          });
        }
      });
    });
    return (
      <View style={styles.weekTableMainContainer}>
        <Text style={styles.weekTableTitle}>Lịch học trong tuần</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.weekTableScroll} 
          contentContainerStyle={styles.weekTableScrollContent}
        >
          <View style={styles.weekTableContainer}>
            <View style={styles.weekTableHeader}>
              {daysOfWeek.map(day => (
                <View key={day} style={styles.weekTableHeaderCell}>
                  <Text style={styles.weekTableHeaderText}>{day.substring(0, 3)}</Text>
                </View>
              ))}
            </View>
            <View style={styles.weekTableBody}>
              <View style={styles.weekTableRow}>
                {daysOfWeek.map(day => (
                  <View key={day} style={styles.weekTableCell}>
                    {dayToActivities[day].length === 0 ? (
                      <View style={styles.noActivitiesContainer}>
                        <Ionicons name="cafe-outline" size={20} color="#C0C0CF" />
                        <Text style={styles.noActivitiesText}>Ngày tự do</Text>
                      </View>
                    ) : (
                      dayToActivities[day].map((act, idx) => (
                        <TouchableOpacity
                          key={act.$id + idx}
                          style={styles.activityChip}
                          onPress={() => { setSelectedActivity(act); setActivityModalVisible(true); }}
                        >
                          <Text style={styles.activityChipTitle} numberOfLines={2} ellipsizeMode="tail">{act.name}</Text>
                          <View style={styles.activityTimeContainer}>
                            <Ionicons name="time-outline" size={12} color="#737AA8" />
                            <Text style={styles.activityChipDuration}>{act.duration_minutes} phút</Text>
                          </View>
                        </TouchableOpacity>
                      ))
                    )}
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  // Activity modal
  const renderActivityModal = () => {
    if (!selectedActivity) return null;
    return (
      <Modal
        visible={activityModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setActivityModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.activityModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chi tiết hoạt động</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setActivityModalVisible(false)}>
                <Ionicons name="close" size={24} color="#353859" />
              </TouchableOpacity>
            </View>
            <Text style={styles.activityModalName}>{selectedActivity.name}</Text>
            <Text style={styles.activityModalDuration}>{selectedActivity.duration_minutes} phút</Text>
            <Text style={styles.activityModalDescription}>{selectedActivity.description}</Text>
            <Text style={styles.activityModalSectionTitle}>Kỹ thuật:</Text>
            <View style={styles.techniquesRow}>
              {(Array.isArray(selectedActivity.techniques) ? selectedActivity.techniques : []).map((tech: string, idx: number) => (
                <View key={idx} style={styles.techniqueChip}>
                  <Text style={styles.techniqueChipText}>{tech}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.closeModalButton} onPress={() => setActivityModalVisible(false)}>
              <Text style={styles.closeModalButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  // Milestone Card component
  const renderMilestoneCard = () => {
    if (loadingMilestones) {
      return (
        <View style={styles.milestoneCardLoading}>
          <Ionicons name="hourglass-outline" size={30} color="#8A84FF" />
          <Text style={styles.loadingText}>Đang tải các mốc (milestone)...</Text>
        </View>
      );
    }
    if (!milestones || milestones.length === 0) {
      return (
        <View style={styles.milestoneCardEmpty}>
          <Ionicons name="flag-outline" size={40} color="#8A84FF" />
          <Text style={styles.noPlanText}>Không có mốc (milestone) nào.</Text>
        </View>
      );
    }

    // Only show milestone 1 if not expanded, else show all
    const milestonesToShow = milestoneExpanded ? milestones : [milestones[0]];

    return (
      <TouchableOpacity
        style={styles.milestoneCardWrapper}
        activeOpacity={0.9}
        onPress={() => setMilestoneExpanded(!milestoneExpanded)}
      >
        <Text style={styles.milestoneCardTitle}>Các mốc (milestone) của bạn</Text>
        {milestonesToShow.map((milestone, index) => (
          <View key={milestone.id} style={[styles.milestoneItem, index === milestonesToShow.length - 1 && { marginBottom: 0 }]}>
            <View style={styles.milestoneContent}>
              <View style={styles.milestoneTitleRow}>
                <Text style={styles.milestoneNumber}>Mốc {milestone.id}</Text>
                <Ionicons name="flag" size={18} color="#737AA8" />
              </View>
              <Text style={styles.milestoneDescription} numberOfLines={2}>{milestone.description}</Text>
              <Text style={styles.milestoneTargetDate}>Hoàn thành trước: {milestone.target_completion}</Text>
            </View>
          </View>
        ))}
        <View style={{ alignItems: 'center', marginTop: 6 }}>
          <Ionicons
            name={milestoneExpanded ? 'chevron-up' : 'chevron-down'}
            size={22}
            color="#737AA8"
          />
          <Text style={{ color: '#737AA8', fontSize: 13, marginTop: 2 }}>
            {milestoneExpanded ? 'Thu gọn' : 'Xem tất cả các mốc'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Lịch học của tôi</Text>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {renderMilestoneCard()}
        {renderWeeklyPlanCard()}
        {renderWeekTable()}
      </ScrollView>
      {renderTopicsModal()}
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
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 15,
  },
  // Weekly Plan Card Styling
  weeklyPlanCardWrapper: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
  },
  weeklyPlanCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
  },
  weeklyPlanCardLoading: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    minHeight: 180,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  weeklyPlanCardEmpty: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    minHeight: 180,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  weeklyPlanHeader: {
    backgroundColor: '#E6E7F4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  weekBadge: {
    backgroundColor: '#737AA8',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 8,
    shadowColor: '#737AA8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  weekNumber: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCC89B',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  viewDetailsText: {
    color: '#353859',
    fontWeight: '600',
    fontSize: 14,
    marginRight: 4,
  },
  planContent: {
    padding: 20,
  },
  focusSection: {
    marginBottom: 20,
  },
  sectionLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionIcon: {
    marginRight: 6,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#737AA8',
    letterSpacing: 0.5,
  },
  focusContainer: {
    backgroundColor: '#E6E7F4',
    borderRadius: 16,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#737AA8',
  },
  focusText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#353859',
  },
  objectiveSection: {
    marginBottom: 20,
  },
  objectiveText: {
    fontSize: 15,
    color: '#353859',
    lineHeight: 24,
    backgroundColor: '#EDEDF6',
    padding: 14,
    borderRadius: 16,
  },
  topicsPreviewSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#E6E7F4',
  },
  topicCountBadge: {
    backgroundColor: '#E6E7F4',
    height: 28,
    width: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  topicCountText: {
    color: '#737AA8',
    fontWeight: 'bold',
    fontSize: 14,
  },
  topicsPreviewText: {
    color: '#555566',
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Loading & Empty States
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#737AA8',
    marginTop: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    padding: 20,
  },
  noPlanText: {
    color: '#737AA8',
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  
  // Week Table Styling
  weekTableMainContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  weekTableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#353859',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  weekTableContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  weekTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#E6E7F4',
    borderRadius: 12,
    marginBottom: 8,
  },
  weekTableHeaderCell: {
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  weekTableHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#737AA8',
  },
  weekTableBody: {
    flex: 1,
  },
  weekTableRow: {
    flexDirection: 'row',
  },
  weekTableCell: {
    width: 100,
    backgroundColor: '#EDEDF6',
    borderRadius: 12,
    padding: 8,
    margin: 2,
    minHeight: 150,
    alignItems: 'center',
  },
  noActivitiesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noActivitiesText: {
    color: '#C0C0CF',
    fontStyle: 'italic',
    marginTop: 8,
  },
  activityChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    margin: 4,
    width: '95%',
    shadowColor: '#737AA8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  activityChipTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#353859',
    marginBottom: 6,
    width: '100%',
  },
  activityTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityChipDuration: {
    fontSize: 12,
    color: '#737AA8',
    fontWeight: '500',
    marginLeft: 4,
  },
  weekTableLoading: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    minHeight: 150,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  weekTableEmpty: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    minHeight: 150,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  weekTableScroll: {
    flex: 1,
  },
  weekTableScrollContent: {
    padding: 10,
  },
  
  // Modal Styling
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalWeekBadge: {
    backgroundColor: '#737AA8',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 6,
  },
  modalWeekBadgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  closeButton: {
    padding: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#353859',
    marginBottom: 16,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#737AA8',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  modalFocusContainer: {
    backgroundColor: '#f0f0ff',
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#6c63ff',
  },
  modalFocusText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#353859',
  },
  modalObjectiveContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 14,
  },
  modalObjectiveText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#353859',
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  topicChip: {
    backgroundColor: '#353859',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    margin: 4,
  },
  topicText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  noTopicsText: {
    color: '#737AA8',
    fontStyle: 'italic',
    marginTop: 5,
  },
  closeModalButton: {
    backgroundColor: '#FCC89B',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  closeModalButtonText: {
    color: '#353859',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Activity modal
  activityModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  activityModalName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#353859',
    marginBottom: 16,
  },
  activityModalDuration: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6C63FF',
    marginBottom: 20,
    backgroundColor: '#F5F5FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  activityModalDescription: {
    fontSize: 15,
    color: '#353859',
    marginBottom: 20,
    lineHeight: 24,
  },
  activityModalSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6C63FF',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  techniquesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  techniqueChip: {
    backgroundColor: '#F0F0FF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    margin: 4,
    borderWidth: 1,
    borderColor: '#E0E0FF',
  },
  techniqueChipText: {
    color: '#6C63FF',
    fontWeight: '600',
    fontSize: 13,
  },
  
  // Adding any missing styles
  calendarHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5ff',
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
    color: '#6C63FF',
  },
  sessionItem: {
    position: 'absolute',
    backgroundColor: '#F5F5FF',
    borderRadius: 12,
    padding: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#6C63FF',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sessionTitle: {
    fontWeight: '600',
    fontSize: 12,
    color: '#353859',
  },
  sessionTime: {
    fontSize: 10,
    color: '#6C63FF',
    marginTop: 2,
  },
  // Milestone Styling
  milestoneCardWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  milestoneCardTitle: {
    color: '#353859',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 16,
  },
  milestoneCardLoading: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  milestoneCardEmpty: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  milestoneItem: {
    backgroundColor: '#F8F8FC',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#737AA8',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  milestoneNumber: {
    color: '#737AA8',
    fontWeight: 'bold',
    fontSize: 15,
  },
  milestoneDescription: {
    color: '#353859',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  milestoneTargetDate: {
    color: '#FCC89B',
    fontWeight: '500',
    fontSize: 14,
  },
});

export default ScheduleScreen;
