import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { ChevronLeft, User, Phone, Mail } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';
import { authService } from '../../api/authService';
import useAuthStore from '../../store/useAuthStore';

export default function EditProfile({ navigation }) {
  const { user, setUser, token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });

  const handleUpdate = async () => {
    if (!formData.name || !formData.phone) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const updatedUser = await authService.updateProfile(formData);
      setUser(updatedUser, token);
      Alert.alert("Success", "Profile updated successfully", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputBox}>
            <User size={20} color={COLORS.primary} />
            <TextInput 
              style={styles.input} 
              value={formData.name}
              onChangeText={(txt) => setFormData({...formData, name: txt})}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputBox}>
            <Phone size={20} color={COLORS.primary} />
            <TextInput 
              style={styles.input} 
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(txt) => setFormData({...formData, phone: txt})}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address (Immutable)</Text>
          <View style={[styles.inputBox, { opacity: 0.6 }]}>
            <Mail size={20} color={COLORS.gray} />
            <TextInput style={styles.input} value={user?.email} editable={false} />
          </View>
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleUpdate} disabled={loading}>
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.btnText}>Save Changes</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  backBtn: { padding: 10 },
  form: { padding: 25 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: 'bold', color: COLORS.gray, marginBottom: 8 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9F9F9', borderRadius: 15, paddingHorizontal: 15, height: 60 },
  input: { flex: 1, marginLeft: 10, fontWeight: '500', color: 'black' },
  btn: { backgroundColor: COLORS.primary, height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginTop: 30, elevation: 4 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});