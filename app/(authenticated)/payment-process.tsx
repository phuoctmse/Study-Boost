import { getCurrentUser, getCurrentUserProfile, getUserDocumentById } from '@/api/auth';
import { getPackages } from '@/api/package/package';
import { createPayment, getPaymentById } from '@/api/payment/payment';
import { PaymentStatus } from '@/types/payment';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentProcess() {
  const router = useRouter();
  const navigation = useNavigation<any>();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  useEffect(() => {
    const startPayment = async () => {
      try {
        const user = await getCurrentUser();
        const packagesRes = await getPackages();
        const studentPackage = packagesRes.documents.find((pkg: any) => pkg.name.toLowerCase() === 'student');
        if (!studentPackage) {
          setErrorMessage('Không tìm thấy gói Sinh viên.');
          setStatus('error');
          return;
        }
        const payment = await createPayment({
          package_id: studentPackage.$id,
          user_id: user.$id,
          started_at: new Date(),
          ended_at: new Date(),
          status: PaymentStatus.Pending,
        });
        setPaymentId(payment.$id);
        setQrCodeUrl(`https://qr.sepay.vn/img?acc=27202407&bank=ACB&amount=150000&des=SB${payment.$id}`);
        console.log(payment.$id);
      } catch (err) {
        setErrorMessage('Không thể khởi tạo thanh toán.');
        setStatus('error');
      }
    };
    startPayment();
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      if (!paymentId) throw new Error('No paymentId');
      const payment = await getPaymentById(paymentId);
      if (payment && payment.status && payment.status.toLowerCase() === 'completed') {
        setStatus('success');
        setTimeout(async () => {
          // Optionally, you can call a function to refresh user data here if you have a global user context or state
          // For example: await refreshCurrentUser();
          router.replace('/profile');
        }, 2000);
      } else {
        setStatus('error');
        setErrorMessage('Thanh toán chưa được xác nhận. Vui lòng thử lại sau khi hoàn tất thanh toán.');
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      setStatus('error');
      setErrorMessage('Không thể kiểm tra trạng thái thanh toán. Vui lòng thử lại.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {status === 'processing' && (
          <>
            <Text style={styles.title}>Quét mã QR để thanh toán</Text>
            <Text style={styles.amount}>150,000 VND</Text>
            {qrCodeUrl && (
              <Image 
                source={{ uri: qrCodeUrl }} 
                style={styles.qrCode}
                resizeMode="contain"
              />
            )}
            <Text style={styles.instructions}>
              Vui lòng quét mã QR này bằng ứng dụng ngân hàng để hoàn tất thanh toán
            </Text>
            <Text style={styles.bankInfo}>
              {`Ngân hàng: ACB\nSố tài khoản: 27202407`}
            </Text>
            <TouchableOpacity 
              style={styles.checkButton}
              onPress={checkSubscriptionStatus}
            >
              <Text style={styles.checkButtonText}>Kiểm tra trạng thái thanh toán</Text>
            </TouchableOpacity>
          </>
        )}

        {status === 'success' && (
          <>
            <Text style={[styles.message, styles.successMessage]}>
              Payment successful!
            </Text>
            <TouchableOpacity
              style={styles.checkButton}
              onPress={async () => {
                // Fetch latest user data before navigating
                try {
                  const user = await getCurrentUserProfile();
                  if (user?.$id) {
                    await getUserDocumentById(user.$id);
                  }
                } catch (e) {}
                navigation.reset({
  index: 0,
  routes: [{ name: 'Tabs', state: { routes: [{ name: 'Pomodoro' }] } }],
});
              }}
            >
              <Text style={styles.checkButtonText}>Về trang cá nhân</Text>
            </TouchableOpacity>
          </>
        )}

        {status === 'error' && (
          <>
            <Text style={[styles.message, styles.errorMessage]}>
              {errorMessage}
            </Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => setStatus('processing')}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#353859',
    marginBottom: 10,
  },
  amount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#353859',
    marginBottom: 30,
  },
  qrCode: {
    width: 250,
    height: 250,
    marginBottom: 30,
  },
  instructions: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  bankInfo: {
    fontSize: 16,
    color: '#353859',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 24,
    marginBottom: 30,
  },
  checkButton: {
    backgroundColor: '#353859',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  retryButton: {
    backgroundColor: '#FCC89B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  message: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#353859',
  },
  successMessage: {
    color: '#4CAF50',
  },
  errorMessage: {
    color: '#f44336',
  },
}); 