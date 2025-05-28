import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const PremiumPage = () => {
  const handlePurchase = () => {
    // Implement purchase logic here
    alert('Thank you for purchasing Premium!');
  };

  return (
    <SafeAreaView style={styles.container}>      
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Choose a plan</Text>
        <Text style={styles.subtitle}>
          Whichever plan you pick, it's free until you love your study.
        </Text>

        <View style={styles.plansContainerVertical}>
          {/* Default Plan */}
          <View style={styles.planCard}>
            <View style={styles.planHeader}>
              <View style={styles.planTitleContainer}>
                <Text style={styles.planTitleEmoji}>🆓</Text>
                <Text style={styles.planTitle}>Free (Default Plan)</Text>
              </View>
              <Text style={styles.planPrice}>
                <Text style={styles.priceAmount}>0đ</Text>
                <Text style={styles.pricePeriod}>/mo</Text>
              </Text>
            </View>

            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle-outline" size={18} color="#353859" />
                <Text style={styles.featureText}>Access to basic flashcards</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle-outline" size={18} color="#353859" />
                <Text style={styles.featureText}>Limited daily quizzes</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle-outline" size={18} color="#353859" />
                <Text style={styles.featureText}>Standard learning streak tracker</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle-outline" size={18} color="#353859" />
                <Text style={styles.featureText}>Basic study reminders</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle-outline" size={18} color="#353859" />
                <Text style={styles.featureText}>Limited subject categories</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle-outline" size={18} color="#353859" />
                <Text style={styles.featureText}>Community forum access</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle-outline" size={18} color="#353859" />
                <Text style={styles.featureText}>View progress history (last 7 days)</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.currentButton}>
              <Text style={styles.currentButtonText}>Current</Text>
            </TouchableOpacity>
          </View>

          {/* Premium Plan */}
          <View style={[styles.planCard, styles.premiumCard]}>
            <View style={styles.popularTag}>
              <Text style={styles.popularText}>Most popular</Text>
            </View>
            <View style={styles.planHeader}>
              <View style={styles.planTitleContainer}>
                <Text style={[styles.planTitleEmoji, styles.premiumEmoji]}>💎</Text>
                <Text style={[styles.planTitle, styles.premiumTitle]}>Premium</Text>
              </View>
              <Text style={[styles.planPrice, styles.premiumPrice]}>
                <Text style={styles.priceAmount2}>150,000 VND</Text>
                <Text style={styles.pricePeriod2}>/mo</Text>
              </Text>
            </View>

            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <Text style={[styles.planTitleEmoji, styles.premiumEmoji, {marginRight: 5}]}>🌟</Text>
                <Text style={[styles.featureText, styles.premiumFeatureText]}>Unlimited flashcard creation</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={[styles.planTitleEmoji, styles.premiumEmoji, {marginRight: 5}]}>🌟</Text>
                <Text style={[styles.featureText, styles.premiumFeatureText]}>AI-generated practice questions</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={[styles.planTitleEmoji, styles.premiumEmoji, {marginRight: 5}]}>🌟</Text>
                <Text style={[styles.featureText, styles.premiumFeatureText]}>Smart review system (Spaced Repetition)</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={[styles.planTitleEmoji, styles.premiumEmoji, {marginRight: 5}]}>🌟</Text>
                <Text style={[styles.featureText, styles.premiumFeatureText]}>Access to premium study sets</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={[styles.planTitleEmoji, styles.premiumEmoji, {marginRight: 5}]}>🌟</Text>
                <Text style={[styles.featureText, styles.premiumFeatureText]}>Offline access to materials</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={[styles.planTitleEmoji, styles.premiumEmoji, {marginRight: 5}]}>🌟</Text>
                <Text style={[styles.featureText, styles.premiumFeatureText]}>Advanced performance analytics</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={[styles.planTitleEmoji, styles.premiumEmoji, {marginRight: 5}]}>🌟</Text>
                <Text style={[styles.featureText, styles.premiumFeatureText]}>Customizable study plans</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={[styles.planTitleEmoji, styles.premiumEmoji, {marginRight: 5}]}>🌟</Text>
                <Text style={[styles.featureText, styles.premiumFeatureText]}>Priority support</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={[styles.planTitleEmoji, styles.premiumEmoji, {marginRight: 5}]}>🌟</Text>
                <Text style={[styles.featureText, styles.premiumFeatureText]}>No ads</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={[styles.planTitleEmoji, styles.premiumEmoji, {marginRight: 5}]}>🌟</Text>
                <Text style={[styles.featureText, styles.premiumFeatureText]}>Early access to new features</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.purchaseButton}
              onPress={handlePurchase}
            >
              <Text style={styles.purchaseButtonText}>Purchase</Text>
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
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    marginTop: 65, // Add some top margin to account for the Navbar
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#353859',
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  plansContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  plansContainerVertical: {
    flexDirection: 'column',
    gap: 30,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  premiumCard: {
    backgroundColor: '#353859',
  },
  popularTag: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: '#4CAF50',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  popularText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  planHeader: {
    marginBottom: 20,
  },
  planTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  planTitleEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  premiumEmoji: {
    color: '#fff',
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#353859',
    marginBottom: 8,
  },
  premiumTitle: {
    color: '#fff',
  },
  planPrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceAmount: {
    fontSize: 22,
    fontWeight: '700',
    color: '#353859',
  },
  premiumPrice: {
    color: '#fff',
  },
  pricePeriod: {
    fontSize: 14,
    color: '#666',
    marginLeft: 2,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#555',
  },
  premiumFeatureText: {
    color: '#eee',
  },
  currentButton: {
    backgroundColor: '#ededed',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  currentButtonText: {
    color: '#353859',
    fontWeight: '600',
    fontSize: 16,
  },
  purchaseButton: {
    backgroundColor: '#FCC89B',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  pricePeriod2: {
    fontSize: 14,
    color: '#ffffff',
    marginLeft: 2,
  },
  priceAmount2: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
});

export default PremiumPage;
