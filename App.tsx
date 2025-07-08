import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons 
} from '@expo/vector-icons';

import { useAuth } from './hooks/useAuth';
import { supabase } from './lib/supabase';
import type { UserStats as UserStatsType, Recipe, ShoppingListItem } from './lib/supabase';

// Import components (we'll create these)
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Recipes from './components/Recipes';
import ShoppingList from './components/ShoppingList';
import Challenges from './components/Challenges';
import Exercise from './components/Exercise';
import BloodPressure from './components/BloodPressure';
import Profile from './components/Profile';
import Home from './components/Home';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Define theme colors
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

function HomeStack() {
  const { user, signOut } = useAuth();
  const [userStats, setUserStats] = useState<UserStatsType>({
    id: '',
    user_id: '',
    points: 0,
    streak: 0,
    level: 1,
    completed_challenges: 0,
    recipes_cooked: 0,
    exercise_minutes: 0,
    updated_at: ''
  });

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setUserStats(data);
      } else {
        // No user stats record exists, create one
        const defaultStats = {
          user_id: user.id,
          points: 0,
          streak: 0,
          level: 1,
          completed_challenges: 0,
          recipes_cooked: 0,
          exercise_minutes: 0,
          updated_at: new Date().toISOString()
        };

        const { data: newStats, error: insertError } = await supabase
          .from('user_stats')
          .insert(defaultStats)
          .select()
          .single();

        if (insertError) throw insertError;
        if (newStats) setUserStats(newStats);
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeMain" 
        component={Home} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Profile" 
        options={{ 
          title: 'Profile',
          headerStyle: { backgroundColor: COLORS.white },
          headerTitleStyle: { fontWeight: 'bold', color: COLORS.primary },
          headerTintColor: COLORS.primary,
        }}
      >
        {() => (
          <Profile 
            user={user} 
            userStats={userStats} 
            onSignOut={handleSignOut} 
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function AppTabs() {
  const { user, signOut } = useAuth();
  const [userStats, setUserStats] = useState<UserStatsType>({
    id: '',
    user_id: '',
    points: 0,
    streak: 0,
    level: 1,
    completed_challenges: 0,
    recipes_cooked: 0,
    exercise_minutes: 0,
    updated_at: ''
  });
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    if (user) {
      loadUserData();
      loadShoppingList();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setUserStats(data);
      } else {
        // No user stats record exists, create one
        const defaultStats = {
          user_id: user.id,
          points: 0,
          streak: 0,
          level: 1,
          completed_challenges: 0,
          recipes_cooked: 0,
          exercise_minutes: 0,
          updated_at: new Date().toISOString()
        };

        const { data: newStats, error: insertError } = await supabase
          .from('user_stats')
          .insert(defaultStats)
          .select()
          .single();

        if (insertError) throw insertError;
        if (newStats) setUserStats(newStats);
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const loadShoppingList = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('shopping_list_items')
        .select('id, item_name, is_checked, added_from, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setShoppingList(data);
      }
    } catch (error) {
      console.error('Error loading shopping list:', error);
    }
  };

  const addToShoppingList = async (ingredient: string) => {
    if (!user || shoppingList.some(item => item.item_name === ingredient)) return;

    try {
      const { data, error } = await supabase
        .from('shopping_list_items')
        .insert({
          user_id: user.id,
          item_name: ingredient,
          is_checked: false,
          added_from: 'manual'
        })
        .select('id, item_name, is_checked, added_from, created_at')
        .single();

      if (error) throw error;
      if (data) {
        setShoppingList([data, ...shoppingList]);
      }
    } catch (error) {
      console.error('Error adding to shopping list:', error);
    }
  };

  const addShoppingListItem = async (itemName: string) => {
    if (!user || shoppingList.some(item => item.item_name === itemName)) return;

    try {
      const { data, error } = await supabase
        .from('shopping_list_items')
        .insert({
          user_id: user.id,
          item_name: itemName,
          is_checked: false,
          added_from: 'manual'
        })
        .select('id, item_name, is_checked, added_from, created_at')
        .single();

      if (error) throw error;
      if (data) {
        setShoppingList([data, ...shoppingList]);
      }
    } catch (error) {
      console.error('Error adding shopping list item:', error);
    }
  };

  const removeFromShoppingList = async (ingredient: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('shopping_list_items')
        .delete()
        .eq('user_id', user.id)
        .eq('item_name', ingredient);

      if (error) throw error;
      setShoppingList(shoppingList.filter(item => item.item_name !== ingredient));
    } catch (error) {
      console.error('Error removing from shopping list:', error);
    }
  };

  const updateShoppingListItemStatus = async (itemId: string, isChecked: boolean) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('shopping_list_items')
        .update({ is_checked: isChecked })
        .eq('id', itemId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setShoppingList(shoppingList.map(item => 
        item.id === itemId ? { ...item, is_checked: isChecked } : item
      ));
    } catch (error) {
      console.error('Error updating shopping list item status:', error);
    }
  };

  const updateUserStats = async (newStats: Partial<UserStatsType>) => {
    if (!user) return;

    try {
      const updatedStats = { ...userStats, ...newStats, updated_at: new Date().toISOString() };
      
      const { error } = await supabase
        .from('user_stats')
        .update(updatedStats)
        .eq('user_id', user.id);

      if (error) throw error;
      setUserStats(updatedStats);
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;
          let IconComponent = Ionicons;

          if (route.name === 'Home') {
            IconComponent = Ionicons;
            iconName = focused ? 'pulse' : 'pulse-outline';
          } else if (route.name === 'Recipes') {
            IconComponent = Ionicons;
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'Shopping') {
            IconComponent = Ionicons;
            iconName = focused ? 'bag' : 'bag-outline';
          } else if (route.name === 'Goals') {
            IconComponent = Ionicons;
            iconName = focused ? 'target' : 'ellipse-outline';
          } else if (route.name === 'Workout') {
            IconComponent = Ionicons;
            iconName = focused ? 'barbell' : 'barbell-outline';
          } else if (route.name === 'Health') {
            IconComponent = Ionicons;
            iconName = focused ? 'heart' : 'heart-outline';
          }

          return <IconComponent name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.accent,
          paddingBottom: 5,
          paddingTop: 5,
          height: 65,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: COLORS.white,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.accent,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: COLORS.primary,
        },
        headerTitleAlign: 'center',
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ title: 'Home', headerShown: false }} />
      <Tab.Screen name="Recipes" options={{ title: 'Recipes' }}>
        {() => (
          <Recipes 
            addToShoppingList={addToShoppingList} 
            selectedRecipe={selectedRecipe}
            onRecipeSelect={setSelectedRecipe}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Shopping" options={{ title: 'Shopping' }}>
        {() => (
          <ShoppingList 
            items={shoppingList} 
            removeItem={removeFromShoppingList}
            addShoppingListItem={addShoppingListItem}
            updateItemStatus={updateShoppingListItemStatus}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Goals" options={{ title: 'Goals' }}>
        {() => (
          <Challenges 
            userStats={userStats} 
            setUserStats={updateUserStats} 
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Workout" component={Exercise} options={{ title: 'Workout' }} />
      <Tab.Screen name="Health" component={BloodPressure} options={{ title: 'Health' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar style="auto" />
        <View style={styles.loadingContent}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.darkGray]}
            style={styles.loadingIcon}
          >
            <Ionicons name="heart" size={32} color={COLORS.white} />
          </LinearGradient>
          <Text style={styles.loadingText}>Loading...</Text>
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 10 }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      {user ? <AppTabs /> : <Auth />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.gray,
    fontWeight: '500',
  },
});
