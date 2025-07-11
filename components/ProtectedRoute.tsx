import { getCurrentUser, getUserDocumentById } from '@/api/auth';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import SubscriptionModal from './SubscriptionModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
  returnToPage?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children
}) => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const user = await getCurrentUser();
        const userDoc = await getUserDocumentById(user.$id);
        if (userDoc.subscription_plan && userDoc.subscription_plan !== 'Free') {
          setAllowed(true);
        } else {
          setAllowed(false);
          setShowModal(true);
        }
      } catch (err: any) {
        setAllowed(false);
        setShowModal(true);
      } finally {
        setLoading(false);
      }
    };
    checkSubscription();
  }, []);

  const handleBackToPomodoro = () => {
    setShowModal(false);
    (navigation as any).navigate('Tabs', { screen: 'Pomodoro' });
  };

  const handleUpgrade = () => {
    setShowModal(false);
    (navigation as any).navigate('premium');
  };

  if (loading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" /><Text>Loading...</Text></View>;
  }
  if (!allowed) {
    return (
      <SubscriptionModal
        visible={showModal}
        onClose={handleBackToPomodoro}
        onUpgrade={handleUpgrade}
      />
    );
  }
  return <>{children}</>;
};

export default ProtectedRoute;
