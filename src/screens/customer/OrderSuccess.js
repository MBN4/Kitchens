import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';

export default function OrderSuccess({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <CheckCircle2 size={80} color={COLORS.primary} />
        </View>
        <Text style={styles.title}>Order Placed!</Text>
        <Text style={styles.subtitle}>Your delicious meal is being prepared with love and care.</Text>
        
        <TouchableOpacity 
          style={styles.btn} 
          onPress={() => navigation.navigate('CustomerHome')}
        >
          <Text style={styles.btnText}>Back to Home</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.outlineBtn} 
          onPress={() => navigation.navigate('Orders')}
        >
          <Text style={styles.outlineBtnText}>Track Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', justifyContent: 'center', padding: 30 },
  content: { alignItems: 'center' },
  iconCircle: { width: 150, height: 150, borderRadius: 75, backgroundColor: COLORS.primary + '15', justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.primary, marginBottom: 10 },
  subtitle: { fontSize: 16, color: COLORS.gray, textAlign: 'center', marginBottom: 40, lineHeight: 22 },
  btn: { backgroundColor: COLORS.primary, width: '100%', height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  outlineBtn: { width: '100%', height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.primary },
  outlineBtnText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 16 }
});