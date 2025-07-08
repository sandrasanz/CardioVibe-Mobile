import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  Modal, 
  TextInput, 
  Alert 
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { TYPOGRAPHY, FONT_WEIGHTS, COLORS } from '../constants/Typography';

interface BloodPressureReading {
  id: string;
  systolic: number;
  diastolic: number;
  pulse?: number;
  notes?: string;
  created_at: string;
  user_id: string;
}

const getBPClassification = (systolic: number, diastolic: number) => {
  if (systolic < 120 && diastolic < 80) return { label: 'Normal', color: COLORS.green };
  if (systolic < 130 && diastolic < 80) return { label: 'Elevated', color: COLORS.yellow };
  if (systolic < 140 || diastolic < 90) return { label: 'High Stage 1', color: COLORS.orange };
  if (systolic >= 140 || diastolic >= 90) return { label: 'High Stage 2', color: COLORS.red };
  return { label: 'Elevated', color: COLORS.yellow };
};

export default function BloodPressure() {
  const { user } = useAuth();
  const [readings, setReadings] = useState<BloodPressureReading[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('7 Days');
  const [recordingMethod, setRecordingMethod] = useState('Manual Entry');
  const [newReading, setNewReading] = useState({
    systolic: '',
    diastolic: '',
    pulse: '',
    notes: ''
  });

  useEffect(() => {
    if (user) {
      fetchReadings();
    }
  }, [user]);

  const fetchReadings = async () => {
    try {
      const { data, error } = await supabase
        .from('blood_pressure_readings')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReadings(data || []);
    } catch (error) {
      console.error('Error fetching readings:', error);
    }
  };

  const saveReading = async () => {
    if (!newReading.systolic || !newReading.diastolic) {
      Alert.alert('Error', 'Please enter both systolic and diastolic values');
      return;
    }

    try {
      const { error } = await supabase
        .from('blood_pressure_readings')
        .insert([{
          user_id: user?.id,
          systolic: parseInt(newReading.systolic),
          diastolic: parseInt(newReading.diastolic),
          pulse: newReading.pulse ? parseInt(newReading.pulse) : null,
          notes: newReading.notes || null,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      setNewReading({ systolic: '', diastolic: '', pulse: '', notes: '' });
      setShowAddModal(false);
      fetchReadings();
    } catch (error) {
      console.error('Error saving reading:', error);
      Alert.alert('Error', 'Failed to save reading');
    }
  };

  const getLatestReading = () => readings[0];
  const getAverageReading = () => {
    if (readings.length === 0) return null;
    const total = readings.reduce((acc, reading) => ({
      systolic: acc.systolic + reading.systolic,
      diastolic: acc.diastolic + reading.diastolic
    }), { systolic: 0, diastolic: 0 });
    return {
      systolic: Math.round(total.systolic / readings.length),
      diastolic: Math.round(total.diastolic / readings.length)
    };
  };

  const getAveragePulse = () => {
    const readingsWithPulse = readings.filter(r => r.pulse);
    if (readingsWithPulse.length === 0) return 0;
    return Math.round(readingsWithPulse.reduce((acc, r) => acc + r.pulse!, 0) / readingsWithPulse.length);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    }) + ' at ' + date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const latestReading = getLatestReading();
  const averageReading = getAverageReading();
  const averagePulse = getAveragePulse();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Blood Pressure</Text>
          <Text style={styles.subtitle}>Track and monitor your readings</Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {latestReading && (
          <View style={styles.latestReadingCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Latest Reading</Text>
              <View style={[styles.badge, { backgroundColor: getBPClassification(latestReading.systolic, latestReading.diastolic).color }]}>
                <Text style={styles.badgeText}>{getBPClassification(latestReading.systolic, latestReading.diastolic).label}</Text>
              </View>
            </View>
            <View style={styles.readingDisplay}>
              <Text style={styles.readingNumber}>{latestReading.systolic}</Text>
              <Text style={styles.readingSeparator}>/</Text>
              <Text style={styles.readingNumber}>{latestReading.diastolic}</Text>
            </View>
            <View style={styles.readingLabels}>
              <Text style={styles.readingLabel}>Systolic</Text>
              <Text style={styles.readingLabel}>Diastolic</Text>
            </View>
            <Text style={styles.trendText}>📈 0.0 points higher than last week</Text>
          </View>
        )}

        {averageReading && (
          <View style={styles.trendCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>7-Day Trend</Text>
              <Text style={styles.trendValue}>📈 0.0 mmHg</Text>
            </View>
            <View style={styles.trendStats}>
              <View style={styles.trendStat}>
                <Text style={styles.trendStatNumber}>{averageReading.systolic}</Text>
                <Text style={styles.trendStatLabel}>Avg Systolic</Text>
              </View>
              <View style={styles.trendStat}>
                <Text style={styles.trendStatNumber}>{readings.length}</Text>
                <Text style={styles.trendStatLabel}>Readings</Text>
              </View>
              <View style={styles.trendStat}>
                <Text style={styles.trendStatNumber}>{averagePulse}</Text>
                <Text style={styles.trendStatLabel}>Avg Pulse</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.periodFilters}>
          {['7 Days', '30 Days', '3 Months'].map(period => (
            <TouchableOpacity
              key={period}
              style={[styles.periodFilter, selectedPeriod === period && styles.activeFilter]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[styles.periodFilterText, selectedPeriod === period && styles.activeFilterText]}>
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.recentReadings}>
          <Text style={styles.sectionTitle}>Recent Readings</Text>
          {readings.map((reading) => {
            const classification = getBPClassification(reading.systolic, reading.diastolic);
            return (
              <View key={reading.id} style={styles.readingItem}>
                <View style={styles.readingInfo}>
                  <Text style={styles.readingValue}>{reading.systolic}/{reading.diastolic}</Text>
                  {reading.pulse && <Text style={styles.pulseValue}>{reading.pulse} bpm</Text>}
                </View>
                <Text style={styles.readingDate}>{formatDate(reading.created_at)}</Text>
                <View style={[styles.badge, { backgroundColor: classification.color }]}>
                  <Text style={styles.badgeText}>{classification.label}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>❤️ Measurement Tips</Text>
          <Text style={styles.tip}>• Take readings at the same time each day</Text>
          <Text style={styles.tip}>• Sit quietly for 5 minutes before measuring</Text>
          <Text style={styles.tip}>• Keep feet flat on the floor, arm at heart level</Text>
          <Text style={styles.tip}>• Avoid caffeine, exercise, and smoking beforehand</Text>
        </View>
      </ScrollView>

      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Reading</Text>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Text style={styles.sectionTitle}>Recording Method</Text>
            <View style={styles.methodButtons}>
              <TouchableOpacity
                style={[styles.methodButton, recordingMethod === 'Manual Entry' && styles.activeMethodButton]}
                onPress={() => setRecordingMethod('Manual Entry')}
              >
                <Text style={styles.methodIcon}>📱</Text>
                <Text style={styles.methodText}>Manual Entry</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.methodButton, recordingMethod === 'Bluetooth Device' && styles.activeMethodButton]}
                onPress={() => setRecordingMethod('Bluetooth Device')}
              >
                <Text style={styles.methodIcon}>📶</Text>
                <Text style={styles.methodText}>Bluetooth Device</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Systolic</Text>
                <TextInput
                  style={styles.input}
                  value={newReading.systolic}
                  onChangeText={(text) => setNewReading({...newReading, systolic: text})}
                  placeholder="120"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Diastolic</Text>
                <TextInput
                  style={styles.input}
                  value={newReading.diastolic}
                  onChangeText={(text) => setNewReading({...newReading, diastolic: text})}
                  placeholder="80"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Pulse (optional)</Text>
              <TextInput
                style={styles.input}
                value={newReading.pulse}
                onChangeText={(text) => setNewReading({...newReading, pulse: text})}
                placeholder="72"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Notes (optional)</Text>
              <TextInput
                style={[styles.input, styles.notesInput]}
                value={newReading.notes}
                onChangeText={(text) => setNewReading({...newReading, notes: text})}
                placeholder="e.g., After exercise, morning reading, feeling stressed..."
                multiline
              />
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowAddModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveReading}
            >
              <Text style={styles.saveButtonText}>Save Reading</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: TYPOGRAPHY.title,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.gray,
    marginTop: 4,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  latestReadingCard: {
    backgroundColor: COLORS.lightBlue,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  trendCard: {
    backgroundColor: COLORS.pink,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: TYPOGRAPHY.heading,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.primary,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: TYPOGRAPHY.label,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.primary,
  },
  readingDisplay: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  readingNumber: {
    fontSize: TYPOGRAPHY.massive,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
  },
  readingSeparator: {
    fontSize: TYPOGRAPHY.massive,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
    marginHorizontal: 8,
  },
  readingLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 40,
  },
  readingLabel: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.gray,
  },
  trendText: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.primary,
    textAlign: 'center',
  },
  trendValue: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.red,
    fontWeight: '600',
  },
  trendStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trendStat: {
    alignItems: 'center',
  },
  trendStatNumber: {
    fontSize: TYPOGRAPHY.title,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  trendStatLabel: {
    fontSize: TYPOGRAPHY.label,
    color: COLORS.gray,
    marginTop: 4,
  },
  periodFilters: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  periodFilter: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: COLORS.white,
  },
  activeFilter: {
    backgroundColor: COLORS.primary,
  },
  periodFilterText: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.gray,
  },
  activeFilterText: {
    color: COLORS.white,
  },
  recentReadings: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.subheading,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 16,
  },
  readingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  readingInfo: {
    flex: 1,
  },
  readingValue: {
    fontSize: TYPOGRAPHY.subheading,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  pulseValue: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.gray,
    marginTop: 2,
  },
  readingDate: {
    fontSize: TYPOGRAPHY.label,
    color: COLORS.gray,
    marginRight: 12,
  },
  tipsCard: {
    backgroundColor: COLORS.pink,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: TYPOGRAPHY.subtitle,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 12,
  },
  tip: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.primary,
    marginBottom: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  modalHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.title,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  methodButtons: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  methodButton: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    marginRight: 12,
  },
  activeMethodButton: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.lightGray,
  },
  methodIcon: {
    fontSize: TYPOGRAPHY.title,
    marginBottom: 8,
  },
  methodText: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontWeight: '600',
    color: COLORS.primary,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  inputGroup: {
    flex: 1,
    marginRight: 12,
  },
  inputLabel: {
    fontSize: TYPOGRAPHY.subtitle,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
    fontSize: TYPOGRAPHY.input,
    backgroundColor: COLORS.white,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    marginRight: 12,
  },
  cancelButtonText: {
    fontSize: TYPOGRAPHY.button,
    fontWeight: '600',
    color: COLORS.primary,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },
  saveButtonText: {
    fontSize: TYPOGRAPHY.button,
    fontWeight: '600',
    color: COLORS.white,
  },
});