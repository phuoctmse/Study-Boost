import { getCurrentUser } from '@/api/auth';
import { getUserScoreAndStreak, savePointToLeaderboard, updateDailyStreak } from '@/api/leaderboard/leaderboard';
import { getActivitiesByIds, getDailySessionsByIds, getStudySchedulesByUserId } from '@/api/study-schedule/study_schedule';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import { ImageBackground, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import BackgroundPickerModal from '../../components/BackgroundPickerModal';
import CongratulationModal from '../../components/CongratulationModal';
import MusicPlayerModal from '../../components/MusicPlayerModal';
import { schedulePomodoroNotification, setupAndroidNotificationChannel } from '../../components/NotificationHelper';

const SOUNDS = [
  { name: 'Standard', icon: 'bell' },
  { name: 'Chirping', icon: 'twitter' },
  { name: 'Breeze', icon: 'wind' },
  { name: 'Rain', icon: 'cloud-rain' },
];
const MUSIC_INFO = [
  {
    title: 'In & Out',
    artist: 'Red Velvet',
    file: require('../../assets/music/music-1.mp3'),
    cover: require('../../assets/images/background-1.jpg'),
    duration: 57,
  },
  {
    title: 'Morning Garden - Acoustic Chill',
    artist: 'folk_acoustic',
    file: require('../../assets/music/music-2.mp3'),
    cover: require('../../assets/images/background-2.jpg'),
    duration: 147,
  },
  {
    title: 'Good Night - Lofi Cozy Chill Music',
    artist: 'FASSounds',
    file: require('../../assets/music/music-3.mp3'),
    cover: require('../../assets/images/background-3.jpg'),
    duration: 233,
  },
];
const TIMER_STATES = {
  FOCUS: 'FOCUS',
  BREAK: 'BREAK',
  LONG_BREAK: 'LONG_BREAK',
};
const BACKGROUND_IMAGES = [
  require('../../assets/images/background-1.jpg'),
  require('../../assets/images/background-2.jpg'),
  require('../../assets/images/background-3.jpg'),
];
const MOTIVATIONAL_QUOTES = [
  'Giữ vững tập trung và đừng bao giờ bỏ cuộc!',
  'Từng bước nhỏ mỗi ngày!',
  'Bạn có thể làm được những điều tuyệt vời.',
  'Tiến bộ, không cần hoàn hảo.',
  'Tiếp tục cố gắng, bạn sẽ đạt được mục tiêu!',
];

export default function Pomodoro() {
  // Settings
  const [focus, setFocus] = useState(1);
  const [breakTime, setBreakTime] = useState(5);
  const [longBreak, setLongBreak] = useState(15);
  const [selectedSoundName, setSelectedSoundName] = useState(SOUNDS[0].name);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // Timer
  const [timerState, setTimerState] = useState(TIMER_STATES.FOCUS);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(focus * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [round, setRound] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [showBgModal, setShowBgModal] = useState(false);
  const [showMusicModal, setShowMusicModal] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [musicIndex, setMusicIndex] = useState(0);
  const [quote, setQuote] = useState(MOTIVATIONAL_QUOTES[0]);

  // Music player state
  const [musicPosition, setMusicPosition] = useState(0);
  const [musicDuration, setMusicDuration] = useState(0);

  // Today's activities
  const [todayActivities, setTodayActivities] = useState<any[]>([]);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [activityLoading, setActivityLoading] = useState(true);
  const [showAllActivitiesModal, setShowAllActivitiesModal] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [userStreak, setUserStreak] = useState(0);

  // Update timer when settings change
  useEffect(() => {
    if (!isRunning) {
      if (timerState === TIMER_STATES.FOCUS) setSecondsLeft(focus * 60);
      if (timerState === TIMER_STATES.BREAK) setSecondsLeft(breakTime * 60);
      if (timerState === TIMER_STATES.LONG_BREAK) setSecondsLeft(longBreak * 60);
    }
  }, [focus, breakTime, longBreak, timerState, isRunning]);

  // Timer logic (decrement both timer and studyLeft if running and in FOCUS)
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            handleTimerEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  // Play music when timer starts
  useEffect(() => {
    if (isRunning) {
      playMusic();
    } else {
      stopMusic();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, musicIndex]);

  // Cleanup sound on unmount
  useEffect(() => {
    return () => {
      stopMusic();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playMusic = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync(
        MUSIC_INFO[musicIndex].file,
        { shouldPlay: true, isLooping: true }
      );
      setSound(newSound);

      // Get duration and set up position tracking
      const status = await newSound.getStatusAsync();
      if (status.isLoaded) {
        setMusicDuration(status.durationMillis || 0);
      }

      // Update position every second
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setMusicPosition(status.positionMillis || 0);
        }
      });
    } catch (e) {
      // handle error
    }
  };
  const stopMusic = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
  };

  // Random quote
  useEffect(() => {
    setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
  }, [isRunning]);

  // Fetch today's activities on mount
  useEffect(() => {
    const fetchTodayActivities = async () => {
      setActivityLoading(true);
      try {
        const user = await getCurrentUser();
        const schedules = await getStudySchedulesByUserId(user.$id);
        if (schedules.length > 0) {
          const dailySessionIds = Array.isArray(schedules[0].daily_session_id) ? schedules[0].daily_session_id : [schedules[0].daily_session_id];
          const dailySessions = await getDailySessionsByIds(dailySessionIds);
          // Get today's day name (e.g., 'Monday')
          const today = new Date();
          const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const todayName = daysOfWeek[today.getDay()];
          // Find sessions for today
          const sessionsToday = dailySessions.filter((ds: any) => (ds.study_days || []).includes(todayName));
          let allActivityIds: string[] = [];
          sessionsToday.forEach((ds: any) => {
            if (Array.isArray(ds.activities_id)) {
              allActivityIds = allActivityIds.concat(ds.activities_id);
            }
          });
          const activities = await getActivitiesByIds(allActivityIds);
          // Sort activities to match the order of allActivityIds
          const activitiesMap = Object.fromEntries(activities.map(a => [a.$id, a]));
          const sortedActivities = allActivityIds.map(id => activitiesMap[id]).filter(Boolean);
          setTodayActivities(sortedActivities);
          setCurrentActivityIndex(0);
        } else {
          setTodayActivities([]);
        }
      } catch (err) {
        setTodayActivities([]);
      } finally {
        setActivityLoading(false);
      }
    };
    fetchTodayActivities();
  }, []);

  // Fetch streak on mount
  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const user = await getCurrentUser();
        const { streak } = await getUserScoreAndStreak(user.$id);
        setUserStreak(streak);
      } catch {
        setUserStreak(0);
      }
    };
    fetchStreak();
  }, []);

  // When currentActivityIndex changes, update timer duration
  useEffect(() => {
    if (todayActivities.length > 0 && currentActivityIndex < todayActivities.length) {
      setSecondsLeft(todayActivities[currentActivityIndex].duration_minutes * 60);
    }
  }, [currentActivityIndex, todayActivities]);

  // Setup Android notification channel on mount
  useEffect(() => {
    setupAndroidNotificationChannel();
  }, []);

  // After timer ends, move to next activity if available
  const handleTimerEnd = async () => {
    // Trigger local notification
    await schedulePomodoroNotification({
      title: 'Pomodoro hoàn thành!',
      body: 'Đã đến lúc nghỉ ngơi hoặc chuyển sang hoạt động tiếp theo.',
      secondsFromNow: 0,
    });

    try {
      const user = await getCurrentUser();
      await updateDailyStreak(user.$id);
      await savePointToLeaderboard(user.$id, user.name);
      // Refresh streak after update
      const { streak } = await getUserScoreAndStreak(user.$id);
      setUserStreak(streak);
      setShowCongrats(true); // Show modal
    } catch (err) {
      console.error('Failed to update leaderboard or streak:', err);
    }

    if (todayActivities.length > 0 && currentActivityIndex < todayActivities.length - 1) {
      setCurrentActivityIndex((idx) => idx + 1);
      setSecondsLeft(todayActivities[currentActivityIndex + 1].duration_minutes * 60);
      setIsRunning(false);
    } else {
      setSecondsLeft(focus * 60);
      setIsRunning(false);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const formatMusicTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Progress for circular timer
  const getProgress = () => {
    let total;
    if (todayActivities.length > 0 && currentActivityIndex < todayActivities.length) {
      // Use current activity's duration
      total = todayActivities[currentActivityIndex].duration_minutes * 60;
    } else {
      // Fallback to focus time if no activities
      total = focus * 60;
    }
    return 1 - secondsLeft / total;
  };

  // Info: subject and study time left, plus today's activities
  const Info = () => (
  <View style={styles.infoCard}>
    {/* Header row: Title + Streak Button */}
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 10 }}>
      <Text style={{ fontWeight: 'bold', color: '#737AA8', fontSize: 17 }}>Hoạt động hôm nay</Text>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#FCC89B',
          borderRadius: 16,
          paddingVertical: 6,
          paddingHorizontal: 16,
          marginLeft: 8,
        }}
        activeOpacity={0.85}
        // onPress={() => {}} // Add streak history modal here if needed
      >
        <Text style={{ color: '#353859', fontWeight: 'bold', fontSize: 15, marginRight: 6 }}>
          Streak: {userStreak}
        </Text>
        <Ionicons name="flame" size={20} color="#FF9800" />
      </TouchableOpacity>
    </View>

    {/* Activities */}
    {activityLoading ? (
      <Text style={{ color: '#737AA8', marginTop: 10 }}>Đang tải hoạt động...</Text>
    ) : todayActivities.length === 0 ? (
      <Text style={{ color: '#737AA8', marginTop: 10 }}>Không có hoạt động nào cho hôm nay.</Text>
    ) : (
      <>
        <View
          key={todayActivities[currentActivityIndex].$id}
          style={{
            backgroundColor: '#FFE7D1',
            borderRadius: 14,
            padding: 14,
            marginBottom: 10,
            shadowColor: '#FCC89B',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          <Text style={{ fontWeight: 'bold', color: '#353859', fontSize: 15, marginBottom: 2 }}>
            {todayActivities[currentActivityIndex].name}
          </Text>
          <Text style={{ color: '#353859', fontSize: 14, marginBottom: 6 }}>
            {todayActivities[currentActivityIndex].description}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 6 }}>
            {(todayActivities[currentActivityIndex].techniques || []).map((tech: string, i: number) => (
              <View
                key={i}
                style={{
                  backgroundColor: '#E6E7F4',
                  borderRadius: 10,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  marginRight: 6,
                  marginBottom: 4,
                }}
              >
                <Text style={{ color: '#737AA8', fontSize: 13 }}>{tech}</Text>
              </View>
            ))}
          </View>
          <Text style={{ color: '#737AA8', fontSize: 13 }}>
            Thời lượng: {todayActivities[currentActivityIndex].duration_minutes} phút
          </Text>
        </View>
        <TouchableOpacity
          style={{ alignItems: 'center', marginTop: 2 }}
          activeOpacity={0.8}
          onPress={() => setShowAllActivitiesModal(true)}
        >
          <Ionicons name={'chevron-down'} size={22} color="#737AA8" />
          <Text style={{ color: '#737AA8', fontSize: 13, marginTop: 2 }}>
            Xem tất cả hoạt động
          </Text>
        </TouchableOpacity>
      </>
    )}
  </View>
);

  // Modal to show all activities
  const renderAllActivitiesModal = () => (
    <Modal
      visible={showAllActivitiesModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowAllActivitiesModal(false)}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 20, width: '100%', maxWidth: 400, maxHeight: '80%' }}>
          <Text style={{ color: '#737AA8', fontWeight: 'bold', fontSize: 18, marginBottom: 16, textAlign: 'center' }}>Tất cả hoạt động hôm nay</Text>
          <ScrollView style={{ maxHeight: 350 }}>
            {todayActivities.map((act, idx) => (
              <View key={act.$id} style={{ backgroundColor: idx === currentActivityIndex ? '#FCC89B' : '#F8F8FC', borderRadius: 12, padding: 12, marginBottom: 10 }}>
                <Text style={{ fontWeight: 'bold', color: '#353859', fontSize: 15 }}>{act.name}</Text>
                <Text style={{ color: '#353859', fontSize: 14, marginTop: 2 }}>{act.description}</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 }}>
                  {(act.techniques || []).map((tech: string, i: number) => (
                    <View key={i} style={{ backgroundColor: '#E6E7F4', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4, marginRight: 6, marginBottom: 4 }}>
                      <Text style={{ color: '#737AA8', fontSize: 13 }}>{tech}</Text>
                    </View>
                  ))}
                </View>
                <Text style={{ color: '#737AA8', fontSize: 13, marginTop: 4 }}>Thời lượng: {act.duration_minutes} phút</Text>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={{ backgroundColor: '#FCC89B', borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginTop: 10 }}
            onPress={() => setShowAllActivitiesModal(false)}
          >
            <Text style={{ color: '#353859', fontWeight: 'bold', fontSize: 16 }}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Main render
  return (
    <ImageBackground source={BACKGROUND_IMAGES[bgIndex]} style={styles.bg} resizeMode="cover">
      <BackgroundPickerModal
        visible={showBgModal}
        onClose={() => setShowBgModal(false)}
        backgrounds={BACKGROUND_IMAGES}
        selectedIndex={bgIndex}
        onSelect={setBgIndex}
      />
      <MusicPlayerModal
        visible={showMusicModal}
        onClose={() => setShowMusicModal(false)}
        musicInfo={MUSIC_INFO}
        musicIndex={musicIndex}
        setMusicIndex={setMusicIndex}
        isRunning={isRunning}
        setIsRunning={setIsRunning}
        musicPosition={musicPosition}
        musicDuration={musicDuration}
        formatMusicTime={formatMusicTime}
      />
      {renderAllActivitiesModal()}
      <View style={styles.timerScreen}>
        <View style={styles.timerHeaderMinimal}>
          <TouchableOpacity onPress={() => setShowBgModal(true)}>
            <Ionicons name="image-outline" size={24} color="#AAA" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowMusicModal(true)}>
            <Ionicons name="musical-notes-outline" size={24} color="#AAA" />
          </TouchableOpacity>
        </View>
        <View style={styles.circleWrapperMinimal}>
          <Svg width={220} height={220}>
            <Circle
              cx={110}
              cy={110}
              r={95}
              stroke="#F3F3F3"
              strokeWidth={16}
              fill="none"
            />
            <Circle
              cx={110}
              cy={110}
              r={95}
              stroke="#737AA8"
              strokeWidth={16}
              fill="none"
              strokeDasharray={2 * Math.PI * 95}
              strokeDashoffset={(2 * Math.PI * 95) * (1 - getProgress())}
              strokeLinecap="round"
            />
          </Svg>
          <View style={styles.timerTextWrapperMinimal}>
            <Text style={styles.timerTextMinimal}>{formatTime(secondsLeft)}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.playButtonMinimal}
          onPress={() => setIsRunning((r) => !r)}
        >
          <Ionicons name={isRunning ? 'pause' : 'play'} size={36} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.quote}>{quote}</Text>
        <Info />
        <TouchableOpacity
          style={{
            backgroundColor: '#FCC89B',
            borderRadius: 16,
            paddingVertical: 10,
            paddingHorizontal: 24,
            marginTop: 18,
            alignSelf: 'center'
          }}
          onPress={() => setShowTimeModal(true)}
        >
          <Text style={{ color: '#353859', fontWeight: 'bold', fontSize: 16 }}>Điều chỉnh thời gian</Text>
        </TouchableOpacity>
        <Modal visible={showTimeModal} transparent animationType="slide">
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 24, width: 320, alignItems: 'center' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#737AA8', marginBottom: 24, textAlign: 'center' }}>
                Đổi thời gian tập trung
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
                <TouchableOpacity
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: focus > 5 ? '#E6E7F4' : '#F3F3F3',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 18,
                    opacity: focus > 5 ? 1 : 0.5,
                  }}
                  disabled={focus <= 1}
                  onPress={() => setFocus((prev) => Math.max(1, prev - 1))}
                >
                  <Ionicons name="chevron-back" size={28} color="#737AA8" />
                </TouchableOpacity>
                <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#353859', minWidth: 70, textAlign: 'center' }}>
                  {focus} phút
                </Text>
                <TouchableOpacity
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: focus < 180 ? '#E6E7F4' : '#F3F3F3',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 18,
                    opacity: focus < 180 ? 1 : 0.5,
                  }}
                  disabled={focus >= 180}
                  onPress={() => setFocus((prev) => Math.min(180, prev + 1))}
                >
                  <Ionicons name="chevron-forward" size={28} color="#737AA8" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: '#FCC89B',
                  borderRadius: 16,
                  paddingVertical: 12,
                  alignItems: 'center',
                  marginTop: 8,
                  width: '100%',
                }}
                onPress={() => {
                  setIsRunning(false);
                  setSecondsLeft(focus * 60);
                  setShowTimeModal(false);
                }}
              >
                <Text style={{ color: '#353859', fontWeight: 'bold', fontSize: 16 }}>Xong</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      <CongratulationModal visible={showCongrats} onClose={() => setShowCongrats(false)} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerScreen: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  timerHeaderMinimal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginBottom: 8,
    alignSelf: 'center',
  },
  circleWrapperMinimal: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  timerTextWrapperMinimal: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  timerTextMinimal: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#737AA8',
    letterSpacing: 1,
  },
  roundTextMinimal: {
    fontSize: 18,
    color: '#AAA',
    marginTop: 2,
    fontWeight: '500',
  },
  playButtonMinimal: {
    backgroundColor: '#737AA8',
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#737AA8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
    alignSelf: 'center',
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    width: '100%',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    width: 90,
  },
  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    flex: 1,
  },
  pickerOption: {
    backgroundColor: '#F3F3F3',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  pickerOptionActive: {
    backgroundColor: '#737AA8',
  },
  pickerOptionText: {
    color: '#AAA',
    fontSize: 15,
  },
  pickerOptionTextActive: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  soundRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
    width: '100%',
  },
  soundOption: {
    alignItems: 'center',
    margin: 4,
    padding: 8,
    borderRadius: 16,
    backgroundColor: '#F3F3F3',
    flexBasis: '22%',
  },
  soundOptionActive: {
    backgroundColor: '#737AA8',
  },
  soundText: {
    fontSize: 12,
    color: '#AAA',
    marginTop: 2,
  },
  quote: {
    marginTop: 10,
    fontSize: 20,
    color: '#F8BB84',
    textAlign: 'center',
    fontStyle: 'italic',
    textShadowColor: '#FFF',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    alignItems: 'center',
    marginTop: 5,
  },
  infoSubject: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  infoMainText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  infoSubText: {
    fontSize: 14,
    color: '#AAA',
  },
  progressBarBg: {
    backgroundColor: '#F3F3F3',
    borderRadius: 16,
    padding: 2,
    width: '100%',
    marginBottom: 16,
  },
  progressBarFill: {
    backgroundColor: '#737AA8',
    borderRadius: 12,
    padding: 2,
    width: '0%',
  },
  musicPlayerContainer: {
    backgroundColor: '#737AA8',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '85%',
    maxWidth: 350,
  },
  musicCover: {
    width: 150,
    height: 150,
    borderRadius: 12,
    marginBottom: 16,
  },
  musicTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  musicArtist: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.8,
    marginBottom: 24,
  },
  musicControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '70%',
  },
  musicPlayButton: {
    backgroundColor: '#FCC89B',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FCC89B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  musicSliderContainer: {
    width: '100%',
    marginBottom: 20,
  },
  musicProgressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginBottom: 8,
    position: 'relative',
  },
  musicProgressFill: {
    height: '100%',
    backgroundColor: '#FCC89B',
    borderRadius: 2,
  },
  musicSliderThumb: {
    position: 'absolute',
    top: -4,
    width: 12,
    height: 12,
    backgroundColor: '#FCC89B',
    borderRadius: 6,
    marginLeft: -6,
  },
  musicTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  musicTime: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
});