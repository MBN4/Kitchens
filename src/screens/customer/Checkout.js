import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { MapPin, CreditCard, Banknote, ChevronRight, ChevronLeft } from 'lucide-react-native';
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
    if (!user?._id) {
      Alert.alert("Error", "Please login to place an order");
      return;
    }

    setLoading(true);

    const formattedItems = cartItems.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price
    }));

    const orderData = {
      customer: user._id,
      chef: currentChefId,
      items: formattedItems,
      totalAmount: total,
      paymentMethod: paymentMethod,
      deliveryAddress: user.address || 'Default Address',
      status: 'pending'
    };

    try {
      await orderService.createOrder(orderData);
      clearCart();
      navigation.replace('OrderSuccess');
    } catch (error) {
      Alert.alert("Order Failed", error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ChevronLeft color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <TouchableOpacity style={styles.card}>
          <MapPin color={COLORS.primary} size={20} />
          <View style={styles.cardBody}>
            <Text style={styles.cardText}>{user?.address || "No address saved"}</Text>
          </View>
          <ChevronRight color={COLORS.gray} size={20} />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Payment Method</Text>
        <TouchableOpacity 
          style={[styles.card, paymentMethod === 'cod' && styles.selectedCard]} 
          onPress={() => setPaymentMethod('cod')}
        >
          <Banknote color={paymentMethod === 'cod' ? COLORS.primary : COLORS.gray} size={20} />
          <Text style={[styles.cardText, paymentMethod === 'cod' && {color: COLORS.primary}]}>Cash on Delivery</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.card, paymentMethod === 'card' && styles.selectedCard]} 
          onPress={() => setPaymentMethod('card')}
        >
          <CreditCard color={paymentMethod === 'card' ? COLORS.primary : COLORS.gray} size={20} />
          <Text style={[styles.cardText, paymentMethod === 'card' && {color: COLORS.primary}]}>Credit / Debit Card</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.summaryBox}>
          {cartItems.map((item, index) => (
            <View key={index} style={styles.summaryRow}>
              <Text style={styles.itemTxt}>{item.quantity}x {item.name}</Text>
              <Text style={styles.itemTxt}>${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.feeTxt}>Subtotal</Text>
            <Text style={styles.feeTxt}>${getTotalPrice().toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.feeTxt}>Delivery Fee</Text>
            <Text style={styles.feeTxt}>${deliveryFee.toFixed(2)}</Text>
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
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.placeOrderText}>Place Order</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingTop: 60, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  backBtn: { padding: 8 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginVertical: 15, color: COLORS.primary },
  card: { flexDirection: 'row', alignItems: 'center', padding: 18, backgroundColor: '#F9F9F9', borderRadius: 20, marginBottom: 10, borderWidth: 1, borderColor: '#eee' },
  selectedCard: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '08' },
  cardBody: { flex: 1, marginLeft: 10 },
  cardText: { fontSize: 14, fontWeight: '600', marginLeft: 10, color: COLORS.gray },
  summaryBox: { backgroundColor: '#F9F9F9', padding: 20, borderRadius: 25 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  itemTxt: { color: '#444', fontWeight: '500' },
  feeTxt: { color: COLORS.gray, fontSize: 13 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  totalLabel: { fontWeight: 'bold', fontSize: 18, color: 'black' },
  totalAmount: { fontWeight: 'bold', fontSize: 20, color: COLORS.primary },
  footer: { padding: 25, borderTopWidth: 1, borderTopColor: '#eee', paddingBottom: 40 },
  placeOrderBtn: { backgroundColor: COLORS.primary, height: 65, borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  placeOrderText: { color: 'white', fontWeight: 'bold', fontSize: 18 }
});