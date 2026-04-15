import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { COLORS } from '../../constants/theme';
import { Plus, AlertCircle, CheckCircle, List, BarChart3, Settings } from 'lucide-react-native';
import useAuthStore from '../../store/useAuthStore';
import client from '../../api/client';

export default function ChefDashboard({ navigation }) {
  const { user } = useAuthStore();
  const [chefProfile, setChefProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChefProfile();
  }, []);

  const fetchChefProfile = async () => {
    try {
      const response = await client.get(`/api/chefs/profile/${user._id}`);
      setChefProfile(response.data);
    } catch (error) {
      console.log("Chef profile fetch error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );

  if (chefProfile?.status === 'pending') {
    return (
      <View style={styles.centerContainer}>
        <StatusBar barStyle="dark-content" />
        <AlertCircle size={80} color={COLORS.secondary} />
        <Text style={styles.statusTitle}>Under Review</Text>
        <Text style={styles.statusDesc}>Your kitchen "{chefProfile.kitchenName}" is being verified. We will notify you once you are live!</Text>
        <TouchableOpacity style={styles.refreshBtn} onPress={fetchChefProfile}>
          <Text style={styles.refreshTxt}>Check Status</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Welcome Back,</Text>
          <Text style={styles.kitchenName}>{chefProfile?.kitchenName || 'Chef'}</Text>
        </View>
        <View style={styles.activeBadge}>
          <CheckCircle size={14} color={COLORS.primary} />
          <Text style={styles.activeTxt}>Live</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>0</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: COLORS.secondary + '20' }]}>
          <Text style={styles.statNum}>$0</Text>
          <Text style={styles.statLabel}>Earnings</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      
      <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('AddFoodItem')}>
        <View style={styles.iconBox}><Plus color="white" /></View>
        <Text style={styles.actionTxt}>Add New Dish</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('MenuManagement')}>
        <View style={[styles.iconBox, { backgroundColor: '#3498db' }]}><List color="white" /></View>
        <Text style={styles.actionTxt}>Manage Menu</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionBtn}>
        <View style={[styles.iconBox, { backgroundColor: '#9b59b6' }]}><BarChart3 color="white" /></View>
        <Text style={styles.actionTxt}>Sales Analytics</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionBtn}>
        <View style={[styles.iconBox, { backgroundColor: COLORS.gray }]}><Settings color="white" /></View>
        <Text style={styles.actionTxt}>Kitchen Settings</Text>
      </TouchableOpacity>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 25 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 60, marginBottom: 30 },
  welcome: { fontSize: 14, color: '#888' },
  kitchenName: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary },
  activeBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.secondary + '30', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  activeTxt: { marginLeft: 5, color: COLORS.primary, fontWeight: 'bold', fontSize: 12 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  statCard: { width: '47%', padding: 20, borderRadius: 25, backgroundColor: '#f8f9fa' },
  statNum: { fontSize: 22, fontWeight: 'bold', color: COLORS.primary },
  statLabel: { fontSize: 12, color: '#888', marginTop: 5 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary, marginBottom: 15 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 20, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  iconBox: { width: 45, height: 45, borderRadius: 15, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  actionTxt: { marginLeft: 15, fontSize: 16, fontWeight: '600', color: COLORS.primary },
  statusTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary, marginTop: 20 },
  statusDesc: { fontSize: 14, color: '#888', textAlign: 'center', marginTop: 10, lineHeight: 22 },
  refreshBtn: { marginTop: 30, backgroundColor: COLORS.primary, paddingHorizontal: 30, paddingVertical: 15, borderRadius: 20 },
  refreshTxt: { color: 'white', fontWeight: 'bold' }
});