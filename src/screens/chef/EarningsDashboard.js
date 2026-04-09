import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Dimensions, FlatList } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';
import { ChevronLeft, TrendingUp, ArrowDownLeft, ArrowUpRight, Wallet } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const WEEKLY_DATA = [
  { day: 'Mon', amount: 45, height: 60 },
  { day: 'Tue', amount: 80, height: 110 },
  { day: 'Wed', amount: 65, height: 90 },
  { day: 'Thu', amount: 95, height: 130 },
  { day: 'Fri', amount: 120, height: 160 },
  { day: 'Sat', amount: 150, height: 200 },
  { day: 'Sun', amount: 90, height: 125 },
];

const TRANSACTIONS = [
  { id: '1', type: 'order', title: 'Order #8821', date: 'Today, 2:30 PM', amount: '+ $24.50', status: 'earned' },
  { id: '2', type: 'payout', title: 'Weekly Payout', date: 'Yesterday', amount: '- $450.00', status: 'paid' },
  { id: '3', type: 'order', title: 'Order #8819', date: 'Oct 24, 2023', amount: '+ $18.00', status: 'earned' },
];

export default function EarningsDashboard({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.darkHeader}>
        <View style={styles.navRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ChevronLeft color={COLORS.white} size={24} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Earnings</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceValue}>$1,240.50</Text>
          <TouchableOpacity style={styles.withdrawBtn}>
             <Wallet size={18} color={COLORS.primary} />
             <Text style={styles.withdrawText}>Withdraw to Bank</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.whiteSheet}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Weekly Revenue</Text>
            <View style={styles.trendBadge}>
              <TrendingUp size={14} color={COLORS.secondary} />
              <Text style={styles.trendText}>+12.5%</Text>
            </View>
          </View>

          <View style={styles.chartContainer}>
            {WEEKLY_DATA.map((item, index) => (
              <View key={index} style={styles.barCol}>
                <View style={[styles.bar, { height: item.height }]} />
                <Text style={styles.barLabel}>{item.day}</Text>
              </View>
            ))}
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryBox}>
               <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}><ArrowDownLeft color="#2E7D32" size={20} /></View>
               <Text style={styles.sumVal}>$840</Text>
               <Text style={styles.sumLabel}>Income</Text>
            </View>
            <View style={styles.summaryBox}>
               <View style={[styles.iconBox, { backgroundColor: '#FFEBEE' }]}><ArrowUpRight color="#C62828" size={20} /></View>
               <Text style={styles.sumVal}>$320</Text>
               <Text style={styles.sumLabel}>Expenses</Text>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 30, marginBottom: 20 }]}>Recent Transactions</Text>
          {TRANSACTIONS.map((item) => (
            <View key={item.id} style={styles.transCard}>
              <View style={[styles.transIcon, { backgroundColor: item.type === 'order' ? COLORS.primary + '10' : COLORS.secondary + '20' }]}>
                {item.type === 'order' ? <ArrowDownLeft color={COLORS.primary} size={20} /> : <Wallet color={COLORS.secondary} size={20} />}
              </View>
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={styles.transTitle}>{item.title}</Text>
                <Text style={styles.transDate}>{item.date}</Text>
              </View>
              <Text style={[styles.transAmount, { color: item.type === 'order' ? '#2E7D32' : COLORS.primary }]}>{item.amount}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },
  darkHeader: { height: height * 0.4, paddingHorizontal: 25, paddingTop: 50 },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  navTitle: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  balanceCard: { alignItems: 'center' },
  balanceLabel: { color: COLORS.white, opacity: 0.6, fontSize: 14 },
  balanceValue: { color: COLORS.white, fontSize: 42, fontWeight: 'bold', marginVertical: 10 },
  withdrawBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.secondary, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 25, marginTop: 10 },
  withdrawText: { color: COLORS.primary, fontWeight: 'bold', marginLeft: 8, fontSize: 14 },
  whiteSheet: { flex: 1, backgroundColor: COLORS.background, borderTopLeftRadius: 50, borderTopRightRadius: 50, paddingHorizontal: 25, paddingTop: 35 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
  trendBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary + '10', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  trendText: { color: COLORS.primary, fontSize: 12, fontWeight: 'bold', marginLeft: 4 },
  chartContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 220, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  barCol: { alignItems: 'center', width: (width - 100) / 7 },
  bar: { width: 8, backgroundColor: COLORS.primary, borderRadius: 4 },
  barLabel: { marginTop: 10, fontSize: 10, color: COLORS.gray, fontWeight: 'bold' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 },
  summaryBox: { width: '47%', backgroundColor: COLORS.surface, borderRadius: 25, padding: 15, elevation: 2 },
  iconBox: { width: 35, height: 35, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  sumVal: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
  sumLabel: { fontSize: 11, color: COLORS.gray, marginTop: 2 },
  transCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, padding: 15, borderRadius: 25, marginBottom: 12 },
  transIcon: { width: 45, height: 45, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  transTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.primary },
  transDate: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  transAmount: { fontWeight: 'bold', fontSize: 15 }
});