import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Star, MapPin } from 'lucide-react-native';
import { COLORS } from '../constants/theme';

export default function ChefCard({ chef, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: chef.banner_image || 'https://via.placeholder.com/150' }} style={styles.image} />
      <View style={styles.info}>
        <View style={styles.row}>
          <Text style={styles.name}>{chef.kitchen_name}</Text>
          <View style={styles.rating}>
            <Star size={14} color={COLORS.accent} fill={COLORS.accent} />
            <Text style={styles.ratingText}>{chef.rating || '4.5'}</Text>
          </View>
        </View>
        <Text style={styles.description} numberOfLines={1}>{chef.description}</Text>
        <View style={styles.locationRow}>
          <MapPin size={14} color={COLORS.gray} />
          <Text style={styles.locationText}>2.5 km away</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 15, marginBottom: 20, overflow: 'hidden', elevation: 3 },
  image: { width: '100%', height: 150 },
  info: { padding: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  rating: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF9E5', padding: 4, borderRadius: 5 },
  ratingText: { marginLeft: 4, fontWeight: 'bold', fontSize: 12 },
  description: { color: '#777', fontSize: 14, marginVertical: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  locationText: { color: COLORS.gray, fontSize: 12, marginLeft: 4 }
});