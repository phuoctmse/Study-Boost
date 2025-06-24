import { getCurrentUserProfile } from '@/api/auth';
import { submitFeedback } from '@/api/feedback/feedback';
import type { Feedback } from '@/types/feedback';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

interface FeedbackFormProps {
  visible: boolean;
  onClose: () => void;
  userId?: string;
  initialFeedback?: Feedback | null;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ visible, onClose, userId: userIdProp, initialFeedback }) => {
  const [content, setContent] = useState(initialFeedback?.content || '');
  const [rate, setRate] = useState(initialFeedback?.rate || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userDocId, setUserDocId] = useState<string | null>(userIdProp || null);
  const [fetchingUser, setFetchingUser] = useState(false);

  useEffect(() => {
    setContent(initialFeedback?.content || '');
    setRate(initialFeedback?.rate || 0);
    setError('');
  }, [initialFeedback, visible]);

  useEffect(() => {
    // If userId is not provided, fetch it
    if ((!userIdProp || userIdProp === '') && visible) {
      setFetchingUser(true);
      getCurrentUserProfile()
        .then(user => {
          console.log("Current User in Form:", user);
          if (user && user.$id) {
            setUserDocId(user.$id);
            return user;
          }
          throw new Error("User ID not found");
        })
        .catch((err) => {
          console.error("Error fetching user:", err);
          setUserDocId(null);
          setError('Không thể xác định người dùng. Vui lòng đăng nhập lại.');
        })
        .finally(() => setFetchingUser(false));
    } else if (userIdProp && userIdProp !== '') {
      setUserDocId(userIdProp);
    }
  }, [userIdProp, visible]);

  const handleSubmit = async () => {
    if (!userDocId) {
      setError('Không xác định được người dùng. Vui lòng đăng nhập lại.');
      return;
    }
    if (!content.trim()) {
      setError('Vui lòng nhập nội dung phản hồi.');
      return;
    }
    if (rate < 1 || rate > 5) {
      setError('Vui lòng chọn số sao.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await submitFeedback({
        user_id: userDocId,
        content,
        rate,
        created_at: new Date(),
      }, (initialFeedback && (initialFeedback as any).$id) ? (initialFeedback as any).$id : undefined);
      Alert.alert('Thành công', initialFeedback ? 'Cập nhật phản hồi thành công!' : 'Gửi phản hồi thành công!');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose} disabled={loading}>
            <Ionicons name="close" size={24} color="#737AA8" />
          </TouchableOpacity>
          <Text style={styles.title}>{initialFeedback ? 'Chỉnh sửa phản hồi' : 'Gửi phản hồi'}</Text>
          {fetchingUser && (
            <View style={{ marginBottom: 10 }}>
              <ActivityIndicator color="#737AA8" />
              <Text style={{ color: '#737AA8', marginTop: 4 }}>Đang tải thông tin người dùng...</Text>
            </View>
          )}
          {!userDocId && !fetchingUser && (
            <Text style={{ color: '#FF6B6B', marginBottom: 10, fontWeight: 'bold', textAlign: 'center' }}>
              Không xác định được người dùng. Vui lòng đăng nhập lại.
            </Text>
          )}
          <Text style={styles.label}>Đánh giá của bạn:</Text>
          <View style={styles.starsRow}>
            {[1,2,3,4,5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRate(star)}
                disabled={loading}
                style={{ marginHorizontal: 2 }}
              >
                <Ionicons
                  name={rate >= star ? 'star' : 'star-outline'}
                  size={32}
                  color={rate >= star ? '#FCC89B' : '#ccc'}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.label}>Nội dung phản hồi:</Text>
          <TextInput
            style={styles.input}
            value={content}
            onChangeText={setContent}
            placeholder="Nhập phản hồi của bạn..."
            placeholderTextColor="#aaa"
            multiline
            numberOfLines={4}
            editable={!loading}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TouchableOpacity
            style={[styles.submitButton, (loading || !userDocId || fetchingUser) && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={loading || !userDocId || fetchingUser}
          >
            {loading ? (
              <ActivityIndicator color="#353859" />
            ) : (
              <Text style={styles.submitButtonText}>{initialFeedback ? 'Cập nhật' : 'Gửi phản hồi'}</Text>
            )}
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#353859',
    marginBottom: 18,
    textAlign: 'center',
  },
  label: {
    fontSize: 15,
    color: '#737AA8',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 6,
    marginTop: 10,
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    minHeight: 80,
    borderColor: '#737AA8',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: '#353859',
    backgroundColor: '#f7f8fc',
    marginBottom: 10,
    textAlignVertical: 'top',
  },
  error: {
    color: '#FF6B6B',
    fontSize: 14,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  submitButton: {
    backgroundColor: '#FCC89B',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    width: '100%',
  },
  submitButtonText: {
    color: '#353859',
    fontWeight: 'bold',
    fontSize: 17,
  },
});

export default FeedbackForm;