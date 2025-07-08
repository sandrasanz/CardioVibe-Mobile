import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { UserStats, Recipe } from '../lib/supabase';

const COLORS = {
  primary: '#000000',
  secondary: '#f3f4f6',
  accent: '#e5e7eb',
  pink: '#fce7f3',
  green: '#dcfce7',
  lavender: '#e0e7ff',
  background: '#f9fafb',
  white: '#ffffff',
  gray: '#6b7280',
  darkGray: '#374151',
};

interface DashboardProps {
  userStats: UserStats;
  onRecipeSelect: (recipe: Recipe) => void;
  onTabChange: (tab: string) => void;
}

export default function Dashboard({ userStats, onRecipeSelect, onTabChange }: DashboardProps) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text style={styles.subtitle}>Let's check your health progress</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: COLORS.lavender }]}>
              <Ionicons name="flame" size={24} color={COLORS.primary} />
              <Text style={styles.statNumber}>{userStats.streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: COLORS.pink }]}>
              <Ionicons name="star" size={24} color={COLORS.primary} />
              <Text style={styles.statNumber}>{userStats.points}</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
          </View>
          
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: COLORS.green }]}>
              <Ionicons name="trophy" size={24} color={COLORS.primary} />
              <Text style={styles.statNumber}>{userStats.level}</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: COLORS.secondary }]}>
              <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
              <Text style={styles.statNumber}>{userStats.completed_challenges}</Text>
              <Text style={styles.statLabel}>Challenges</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: COLORS.green }]}
              onPress={() => onTabChange('recipes')}
            >
              <Ionicons name="restaurant" size={32} color={COLORS.primary} />
              <Text style={styles.actionText}>Recipes</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: COLORS.lavender }]}
              onPress={() => onTabChange('exercise')}
            >
              <Ionicons name="fitness" size={32} color={COLORS.primary} />
              <Text style={styles.actionText}>Exercise</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: COLORS.pink }]}
              onPress={() => onTabChange('bp')}
            >
              <Ionicons name="heart" size={32} color={COLORS.primary} />
              <Text style={styles.actionText}>BP Track</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: COLORS.secondary }]}
              onPress={() => onTabChange('challenges')}
            >
              <Ionicons name="trophy" size={32} color={COLORS.primary} />
              <Text style={styles.actionText}>Challenges</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Goals */}
        <View style={styles.goalsContainer}>
          <Text style={styles.sectionTitle}>Today's Goals</Text>
                      <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Ionicons name="flag" size={20} color={COLORS.primary} />
              <Text style={styles.goalTitle}>Daily Activity</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '65%' }]} />
            </View>
            <Text style={styles.progressText}>65% complete</Text>
          </View>
          
          <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Ionicons name="water" size={20} color={COLORS.primary} />
              <Text style={styles.goalTitle}>Hydration</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '40%' }]} />
            </View>
            <Text style={styles.progressText}>4/10 glasses</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
  },
  statsContainer: {
    marginBottom: 32,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
    fontWeight: '500',
  },
  quickActionsContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 8,
  },
  goalsContainer: {
    marginBottom: 32,
  },
  goalCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.secondary,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: COLORS.gray,
  },
});