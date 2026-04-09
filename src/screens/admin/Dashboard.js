import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';
import { adminService } from '../../api/adminService';
import { Check, X, ShieldCheck, UserCheck, Utensils, ChevronRight } from 'lucide-react-native';

const { height } = Dimensions.get('window');

export default function AdminDashboard() {
  const [pendingChefs, setPendingChefs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingChefs();
  }, []);

  const fetchPendingChefs = async () => {
    try {
      const data = await adminService.getPendingChefs();
      setPendingChefs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await adminService.updateChefStatus(id, status);
      Alert.alert("Success", `Chef has been ${status}`);
      fetchPendingChefs();
    } catch (error) {
      Alert.alert("Error", "Failed to update status");
    }
  };

  const StatBox = ({ title, value, icon: Icon, color }) => (
    <View style={[styles.statBox, { borderLeftColor: color }]}>
      <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
        <Icon size={20} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.darkHeader}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Control Center</Text>
            <Text style={styles.headerSubtitle}>Super Admin Oversight</Text>
          </View>
          <View style={styles.adminBadge}>
             <ShieldCheck color={COLORS.primary} size={18} />
             <Text style={styles.adminBadgeText}>Verified Admin</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
           <StatBox title="Active Chefs" value="128" icon={UserCheck} color={COLORS.secondary} />
           <StatBox title="Total Meals" value="1.4k" icon={Utensils} color="#3498db" />
        </View>
      </View>

      <View style={styles.whiteSheet}>
        <View style={styles.sheetHeader}>
           <Text style={styles.sheetTitle}>Verification Requests</Text>
           <View style={styles.countBadge}>
              <Text style={styles.countText}>{pendingChefs.length} New</Text>
           </View>
        </View>

        {loading ? (
          <ActivityIndicator color={COLORS.primary} size="large" style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={pendingChefs}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>All kitchens are verified!</Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.chefCard}>
                <View style={styles.cardInfo}>
                  <Text style={styles.kitchenName}>{item.kitchen_name}</Text>
                  <Text style={styles.ownerName}>Owner: {item.name || 'Anonymous'}</Text>
                  <Text style={styles.emailText}>{item.email}</Text>
                </View>
                <View style={styles.actionRow}>
                  <TouchableOpacity 
                    style={[styles.actionBtn, { backgroundColor: COLORS.secondary }]}
                    onPress={() => handleStatusChange(item.id, 'active')}
                  >
                    <Check color={COLORS.primary} size={22} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionBtn, { backgroundColor: '#f0f0f0' }]}
                    onPress={() => handleStatusChange(item.id, 'rejected')}
                  >
                    <X color="#E74C3C" size={22} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },
  darkHeader: { height: height * 0.35, paddingHorizontal: 25, paddingTop: 60 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.white },
  headerSubtitle: { fontSize: 14, color: COLORS.white, opacity: 0.6 },
  adminBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.secondary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  adminBadgeText: { marginLeft: 6, color: COLORS.primary, fontWeight: 'bold', fontSize: 10 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statBox: { backgroundColor: 'rgba(255,255,255,0.1)', width: '47%', padding: 15, borderRadius: 25, borderLeftWidth: 4 },
  iconBox: { width: 35, height: 35, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  statValue: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  statLabel: { color: COLORS.white, opacity: 0.5, fontSize: 11, marginTop: 2 },
  whiteSheet: { flex: 1, backgroundColor: COLORS.background, borderTopLeftRadius: 50, borderTopRightRadius: 50, paddingHorizontal: 25, paddingTop: 35 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  sheetTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  countBadge: { marginLeft: 12, backgroundColor: COLORS.primary + '10', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  countText: { fontSize: 12, fontWeight: 'bold', color: COLORS.primary },
  chefCard: { backgroundColor: COLORS.surface, borderRadius: 30, padding: 20, marginBottom: 15, flexDirection: 'row', alignItems: 'center', elevation: 2 },
  cardInfo: { flex: 1 },
  kitchenName: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  ownerName: { fontSize: 13, color: COLORS.gray, marginTop: 4 },
  emailText: { fontSize: 11, color: COLORS.gray, marginTop: 2 },
  actionRow: { flexDirection: 'row' },
  actionBtn: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  emptyContainer: { marginTop: 100, alignItems: 'center' },
  emptyText: { color: COLORS.gray, fontSize: 16, fontWeight: '500' }
});