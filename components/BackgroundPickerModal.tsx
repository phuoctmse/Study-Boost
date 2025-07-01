import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface BackgroundPickerModalProps {
  visible: boolean;
  onClose: () => void;
  backgrounds: any[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

const BackgroundPickerModal: React.FC<BackgroundPickerModalProps> = ({
  visible,
  onClose,
  backgrounds,
  selectedIndex,
  onSelect,
}) => (
  <Modal visible={visible} animationType="slide" transparent>
    <View style={{
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.08)',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <View style={{
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        width: 370,
        alignItems: 'center'
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 18,
          width: '100%',
          justifyContent: 'space-between'
        }}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>Chọn hình nền</Text>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 10 }}>
          {backgrounds.map((img, index) => (
            <TouchableOpacity
              key={index}
              style={{
                marginHorizontal: 10,
                borderRadius: 32,
                borderWidth: selectedIndex === index ? 4 : 0,
                borderColor: selectedIndex === index ? '#737AA8' : 'transparent',
                overflow: 'hidden',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.12,
                shadowRadius: 10,
                elevation: 4,
              }}
              onPress={() => {
                onSelect(index);
                onClose();
              }}
              activeOpacity={0.85}
            >
              <Image
                source={img}
                style={{ width: 160, height: 340, resizeMode: 'cover' }}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  </Modal>
);

export default BackgroundPickerModal;