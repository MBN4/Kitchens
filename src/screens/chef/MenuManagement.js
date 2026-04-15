import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Switch, Alert, ActivityIndicator } from 'react-native';
import { ChevronLeft, Plus, Trash2, Edit3, Clock } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';
import client from '../../api/client';
import useAuthStore from '../../store/useAuthStore';

export default function MenuManagement({ navigation }) {
  const { user } = useAuthStore();
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChefMenu();
  }, []);

  const fetchChefMenu = async () => {
    try {
      const response = await client.get(`/api/chefs/menu/${user._id}`);
      setMenu(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (itemId, currentStatus) => {
    try {
      const response = await client.put(`/api/chefs/food/${itemId}`, { isAvailable: !currentStatus });
      setMenu(prev => prev.map(item => item._id === itemId ? response.data : item));
    } catch (error) {
      Alert.alert("Error", "Update failed");
    }
  };

  const confirmDelete = (itemId) => {
    Alert.alert("Delete Dish", "Are you sure you want to remove this from your menu?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteItem(itemId) }
    ]);
  };

  const deleteItem = async (itemId) => {
    try {
      await client.delete(`/api/chefs/food/${itemId}`);
      setMenu(prev => prev.filter(item => item._id !== itemId));
    } catch (error) {
      Alert.alert("Error", "Delete failed");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><ChevronLeft color="black" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Menu Management</Text>
        <TouchableOpacity style={styles.addIcon} onPress={() => navigation.navigate('AddFoodItem')}>
          <Plus color={COLORS.primary} size={24} />
        </TouchableOpacity>
      </View>

      {loading ? <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} /> : (
        <FlatList
          data={menu}
          keyExtractor={item => item._id}
          contentContainerStyle={{ padding: 20 }}
          renderItem={({ item }) => (
            <View style={[styles.card, !item.isAvailable && { opacity: 0.6 }]}>
              <Image source={{ uri: item.image_url }} style={styles.img} />
              <View style={styles.details}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={styles.timeRow}>
                  <Clock size={14} color={COLORS.gray} />
                  <Text style={styles.timeText}>{item.preparationTime}</Text>
                </View>
                <Text style={styles.price}>${item.price}</Text>
              </View>
              <View style={styles.actions}>
                <Switch 
                  value={item.isAvailable} 
                  onValueChange={() => toggleAvailability(item._id, item.isAvailable)}
                  trackColor={{ false: "#ddd", true: COLORS.primary }}
                />
                <View style={styles.iconRow}>
                  <TouchableOpacity onPress={() => confirmDelete(item._id)}><Trash2 size={20} color="red" /></TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, backgroundColor: 'white' },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  addIcon: { backgroundColor: COLORS.primary + '15', padding: 8, borderRadius: 12 },
  card: { flexDirection: 'row', backgroundColor: 'white', borderRadius: 20, padding: 15, marginBottom: 15, elevation: 2, alignItems: 'center' },
  img: { width: 70, height: 70, borderRadius: 15 },
  details: { flex: 1, marginLeft: 15 },
  name: { fontSize: 16, fontWeight: 'bold' },
  timeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  timeText: { fontSize: 12, color: COLORS.gray, marginLeft: 4 },
  price: { color: COLORS.primary, fontWeight: 'bold', marginTop: 5 },
  actions: { alignItems: 'flex-end', justifyContent: 'space-between', height: 70 },
  iconRow: { flexDirection: 'row', marginTop: 10 }
});