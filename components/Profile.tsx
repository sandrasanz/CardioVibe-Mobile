import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { User } from '@supabase/supabase-js';
import { UserStats } from '../lib/supabase';

const COLORS = {
  primary: '#000000',
  background: '#f9fafb',
  white: '#ffffff',
  gray: '#6b7280',
  danger: '#ef4444',
};

interface ProfileProps {
  user: User | null;
  userStats: UserStats;
  onSignOut: () => void;
}

export default function Profile({ user, userStats, onSignOut }: ProfileProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Email: {user?.email}</Text>
        <Text style={styles.subtitle}>Level: {userStats.level}</Text>
        <Text style={styles.subtitle}>Points: {userStats.points}</Text>
        
        <TouchableOpacity style={styles.signOutButton} onPress={onSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 8,
  },
  signOutButton: {
    backgroundColor: COLORS.danger,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 32,
  },
  signOutText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});