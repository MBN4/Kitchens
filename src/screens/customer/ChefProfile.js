import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { ChevronLeft, Star, Clock, Plus, Minus } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';
import useCartStore from '../../store/useCartStore';
import client from '../../api/client';

export default function ChefProfile({ route, navigation }) {
  const { chef } = route.params;
  const { addToCart, removeFromCart, cartItems, getTotalPrice } = useCartStore();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await client.get(`/api/chefs/menu/${chef._id}`);
      setMenuItems(response.data);
    } catch (error) {
      Alert.alert("Error", "Could not fetch menu items");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (item) => {
    const success = addToCart(item, chef._id);
    if (!success) {
      Alert.alert(
        "Replace cart?",
        "You can only order from one chef at a time. Clear cart and add this instead?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Clear Cart", onPress: () => { useCartStore.getState().clearCart(); addToCart(item, chef._id); } }
        ]
      );
    }
  };

  const getItemQty = (id) => {
    const item = cartItems.find(i => i.id === id || i._id === id);
    return item ? item.quantity : 0;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: chef.bannerImage || 'https://images.unsplash.com/photo-1563379091339-03b21bc4a6f8' }} style={styles.banner} />
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.title}>{chef.kitchenName}</Text>
        <Text style={styles.desc}>{chef.description || 'No description available'}</Text>
        <View style={styles.meta}>
          <Star size={16} color={COLORS.accent} fill={COLORS.accent} />
          <Text style={styles.metaText}>{chef.rating || '5.0'}</Text>
          <Clock size={16} color={COLORS.gray} style={{ marginLeft: 15 }} />
          <Text style={styles.metaText}>30-40 min</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={menuItems}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 20 }}
          renderItem={({ item }) => (
            <View style={styles.foodCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.foodPrice}>${item.price}</Text>
                <Text style={styles.foodDesc}>{item.description}</Text>
              </View>
              <View style={styles.actionArea}>
                <Image source={{ uri: item.image_url }} style={styles.foodImg} />
                {getItemQty(item._id) === 0 ? (
                  <TouchableOpacity style={styles.addBtn} onPress={() => handleAdd(item)}>
                    <Plus size={18} color="white" />
                  </TouchableOpacity>
                ) : (
                  <View style={styles.qtyRow}>
                    <TouchableOpacity onPress={() => removeFromCart(item._id)}><Minus size={18} color={COLORS.primary}/></TouchableOpacity>
                    <Text style={styles.qtyText}>{getItemQty(item._id)}</Text>
                    <TouchableOpacity onPress={() => handleAdd(item)}><Plus size={18} color={COLORS.primary}/></TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          )}
        />
      )}

      {cartItems.length > 0 && (
        <TouchableOpacity style={styles.cartBar} onPress={() => navigation.navigate('Cart')}>
          <Text style={styles.cartBarText}>{cartItems.length} items | ${getTotalPrice()}</Text>
          <Text style={styles.cartBarText}>View Cart</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { height: 200 },
  banner: { width: '100%', height: '100%' },
  backBtn: { position: 'absolute', top: 50, left: 20, backgroundColor: 'white', padding: 8, borderRadius: 20 },
  infoSection: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 24, fontWeight: 'bold' },
  desc: { color: '#666', marginTop: 5 },
  meta: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  metaText: { marginLeft: 5, fontWeight: 'bold' },
  foodCard: { flexDirection: 'row', marginBottom: 25, alignItems: 'center' },
  foodName: { fontSize: 16, fontWeight: 'bold' },
  foodPrice: { color: COLORS.primary, fontWeight: 'bold', marginVertical: 2 },
  foodDesc: { color: '#888', fontSize: 12 },
  foodImg: { width: 80, height: 80, borderRadius: 10 },
  actionArea: { alignItems: 'center' },
  addBtn: { position: 'absolute', bottom: -10, backgroundColor: COLORS.primary, padding: 5, borderRadius: 15 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 15, paddingHorizontal: 10, position: 'absolute', bottom: -10 },
  qtyText: { marginHorizontal: 10, fontWeight: 'bold' },
  cartBar: { position: 'absolute', bottom: 30, left: 20, right: 20, backgroundColor: COLORS.primary, flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderRadius: 15 },
  cartBarText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});