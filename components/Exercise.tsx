import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Stack = createStackNavigator();

const COLORS = {
  primary: '#000000',
  background: '#f9fafb',
  white: '#ffffff',
  gray: '#6b7280',
  blue: '#3b82f6',
  green: '#22c55e',
  red: '#ef4444',
  orange: '#f97316',
};

interface Exercise {
  id: string;
  name: string;
  duration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  type: 'Cardio' | 'Strength' | 'Flexibility';
  calories: number;
  description: string;
  benefits: string[];
  videoUrl?: string;
  completed: boolean;
}

const MOCK_EXERCISES: Exercise[] = [
  {
    id: '1',
    name: 'Cardio aerobics',
    duration: 20,
    difficulty: 'Intermediate',
    type: 'Cardio',
    calories: 150,
    description: 'Start your day with a fun cardiovascular workout. Remember to keep an eye in your heart rate.',
    benefits: ['Improves circulation', 'Reduces blood pressure', 'Boosts energy'],
    videoUrl: 'https://youtube.com/watch?v=example1',
    completed: false
  },
  {
    id: '2',
    name: 'Low impact cardio',
    duration: 20,
    difficulty: 'Beginner',
    type: 'Cardio',
    calories: 120,
    description: 'Gentle cardio workout perfect for beginners or those with joint concerns.',
    benefits: ['Easy on joints', 'Builds endurance', 'Heart healthy'],
    videoUrl: 'https://youtube.com/watch?v=example2',
    completed: false
  }
];

const WEEK_DAYS = [
  { day: 'Monday', date: 'Jul 7', active: true },
  { day: 'Tuesday', date: 'Jul 8', active: false },
  { day: 'Wednesday', date: 'Jul 9', active: false },
  { day: 'Thursday', date: 'Jul 10', active: false }
];

// Weekly Plan Screen
function WeeklyPlanScreen({ navigation }) {
  const [weeklyProgress] = useState({
    daysCompleted: 0,
    totalMinutes: 337,
    caloriesBurned: 'NaN',
    progressDays: '0 of 7 days'
  });

  const [selectedDay, setSelectedDay] = useState('Monday');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Weekly Exercise Plan</Text>
          <Text style={styles.subtitle}>Personalized workouts for heart health</Text>
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>This Week's Progress</Text>
            <View style={styles.mascot}>
              <Text style={styles.mascotEmoji}>🏃‍♂️</Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{weeklyProgress.daysCompleted}</Text>
              <Text style={styles.statLabel}>Days{"\n"}Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{weeklyProgress.totalMinutes}</Text>
              <Text style={styles.statLabel}>Minutes Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{weeklyProgress.caloriesBurned}</Text>
              <Text style={styles.statLabel}>Calories Burned</Text>
            </View>
          </View>

          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: '0%' }]} />
            </View>
          </View>

          <View style={styles.progressFooter}>
            <Text style={styles.progressText}>Progress</Text>
            <Text style={styles.progressDays}>{weeklyProgress.progressDays}</Text>
          </View>
        </View>

        {/* Week Calendar */}
        <View style={styles.weekCalendar}>
          {WEEK_DAYS.map((dayInfo) => (
            <TouchableOpacity 
              key={dayInfo.day}
              style={[
                styles.dayCard,
                dayInfo.day === selectedDay && styles.dayCardActive
              ]}
              onPress={() => {
                setSelectedDay(dayInfo.day);
                navigation.navigate('DailyWorkout', { day: dayInfo.day, date: dayInfo.date });
              }}
            >
              <Text style={[
                styles.dayText,
                dayInfo.day === selectedDay && styles.dayTextActive
              ]}>
                {dayInfo.day}
              </Text>
              <Text style={[
                styles.dateText,
                dayInfo.day === selectedDay && styles.dateTextActive
              ]}>
                {dayInfo.date}
              </Text>
              {dayInfo.day === selectedDay && <View style={styles.activeDot} />}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Daily Workout Screen
function DailyWorkoutScreen({ route, navigation }) {
  const { day, date } = route.params || { day: 'Monday', date: 'Jul 7' };
  const [exercises, setExercises] = useState(MOCK_EXERCISES);
  const [selectedDay, setSelectedDay] = useState(day);
  const [weeklyProgress] = useState({
    daysCompleted: 0,
    totalMinutes: 337,
    caloriesBurned: 'NaN',
    progressDays: '0 of 7 days'
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Weekly Exercise Plan Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Weekly Exercise Plan</Text>
          <Text style={styles.subtitle}>Personalized workouts for heart health</Text>
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>This Week's Progress</Text>
            <View style={styles.mascot}>
              <Text style={styles.mascotEmoji}>🏃‍♂️</Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{weeklyProgress.daysCompleted}</Text>
              <Text style={styles.statLabel}>Days{"\n"}Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{weeklyProgress.totalMinutes}</Text>
              <Text style={styles.statLabel}>Minutes Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{weeklyProgress.caloriesBurned}</Text>
              <Text style={styles.statLabel}>Calories Burned</Text>
            </View>
          </View>

          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: '0%' }]} />
            </View>
          </View>

          <View style={styles.progressFooter}>
            <Text style={styles.progressText}>Progress</Text>
            <Text style={styles.progressDays}>{weeklyProgress.progressDays}</Text>
          </View>
        </View>

        {/* Week Calendar */}
        <View style={styles.weekCalendar}>
          {WEEK_DAYS.map((dayInfo) => (
            <TouchableOpacity 
              key={dayInfo.day}
              style={[
                styles.dayCard,
                dayInfo.day === selectedDay && styles.dayCardActive
              ]}
              onPress={() => setSelectedDay(dayInfo.day)}
            >
              <Text style={[
                styles.dayText,
                dayInfo.day === selectedDay && styles.dayTextActive
              ]}>
                {dayInfo.day}
              </Text>
              <Text style={[
                styles.dateText,
                dayInfo.day === selectedDay && styles.dateTextActive
              ]}>
                {dayInfo.date}
              </Text>
              {dayInfo.day === selectedDay && <View style={styles.activeDot} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Daily Workout Section Header */}
        <View style={styles.dailyHeader}>
          <Text style={styles.dailyTitle}>{selectedDay}'s</Text>
          <View style={styles.dailyHeaderRight}>
            <Text style={styles.dailyStats}>40</Text>
            <Text style={styles.dailyStats}>0</Text>
          </View>
        </View>
        <View style={styles.dailySubheader}>
          <Text style={styles.dailySubtitle}>Workout <Text style={styles.todayBadge}>Today</Text></Text>
          <View style={styles.dailyStatsLabels}>
            <Text style={styles.statsLabel}>min</Text>
            <Text style={styles.statsLabel}>cal</Text>
          </View>
        </View>

        {/* Exercise List */}
        <View style={styles.exercisesList}>
          {exercises.map((exercise) => (
            <TouchableOpacity 
              key={exercise.id}
              style={styles.exerciseCard}
              onPress={() => navigation.navigate('ExerciseDetail', { exercise })}
            >
              <View style={styles.exerciseIcon}>
                <Text style={styles.exerciseEmoji}>🏃‍♂️</Text>
              </View>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseDuration}>{exercise.duration} min</Text>
                <View style={styles.exerciseBadges}>
                  <View style={[
                    styles.difficultyBadge,
                    exercise.difficulty === 'Beginner' && { backgroundColor: '#22c55e' },
                    exercise.difficulty === 'Intermediate' && { backgroundColor: '#f59e0b' },
                    exercise.difficulty === 'Advanced' && { backgroundColor: '#ef4444' }
                  ]}>
                    <Text style={styles.difficultyText}>{exercise.difficulty}</Text>
                  </View>
                  <View style={styles.typeBadge}>
                    <Text style={styles.typeText}>{exercise.type}</Text>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Start Workout Button */}
        <View style={styles.startButtonContainer}>
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>Start Today's Workout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Exercise Detail Screen
function ExerciseDetailScreen({ route, navigation }) {
  const { exercise } = route.params;
  const [isCompleted, setIsCompleted] = useState(exercise.completed);

  const handleGoToYouTube = () => {
    if (exercise.videoUrl) {
      Linking.openURL(exercise.videoUrl);
    } else {
      Alert.alert('Video Unavailable', 'This exercise video is not available yet.');
    }
  };

  const handleMarkComplete = () => {
    setIsCompleted(true);
    Alert.alert(
      'Exercise Completed!',
      `Great job completing ${exercise.name}! You burned approximately ${exercise.calories} calories.`,
      [
        {
          text: 'Continue',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <View style={styles.backButtonContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#222" />
          </TouchableOpacity>
        </View>
        {/* Video Section */}
        <View style={styles.videoSection}>
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{exercise.duration} min</Text>
          </View>
          <View style={styles.videoPlaceholder}>
            <Text style={styles.videoEmoji}>🏃‍♂️</Text>
          </View>
          <TouchableOpacity style={styles.youtubeButton} onPress={handleGoToYouTube}>
            <Ionicons name="play" size={20} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.youtubeButtonText}>Go to YouTube</Text>
            <Ionicons name="open-outline" size={16} color="white" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>

        {/* Exercise Info */}
        <View style={styles.exerciseDetailContent}>
          <View style={styles.exerciseDetailHeader}>
            <Text style={styles.exerciseDetailTitle}>{exercise.name}</Text>
            {isCompleted && (
              <View style={styles.completedBadge}>
                <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
              </View>
            )}
          </View>

          <View style={styles.exerciseDetailBadges}>
            <View style={styles.timeBadge}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.timeBadgeText}>{exercise.duration} min</Text>
            </View>
            <View style={[
              styles.difficultyBadge,
              exercise.difficulty === 'Beginner' && { backgroundColor: '#22c55e' },
              exercise.difficulty === 'Intermediate' && { backgroundColor: '#f59e0b' },
              exercise.difficulty === 'Advanced' && { backgroundColor: '#ef4444' }
            ]}>
              <Text style={styles.difficultyText}>{exercise.difficulty}</Text>
            </View>
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>{exercise.type}</Text>
            </View>
          </View>

          <Text style={styles.exerciseDescription}>{exercise.description}</Text>

          {/* Benefits */}
          <View style={styles.benefitsSection}>
            <Text style={styles.benefitsTitle}>Benefits</Text>
            {exercise.benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>

          {/* Stats */}
          <View style={styles.exerciseStats}>
            <View style={styles.exerciseStatCard}>
              <Text style={styles.exerciseStatNumber}>NaN</Text>
              <Text style={styles.exerciseStatLabel}>Calories Burned</Text>
            </View>
            <View style={styles.exerciseStatCard}>
              <Text style={styles.exerciseStatNumber}>{exercise.duration}</Text>
              <Text style={styles.exerciseStatLabel}>Minutes</Text>
            </View>
          </View>

          {/* Complete Button */}
          {!isCompleted && (
            <TouchableOpacity style={styles.completeButton} onPress={handleMarkComplete}>
              <Text style={styles.completeButtonText}>Mark as Complete</Text>
            </TouchableOpacity>
          )}

          {isCompleted && (
            <View style={styles.completedSection}>
              <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
              <Text style={styles.completedText}>Exercise Completed!</Text>
            </View>
          )}
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
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
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
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  mascot: {
    alignItems: 'center',
  },
  mascotEmoji: {
    fontSize: 32,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#222',
    borderRadius: 4,
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
    color: '#666',
  },
  progressDays: {
    fontSize: 16,
    color: '#666',
  },
  weekCalendar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dayCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginRight: 8,
    alignItems: 'center',
    position: 'relative',
  },
  dayCardActive: {
    backgroundColor: '#222',
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  dayTextActive: {
    color: 'white',
  },
  dateText: {
    fontSize: 14,
    color: '#999',
  },
  dateTextActive: {
    color: '#ccc',
  },
  activeDot: {
    position: 'absolute',
    bottom: 8,
    width: 6,
    height: 6,
    backgroundColor: '#3b82f6',
    borderRadius: 3,
  },
  // Daily Workout Styles
  dailyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  dailyTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
  },
  dailyHeaderRight: {
    flexDirection: 'row',
    gap: 20,
  },
  dailyStats: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },
  dailySubheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dailySubtitle: {
    fontSize: 18,
    color: '#666',
  },
  todayBadge: {
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  dailyStatsLabels: {
    flexDirection: 'row',
    gap: 20,
  },
  statsLabel: {
    fontSize: 14,
    color: '#666',
  },
  exercisesList: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  exerciseIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  exerciseEmoji: {
    fontSize: 24,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  exerciseDuration: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  exerciseBadges: {
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
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#fecaca',
  },
  typeText: {
    fontSize: 12,
    color: '#dc2626',
    fontWeight: '500',
  },
  startButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  startButton: {
    backgroundColor: '#222',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Exercise Detail Styles
  videoSection: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  durationBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#6b7280',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 1,
  },
  durationText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  videoPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  videoEmoji: {
    fontSize: 48,
  },
  youtubeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dc2626',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  youtubeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exerciseDetailContent: {
    paddingHorizontal: 20,
  },
  exerciseDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  exerciseDetailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    flex: 1,
  },
  completedBadge: {
    marginLeft: 12,
  },
  exerciseDetailBadges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  timeBadgeText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  exerciseDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
  },
  benefitsSection: {
    marginBottom: 24,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  exerciseStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  exerciseStatCard: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  exerciseStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  exerciseStatLabel: {
    fontSize: 14,
    color: '#666',
  },
  completeButton: {
    backgroundColor: '#222',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 100,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  completedSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    marginBottom: 100,
  },
  completedText: {
    fontSize: 18,
    color: '#22c55e',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  backButtonContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default function Exercise() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DailyWorkout" component={DailyWorkoutScreen} />
      <Stack.Screen name="WeeklyPlan" component={WeeklyPlanScreen} />
      <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
    </Stack.Navigator>
  );
}