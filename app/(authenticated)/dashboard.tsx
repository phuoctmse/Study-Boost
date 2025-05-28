import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { usePathname } from 'expo-router';
import { BarChart } from 'react-native-chart-kit';

const Dashboard = () => {  // Sample data for the chart - this would come from your backend in a real app
  const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const studyHours = [3, 5, 2, 4, 3, 1, 4]; // Hours studied per day

  const screenWidth = Dimensions.get('window').width - 40;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      
      <View style={styles.statsContainer}>        <View style={styles.statCard}>
          <View style={styles.labelContainer}>
            <Text style={styles.statLabel}>Average</Text>
            <View style={styles.dropdown}>
              <Text style={styles.dropdownText}>Per weeks</Text>
            </View>
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeValue}>13 Hours</Text>
          </View>
        </View>
        
        <View style={styles.statCard}>
          <View style={styles.labelContainer}>
            <Text style={styles.statLabel}>Studied</Text>
            <View style={styles.dropdown}>
              <Text style={styles.dropdownText}>This weeks</Text>
            </View>
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeValue}>7 Hours</Text>
          </View>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Study Analysis</Text>
          <View style={styles.dropdown}>
            <Text style={styles.dropdownText}>By weeks</Text>
          </View>
        </View>
          <View style={styles.chart}>
          <BarChart            data={{
              labels: weekDays,
              datasets: [
                {
                  data: studyHours,
                },
              ],
            }}
            width={screenWidth}
            height={220}
            yAxisLabel=""
            yAxisSuffix="h"
            chartConfig={{
              backgroundGradientFrom: '#F5F5F7',
              backgroundGradientTo: '#F5F5F7',
              decimalPlaces: 0,              color: (opacity = 1, index) => {
                // Make T3 (index 1) orange, all others purple
                return index === 1 ? 
                  `rgba(252, 200, 155, ${opacity})` : 
                  `rgba(92, 99, 151, ${opacity})`;
              },
              labelColor: () => '#444',
              barPercentage: 0.6,
              barRadius: 0,
              propsForLabels: {
                fontSize: 12,
              },
            }}
            withHorizontalLabels={true}
            showValuesOnTopOfBars={false}
            withInnerLines={false}
            fromZero={true}
            style={{
              marginVertical: 8,
              borderRadius: 16,
              paddingRight: 0,
            }}
          />
          <Text style={styles.timeScale}>24H</Text>
        </View>
      </View>

      <View style={styles.additionalStats}>
        <Text style={styles.sectionTitle}>Thành tích gần đây</Text>
        {/* Add more content here as needed */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4D4F75',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    marginTop: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#F5F5F7',
    borderRadius: 10,
    padding: 15,
    width: '48%',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  timeContainer: {
    marginTop: 5,
  },
  timeValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  dropdown: {
    backgroundColor: '#FCC89B',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  dropdownText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  chartContainer: {
    backgroundColor: '#F5F5F7',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  chartTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    flex: 1,
  },
  chart: {
    alignItems: 'center',
    marginTop: 10,
    position: 'relative',
  },
  timeScale: {
    position: 'absolute',
    top: 10,
    right: 10,
    fontSize: 10,
    color: '#888',
  },
  additionalStats: {
    backgroundColor: '#F5F5F7',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
});

export default Dashboard;
