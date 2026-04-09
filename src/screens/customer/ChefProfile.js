import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ChevronLeft, Star, Clock, Plus, Minus } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';
import useCartStore from '../../store/useCartStore';

export default function ChefProfile({ route, navigation }) {
  const { chefId } = route.params;
  const { addToCart, removeFromCart, cartItems, getTotalPrice } = useCartStore();

  const chefData = {
    id: chefId,
    kitchen_name: "Mom's Biryani",
    banner_image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a6f8',
    rating: '4.9',
    time: '30-40 min',
    description: 'Authentic homemade spices and organic ingredients.'
  };

  const menuItems = [
    { id: '101', name: 'Chicken Biryani', price: 12, description: 'Serves 1, spicy with raita', image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a6f8' },
    { id: '102', name: 'Shami Kabab', price: 5, description: '2 pieces with mint chutney', image: 'https://images.unsplash.com/photo-1601050638917-3f309a4065ef' }
  ];

  const handleAdd = (item) => {
    const success = addToCart(item, chefId);
    if (!success) {
      Alert.alert(
        "Replace cart?",
        "You can only order from one chef at a time. Clear cart and add this instead?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Clear Cart", onPress: () => { useCartStore.getState().clearCart(); addToCart(item, chefId); } }
        ]
      );
    }
  };

  const getItemQty = (id) => {
    const item = cartItems.find(i => i.id === id);
    return item ? item.quantity : 0;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: chefData.banner_image }} style={styles.banner} />
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.title}>{chefData.kitchen_name}</Text>
        <Text style={styles.desc}>{chefData.description}</Text>
        <View style={styles.meta}>
          <Star size={16} color={COLORS.accent} fill={COLORS.accent} />
          <Text style={styles.metaText}>{chefData.rating}</Text>
          <Clock size={16} color={COLORS.gray} style={{ marginLeft: 15 }} />
          <Text style={styles.metaText}>{chefData.time}</Text>
        </View>
      </View>

      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View style={styles.foodCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.foodName}>{item.name}</Text>
              <Text style={styles.foodPrice}>${item.price}</Text>
              <Text style={styles.foodDesc}>{item.description}</Text>
            </View>
            <View style={styles.actionArea}>
              <Image source={{ uri: item.image }} style={styles.foodImg} />
              {getItemQty(item.id) === 0 ? (
                <TouchableOpacity style={styles.addBtn} onPress={() => handleAdd(item)}>
                  <Plus size={18} color="white" />
                </TouchableOpacity>
              ) : (
                <View style={styles.qtyRow}>
                  <TouchableOpacity onPress={() => removeFromCart(item.id)}><Minus size={18} color={COLORS.primary}/></TouchableOpacity>
                  <Text style={styles.qtyText}>{getItemQty(item.id)}</Text>
                  <TouchableOpacity onPress={() => handleAdd(item)}><Plus size={18} color={COLORS.primary}/></TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )}
      />

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