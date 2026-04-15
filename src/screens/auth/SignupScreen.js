import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, StatusBar, Dimensions, Alert, ActivityIndicator, Animated, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';
import { User, Mail, Phone, Lock, ChevronLeft, Eye, EyeOff, MapPin } from 'lucide-react-native';
import { authService } from '../../api/authService';

const { height } = Dimensions.get('window');

export default function SignupScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('customer');
  const [showPassword, setShowPassword] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', address: '' });
  const [region, setRegion] = useState({
    latitude: 33.6844,
    longitude: 73.0479,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const animateToggle = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.2, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    setShowPassword(!showPassword);
  };

  const getCurrentLocation = async () => {
    Keyboard.dismiss();
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Denied", "Location access is required.");
      return;
    }

    setLoading(true);
    try {
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      setRegion(newRegion);

      let response = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (response.length > 0) {
        const item = response[0];
        const addressString = `${item.name || ''} ${item.street || ''}, ${item.district || item.subregion || ''}, ${item.city || ''}`;
        setFormData(prev => ({ ...prev, address: addressString.trim() }));
      }
    } catch (error) {
      Alert.alert("Error", "Could not fetch address. Please type it manually.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    Keyboard.dismiss();
    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.address) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: role,
        location: {
          latitude: region.latitude,
          longitude: region.longitude,
          address: formData.address
        }
      };
      await authService.signup(payload);
      Alert.alert("Success", "Account created successfully!", [{ text: "Login", onPress: () => navigation.navigate('Login') }]);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Registration failed";
      Alert.alert("Signup Failed", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar barStyle="light-content" translucent />
        <View style={styles.darkHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <ChevronLeft color={COLORS.white} size={28} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Join Us</Text>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} style={{ flex: 1 }}>
          <View style={styles.whiteSheet}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
              <View style={styles.roleContainer}>
                <TouchableOpacity style={[styles.roleBtn, role === 'customer' && styles.activeRole]} onPress={() => setRole('customer')}>
                  <Text style={[styles.roleText, role === 'customer' && styles.activeRoleText]}>Customer</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.roleBtn, role === 'chef' && styles.activeRole]} onPress={() => setRole('chef')}>
                  <Text style={[styles.roleText, role === 'chef' && styles.activeRoleText]}>Home Chef</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputBox}>
                <User color={COLORS.primary} size={20} />
                <TextInput style={styles.input} placeholder="Full Name" value={formData.name} onChangeText={(val) => setFormData({...formData, name: val})} />
              </View>

              <View style={styles.inputBox}>
                <Mail color={COLORS.primary} size={20} />
                <TextInput style={styles.input} placeholder="Email Address" autoCapitalize="none" keyboardType="email-address" value={formData.email} onChangeText={(val) => setFormData({...formData, email: val})} />
              </View>

              <View style={styles.inputBox}>
                <Phone color={COLORS.primary} size={20} />
                <TextInput style={styles.input} placeholder="Phone (11 Digits)" keyboardType="phone-pad" maxLength={11} value={formData.phone} onChangeText={(val) => setFormData({...formData, phone: val})} />
              </View>

              <View style={styles.inputBox}>
                <Lock color={COLORS.primary} size={20} />
                <TextInput style={styles.input} placeholder="Password" secureTextEntry={!showPassword} value={formData.password} onChangeText={(val) => setFormData({...formData, password: val})} />
                <TouchableOpacity onPress={animateToggle}>
                  <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    {showPassword ? <EyeOff color={COLORS.primary} size={20} /> : <Eye color={COLORS.primary} size={20} />}
                  </Animated.View>
                </TouchableOpacity>
              </View>

              <View style={styles.inputBox}>
                <MapPin color={COLORS.primary} size={20} />
                <TextInput 
                  style={styles.input} 
                  placeholder="Street / Area Name" 
                  value={formData.address}
                  onChangeText={(val) => setFormData({...formData, address: val})} 
                />
              </View>

              <View style={styles.locationHeader}>
                <Text style={styles.locationTitle}>Pin on Map</Text>
                <TouchableOpacity onPress={getCurrentLocation}>
                  <Text style={styles.currentLocText}>Locate Me</Text>
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
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },
  darkHeader: { height: height * 0.12, justifyContent: 'center', paddingHorizontal: 30 },
  backBtn: { marginBottom: 5 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.white },
  whiteSheet: { flex: 1, backgroundColor: COLORS.background, borderTopLeftRadius: 50, borderTopRightRadius: 50, paddingHorizontal: 25, paddingTop: 30 },
  roleContainer: { flexDirection: 'row', backgroundColor: '#eee', borderRadius: 25, padding: 5, marginBottom: 20 },
  roleBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 20 },
  activeRole: { backgroundColor: COLORS.secondary },
  roleText: { color: COLORS.primary, fontWeight: 'bold' },
  activeRoleText: { color: COLORS.primary },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 20, paddingHorizontal: 20, height: 60, marginBottom: 12, elevation: 1 },
  input: { flex: 1, marginLeft: 12, color: COLORS.primary, fontWeight: '500' },
  locationHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, marginTop: 10 },
  locationTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.primary },
  currentLocText: { color: COLORS.secondary, fontWeight: 'bold' },
  mapContainer: { height: 160, borderRadius: 25, overflow: 'hidden', marginBottom: 20, borderWidth: 1, borderColor: '#eee' },
  map: { flex: 1 },
  signupBtn: { backgroundColor: COLORS.secondary, height: 65, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  signupBtnText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 18 }
});