import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, TextInput, FlatList, ScrollView, StyleSheet, 
  TouchableOpacity, Image, StatusBar, Animated, LayoutAnimation 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, Filter, MapPin, User as UserIcon, Star } from 'lucide-react-native';
import { COLORS, SIZES } from '../../constants/theme';
import useAuthStore from '../../store/useAuthStore';

const CATEGORIES = ['All', 'Biryani', 'Pasta', 'Desserts', 'Healthy', 'Organic'];
const DEMO_DISHES = [
  { id: '1', name: "Spicy Mutton Biryani", chef: "Mom's Kitchen", price: 15, rating: 4.9, category: 'Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a6f8' },
  { id: '2', name: "Creamy Fettuccine", chef: "Pasta Queen", price: 12, rating: 4.7, category: 'Pasta', image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856' },
  { id: '3', name: "Chocolate Lava Cake", chef: "Bake House", price: 8, rating: 4.8, category: 'Desserts', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb' },
  { id: '4', name: "Quinoa Salad Bowl", chef: "Green Life", price: 10, rating: 4.5, category: 'Healthy', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd' },
  { id: '5', name: "Organic Acai Bowl", chef: "Nature's Best", price: 14, rating: 4.6, category: 'Organic', image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733' },
];

const DishCard = ({ item, index, navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay: index * 100, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={[styles.dishCard, { opacity: fadeAnim }]}>
      <Image source={{ uri: item.image }} style={styles.dishImage} />
      <View style={styles.dishInfo}>
        <Text style={styles.dishName}>{item.name}</Text>
        <Text style={styles.chefName}>by {item.chef}</Text>
        <View style={styles.dishFooter}>
          <Text style={styles.dishPrice}>${item.price}</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('ChefProfile', { chefId: item.id })}>
            <Text style={styles.addBtnText}>View</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const [activeCategory, setActiveCategory] = useState('All');
  const [filteredDishes, setFilteredDishes] = useState(DEMO_DISHES);

  const handleCategoryChange = (cat) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveCategory(cat);
    setFilteredDishes(cat === 'All' ? DEMO_DISHES : DEMO_DISHES.filter(d => d.category === cat));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" translucent />
      <View style={styles.header}>
        <View>
          <Text style={styles.locationLabel}>Delivering to</Text>
          <View style={styles.locationRow}>
            <MapPin size={16} color={COLORS.primary} />
            <Text style={styles.locationText}>{user?.address || 'Your Home, NY'}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.profileCircle}>
          <UserIcon size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredDishes}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        ListHeaderComponent={
          <>
            <View style={styles.searchContainer}>
              <View style={styles.searchBox}>
                <Search size={20} color={COLORS.gray} />
                <TextInput placeholder="Search delicious food..." style={styles.searchInput} />
              </View>
              <TouchableOpacity style={styles.filterBtn}><Filter size={20} color={COLORS.white} /></TouchableOpacity>
            </View>
            <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Categories</Text></View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity 
                  key={cat} 
                  onPress={() => handleCategoryChange(cat)}
                  style={[styles.catPill, activeCategory === cat && styles.catPillActive]}
                >
                  <Text style={[styles.catText, activeCategory === cat && styles.catTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        }
        renderItem={({ item, index }) => <DishCard item={item} index={index} navigation={navigation} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 15 },
  locationLabel: { fontSize: 12, color: COLORS.gray, fontWeight: '500' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  locationText: { fontWeight: 'bold', fontSize: 14, marginLeft: 4, color: COLORS.primary },
  profileCircle: { width: 45, height: 45, borderRadius: 23, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  searchContainer: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 10, marginBottom: 20 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, paddingHorizontal: 15, borderRadius: 15, height: 55, elevation: 1 },
  searchInput: { flex: 1, marginLeft: 10, color: COLORS.primary },
  filterBtn: { backgroundColor: COLORS.primary, width: 55, height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  sectionHeader: { paddingHorizontal: 20, marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  catScroll: { paddingLeft: 20, marginBottom: 25 },
  catPill: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, backgroundColor: COLORS.white, marginRight: 12, elevation: 1 },
  catPillActive: { backgroundColor: COLORS.secondary },
  catText: { color: COLORS.primary, fontWeight: '600' },
  dishCard: { backgroundColor: COLORS.white, marginHorizontal: 20, marginBottom: 20, borderRadius: 25, overflow: 'hidden', elevation: 3 },
  dishImage: { width: '100%', height: 200 },
  dishInfo: { padding: 15 },
  dishName: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
  chefName: { fontSize: 14, color: COLORS.gray, marginTop: 2 },
  dishFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  dishPrice: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  addBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 12 },
  addBtnText: { color: COLORS.white, fontWeight: 'bold' }
});