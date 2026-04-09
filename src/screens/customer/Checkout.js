import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ScrollView } from 'react-native';
import { MapPin, CreditCard, Banknote, ChevronRight } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';
import useCartStore from '../../store/useCartStore';
import useAuthStore from '../../store/useAuthStore';
import { orderService } from '../../api/orderService';

export default function Checkout({ navigation }) {
  const { cartItems, getTotalPrice, clearCart, currentChefId } = useCartStore();
  const { user } = useAuthStore();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);

  const deliveryFee = 2.00;
  const total = getTotalPrice() + deliveryFee;

  const handlePlaceOrder = async () => {
    setLoading(true);
    const orderData = {
      customer_id: user.id,
      chef_id: currentChefId,
      items: cartItems,
      total_amount: total,
      payment_method: paymentMethod,
      status: 'pending',
      delivery_address: user.address || 'Default Address',
      created_at: new Date().toISOString()
    };

    try {
      await orderService.createOrder(orderData);
      Alert.alert("Success", "Order placed successfully!", [
        { text: "OK", onPress: () => { clearCart(); navigation.navigate('CustomerHome'); } }
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <TouchableOpacity style={styles.card}>
          <MapPin color={COLORS.primary} size={20} />
          <View style={styles.cardBody}>
            <Text style={styles.cardText}>{user?.address || "Select Address"}</Text>
          </View>
          <ChevronRight color={COLORS.gray} size={20} />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Payment Method</Text>
        <TouchableOpacity 
          style={[styles.card, paymentMethod === 'cod' && styles.selectedCard]} 
          onPress={() => setPaymentMethod('cod')}
        >
          <Banknote color={paymentMethod === 'cod' ? COLORS.primary : COLORS.gray} size={20} />
          <Text style={styles.cardText}>Cash on Delivery</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.card, paymentMethod === 'card' && styles.selectedCard]} 
          onPress={() => setPaymentMethod('card')}
        >
          <CreditCard color={paymentMethod === 'card' ? COLORS.primary : COLORS.gray} size={20} />
          <Text style={styles.cardText}>Credit / Debit Card</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.summaryBox}>
          {cartItems.map(item => (
            <View key={item.id} style={styles.summaryRow}>
              <Text>{item.quantity}x {item.name}</Text>
              <Text>${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text>Subtotal</Text>
            <Text>${getTotalPrice().toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Delivery Fee</Text>
            <Text>${deliveryFee.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, { marginTop: 10 }]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.placeOrderBtn, loading && { opacity: 0.7 }]} 
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          <Text style={styles.placeOrderText}>{loading ? 'Processing...' : 'Place Order'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingTop: 50, paddingBottom: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginVertical: 15 },
  card: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#F9F9F9', borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#eee' },
  selectedCard: { borderColor: COLORS.primary, backgroundColor: '#FFF5F5' },
  cardBody: { flex: 1, marginLeft: 10 },
  cardText: { fontSize: 14, fontWeight: '500', marginLeft: 10 },
  summaryBox: { backgroundColor: '#F9F9F9', padding: 15, borderRadius: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  totalLabel: { fontWeight: 'bold', fontSize: 16 },
  totalAmount: { fontWeight: 'bold', fontSize: 18, color: COLORS.primary },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#eee' },
  placeOrderBtn: { backgroundColor: COLORS.primary, padding: 18, borderRadius: 12, alignItems: 'center' },
  placeOrderText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});