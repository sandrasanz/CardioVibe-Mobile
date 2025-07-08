import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import Constants from 'expo-constants'

const supabaseUrl = Constants.expoConfig?.extra?.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = Constants.expoConfig?.extra?.SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to get public URL from assets bucket
export const getPublicAssetUrl = (path: string): string => {
  if (!path) return '';
  
  // If it's already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Get public URL from assets bucket
  const { data } = supabase.storage.from('assets').getPublicUrl(path);
  return data.publicUrl;
};

// Database types
export interface User {
  id: string
  email: string
  username: string
  created_at: string
  updated_at: string
}

export interface Ingredient {
  id: string
  name: string
  category: string
  benefits: string
  potency: 'low' | 'medium' | 'high'
  icon: string
  created_at: string
}

export interface BloodPressureReading {
  id: string
  user_id: string
  systolic: number
  diastolic: number
  pulse?: number
  notes?: string
  method: 'manual' | 'bluetooth'
  created_at: string
}

export interface UserChallenge {
  id: string
  user_id: string
  challenge_id: number
  status: 'active' | 'completed' | 'paused'
  progress: number
  started_at: string
  completed_at?: string
  notes?: string
}

export interface ShoppingListItem {
  id: string
  user_id: string
  item_name: string
  is_checked: boolean
  added_from: 'recipe' | 'ingredient' | 'manual'
  created_at: string
}

export interface UserStats {
  id: string
  user_id: string
  points: number
  streak: number
  level: number
  completed_challenges: number
  recipes_cooked: number
  exercise_minutes: number
  updated_at: string
}

// Updated Exercise interface to match the exercises table schema
export interface Exercise {
  id: string
  name: string
  description: string
  duration_minutes: number
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  exercise_type: 'Cardio' | 'Strength' | 'Flexibility' | 'Balance'
  calories_per_minute: number
  video_url: string
  thumbnail_url: string
  benefits: string[]
  equipment_needed?: string[]
  target_muscles?: string[]
  created_at: string
}

// Updated ExerciseLog interface with string exercise_id (UUID)
export interface ExerciseLog {
  id: string
  user_id: string
  exercise_id: string // Changed from number to string (UUID)
  duration: number
  calories_burned: number
  completed_at: string
  notes?: string
}

export interface Recipe {
  id: string;
  name: string;
  image_url?: string;
  prep_time_minutes?: number;
  servings?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  rating?: number;
  tags?: string[];
  meal_time?: 'Breakfast' | 'Lunch' | 'Dinner';
  ingredients_list?: string;
  steps_list?: string;
  benefits?: string;
  created_at: string;
}

// Type definitions for exercise enums
export type ExerciseDifficulty = 'Beginner' | 'Intermediate' | 'Advanced'
export type ExerciseType = 'Cardio' | 'Strength' | 'Flexibility' | 'Balance'