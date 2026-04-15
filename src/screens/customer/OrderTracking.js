import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import { COLORS } from '../../constants/theme';
import { ChevronLeft, CheckCircle2, Circle, MapPin, Phone, MessageSquare } from 'lucide-react-native';
import { orderService } from '../../api/orderService';
import useAuthStore from '../../store/useAuthStore';

const { height } = Dimensions.get('window');
const STATUS_STEPS = ['pending', 'preparing', 'ready', 'delivered'];

export default function OrderTracking({ route, navigation }) {
  const { isAuthenticated } = useAuthStore();
  const [order, setOrder] = useState(route.params.order);

  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(async () => {
      try {
        const updatedOrder = await orderService.getOrderById(order._id);
        if (updatedOrder) setOrder(updatedOrder);
      } catch (err) {
        console.log("Polling stopped or failed");
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const Step = ({ title, desc, index }) => {
    const currentIndex = STATUS_STEPS.indexOf(order.status);
    const isCompleted = index <= currentIndex;
    const isCurrent = index === currentIndex;

    return (
      <View style={styles.stepRow}>
        <View style={styles.indicatorCol}>
          <View style={[styles.outerCircle, isCompleted && { borderColor: COLORS.secondary }]}>
             {isCompleted ? <CheckCircle2 size={20} color={COLORS.secondary} /> : <Circle size={20} color={COLORS.gray} />}
          </View>
          {index !== 3 && <View style={[styles.stepLine, isCompleted && { backgroundColor: COLORS.secondary }]} />}
        </View>
        <View style={styles.stepContent}>
          <Text style={[styles.stepTitle, isCurrent && { color: COLORS.secondary }]}>{title}</Text>
          <Text style={styles.stepDesc}>{desc}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.darkHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft color={COLORS.white} size={28} />
        </TouchableOpacity>
        <Text style={styles.headerOrderText}>Order #{order._id.slice(-6).toUpperCase()}</Text>
        <View style={styles.totalBadge}>
           <Text style={styles.totalText}>${order.totalAmount}</Text>
        </View>
      </View>

      <View style={styles.whiteSheet}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
          <View style={styles.statusBanner}>
            <Text style={styles.currentStatusLabel}>Current Status</Text>
            <Text style={styles.currentStatusValue}>{order.status.toUpperCase()}</Text>
          </View>

          <View style={styles.stepperContainer}>
            <Step title="Order Confirmed" desc="Kitchen has received your order" index={0} />
            <Step title="Preparing" desc="Chef is cooking your fresh meal" index={1} />
            <Step title="Out for Delivery" desc="Rider is heading to your location" index={2} />
            <Step title="Delivered" desc="Enjoy your homemade meal!" index={3} />
          </View>

          <View style={styles.addressCard}>
            <View style={styles.iconBox}><MapPin color={COLORS.primary} size={22} /></View>
            <View style={{ flex: 1, marginLeft: 15 }}>
               <Text style={styles.addressLabel}>Delivery Address</Text>
               <Text style={styles.addressValue}>{order.deliveryAddress}</Text>
            </View>
          </View>

          <View style={styles.contactRow}>
            <TouchableOpacity style={styles.contactBtn}>
               <Phone color={COLORS.primary} size={20} /><Text style={styles.contactBtnText}>Call Kitchen</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.contactBtn, { backgroundColor: COLORS.secondary }]}>
               <MessageSquare color={COLORS.primary} size={20} /><Text style={styles.contactBtnText}>Support</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },
  darkHeader: { height: height * 0.25, justifyContent: 'center', paddingHorizontal: 25, paddingTop: 40 },
  backBtn: { marginBottom: 15 },
  headerOrderText: { fontSize: 28, fontWeight: 'bold', color: COLORS.white },
  totalBadge: { backgroundColor: COLORS.secondary, alignSelf: 'flex-start', paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20, marginTop: 10 },
  totalText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 16 },
  whiteSheet: { flex: 1, backgroundColor: COLORS.background, borderTopLeftRadius: 50, borderTopRightRadius: 50, paddingHorizontal: 25, paddingTop: 35 },
  statusBanner: { backgroundColor: COLORS.primary + '08', padding: 25, borderRadius: 30, marginBottom: 30, alignItems: 'center' },
  currentStatusLabel: { color: COLORS.gray, fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  currentStatusValue: { color: COLORS.primary, fontSize: 24, fontWeight: 'bold', marginTop: 5 },
  stepperContainer: { paddingHorizontal: 10, marginBottom: 30 },
  stepRow: { flexDirection: 'row', minHeight: 80 },
  indicatorCol: { alignItems: 'center', width: 30 },
  outerCircle: { width: 34, height: 34, borderRadius: 17, borderWidth: 2, borderColor: '#eee', justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.white },
  stepLine: { width: 2, flex: 1, backgroundColor: '#eee', marginVertical: 4 },
  stepContent: { flex: 1, marginLeft: 20, paddingTop: 5 },
  stepTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  stepDesc: { fontSize: 12, color: COLORS.gray, marginTop: 4 },
  addressCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, padding: 20, borderRadius: 30, elevation: 2 },
  iconBox: { width: 50, height: 50, borderRadius: 15, backgroundColor: COLORS.primary + '10', justifyContent: 'center', alignItems: 'center' },
  addressLabel: { fontSize: 12, fontWeight: 'bold', color: COLORS.gray, textTransform: 'uppercase' },
  addressValue: { fontSize: 14, color: COLORS.primary, marginTop: 4, lineHeight: 20 },
  contactRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 },
  contactBtn: { flex: 1, height: 60, backgroundColor: COLORS.surface, borderRadius: 30, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: 5, elevation: 2 },
  contactBtnText: { marginLeft: 10, fontWeight: 'bold', color: COLORS.primary, fontSize: 14 }
});