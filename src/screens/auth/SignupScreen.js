import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, StatusBar, Dimensions, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';
import { User, Mail, Phone, Lock, MapPin, ChevronLeft } from 'lucide-react-native';
import { authService } from '../../api/authService';

const { height } = Dimensions.get('window');

export default function SignupScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('customer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{11}$/;

    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      Alert.alert("Error", "All fields are required");
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }
    if (!phoneRegex.test(formData.phone)) {
      Alert.alert("Error", "Phone number must be exactly 11 digits");
      return false;
    }
    if (formData.password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Denied", "Location access is required.");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setRegion({
      ...region,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        ...formData,
        role: role,
        location: {
          latitude: region.latitude,
          longitude: region.longitude,
          address: "Selected on Map"
        }
      };
      await authService.signup(payload);
      Alert.alert("Success", "Account created successfully!");
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" translucent />
      <View style={styles.darkHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft color={COLORS.white} size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Join Us</Text>
      </View>

      <View style={styles.whiteSheet}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>
          <View style={styles.roleContainer}>
            <TouchableOpacity 
              style={[styles.roleBtn, role === 'customer' && styles.activeRole]} 
              onPress={() => setRole('customer')}
            >
              <Text style={[styles.roleText, role === 'customer' && styles.activeRoleText]}>Customer</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.roleBtn, role === 'chef' && styles.activeRole]} 
              onPress={() => setRole('chef')}
            >
              <Text style={[styles.roleText, role === 'chef' && styles.activeRoleText]}>Home Chef</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputBox}>
            <User color={COLORS.primary} size={20} />
            <TextInput 
              style={styles.input} 
              placeholder="Full Name" 
              placeholderTextColor={COLORS.gray}
              onChangeText={(val) => setFormData({...formData, name: val})}
            />
          </View>

          <View style={styles.inputBox}>
            <Mail color={COLORS.primary} size={20} />
            <TextInput 
              style={styles.input} 
              placeholder="Email Address" 
              placeholderTextColor={COLORS.gray}
              autoCapitalize="none"
              onChangeText={(val) => setFormData({...formData, email: val})}
            />
          </View>

          <View style={styles.inputBox}>
            <Phone color={COLORS.primary} size={20} />
            <TextInput 
              style={styles.input} 
              placeholder="Phone Number (11 Digits)" 
              placeholderTextColor={COLORS.gray}
              keyboardType="phone-pad"
              maxLength={11}
              onChangeText={(val) => setFormData({...formData, phone: val})}
            />
          </View>

          <View style={styles.inputBox}>
            <Lock color={COLORS.primary} size={20} />
            <TextInput 
              style={styles.input} 
              placeholder="Password" 
              placeholderTextColor={COLORS.gray}
              secureTextEntry 
              onChangeText={(val) => setFormData({...formData, password: val})}
            />
          </View>

          <View style={styles.locationHeader}>
            <Text style={styles.locationTitle}>Delivery Address</Text>
            <TouchableOpacity onPress={getCurrentLocation}>
              <Text style={styles.currentLocText}>Get GPS</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.mapContainer}>
            <MapView style={styles.map} region={region} onRegionChangeComplete={setRegion}>
              <Marker coordinate={region} pinColor={COLORS.primary} />
            </MapView>
          </View>

          <TouchableOpacity style={styles.signupBtn} onPress={handleSignup} disabled={loading}>
            {loading ? <ActivityIndicator color={COLORS.primary} /> : <Text style={styles.signupBtnText}>Create Account</Text>}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },
  darkHeader: { height: height * 0.15, justifyContent: 'center', paddingHorizontal: 30 },
  backBtn: { marginBottom: 10 },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: COLORS.white },
  whiteSheet: { flex: 1, backgroundColor: COLORS.background, borderTopLeftRadius: 50, borderTopRightRadius: 50, paddingHorizontal: 25, paddingTop: 30 },
  roleContainer: { flexDirection: 'row', backgroundColor: '#eee', borderRadius: 25, padding: 5, marginBottom: 25 },
  roleBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 20 },
  activeRole: { backgroundColor: COLORS.secondary },
  roleText: { color: COLORS.primary, fontWeight: 'bold' },
  activeRoleText: { color: COLORS.primary },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 25, paddingHorizontal: 20, height: 60, marginBottom: 15, elevation: 1 },
  input: { flex: 1, marginLeft: 12, color: COLORS.primary, fontWeight: '500' },
  locationHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  locationTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  currentLocText: { color: COLORS.secondary, fontWeight: 'bold' },
  mapContainer: { height: 180, borderRadius: 30, overflow: 'hidden', marginBottom: 25, borderWidth: 1, borderColor: '#eee' },
  map: { flex: 1 },
  signupBtn: { backgroundColor: COLORS.secondary, height: 65, borderRadius: 35, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  signupBtnText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 18 }
});