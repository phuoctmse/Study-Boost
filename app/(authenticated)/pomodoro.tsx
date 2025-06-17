import { Feather, Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import { Image, ImageBackground, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const FOCUS_MIN = [15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
const BREAK_MIN = [3, 5, 10, 15, 20];
const LONG_BREAK_MIN = [10, 15, 20, 25, 30];
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
    duration: 373,
  },
  {
    title: 'Song 2',
    artist: 'Red Velvet',
    file: require('../../assets/music/music-2.mp3'),
    cover: require('../../assets/images/background-2.jpg'),
    duration: 373,
  },
];
const TIMER_STATES = {
  FOCUS: 'FOCUS',
  BREAK: 'BREAK',
  LONG_BREAK: 'LONG_BREAK',
};
const CIRCLE_LENGTH = 260;
const RADIUS = 42;
const BACKGROUND_IMAGES = [
  require('../../assets/images/background-1.jpg'),
  require('../../assets/images/background-2.jpg'),
  require('../../assets/images/background-3.jpg'),
];
const MOTIVATIONAL_QUOTES = [
  'Stay focused and never give up!',
  'Small steps every day!',
  'You are capable of amazing things.',
  'Progress, not perfection.',
  'Keep going, you are getting there!',
];

export default function Pomodoro() {
  // Settings
  const [focus, setFocus] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [longBreak, setLongBreak] = useState(15);
  const [selectedSoundName, setSelectedSoundName] = useState(SOUNDS[0].name);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // Timer
  const [timerState, setTimerState] = useState(TIMER_STATES.FOCUS);
  const [secondsLeft, setSecondsLeft] = useState(focus * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [round, setRound] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showBgModal, setShowBgModal] = useState(false);
  const [showMusicModal, setShowMusicModal] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [musicIndex, setMusicIndex] = useState(0);
  const [quote, setQuote] = useState(MOTIVATIONAL_QUOTES[0]);
  const [completed, setCompleted] = useState(0); // Pomodoros completed today

  // Music player state
  const [musicPosition, setMusicPosition] = useState(0);
  const [musicDuration, setMusicDuration] = useState(0);

  // Info: subject and study time left
  const [subject] = useState('Math');
  const [goalMinutes] = useState(60); // daily goal
  const [studyLeft, setStudyLeft] = useState(goalMinutes * 60); // in seconds

  // Update timer when settings change
  useEffect(() => {
    if (timerState === TIMER_STATES.FOCUS) setSecondsLeft(focus * 60);
    if (timerState === TIMER_STATES.BREAK) setSecondsLeft(breakTime * 60);
    if (timerState === TIMER_STATES.LONG_BREAK) setSecondsLeft(longBreak * 60);
  }, [focus, breakTime, longBreak, timerState]);

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
        if (timerState === TIMER_STATES.FOCUS) {
          setStudyLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timerState]);

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

  const handleTimerEnd = () => {
    if (timerState === TIMER_STATES.FOCUS) {
      setCompleted((c) => c + 1);
      setTimerState(TIMER_STATES.BREAK);
      setSecondsLeft(breakTime * 60);
    } else if (timerState === TIMER_STATES.BREAK) {
      if (round % 4 === 0) {
        setTimerState(TIMER_STATES.LONG_BREAK);
        setSecondsLeft(longBreak * 60);
      } else {
        setTimerState(TIMER_STATES.FOCUS);
        setSecondsLeft(focus * 60);
        setRound((r) => r + 1);
      }
    } else if (timerState === TIMER_STATES.LONG_BREAK) {
      setTimerState(TIMER_STATES.FOCUS);
      setSecondsLeft(focus * 60);
      setRound((r) => r + 1);
    }
    setIsRunning(false);
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

  const handleSliderValueChange = async (value: number) => {
    if (sound) {
      const newPosition = value * musicDuration;
      await sound.setPositionAsync(newPosition);
      setMusicPosition(newPosition);
    }
  };

  // Progress for circular timer
  const getProgress = () => {
    let total = focus * 60;
    if (timerState === TIMER_STATES.BREAK) total = breakTime * 60;
    if (timerState === TIMER_STATES.LONG_BREAK) total = longBreak * 60;
    return 1 - secondsLeft / total;
  };

  // Info component
  const Info = () => (
    <View style={styles.infoCard}>
      <Text style={styles.infoSubject}>{subject}</Text>
      <Text style={styles.infoMainText}>{Math.ceil(studyLeft / 60)} minutes left for today</Text>
      <Text style={styles.infoSubText}>({new Date().toLocaleDateString('en-US')})</Text>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${Math.min(((goalMinutes * 60 - studyLeft) / (goalMinutes * 60)) * 100, 100)}%` }]} />
      </View>
      <Text style={styles.infoSubText}>Completed: {Math.floor((goalMinutes * 60 - studyLeft) / 60)}/{goalMinutes} min</Text>
    </View>
  );

  // Settings pickers
  const renderPicker = (label: string, value: number, setValue: (v: number) => void, options: number[]) => (
    <View style={styles.settingRow}>
      <Text style={styles.settingLabel}>{label}</Text>
      <View style={styles.optionsWrap}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.pickerOption, value === opt && styles.pickerOptionActive]}
            onPress={() => setValue(opt)}
          >
            <Text style={[styles.pickerOptionText, value === opt && styles.pickerOptionTextActive]}>{opt} min</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // Sound picker
  const renderSoundPicker = () => (
    <View style={styles.soundRow}>
      {SOUNDS.map((s) => (
        <TouchableOpacity
          key={s.name}
          style={[styles.soundOption, selectedSoundName === s.name && styles.soundOptionActive]}
          onPress={() => setSelectedSoundName(s.name)}
        >
          <Feather name={s.icon as any} size={22} color={selectedSoundName === s.name ? '#FF7B86' : '#AAA'} />
          <Text style={[styles.soundText, selectedSoundName === s.name && { color: '#FF7B86' }]}>{s.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // Background modal
  const renderBgModal = () => (
    <Modal visible={showBgModal} animationType="slide" transparent>
      <View style={styles.modalBg}>
        <View style={styles.settingsCard}>
          <View style={styles.settingsHeader}>
            <TouchableOpacity onPress={() => setShowBgModal(false)}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.settingsTitle}>Select Background</Text>
            <View style={{ width: 24 }} />
          </View>
          {BACKGROUND_IMAGES.map((img, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.backgroundOption, bgIndex === index && styles.backgroundOptionActive]}
              onPress={() => {
                setBgIndex(index);
                setShowBgModal(false);
              }}
            >
              <Text style={[styles.backgroundText, bgIndex === index && styles.backgroundTextActive]}>Background {index + 1}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );

  // Music modal (music player style)
  const renderMusicModal = () => (
    <Modal visible={showMusicModal} animationType="slide" transparent>
      <View style={styles.modalBg}>
        <View style={styles.musicPlayerContainer}>
          <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 16 }} onPress={() => setShowMusicModal(false)}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <Image source={MUSIC_INFO[musicIndex].cover} style={styles.musicCover} />
          
          {/* Music Slider */}
          <View style={styles.musicSliderContainer}>
            <View style={styles.musicProgressBar}>
              <View 
                style={[
                  styles.musicProgressFill, 
                  { width: `${musicDuration ? (musicPosition / musicDuration) * 100 : 0}%` }
                ]} 
              />
              <TouchableOpacity 
                style={[
                  styles.musicSliderThumb, 
                  { left: `${musicDuration ? (musicPosition / musicDuration) * 100 : 0}%` }
                ]}
                onPress={() => {}}
              />
            </View>
            <View style={styles.musicTimeContainer}>
              <Text style={styles.musicTime}>{formatMusicTime(musicPosition)}</Text>
              <Text style={styles.musicTime}>{formatMusicTime(musicDuration)}</Text>
            </View>
          </View>

          <Text style={styles.musicTitle}>{MUSIC_INFO[musicIndex].title}</Text>
          <Text style={styles.musicArtist}>{MUSIC_INFO[musicIndex].artist}</Text>
          <View style={styles.musicControlsRow}>
            <TouchableOpacity onPress={() => setMusicIndex((i) => (i - 1 + MUSIC_INFO.length) % MUSIC_INFO.length)}>
              <Ionicons name="play-skip-back" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsRunning((r) => !r)} style={styles.musicPlayButton}>
              <Ionicons name={isRunning ? 'pause' : 'play'} size={28} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMusicIndex((i) => (i + 1) % MUSIC_INFO.length)}>
              <Ionicons name="play-skip-forward" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Main render
  return (
    <ImageBackground source={BACKGROUND_IMAGES[bgIndex]} style={styles.bg} resizeMode="cover">
      {renderBgModal()}
      {renderMusicModal()}
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
              stroke="#FF7B86"
              strokeWidth={16}
              fill="none"
              strokeDasharray={2 * Math.PI * 95}
              strokeDashoffset={(2 * Math.PI * 95) * (1 - getProgress())}
              strokeLinecap="round"
            />
          </Svg>
          <View style={styles.timerTextWrapperMinimal}>
            <Text style={styles.timerTextMinimal}>{formatTime(secondsLeft)}</Text>
            <Text style={styles.roundTextMinimal}>Round {round}</Text>
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
      </View>
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
    paddingTop: 32,
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
    color: '#FF7B86',
    letterSpacing: 1,
  },
  roundTextMinimal: {
    fontSize: 18,
    color: '#AAA',
    marginTop: 2,
    fontWeight: '500',
  },
  playButtonMinimal: {
    backgroundColor: '#FF7B86',
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: '#FF7B86',
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
  settingsCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    width: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    alignItems: 'center',
  },
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    width: '100%',
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionLabel: {
    fontSize: 14,
    color: '#AAA',
    marginTop: 18,
    marginBottom: 8,
    alignSelf: 'flex-start',
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
    backgroundColor: '#FF7B86',
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
    backgroundColor: '#FF7B86',
  },
  soundText: {
    fontSize: 12,
    color: '#AAA',
    marginTop: 2,
  },
  quote: {
    marginTop: 24,
    fontSize: 16,
    color: '#FF7B86',
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
    backgroundColor: '#FF7B86',
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
  backgroundOption: {
    backgroundColor: '#F3F3F3',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 8,
    width: '100%',
    alignItems: 'center',
  },
  backgroundOptionActive: {
    backgroundColor: '#FF7B86',
  },
  backgroundText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  backgroundTextActive: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
