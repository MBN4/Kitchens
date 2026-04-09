import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { COLORS } from '../../constants/theme';
import { ChevronLeft, Clock, MapPin, Package } from 'lucide-react-native';

export default function OrdersScreen({ navigation }) {
  const [orders] = useState([
    { id: '1', customer: 'John Doe', items: '2x Spicy Biryani', total: '24.00', status: 'pending', address: 'Block 4, Downtown' },
    { id: '2', customer: 'Jane Smith', items: '1x Pasta Fettuccine', total: '15.50', status: 'preparing', address: 'Apartment 2B, Westside' }
  ]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={COLORS.primary} size={28} />
        </TouchableOpacity>
        <Text style={styles.title}>Active Orders</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 25 }}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <View style={styles.cardTop}>
              <View style={styles.customerCircle}>
                 <Text style={styles.initial}>{item.customer.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={styles.customerName}>{item.customer}</Text>
                <Text style={styles.orderItems}>{item.items}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: item.status === 'pending' ? COLORS.secondary : '#3498db' }]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>

            <View style={styles.addressBox}>
              <MapPin size={14} color={COLORS.gray} />
              <Text style={styles.addressText}>{item.address}</Text>
            </View>

            <View style={styles.cardBottom}>
               <Text style={styles.totalText}>Total: <Text style={styles.price}>${item.total}</Text></Text>
               <TouchableOpacity style={styles.actionBtn}>
                  <Text style={styles.actionBtnText}>Update Status</Text>
               </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, paddingHorizontal: 25, marginBottom: 10 },
  backBtn: { width: 45, height: 45, borderRadius: 22, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary, marginLeft: 20 },
  orderCard: { backgroundColor: COLORS.surface, borderRadius: 35, padding: 20, marginBottom: 20, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  customerCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.primary + '10', justifyContent: 'center', alignItems: 'center' },
  initial: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  customerName: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  orderItems: { fontSize: 13, color: COLORS.gray, marginTop: 2 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
  statusText: { color: COLORS.primary, fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
  addressBox: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, backgroundColor: COLORS.background, padding: 10, borderRadius: 15 },
  addressText: { fontSize: 12, color: COLORS.gray, marginLeft: 6 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 15 },
  totalText: { fontSize: 14, color: COLORS.primary },
  price: { fontWeight: 'bold', fontSize: 18 },
  actionBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  actionBtnText: { color: COLORS.white, fontWeight: 'bold', fontSize: 12 }
});