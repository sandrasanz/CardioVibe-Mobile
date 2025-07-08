import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { User } from '@supabase/supabase-js';
import { UserStats, supabase } from '../lib/supabase';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { TYPOGRAPHY, FONT_WEIGHTS, COLORS } from '../constants/Typography';

interface ProfileProps {
  user: User | null;
  userStats: UserStats;
  onSignOut: () => void;
}

interface UserActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  points_earned?: number;
}

export default function Profile({ user, userStats, onSignOut }: ProfileProps) {
  const [recentActivity, setRecentActivity] = useState<UserActivity[]>([]);
  const [recipesCooked, setRecipesCooked] = useState(0);
  const [exerciseMinutes, setExerciseMinutes] = useState(357);
  const [challengesCompleted, setChallengesCompleted] = useState(0);
  
  // Account management state
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserStats();
      fetchRecentActivity();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      // This would fetch additional stats from various tables
      // For now, we'll use placeholder values based on the design
      setRecipesCooked(0);
      setExerciseMinutes(357);
      setChallengesCompleted(0);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      // This would fetch recent user activities from the database
      // For now, we'll use an empty array to show the placeholder
      setRecentActivity([]);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon, 
    backgroundColor 
  }: {
    title: string;
    value: string | number;
    subtitle: string;
    icon: string;
    backgroundColor: string;
  }) => (
    <View style={[styles.statCard, { backgroundColor }]}>
      <View style={styles.statIcon}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{subtitle}</Text>
      </View>
    </View>
  );

  const calculatePointsToNextLevel = () => {
    const currentLevel = userStats.level;
    const pointsForNextLevel = currentLevel * 200; // Example: 200 points per level
    const pointsNeeded = pointsForNextLevel - userStats.points;
    return Math.max(0, pointsNeeded);
  };

  const calculateLevelProgress = () => {
    const currentLevel = userStats.level;
    const pointsForCurrentLevel = (currentLevel - 1) * 200;
    const pointsForNextLevel = currentLevel * 200;
    const currentLevelPoints = userStats.points - pointsForCurrentLevel;
    const totalLevelPoints = pointsForNextLevel - pointsForCurrentLevel;
    return Math.min(1, Math.max(0, currentLevelPoints / totalLevelPoints));
  };

  const getMemberSinceDate = () => {
    // This would typically come from user data
    return "June 24, 2025";
  };

  const handleUpdateProfile = async () => {
    try {
      if (email !== user?.email) {
        const { error } = await supabase.auth.updateUser({ email });
        if (error) throw error;
        Alert.alert('Success', 'Email updated successfully');
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      
      setNewPassword('');
      setConfirmPassword('');
      Alert.alert('Success', 'Password updated successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      Alert.alert('Error', 'Failed to change password');
    }
  };

  const handleResetPassword = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user?.email || '');
      if (error) throw error;
      Alert.alert('Success', 'Password reset email sent');
    } catch (error) {
      console.error('Error sending reset email:', error);
      Alert.alert('Error', 'Failed to send reset email');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Profile Header Widget */}
        <View style={{
          backgroundColor: 'white',
          borderRadius: 20,
          padding: 20,
          margin: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
          {/* Avatar and User Info Row */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            {/* Avatar with badges */}
            <View style={{ position: 'relative', marginRight: 16 }}>
              <View style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: '#2D3748',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Ionicons name="person" size={40} color="white" />
              </View>
              {/* Notification badge */}
              <View style={{
                position: 'absolute',
                top: -5,
                right: -5,
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: '#FFD700',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 2,
                borderColor: 'white',
              }}>
                <Text style={{ color: 'black', fontSize: 14, fontWeight: 'bold' }}>1</Text>
              </View>
              {/* Camera icon */}
              <View style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 2,
                borderColor: '#f3f4f6',
              }}>
                <Ionicons name="camera" size={16} color="#6b7280" />
              </View>
            </View>

            {/* User Info */}
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: TYPOGRAPHY.heading, fontWeight: FONT_WEIGHTS.bold, color: COLORS.primary, marginBottom: 8 }}>
                {user?.email}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Ionicons name="calendar" size={14} color={COLORS.gray} style={{ marginRight: 6 }} />
                <Text style={{ fontSize: TYPOGRAPHY.bodySmall, color: COLORS.gray }}>
                  Member since June 24, 2025
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="trophy" size={16} color="#FFD700" style={{ marginRight: 6 }} />
                <Text style={{ fontSize: TYPOGRAPHY.body, fontWeight: FONT_WEIGHTS.bold, color: '#FFD700' }}>
                  Level {userStats.level}
                </Text>
              </View>
            </View>
          </View>

          {/* Progress Section */}
          <View style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="star" size={16} color="#FFD700" style={{ marginRight: 8 }} />
                <Text style={{ fontSize: TYPOGRAPHY.body, fontWeight: FONT_WEIGHTS.semibold, color: COLORS.primary }}>
                  Level {userStats.level} Progress
                </Text>
              </View>
              <Text style={{ fontSize: TYPOGRAPHY.bodySmall, color: COLORS.gray }}>
                {calculatePointsToNextLevel()} points to next level
              </Text>
            </View>
            {/* Progress Bar */}
            <View style={{
              height: 8,
              backgroundColor: '#f3f4f6',
              borderRadius: 4,
              overflow: 'hidden',
            }}>
              <View style={{
                height: '100%',
                backgroundColor: 'black',
                borderRadius: 4,
                width: `${calculateLevelProgress() * 100}%`,
              }} />
            </View>
          </View>

          {/* Stats Cards */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{
              flex: 1,
              padding: 16,
              borderRadius: 16,
              alignItems: 'center',
              marginHorizontal: 4,
              backgroundColor: '#E3E2F6',
            }}>
              <Text style={{ fontSize: TYPOGRAPHY.extraLarge, fontWeight: FONT_WEIGHTS.bold, color: COLORS.primary, marginBottom: 4 }}>
                {userStats.points}
              </Text>
              <Text style={{ fontSize: TYPOGRAPHY.bodySmall, color: COLORS.gray, textAlign: 'center' }}>
                Total Points
              </Text>
            </View>
            <View style={{
              flex: 1,
              padding: 16,
              borderRadius: 16,
              alignItems: 'center',
              marginHorizontal: 4,
              backgroundColor: '#EDE3E4',
            }}>
              <Text style={{ fontSize: TYPOGRAPHY.extraLarge, fontWeight: FONT_WEIGHTS.bold, color: COLORS.primary, marginBottom: 4 }}>
                {userStats.streak}
              </Text>
              <Text style={{ fontSize: TYPOGRAPHY.bodySmall, color: COLORS.gray, textAlign: 'center' }}>
                Day Streak
              </Text>
            </View>
            <View style={{
              flex: 1,
              padding: 16,
              borderRadius: 16,
              alignItems: 'center',
              marginHorizontal: 4,
              backgroundColor: '#E3E7CF',
            }}>
              <Text style={{ fontSize: TYPOGRAPHY.extraLarge, fontWeight: FONT_WEIGHTS.bold, color: COLORS.primary, marginBottom: 4 }}>
                1
              </Text>
              <Text style={{ fontSize: TYPOGRAPHY.bodySmall, color: COLORS.gray, textAlign: 'center' }}>
                Achievements
              </Text>
            </View>
          </View>
        </View>

        {/* Account Management Section */}
        <View style={{
          backgroundColor: 'white',
          borderRadius: 20,
          padding: 20,
          margin: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ fontSize: TYPOGRAPHY.heading, fontWeight: FONT_WEIGHTS.bold, color: COLORS.primary }}>
              Account Settings
            </Text>
            <TouchableOpacity 
              onPress={() => setIsEditing(!isEditing)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
                backgroundColor: isEditing ? '#ef4444' : '#3b82f6',
              }}
            >
              <Text style={{ color: COLORS.white, fontSize: TYPOGRAPHY.button, fontWeight: FONT_WEIGHTS.semibold }}>
                {isEditing ? 'Cancel' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Display Name */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: TYPOGRAPHY.body, fontWeight: FONT_WEIGHTS.semibold, color: COLORS.primary, marginBottom: 8 }}>
              Display Name
            </Text>
            {isEditing ? (
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: TYPOGRAPHY.input,
                  backgroundColor: '#f9fafb',
                }}
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Enter your display name"
              />
            ) : (
              <Text style={{ fontSize: TYPOGRAPHY.body, color: COLORS.gray, padding: 12 }}>
                {displayName || 'No display name set'}
              </Text>
            )}
          </View>

          {/* Email */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: TYPOGRAPHY.body, fontWeight: FONT_WEIGHTS.semibold, color: COLORS.primary, marginBottom: 8 }}>
              Email Address
            </Text>
            {isEditing ? (
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: TYPOGRAPHY.input,
                  backgroundColor: '#f9fafb',
                }}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <Text style={{ fontSize: TYPOGRAPHY.body, color: COLORS.gray, padding: 12 }}>
                {user?.email}
              </Text>
            )}
          </View>

          {/* Update Profile Button */}
          {isEditing && (
            <TouchableOpacity
              onPress={handleUpdateProfile}
              style={{
                backgroundColor: '#10b981',
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <Text style={{ color: COLORS.white, fontSize: TYPOGRAPHY.button, fontWeight: FONT_WEIGHTS.semibold }}>
                Update Profile
              </Text>
            </TouchableOpacity>
          )}

          {/* Password Section */}
          <View style={{ borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 20 }}>
            <Text style={{ fontSize: TYPOGRAPHY.subheading, fontWeight: FONT_WEIGHTS.bold, color: COLORS.primary, marginBottom: 16 }}>
              Password Management
            </Text>

            {/* New Password */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: TYPOGRAPHY.body, fontWeight: FONT_WEIGHTS.semibold, color: COLORS.primary, marginBottom: 8 }}>
                New Password
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: TYPOGRAPHY.input,
                  backgroundColor: '#f9fafb',
                }}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                secureTextEntry
              />
            </View>

            {/* Confirm Password */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: TYPOGRAPHY.body, fontWeight: FONT_WEIGHTS.semibold, color: COLORS.primary, marginBottom: 8 }}>
                Confirm Password
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: TYPOGRAPHY.input,
                  backgroundColor: '#f9fafb',
                }}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                secureTextEntry
              />
            </View>

            {/* Password Actions */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                onPress={handleChangePassword}
                style={{
                  backgroundColor: '#8b5cf6',
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                  flex: 1,
                  marginRight: 8,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: COLORS.white, fontSize: TYPOGRAPHY.bodySmall, fontWeight: FONT_WEIGHTS.semibold }}>
                  Change Password
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleResetPassword}
                style={{
                  backgroundColor: '#f59e0b',
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                  flex: 1,
                  marginLeft: 8,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: COLORS.white, fontSize: TYPOGRAPHY.bodySmall, fontWeight: FONT_WEIGHTS.semibold }}>
                  Reset Password
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.journeySection}>
          <Text style={styles.sectionTitle}>📈 Health Journey</Text>
          
          <View style={styles.statsGrid}>
            <StatCard
              title="Recipes"
              value={recipesCooked}
              subtitle="Recipes cooked"
              icon="🍎"
              backgroundColor={COLORS.green}
            />
            
            <StatCard
              title="Exercise"
              value={exerciseMinutes}
              subtitle="Exercise mins"
              icon="🏋️"
              backgroundColor={COLORS.purple}
            />
            
            <StatCard
              title="Challenges"
              value={challengesCompleted}
              subtitle="Challenges"
              icon="🧘"
              backgroundColor={COLORS.pink}
            />
            
            <StatCard
              title="Level"
              value={`Leve...`}
              subtitle="Current level"
              icon="🏆"
              backgroundColor={COLORS.green}
            />
          </View>
        </View>

        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          
          {recentActivity.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>📈</Text>
              <Text style={styles.emptyStateText}>Start using the app to see your activity here</Text>
            </View>
          ) : (
            <View style={styles.activityList}>
              {recentActivity.map((activity) => (
                <View key={activity.id} style={styles.activityItem}>
                  <Text style={styles.activityType}>{activity.type}</Text>
                  <Text style={styles.activityDescription}>{activity.description}</Text>
                  <Text style={styles.activityTime}>{activity.timestamp}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.profileDetails}>
          <Text style={styles.detailsTitle}>Profile Details</Text>
          <Text style={styles.detailsText}>Email: {user?.email}</Text>
          <Text style={styles.detailsText}>Level: {userStats.level}</Text>
          <Text style={styles.detailsText}>Points: {userStats.points}</Text>
          <Text style={styles.detailsText}>Streak: {userStats.streak} days</Text>
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={onSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  journeySection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.heading,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: TYPOGRAPHY.large,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.bodySmall,
    color: COLORS.gray,
  },
  activitySection: {
    marginBottom: 32,
  },
  emptyState: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
  },
  activityList: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
  },
  activityItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  activityType: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: COLORS.gray,
  },
  profileDetails: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
  },
  detailsText: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 8,
  },
  signOutButton: {
    backgroundColor: COLORS.danger,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
  },
  signOutText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileHeader: {
    backgroundColor: '#FFE4E1',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#FF0000',
  },
  profileAvatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2D3748',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  badgeNumber: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.lightGray,
  },
  userInfo: {
    flex: 1,
  },
  userEmail: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  memberSince: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  memberSinceIcon: {
    marginRight: 6,
  },
  memberSinceText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  levelDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  crownIcon: {
    marginRight: 6,
  },
  levelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  levelProgress: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  progressIcon: {
    marginRight: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    flex: 1,
  },
  progressPoints: {
    fontSize: 14,
    color: COLORS.gray,
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  statsCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statsNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
  },
});