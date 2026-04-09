import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';
import { orderService } from '../../api/orderService';
import useAuthStore from '../../store/useAuthStore';
import { ShoppingBag, ChevronRight, Clock } from 'lucide-react-native';

export default function OrdersHistory({ navigation }) {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getCustomerOrders(user.id);
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color={COLORS.primary} />;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
        <TouchableOpacity style={styles.bagBtn}>
           <ShoppingBag color={COLORS.primary} size={22} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 25 }}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.orderCard} 
            onPress={() => navigation.navigate('OrderTracking', { order: item })}
          >
            <View style={styles.cardHeader}>
              <View style={styles.statusPill}>
                 <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
              </View>
              <Text style={styles.dateText}>{new Date(item.created_at).toLocaleDateString()}</Text>
            </View>

            <View style={styles.cardBody}>
              <View style={styles.iconBox}>
                <Clock color={COLORS.primary} size={20} />
              </View>
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={styles.kitchenName}>Mama's Gourmet Kitchen</Text>
                <Text style={styles.itemCount}>{item.items.length} items ordered</Text>
              </View>
              <Text style={styles.priceText}>${item.total_amount}</Text>
            </View>

            <View style={styles.cardFooter}>
               <Text style={styles.trackLink}>View Tracking Details</Text>
               <ChevronRight color={COLORS.secondary} size={18} />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingHorizontal: 25, marginBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.primary },
  bagBtn: { width: 45, height: 45, borderRadius: 22, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  orderCard: { backgroundColor: COLORS.surface, borderRadius: 35, padding: 20, marginBottom: 20, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  statusPill: { backgroundColor: COLORS.secondary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
  statusText: { color: COLORS.primary, fontSize: 10, fontWeight: 'bold' },
  dateText: { color: COLORS.gray, fontSize: 12, fontWeight: '500' },
  cardBody: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f0f0f0', paddingBottom: 15, marginBottom: 15 },
  iconBox: { width: 45, height: 45, borderRadius: 15, backgroundColor: COLORS.primary + '10', justifyContent: 'center', alignItems: 'center' },
  kitchenName: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  itemCount: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  priceText: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  trackLink: { color: COLORS.primary, fontWeight: 'bold', fontSize: 14 }
});