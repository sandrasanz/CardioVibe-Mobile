import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserStats } from '../lib/supabase';

const COLORS = {
  primary: '#000000',
  background: '#f9fafb',
  white: '#ffffff',
  gray: '#6b7280',
  orange: '#fb923c',
  green: '#22c55e',
  red: '#ef4444',
};

interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: number; // days
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Lifestyle' | 'Diet' | 'Exercise' | 'Mindfulness';
  points: number;
  participants: number;
  color: string;
  emoji: string;
  status: 'available' | 'active' | 'completed';
  progress?: number; // 0-100 for active challenges
}

const MOCK_CHALLENGES: Challenge[] = [
  {
    id: '1',
    title: '21 Days Caffeine Free',
    description: 'Eliminate caffeine to help lower blood pressure naturally',
    duration: 21,
    difficulty: 'Hard',
    category: 'Lifestyle',
    points: 400,
    participants: 892,
    color: '#fb923c',
    emoji: '☕',
    status: 'available'
  },
  {
    id: '2',
    title: '14 Days Mediterranean Diet',
    description: 'Follow heart-healthy Mediterranean eating patterns',
    duration: 14,
    difficulty: 'Medium',
    category: 'Diet',
    points: 300,
    participants: 1250,
    color: '#22c55e',
    emoji: '🥗',
    status: 'available'
  },
  {
    id: '3',
    title: '7 Days Daily Walking',
    description: 'Walk 30 minutes daily to improve cardiovascular health',
    duration: 7,
    difficulty: 'Easy',
    category: 'Exercise',
    points: 150,
    participants: 2100,
    color: '#3b82f6',
    emoji: '🚶‍♂️',
    status: 'active',
    progress: 40
  },
  {
    id: '4',
    title: '10 Days Stress Reduction',
    description: 'Daily meditation and breathing exercises',
    duration: 10,
    difficulty: 'Easy',
    category: 'Mindfulness',
    points: 200,
    participants: 750,
    color: '#8b5cf6',
    emoji: '🧘‍♀️',
    status: 'active',
    progress: 70
  },
  {
    id: '5',
    title: '30 Days No Sugar',
    description: 'Eliminate added sugars from your diet',
    duration: 30,
    difficulty: 'Hard',
    category: 'Diet',
    points: 500,
    participants: 650,
    color: '#ef4444',
    emoji: '🍭',
    status: 'completed'
  }
];

interface ChallengesProps {
  userStats: UserStats;
  setUserStats: (stats: Partial<UserStats>) => void;
}

export default function Challenges({ userStats, setUserStats }: ChallengesProps) {
  const [selectedTab, setSelectedTab] = useState<'available' | 'active' | 'completed'>('available');
  const [challenges, setChallenges] = useState<Challenge[]>(MOCK_CHALLENGES);

  const filteredChallenges = challenges.filter(challenge => challenge.status === selectedTab);
  
  const availableCount = challenges.filter(c => c.status === 'available').length;
  const activeCount = challenges.filter(c => c.status === 'active').length;
  const completedCount = challenges.filter(c => c.status === 'completed').length;

  const handleJoinChallenge = (challenge: Challenge) => {
    Alert.alert(
      'Join Challenge',
      `Are you ready to start "${challenge.title}"?\n\nThis ${challenge.duration}-day challenge will earn you ${challenge.points} points when completed.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Join Challenge', 
          onPress: () => {
            // Update the challenge status to 'active' and add progress
            setChallenges(prevChallenges => 
              prevChallenges.map(c => 
                c.id === challenge.id 
                  ? { ...c, status: 'active' as const, progress: 0 }
                  : c
              )
            );
            
            // Switch to Active tab to show the newly joined challenge
            setSelectedTab('active');
            
            Alert.alert('Success!', 'Challenge started! Good luck! Check the Active tab to track your progress.');
          }
        }
      ]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#22c55e';
      case 'Medium': return '#f59e0b';
      case 'Hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Health Challenges</Text>
          <Text style={styles.subtitle}>Transform your habits, one challenge at a time</Text>
        </View>

        {/* Mascot Character */}
        <View style={styles.mascotContainer}>
          <View style={styles.mascot}>
            <Text style={styles.mascotEmoji}>🍊</Text>
            <View style={styles.mascotArms}>
              <Text style={styles.armEmoji}>🤳</Text>
              <Text style={styles.armEmoji}>💪</Text>
            </View>
          </View>
          <View style={styles.mascotLine} />
        </View>

        {/* Filter Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[
              styles.tab,
              selectedTab === 'available' && styles.tabActive
            ]}
            onPress={() => setSelectedTab('available')}
          >
            <Text style={[
              styles.tabText,
              selectedTab === 'available' && styles.tabTextActive
            ]}>
              Available ({availableCount})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tab,
              selectedTab === 'active' && styles.tabActive
            ]}
            onPress={() => setSelectedTab('active')}
          >
            <Text style={[
              styles.tabText,
              selectedTab === 'active' && styles.tabTextActive
            ]}>
              Active ({activeCount})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tab,
              selectedTab === 'completed' && styles.tabActive
            ]}
            onPress={() => setSelectedTab('completed')}
          >
            <Text style={[
              styles.tabText,
              selectedTab === 'completed' && styles.tabTextActive
            ]}>
              Completed ({completedCount})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Challenges List */}
        <View style={styles.challengesContainer}>
          {filteredChallenges.map((challenge) => (
            <View key={challenge.id} style={styles.challengeCard}>
              {/* Colored top border */}
              <View style={[styles.cardTopBorder, { backgroundColor: challenge.color }]} />
              
              <View style={styles.cardContent}>
                {/* Header with icon and title */}
                <View style={styles.cardHeader}>
                  <View style={styles.challengeIcon}>
                    <Text style={styles.challengeEmoji}>{challenge.emoji}</Text>
                  </View>
                  <View style={styles.cardHeaderText}>
                    <Text style={styles.challengeTitle}>{challenge.title}</Text>
                    <View style={styles.badgesContainer}>
                      <View style={[
                        styles.difficultyBadge,
                        { backgroundColor: getDifficultyColor(challenge.difficulty) }
                      ]}>
                        <Text style={styles.difficultyText}>{challenge.difficulty}</Text>
                      </View>
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{challenge.category}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Description */}
                <Text style={styles.challengeDescription}>{challenge.description}</Text>

                {/* Progress bar for active challenges */}
                {challenge.status === 'active' && challenge.progress !== undefined && (
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBarBackground}>
                      <View 
                        style={[
                          styles.progressBarFill,
                          { width: `${challenge.progress}%`, backgroundColor: challenge.color }
                        ]} 
                      />
                    </View>
                    <Text style={styles.progressText}>{challenge.progress}% complete</Text>
                  </View>
                )}

                {/* Stats */}
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Ionicons name="calendar-outline" size={16} color="#666" />
                    <Text style={styles.statText}>{challenge.duration} days</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="people-outline" size={16} color="#666" />
                    <Text style={styles.statText}>{challenge.participants.toLocaleString()}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="star-outline" size={16} color="#666" />
                    <Text style={styles.statText}>{challenge.points} pts</Text>
                  </View>
                </View>

                {/* Action Button */}
                {challenge.status === 'available' && (
                  <TouchableOpacity 
                    style={styles.joinButton}
                    onPress={() => handleJoinChallenge(challenge)}
                  >
                    <Text style={styles.joinButtonText}>Join Challenge</Text>
                  </TouchableOpacity>
                )}
                
                {challenge.status === 'active' && (
                  <TouchableOpacity style={styles.continueButton}>
                    <Text style={styles.continueButtonText}>Continue Challenge</Text>
                  </TouchableOpacity>
                )}
                
                {challenge.status === 'completed' && (
                  <View style={styles.completedBadge}>
                    <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                    <Text style={styles.completedText}>Completed!</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        {filteredChallenges.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🎯</Text>
            <Text style={styles.emptyTitle}>No {selectedTab} challenges</Text>
            <Text style={styles.emptySubtitle}>
              {selectedTab === 'available' && 'Check back soon for new challenges!'}
              {selectedTab === 'active' && 'Join a challenge to get started!'}
              {selectedTab === 'completed' && 'Complete challenges to see them here!'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  mascotContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  mascot: {
    alignItems: 'center',
    marginBottom: 10,
  },
  mascotEmoji: {
    fontSize: 48,
  },
  mascotArms: {
    flexDirection: 'row',
    marginTop: -10,
  },
  armEmoji: {
    fontSize: 20,
    marginHorizontal: 15,
  },
  mascotLine: {
    width: 40,
    height: 3,
    backgroundColor: '#ddd',
    borderRadius: 2,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: 'transparent',
  },
  tabActive: {
    backgroundColor: '#222',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  tabTextActive: {
    color: 'white',
  },
  challengesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  challengeCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  cardTopBorder: {
    height: 4,
    width: '100%',
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  challengeIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  challengeEmoji: {
    fontSize: 24,
  },
  cardHeaderText: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  challengeDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  joinButton: {
    backgroundColor: '#222',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  joinButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  completedText: {
    fontSize: 16,
    color: '#22c55e',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6b7280',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});