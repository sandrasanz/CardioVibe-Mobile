import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Alert,
  Share
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#000000',
  background: '#f9fafb',
  white: '#ffffff',
  gray: '#6b7280',
  lightGray: '#f3f4f6',
  green: '#dcfce7',
  red: '#fecaca',
};

interface ShoppingListItem {
  id: string;
  item_name: string;
  is_checked: boolean;
  added_from?: string;
  created_at?: string;
}

interface ShoppingListProps {
  items: ShoppingListItem[];
  removeItem: (item: string) => void;
  addShoppingListItem: (item: string) => void;
  updateItemStatus: (itemId: string, isChecked: boolean) => void;
}

export default function ShoppingList({ 
  items, 
  removeItem, 
  addShoppingListItem, 
  updateItemStatus 
}: ShoppingListProps) {
  const [newItem, setNewItem] = useState('');
  
  // Calculate progress
  const completedItems = items.filter(item => item.is_checked).length;
  const totalItems = items.length;
  const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const handleAddItem = () => {
    if (newItem.trim()) {
      addShoppingListItem(newItem.trim());
      setNewItem('');
    }
  };

  const handleToggleItem = (item: ShoppingListItem) => {
    updateItemStatus(item.id, !item.is_checked);
  };

  const handleDeleteItem = (item: ShoppingListItem) => {
    Alert.alert(
      'Delete Item',
      `Remove "${item.item_name}" from your shopping list?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => removeItem(item.item_name)
        }
      ]
    );
  };

  const handleShareList = async () => {
    try {
      const listText = items
        .map(item => `${item.is_checked ? '✓' : '○'} ${item.item_name}`)
        .join('\n');
      
      await Share.share({
        message: `CardioVibe Shopping List\n\n${listText}`,
        title: 'Heart-Healthy Shopping List'
      });
    } catch (error) {
      console.error('Error sharing list:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Shopping List</Text>
          <Text style={styles.subtitle}>Heart-healthy ingredients for your meals</Text>
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Shopping Progress</Text>
            <Text style={styles.progressCount}>{completedItems} of {totalItems} items</Text>
          </View>
          
          <View style={styles.progressInfo}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={styles.progressPercentage}>{progressPercentage}%</Text>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { width: `${progressPercentage}%` }
                ]} 
              />
            </View>
          </View>

          <TouchableOpacity 
            style={styles.shareButton}
            onPress={handleShareList}
          >
            <Ionicons name="share-outline" size={20} color="white" />
            <Text style={styles.shareButtonText}>Share List</Text>
          </TouchableOpacity>
        </View>

        {/* Add Item Input */}
        <View style={styles.addItemCard}>
          <View style={styles.addItemContainer}>
            <TextInput
              style={styles.addItemInput}
              placeholder="Add new ingredient..."
              value={newItem}
              onChangeText={setNewItem}
              onSubmitEditing={handleAddItem}
              returnKeyType="done"
            />
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddItem}
            >
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Shopping Items */}
        <View style={styles.itemsContainer}>
          {items.map((item) => (
            <View 
              key={item.id} 
              style={[
                styles.itemCard,
                item.is_checked && styles.itemCardCompleted
              ]}
            >
              <TouchableOpacity 
                style={styles.checkboxContainer}
                onPress={() => handleToggleItem(item)}
              >
                <View style={[
                  styles.checkbox,
                  item.is_checked && styles.checkboxChecked
                ]}>
                  {item.is_checked && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
              </TouchableOpacity>
              
              <Text style={[
                styles.itemText,
                item.is_checked && styles.itemTextCompleted
              ]}>
                {item.item_name}
              </Text>
              
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleDeleteItem(item)}
              >
                <Ionicons name="trash-outline" size={18} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ))}
          
          {items.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="basket-outline" size={48} color="#d1d5db" />
              <Text style={styles.emptyStateText}>Your shopping list is empty</Text>
              <Text style={styles.emptyStateSubtext}>Add ingredients from recipes or manually</Text>
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
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  progressCount: {
    fontSize: 16,
    color: '#666',
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 16,
    color: '#666',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  progressBarContainer: {
    marginBottom: 20,
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
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#222',
    paddingVertical: 12,
    borderRadius: 12,
  },
  shareButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  addItemCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  addItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addItemInput: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    marginRight: 12,
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: '#6b7280',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  itemCard: {
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
  itemCardCompleted: {
    backgroundColor: '#dcfce7',
  },
  checkboxContainer: {
    marginRight: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#222',
    borderColor: '#222',
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: '#222',
  },
  itemTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#6b7280',
  },
  deleteButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
});