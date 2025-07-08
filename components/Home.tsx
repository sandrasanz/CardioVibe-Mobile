import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Modal, Pressable, ScrollView, Alert } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { TYPOGRAPHY, FONT_WEIGHTS, COLORS } from '../constants/Typography';

type RootStackParamList = {
  HomeMain: undefined;
  Profile: undefined;
};

type HomeNavigationProp = NavigationProp<RootStackParamList>;

export default function Home() {
  const navigation = useNavigation<HomeNavigationProp>();
  const [breathingVisible, setBreathingVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <TouchableOpacity 
              style={styles.avatarButton}
              onPress={() => {
                console.log('Avatar pressed!');
                navigation.navigate('Profile');
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="person-circle" size={40} color="#222" />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          </View>
          <Image source={require('../assets/icon.png')} style={styles.logo} resizeMode="contain" />
          <View style={styles.pointsContainer}>
            <View style={styles.pointsItem}>
              <MaterialIcons name="local-fire-department" size={20} color="#FF7A00" />
              <Text style={styles.pointsText}>2</Text>
            </View>
            <View style={styles.pointsItem}>
              <Ionicons name="star" size={20} color="#A18AFF" />
              <Text style={styles.pointsText}>824</Text>
            </View>
          </View>
        </View>

        {/* Greeting */}
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>Good morning! <Text style={{fontSize: 18}}>🕊️</Text></Text>
          <Text style={styles.greetingSub}>Let's keep your heart healthy today</Text>
        </View>

        {/* Latest Reading Card */}
        <View style={styles.latestReadingCard}>
          <View style={styles.latestReadingHeader}>
            <Text style={styles.latestReadingTitle}>Latest Reading</Text>
            <View style={styles.statusBadge}><Text style={styles.statusBadgeText}>High Stage 1</Text></View>
          </View>
          <View style={styles.readingsRow}>
            <View style={styles.readingItem}>
              <Text style={styles.readingValue}>128</Text>
              <Text style={styles.readingLabel}>Systolic</Text>
            </View>
            <Text style={styles.slash}>/</Text>
            <View style={styles.readingItem}>
              <Text style={styles.readingValue}>82</Text>
              <Text style={styles.readingLabel}>Diastolic</Text>
            </View>
            <View style={styles.readingItem}>
              <Text style={styles.readingValue}>72</Text>
              <Text style={styles.readingLabel}>Pulse</Text>
            </View>
          </View>
          <Text style={styles.comparisonText}>↓ 5 points lower than last week</Text>
        </View>

        {/* Streak & Motivation */}
        <View style={styles.streakMotivationRow}>
          <View style={styles.streakCard}>
            <View style={styles.streakCircle}>
              <Text style={styles.streakNumber}>2</Text>
              <Text style={styles.streakLabel}>day streak</Text>
            </View>
          </View>
          <View style={styles.motivationCard}>
            <Text style={styles.motivationTitle}>Keep up the great work!</Text>
            <Text style={styles.motivationText}>Streak based on daily exercise, cooking, or...</Text>
            <Image source={require('../assets/splash-icon.png')} style={styles.motivationImage} />
          </View>
        </View>

        {/* AI Breathing Coach Card */}
        <View style={styles.aiCoachCard}>
          <View style={styles.aiCoachLeft}>
            {/* Placeholder illustration */}
            <Image source={require('../assets/splash-icon.png')} style={styles.aiCoachImage} />
          </View>
          <View style={styles.aiCoachCenter}>
            <Text style={styles.aiCoachTitle}>AI Breathing Coach</Text>
            <Text style={styles.aiCoachSubtitle}>Reduce stress & lower BP</Text>
          </View>
          <TouchableOpacity style={styles.aiCoachButton} onPress={() => setBreathingVisible(true)}>
            <Ionicons name="play-outline" size={22} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.aiCoachButtonText}>Start</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid Section */}
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: '#E6F7D9' }]}> {/* Green */}
              <Image source={require('../assets/splash-icon.png')} style={styles.statIcon} />
              <View style={styles.statTextContainer}>
                <Text style={styles.statTitle}>Recipes cooked</Text>
              </View>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#E6E6FA', marginRight: 0 }]}> {/* Lavender */}
              <Image source={require('../assets/splash-icon.png')} style={styles.statIcon} />
              <View style={styles.statTextContainer}>
                <Text style={styles.statTitle}>Exercise mins</Text>
              </View>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: '#F5E6F7' }]}> {/* Pinkish */}
              <Image source={require('../assets/splash-icon.png')} style={styles.statIcon} />
              <View style={styles.statTextContainer}>
                <Text style={styles.statTitle}>Challenges</Text>
              </View>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#E6F7D9', marginRight: 0 }]}> {/* Green */}
              <Image source={require('../assets/splash-icon.png')} style={styles.statIcon} />
              <View style={styles.statTextContainer}>
                <Text style={styles.statTitleBold}>Level 1</Text>
                <Text style={styles.statSubtitle}>Current level</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Focus of the Day Section */}
        <View style={styles.focusSection}>
          <View style={styles.focusHeaderRow}>
            <Text style={styles.focusTitle}>Monday's Focus</Text>
            <View style={styles.focusDayBadge}>
              <Ionicons name="calendar-outline" size={18} color="#6B7280" style={{ marginRight: 4 }} />
              <Text style={styles.focusDayText}>Monday</Text>
            </View>
          </View>
          <View style={styles.focusCard}>
            <View style={styles.focusIconBox}>
              <Ionicons name="cafe-outline" size={28} color="#6B7280" />
            </View>
            <View style={styles.focusCardTextBox}>
              <Text style={styles.focusCardTitle}>Energizing breakfast bowl</Text>
              <Text style={styles.focusCardSubtitle}>Oats with berries & nuts</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#B0B0B0" />
          </View>
          <View style={styles.focusCard}>
            <View style={styles.focusIconBox}>
              <Ionicons name="pulse-outline" size={28} color="#6B7280" />
            </View>
            <View style={styles.focusCardTextBox}>
              <Text style={styles.focusCardTitle}>Morning cardio (20 min)</Text>
              <Text style={styles.focusCardSubtitle}>Start the week strong</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#B0B0B0" />
          </View>
          <View style={styles.focusCard}>
            <View style={styles.focusIconBox}>
              <Ionicons name="water-outline" size={28} color="#6B7280" />
            </View>
            <View style={styles.focusCardTextBox}>
              <Text style={styles.focusCardTitle}>Hydration focus</Text>
              <Text style={styles.focusCardSubtitle}>Drink 8 glasses of water</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#B0B0B0" />
          </View>
          <View style={styles.focusNoteRow}>
            <Text style={styles.focusNote}>Personalized recommendations based on your heart health goals</Text>
          </View>
        </View>
      </ScrollView>

      {/* Breathing Exercise Modal */}
      <Modal
        visible={breathingVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setBreathingVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.breathingModal}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setBreathingVisible(false)}>
              <Ionicons name="close" size={28} color="#888" />
            </TouchableOpacity>
            <View style={styles.breathingCircle}>
              <Text style={styles.breathingNumber}>1</Text>
              <Text style={styles.breathingText}>Breathe In</Text>
              <Text style={styles.breathingCycle}>CYCLE 2</Text>
            </View>
            <View style={styles.breathingControls}>
              <TouchableOpacity style={styles.breathingControlBtn}>
                <Ionicons name="pause" size={28} color="#222" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.breathingControlBtn}>
                <Ionicons name="refresh" size={28} color="#222" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  profileContainer: {
    position: 'relative',
  },
  avatarButton: {
    padding: 8,
    borderRadius: 25,
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFD600',
    borderWidth: 2,
    borderColor: '#fff',
  },
  logo: {
    width: 90,
    height: 40,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  pointsText: {
    marginLeft: 4,
    fontWeight: 'bold',
    color: '#222',
  },
  greetingSection: {
    alignItems: 'center',
    marginBottom: 10,
  },
  greeting: {
    fontSize: TYPOGRAPHY.title,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
  },
  greetingSub: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.gray,
    marginTop: 2,
  },
  latestReadingCard: {
    backgroundColor: '#E6F0FF',
    borderRadius: 18,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  latestReadingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  latestReadingTitle: {
    fontSize: TYPOGRAPHY.heading,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
  },
  statusBadge: {
    backgroundColor: '#FFEDD5',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  statusBadgeText: {
    color: '#FF7A00',
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: TYPOGRAPHY.label,
  },
  readingsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  readingItem: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  readingValue: {
    fontSize: TYPOGRAPHY.large,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
  },
  readingLabel: {
    fontSize: TYPOGRAPHY.label,
    color: COLORS.gray,
  },
  slash: {
    fontSize: 28,
    color: '#222',
    marginHorizontal: 2,
  },
  comparisonText: {
    color: '#22C55E',
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 2,
  },
  streakMotivationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  streakCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    width: 110,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  streakCircle: {
    alignItems: 'center',
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  streakLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  motivationCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  motivationTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
    marginBottom: 4,
  },
  motivationText: {
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 8,
  },
  motivationImage: {
    width: 40,
    height: 40,
    alignSelf: 'flex-end',
  },
  aiCoachCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  aiCoachLeft: {
    marginRight: 12,
  },
  aiCoachImage: {
    width: 54,
    height: 54,
    resizeMode: 'contain',
  },
  aiCoachCenter: {
    flex: 1,
    justifyContent: 'center',
  },
  aiCoachTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  aiCoachSubtitle: {
    fontSize: 15,
    color: '#6B7280',
  },
  aiCoachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#181C22',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginLeft: 12,
  },
  aiCoachButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  breathingModal: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 18,
    right: 18,
    zIndex: 2,
  },
  breathingCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 24,
  },
  breathingNumber: {
    fontSize: 64,
    color: '#374151',
    fontWeight: '300',
  },
  breathingText: {
    fontSize: 24,
    color: '#374151',
    fontWeight: '500',
    marginTop: 8,
  },
  breathingCycle: {
    fontSize: 16,
    color: '#B0B0B0',
    fontWeight: '500',
    marginTop: 8,
    letterSpacing: 2,
  },
  breathingControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  breathingControlBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F8FAFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  statsGrid: {
    marginHorizontal: 20,
    marginBottom: 18,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 28,
    padding: 18,
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    minWidth: 0,
  },
  statIcon: {
    width: 48,
    height: 48,
    marginRight: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  statTextContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    minWidth: 0,
  },
  statTitle: {
    fontSize: 18,
    color: '#374151',
    fontWeight: '500',
    flexWrap: 'wrap',
  },
  statTitleBold: {
    fontSize: 20,
    color: '#222',
    fontWeight: 'bold',
    flexWrap: 'wrap',
  },
  statSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '400',
    flexWrap: 'wrap',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  focusSection: {
    backgroundColor: 'rgba(255, 228, 252, 0.7)',
    borderRadius: 32,
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 32,
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  focusHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  focusTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  focusDayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  focusDayText: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '600',
  },
  focusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  focusIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  focusCardTextBox: {
    flex: 1,
  },
  focusCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  focusCardSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 2,
  },
  focusNoteRow: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  focusNote: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
  },
}); 