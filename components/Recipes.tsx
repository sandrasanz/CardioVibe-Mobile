import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  SafeAreaView,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Stack = createStackNavigator();

// Mock recipe data
const RECIPES = [
  {
    id: 1,
    title: 'Baked Salmon with Garlic & Lemon',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
    time: '27 min',
    servings: 3,
    rating: 4,
    category: 'dinner',
    healthBenefits: 'Helps lower blood pressure due to low sodium and high potassium content.',
    ingredients: ['2 salmon fillets', '2 cloves garlic, minced', '1 lemon, sliced', 'olive oil', 'herbs']
  },
  {
    id: 2,
    title: 'Avocado Toast with Seeds',
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400',
    time: '10 min',
    servings: 1,
    rating: 5,
    category: 'breakfast',
    healthBenefits: 'Rich in potassium and healthy fats that support heart health.',
    ingredients: ['1 avocado', '2 slices whole grain bread', 'chia seeds', 'hemp seeds', 'lime']
  }
];

function RecipesListScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner'];

  const filteredRecipes = RECIPES.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || recipe.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Heart-Healthy Recipes</Text>
          <Text style={styles.subtitle}>Delicious meals that help control blood pressure</Text>
        </View>

        {/* BP-Lowering Ingredients Card */}
        <TouchableOpacity 
          style={styles.ingredientsCard}
          onPress={() => navigation.navigate('Ingredients')}
        >
          <View style={styles.ingredientsIcon}>
            <Text style={styles.ingredientsEmoji}>🥗</Text>
          </View>
          <View style={styles.ingredientsText}>
            <Text style={styles.ingredientsTitle}>BP-Lowering Ingredients</Text>
            <Text style={styles.ingredientsSubtitle}>Natural ingredients for heart health</Text>
          </View>
          <View style={styles.exploreButton}>
            <Text style={styles.exploreText}>Explore</Text>
            <Ionicons name="arrow-forward" size={16} color="white" />
          </View>
        </TouchableOpacity>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search recipes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recipes Count */}
        <Text style={styles.recipeCount}>
          Selected: {selectedCategory} | Showing: {filteredRecipes.length} of {RECIPES.length} recipes
        </Text>

        {/* Recipes List */}
        <View style={styles.recipesContainer}>
          {filteredRecipes.map((recipe) => (
            <TouchableOpacity
              key={recipe.id}
              style={styles.recipeCard}
              onPress={() => navigation.navigate('RecipeDetail', { recipe })}
            >
              <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
              <View style={styles.recipeContent}>
                <Text style={styles.recipeTitle}>{recipe.title}</Text>
                <View style={styles.recipeInfo}>
                  <View style={styles.recipeInfoItem}>
                    <Ionicons name="time" size={16} color="#666" />
                    <Text style={styles.recipeInfoText}>{recipe.time}</Text>
                  </View>
                  <View style={styles.recipeInfoItem}>
                    <Ionicons name="people" size={16} color="#666" />
                    <Text style={styles.recipeInfoText}>{recipe.servings} servings</Text>
                  </View>
                  <View style={styles.recipeInfoItem}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.recipeInfoText}>{recipe.rating}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function IngredientsScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Berries', 'Superfruits', 'Vegetables'];
  
  const ingredients = [
    {
      id: 1,
      name: 'Acai Berries',
      description: 'Rich in anthocyanins and antioxidants',
      category: 'Berries',
      intensity: 'Medium',
      emoji: '🫐'
    },
    {
      id: 2,
      name: 'Acerola Cherry',
      description: 'Rich in vitamin C and antioxidants',
      category: 'Superfruits',
      intensity: 'Medium',
      emoji: '🍒'
    },
    {
      id: 3,
      name: 'Spinach',
      description: 'High in potassium and magnesium',
      category: 'Vegetables',
      intensity: 'High',
      emoji: '🥬'
    },
    {
      id: 4,
      name: 'Blueberries',
      description: 'Powerful antioxidants for heart health',
      category: 'Berries',
      intensity: 'High',
      emoji: '🫐'
    }
  ];

  const filteredIngredients = ingredients.filter(ingredient => {
    const matchesSearch = ingredient.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || ingredient.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Back Button */}
        <View style={styles.headerWithBack}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
            <Text style={styles.backButtonText}>Back to Recipes</Text>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>BP-Lowering Ingredients</Text>
          <Text style={styles.pageSubtitle}>Natural ingredients that help control blood pressure</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search ingredients..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Ingredients List */}
        <View style={styles.ingredientsContainer}>
          {filteredIngredients.map((ingredient) => (
            <View key={ingredient.id} style={styles.ingredientCard}>
              <View style={styles.ingredientIcon}>
                <Text style={styles.ingredientEmoji}>{ingredient.emoji}</Text>
              </View>
              <View style={styles.ingredientInfo}>
                <View style={styles.ingredientHeader}>
                  <Text style={styles.ingredientName}>{ingredient.name}</Text>
                  <View style={[
                    styles.intensityBadge,
                    ingredient.intensity === 'High' && styles.intensityHigh,
                    ingredient.intensity === 'Medium' && styles.intensityMedium
                  ]}>
                    <Text style={styles.intensityText}>{ingredient.intensity}</Text>
                  </View>
                </View>
                <Text style={styles.ingredientDescription}>{ingredient.description}</Text>
                <Text style={styles.ingredientCategory}>{ingredient.category}</Text>
              </View>
              <TouchableOpacity style={styles.addButton}>
                <Ionicons name="add" size={20} color="white" />
                <Text style={styles.addButtonText}>Add to List</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function RecipeDetailScreen({ route, navigation }) {
  const { recipe } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.recipeDetailHeader}>
          <Image source={{ uri: recipe.image }} style={styles.recipeDetailImage} />
          <TouchableOpacity 
            style={styles.backButtonOverlay}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Recipe Info */}
        <View style={styles.recipeDetailContent}>
          <Text style={styles.recipeDetailTitle}>{recipe.title}</Text>
          
          <View style={styles.recipeDetailInfo}>
            <View style={styles.recipeDetailInfoItem}>
              <Ionicons name="time" size={20} color="#666" />
              <Text style={styles.recipeDetailInfoText}>{recipe.time}</Text>
            </View>
            <View style={styles.recipeDetailInfoItem}>
              <Ionicons name="people" size={20} color="#666" />
              <Text style={styles.recipeDetailInfoText}>{recipe.servings} servings</Text>
            </View>
            <View style={styles.recipeDetailInfoItem}>
              {[...Array(5)].map((_, index) => (
                <Ionicons 
                  key={index}
                  name={index < recipe.rating ? "star" : "star-outline"} 
                  size={16} 
                  color="#FFD700" 
                />
              ))}
            </View>
          </View>

          <View style={styles.categoryBadge}>
            <Ionicons name="restaurant" size={16} color="#666" />
            <Text style={styles.categoryBadgeText}>{recipe.category}</Text>
          </View>

          {/* Health Benefits */}
          <View style={styles.healthBenefitsCard}>
            <Text style={styles.healthBenefitsTitle}>Health Benefits</Text>
            <Text style={styles.healthBenefitsText}>{recipe.healthBenefits}</Text>
          </View>

          {/* Navigation Buttons */}
          <View style={styles.navigationButtons}>
            <TouchableOpacity 
              style={styles.navButton}
              onPress={() => navigation.navigate('RecipeSteps', { recipe })}
            >
              <Ionicons name="list" size={24} color="white" />
              <Text style={styles.navButtonText}>Recipe Steps</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.navButton}
              onPress={() => navigation.navigate('Ingredients')}
            >
              <Ionicons name="leaf" size={24} color="white" />
              <Text style={styles.navButtonText}>BP Ingredients</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Ingredients Preview */}
          <View style={styles.ingredientsPreview}>
            <Text style={styles.ingredientsPreviewTitle}>Ingredients</Text>
            {recipe.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <Text style={styles.ingredientText}>{ingredient}</Text>
                <TouchableOpacity style={styles.addToListButton}>
                  <Ionicons name="add" size={16} color="white" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function RecipeStepsScreen({ route, navigation }) {
  const { recipe } = route.params;
  
  const steps = [
    'Preheat oven to 425°F (220°C)',
    'Season salmon fillets with salt and pepper',
    'Mince garlic and mix with olive oil',
    'Place salmon on baking sheet, brush with garlic oil',
    'Top with lemon slices and fresh herbs',
    'Bake for 12-15 minutes until fish flakes easily',
    'Serve immediately with your choice of sides'
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Back Button */}
        <View style={styles.headerWithBack}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
            <Text style={styles.backButtonText}>Back to Recipe</Text>
          </TouchableOpacity>
        </View>

        {/* Recipe Header */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>{recipe.title}</Text>
          <Text style={styles.pageSubtitle}>Step-by-step cooking instructions</Text>
        </View>

        {/* Recipe Info Bar */}
        <View style={styles.recipeInfoBar}>
          <View style={styles.recipeInfoBarItem}>
            <Ionicons name="time" size={16} color="#666" />
            <Text style={styles.recipeInfoBarText}>{recipe.time}</Text>
          </View>
          <View style={styles.recipeInfoBarItem}>
            <Ionicons name="people" size={16} color="#666" />
            <Text style={styles.recipeInfoBarText}>{recipe.servings} servings</Text>
          </View>
          <View style={styles.recipeInfoBarItem}>
            <Ionicons name="restaurant" size={16} color="#666" />
            <Text style={styles.recipeInfoBarText}>{recipe.category}</Text>
          </View>
        </View>

        {/* Steps */}
        <View style={styles.stepsContainer}>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepCard}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepText}>{step}</Text>
              </View>
              <TouchableOpacity style={styles.stepCheckButton}>
                <Ionicons name="checkmark" size={20} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Navigation to Ingredients */}
        <View style={styles.bottomNavigation}>
          <TouchableOpacity 
            style={styles.bottomNavButton}
            onPress={() => navigation.navigate('Ingredients')}
          >
            <Ionicons name="leaf" size={20} color="white" />
            <Text style={styles.bottomNavButtonText}>View BP-Lowering Ingredients</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: 'center',
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
  ingredientsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F0FF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  ingredientsIcon: {
    width: 50,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ingredientsEmoji: {
    fontSize: 24,
  },
  ingredientsText: {
    flex: 1,
  },
  ingredientsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  ingredientsSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  exploreText: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 6,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#222',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 12,
  },
  categoryButtonActive: {
    backgroundColor: '#222',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: 'white',
  },
  recipeCount: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  recipesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  recipeCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  recipeImage: {
    width: '100%',
    height: 180,
  },
  recipeContent: {
    padding: 16,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  recipeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  recipeInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipeInfoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  // Ingredients Screen Styles
  headerWithBack: {
    backgroundColor: '#222',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  pageHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 5,
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  ingredientsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  ingredientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  ingredientIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ingredientEmoji: {
    fontSize: 24,
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  ingredientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  intensityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  intensityHigh: {
    backgroundColor: '#FFE4B5',
  },
  intensityMedium: {
    backgroundColor: '#FFF8DC',
  },
  intensityText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  ingredientDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  ingredientCategory: {
    fontSize: 12,
    color: '#999',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  addButtonText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  // Recipe Detail Styles
  recipeDetailHeader: {
    position: 'relative',
  },
  recipeDetailImage: {
    width: '100%',
    height: 250,
  },
  backButtonOverlay: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeDetailContent: {
    padding: 20,
  },
  recipeDetailTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 16,
  },
  recipeDetailInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 16,
  },
  recipeDetailInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipeDetailInfoText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 6,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  categoryBadgeText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    textTransform: 'capitalize',
  },
  healthBenefitsCard: {
    backgroundColor: '#E6F7D9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  healthBenefitsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  healthBenefitsText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#222',
    paddingVertical: 16,
    borderRadius: 16,
  },
  navButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  ingredientsPreview: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
  },
  ingredientsPreviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  ingredientText: {
    fontSize: 16,
    color: '#666',
  },
  addToListButton: {
    width: 24,
    height: 24,
    backgroundColor: '#222',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Recipe Steps Styles
  recipeInfoBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  recipeInfoBarItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipeInfoBarText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  stepsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    backgroundColor: '#222',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  stepCheckButton: {
    width: 32,
    height: 32,
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomNavigation: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  bottomNavButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#222',
    paddingVertical: 16,
    borderRadius: 16,
  },
  bottomNavButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default function Recipes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RecipesList" component={RecipesListScreen} />
      <Stack.Screen name="Ingredients" component={IngredientsScreen} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
      <Stack.Screen name="RecipeSteps" component={RecipeStepsScreen} />
    </Stack.Navigator>
  );
}