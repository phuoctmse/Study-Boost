import { getCurrentUser } from '@/api/auth';
import { config } from '@/api/config';
import { databases } from '@/api/index';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Query } from 'react-native-appwrite';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentProcess() {
  const router = useRouter();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState('');
  const qrCodeUrl = 'https://qr.sepay.vn/img?acc=27202407&bank=ACB&amount=150000';

  const checkSubscriptionStatus = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        throw new Error('User not found');
      }

      // Check user's subscription plan
      const response = await databases.listDocuments(
        config.databaseId,
        config.collections.users,
        [Query.equal('user_id', user.$id)]
      );

      if (response.documents.length > 0) {
        const userDoc = response.documents[0];
        if (userDoc.subscription_plan === 'student') {
          setStatus('success');
          setTimeout(() => {
            router.replace('/profile');
          }, 2000);
        } else {
          setStatus('error');
          setErrorMessage('Payment not confirmed yet. Please try again after completing the payment.');
        }
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      setStatus('error');
      setErrorMessage('Failed to check payment status. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {status === 'processing' && (
          <>
            <Text style={styles.title}>Scan QR Code to Pay</Text>
            <Text style={styles.amount}>150,000 VND</Text>
            <Image 
              source={{ uri: qrCodeUrl }} 
              style={styles.qrCode}
              resizeMode="contain"
            />
            <Text style={styles.instructions}>
              Please scan this QR code with your banking app to complete the payment
            </Text>
            <Text style={styles.bankInfo}>
              Bank: ACB{'\n'}
              Account: 27202407
            </Text>
            <TouchableOpacity 
              style={styles.checkButton}
              onPress={checkSubscriptionStatus}
            >
              <Text style={styles.checkButtonText}>Check Payment Status</Text>
            </TouchableOpacity>
          </>
        )}

        {status === 'success' && (
          <>
            <Text style={[styles.message, styles.successMessage]}>
              Payment successful! Redirecting...
            </Text>
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