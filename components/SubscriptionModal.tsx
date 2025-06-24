import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Get screen dimensions for responsive design
const { width } = Dimensions.get('window');

interface SubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ visible, onClose, onUpgrade }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Close button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#737AA8" />
          </TouchableOpacity>
          
          {/* Header with icon */}
          <View style={styles.headerContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name="lock-closed" size={36} color="#fff" />
            </View>
            <Text style={styles.title}>Upgrade Required</Text>
          </View>
          
          {/* Message */}
          <Text style={styles.message}>
            Tính năng này chỉ khả dụng cho gói Sinh viên hoặc Cao cấp. Vui lòng nâng cấp gói của bạn để truy cập trang này.
          </Text>
          
          {/* Feature comparison */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={20} color="#737AA8" />
              <Text style={styles.featureText}>Nhiều chủ đề tùy chỉnh hơn</Text>
            </View>
            
            <View style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={20} color="#737AA8" />
              <Text style={styles.featureText}>Phân tích dữ liệu học tập nâng cao</Text>
            </View>
            
            <View style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={20} color="#737AA8" />
              <Text style={styles.featureText}>Không có quảng cáo</Text>
            </View>
          </View>
          
          {/* Action buttons */}
          <TouchableOpacity style={styles.upgradeButton} onPress={onUpgrade}>
            <Text style={styles.upgradeButtonText}>Nâng cấp lên Cao cấp</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Text style={styles.backButtonText}>Quay lại Pomodoro</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    width: width * 0.85,
    maxWidth: 400,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 4,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#737AA8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#353859',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  featuresContainer: {
    width: '100%',
    backgroundColor: '#f7f8fc',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#555',
  },
  upgradeButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 12,
  },
  upgradeButtonText: {
    color: '#353859',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#f0f2f5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    elevation: 1,
  },
  backButtonText: {
    color: '#737AA8',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default SubscriptionModal;