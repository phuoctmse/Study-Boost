import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Modal, Text, TouchableOpacity, View } from 'react-native';

interface MusicPlayerModalProps {
  visible: boolean;
  onClose: () => void;
  musicInfo: any[];
  musicIndex: number;
  setMusicIndex: (fn: (i: number) => number) => void;
  isRunning: boolean;
  setIsRunning: (fn: (r: boolean) => boolean) => void;
  musicPosition: number;
  musicDuration: number;
  formatMusicTime: (millis: number) => string;
}

const MusicPlayerModal: React.FC<MusicPlayerModalProps> = ({
  visible,
  onClose,
  musicInfo,
  musicIndex,
  setMusicIndex,
  isRunning,
  setIsRunning,
  musicPosition,
  musicDuration,
  formatMusicTime,
}) => (
  <Modal visible={visible} animationType="slide" transparent>
    <View style={{
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.08)',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <View style={{
        backgroundColor: '#737AA8',
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        width: '85%',
        maxWidth: 350,
      }}>
        <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 16 }} onPress={onClose}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <Image source={musicInfo[musicIndex].cover} style={{ width: 150, height: 150, borderRadius: 12, marginBottom: 16 }} />

        {/* Music Slider */}
        <View style={{ width: '100%', marginBottom: 20 }}>
          <View style={{
            height: 4,
            backgroundColor: 'rgba(255,255,255,0.3)',
            borderRadius: 2,
            marginBottom: 8,
            position: 'relative',
          }}>
            <View
              style={{
                height: '100%',
                backgroundColor: '#FCC89B',
                borderRadius: 2,
                width: `${musicDuration ? (musicPosition / musicDuration) * 100 : 0}%`
              }}
            />
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: -4,
                width: 12,
                height: 12,
                backgroundColor: '#FCC89B',
                borderRadius: 6,
                marginLeft: -6,
                left: `${musicDuration ? (musicPosition / musicDuration) * 100 : 0}%`
              }}
              onPress={() => { }}
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{formatMusicTime(musicPosition)}</Text>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{formatMusicTime(musicDuration)}</Text>
          </View>
        </View>

        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF', marginBottom: 4 }}>{musicInfo[musicIndex].title}</Text>
        <Text style={{ fontSize: 14, color: '#FFF', opacity: 0.8, marginBottom: 24 }}>{musicInfo[musicIndex].artist}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '70%' }}>
          <TouchableOpacity onPress={() => setMusicIndex((i) => (i - 1 + musicInfo.length) % musicInfo.length)}>
            <Ionicons name="play-skip-back" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsRunning((r) => !r)} style={{
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
          }}>
            <Ionicons name={isRunning ? 'pause' : 'play'} size={28} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMusicIndex((i) => (i + 1) % musicInfo.length)}>
            <Ionicons name="play-skip-forward" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

export default MusicPlayerModal;