import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CongratulationModalProps {
  visible: boolean;
  onClose: () => void;
}

const CongratulationModal: React.FC<CongratulationModalProps> = ({ visible, onClose }) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.overlay}>
      <View style={styles.container}>
        <Ionicons name="trophy" size={48} color="#FCC89B" style={{ marginBottom: 12 }} />
        <Text style={styles.title}>Chúc mừng!</Text>
        <Text style={styles.message}>Bạn đã hoàn thành một hoạt động và nhận được 10 điểm!</Text>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>Đóng</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#737AA8',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#353859',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FCC89B',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
  },
  buttonText: {
    color: '#353859',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CongratulationModal;