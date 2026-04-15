import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, Dimensions, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { COLORS } from '../../constants/theme';
import { adminService } from '../../api/adminService';
import { Check, X, ShieldCheck, UserCheck, Utensils, DollarSign, ShoppingBag, LogOut } from 'lucide-react-native';
import useAuthStore from '../../store/useAuthStore';

const { height } = Dimensions.get('window');

export default function AdminDashboard() {
  const { logout } = useAuthStore();
  const [pendingChefs, setPendingChefs] = useState([]);
  const [stats, setStats] = useState({ activeChefs: 0, totalUsers: 0, totalRevenue: 0, totalOrders: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [chefs, sysStats, orders] = await Promise.all([
        adminService.getPendingChefs(),
        adminService.getSystemStats(),
        adminService.getRecentOrders()
      ]);
      setPendingChefs(chefs);
      setStats(sysStats);
      setRecentOrders(orders);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await adminService.updateChefStatus(id, status);
      Alert.alert("Action Processed", `Chef is now ${status}`);
      loadData();
    } catch (error) {
      Alert.alert("Error", "Failed to update status");
    }
  };

  const StatBox = ({ title, value, icon: Icon, color }) => (
    <View style={[styles.statBox, { borderLeftColor: color }]}>
      <View style={[styles.iconBox, { backgroundColor: color + '15' }]}><Icon size={18} color={color} /></View>
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
            <Text style={styles.headerSubtitle}>System-wide Performance</Text>
          </View>
          <TouchableOpacity onPress={() => logout()} style={styles.logoutBtn}>
             <LogOut color={COLORS.primary} size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
           <StatBox title="Revenue" value={`$${stats.totalRevenue}`} icon={DollarSign} color={COLORS.secondary} />
           <StatBox title="Orders" value={stats.totalOrders} icon={ShoppingBag} color="#3498db" />
           <StatBox title="Active Chefs" value={stats.activeChefs} icon={UserCheck} color="#2ecc71" />
           <StatBox title="Customers" value={stats.totalUsers} icon={Utensils} color="#9b59b6" />
        </View>
      </View>

      <View style={styles.whiteSheet}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
            <View style={styles.sectionHeader}>
               <Text style={styles.sectionTitle}>Verification Requests</Text>
               <View style={styles.badge}><Text style={styles.badgeTxt}>{pendingChefs.length}</Text></View>
            </View>

            {pendingChefs.length === 0 ? (
                <View style={styles.emptyBox}><Text style={styles.emptyTxt}>No pending requests</Text></View>
            ) : (
                pendingChefs.map(item => (
                    <View key={item._id} style={styles.chefCard}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.kitchenName}>{item.kitchenName}</Text>
                            <Text style={styles.subTxt}>{item.user?.name || 'New Chef'}</Text>
                        </View>
                        <View style={styles.btnRow}>
                            <TouchableOpacity style={styles.acceptBtn} onPress={() => handleStatusChange(item._id, 'active')}><Check color="white" size={18} /></TouchableOpacity>
                            <TouchableOpacity style={styles.rejectBtn} onPress={() => handleStatusChange(item._id, 'rejected')}><X color="white" size={18} /></TouchableOpacity>
                        </View>
                    </View>
                ))
            )}

            <View style={[styles.sectionHeader, { marginTop: 30 }]}>
               <Text style={styles.sectionTitle}>System Monitor</Text>
            </View>
            
            {recentOrders.map(order => (
                <View key={order._id} style={styles.orderLog}>
                    <Text style={styles.logId}>#{order._id.slice(-6).toUpperCase()}</Text>
                    <Text style={styles.logText}>{order.customer?.name} → {order.chef?.kitchenName}</Text>
                    <Text style={[styles.logStatus, { color: order.status === 'delivered' ? '#2ecc71' : COLORS.secondary }]}>{order.status}</Text>
                </View>
            ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },
  darkHeader: { height: height * 0.45, paddingHorizontal: 25, paddingTop: 60 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.white },
  headerSubtitle: { fontSize: 13, color: COLORS.white, opacity: 0.6 },
  logoutBtn: { width: 45, height: 45, backgroundColor: COLORS.secondary, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statBox: { backgroundColor: 'rgba(255,255,255,0.08)', width: '48%', padding: 15, borderRadius: 20, marginBottom: 12, borderLeftWidth: 3 },
  iconBox: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  statValue: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  statLabel: { color: COLORS.white, opacity: 0.4, fontSize: 10, marginTop: 2 },
  whiteSheet: { flex: 1, backgroundColor: COLORS.background, borderTopLeftRadius: 50, borderTopRightRadius: 50, paddingHorizontal: 25, paddingTop: 35 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
  badge: { marginLeft: 10, backgroundColor: COLORS.primary + '10', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  badgeTxt: { fontSize: 12, fontWeight: 'bold', color: COLORS.primary },
  chefCard: { backgroundColor: COLORS.surface, borderRadius: 25, padding: 20, marginBottom: 12, flexDirection: 'row', alignItems: 'center', elevation: 2 },
  kitchenName: { fontSize: 15, fontWeight: 'bold', color: COLORS.primary },
  subTxt: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  btnRow: { flexDirection: 'row' },
  acceptBtn: { width: 40, height: 40, backgroundColor: '#2ecc71', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  rejectBtn: { width: 40, height: 40, backgroundColor: '#e74c3c', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  emptyBox: { padding: 40, alignItems: 'center', backgroundColor: '#f9f9f9', borderRadius: 25 },
  emptyTxt: { color: COLORS.gray, fontSize: 14 },
  orderLog: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  logId: { fontSize: 11, fontWeight: 'bold', color: COLORS.gray, width: 60 },
  logText: { flex: 1, fontSize: 12, color: COLORS.primary },
  logStatus: { fontSize: 11, fontWeight: 'bold', textTransform: 'capitalize' }
});