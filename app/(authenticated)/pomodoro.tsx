import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const POMODORO = 25 * 60; // 25 minutes in seconds
const SHORT_BREAK = 5 * 60; // 5 minutes in seconds
const LONG_BREAK = 15 * 60; // 15 minutes in seconds

const backgrounds = [
  '#737AA8', // Default - matches login page color
  '#3a506b', // Dark blue
  '#5e548e', // Purple
  '#606c38', // Green
  '#bc4749', // Red
];

const PomodoroScreen = () => {
  const [timeLeft, setTimeLeft] = useState(POMODORO);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('pomodoro'); // 'pomodoro', 'shortBreak', 'longBreak'
  const [objective, setObjective] = useState('4 hours Math');
  const [backgroundColor, setBackgroundColor] = useState(backgrounds[0]);
  const [currentMusic, setCurrentMusic] = useState('None');

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer finished
      setIsActive(false);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    switch(mode) {
      case 'pomodoro':
        setTimeLeft(POMODORO);
        break;
      case 'shortBreak':
        setTimeLeft(SHORT_BREAK);
        break;
      case 'longBreak':
        setTimeLeft(LONG_BREAK);
        break;
    }
  };

  const changeMode = (newMode: string) => {
    setIsActive(false);
    setMode(newMode);
    switch(newMode) {
      case 'pomodoro':
        setTimeLeft(POMODORO);
        break;
      case 'shortBreak':
        setTimeLeft(SHORT_BREAK);
        break;
      case 'longBreak':
        setTimeLeft(LONG_BREAK);
        break;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const changeBackground = () => {
    const currentIndex = backgrounds.indexOf(backgroundColor);
    const nextIndex = (currentIndex + 1) % backgrounds.length;
    setBackgroundColor(backgrounds[nextIndex]);
  };

  const changeMusic = () => {
    const musicOptions = ['None', 'Ambient', 'Nature Sounds', 'Classical', 'Lo-Fi'];
    const currentIndex = musicOptions.indexOf(currentMusic);
    const nextIndex = (currentIndex + 1) % musicOptions.length;
    setCurrentMusic(musicOptions[nextIndex]);
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* Main Content */}
      <ScrollView style={styles.content}>
        <View style={styles.pomodoroCard}>
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
          
          <View style={styles.modeSelector}>
            <TouchableOpacity 
              style={[styles.modeButton, mode === 'pomodoro' && styles.activeModeButton]} 
              onPress={() => changeMode('pomodoro')}
            >
              <Text style={[styles.modeButtonText, mode === 'pomodoro' && styles.activeModeText]}>
                Pomodoro
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modeButton, mode === 'shortBreak' && styles.activeModeButton]} 
              onPress={() => changeMode('shortBreak')}
            >
              <Text style={[styles.modeButtonText, mode === 'shortBreak' && styles.activeModeText]}>
                Short Break
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modeButton, mode === 'longBreak' && styles.activeModeButton]} 
              onPress={() => changeMode('longBreak')}
            >
              <Text style={[styles.modeButtonText, mode === 'longBreak' && styles.activeModeText]}>
                Long Break
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.timerControls}>
            <TouchableOpacity style={styles.timerButton} onPress={toggleTimer}>
              <Ionicons name={isActive ? 'pause' : 'play'} size={24} color="#fff" />
              <Text style={styles.timerButtonText}>{isActive ? 'Pause' : 'Start'}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.timerButton} onPress={resetTimer}>
              <Ionicons name="refresh" size={24} color="#fff" />
              <Text style={styles.timerButtonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.objectiveCard}>
          <Text style={styles.objectiveTitle}>Current Objective</Text>
          <Text style={styles.objectiveText}>{objective}</Text>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="pencil" size={18} color="#fff" />
            <Text style={styles.editButtonText}>Edit Objective</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.settingsCard}>
          <Text style={styles.settingsTitle}>Ambience Settings</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Background</Text>
            <TouchableOpacity style={styles.settingButton} onPress={changeBackground}>
              <View style={[styles.colorSample, { backgroundColor }]} />
              <Text style={styles.settingButtonText}>Change</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Music</Text>
            <TouchableOpacity style={styles.settingButton} onPress={changeMusic}>
              <Text style={styles.settingButtonText}>{currentMusic}</Text>
              <Ionicons name="chevron-forward" size={16} color="#353859" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    marginTop: 65, // Add some top margin to account for the Navbar
  },
  pomodoroCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timerText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#353859',
    marginVertical: 20,
  },
  modeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
    width: '100%',
  },
  modeButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: '#f0f0f0',
  },
  activeModeButton: {
    backgroundColor: '#353859',
  },
  modeButtonText: {
    color: '#353859',
    fontSize: 14,
    fontWeight: '500',
  },
  activeModeText: {
    color: '#fff',
  },
  timerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  timerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#737AA8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  timerButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '500',
    fontSize: 16,
  },
  objectiveCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  objectiveTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#353859',
    marginBottom: 10,
  },
  objectiveText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#737AA8',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: '500',
    fontSize: 14,
  },
  settingsCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#353859',
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  settingButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingButtonText: {
    fontSize: 14,
    color: '#353859',
    marginRight: 5,
  },
  colorSample: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
  },
});

export default PomodoroScreen;
