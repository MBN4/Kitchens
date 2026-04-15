import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Alert, ActivityIndicator } from 'react-native';
import { ChevronLeft, MapPin, Trash2, Plus, Home, Briefcase, Info } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';
import { authService } from '../../api/authService';
import useAuthStore from '../../store/useAuthStore';

export default function AddressManager({ navigation }) {
  const { user, setUser, token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [selectedLabel, setSelectedLabel] = useState('Home');

  const handleAdd = async () => {
    if (!newAddress) return;
    setLoading(true);
    try {
      const updatedAddresses = await authService.addAddress({ label: selectedLabel, address: newAddress });
      setUser({ ...user, savedAddresses: updatedAddresses }, token);
      setNewAddress('');
    } catch (error) {
      Alert.alert("Error", "Could not add address");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const updatedAddresses = await authService.deleteAddress(id);
      setUser({ ...user, savedAddresses: updatedAddresses }, token);
    } catch (error) {
      Alert.alert("Error", "Could not delete address");
    }
  };

  const getIcon = (label) => {
    if (label === 'Home') return <Home size={20} color={COLORS.primary} />;
    if (label === 'Office') return <Briefcase size={20} color={COLORS.primary} />;
    return <Info size={20} color={COLORS.primary} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><ChevronLeft color="black" /></TouchableOpacity>
        <Text style={styles.headerTitle}>My Addresses</Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.addSection}>
        <View style={styles.labelRow}>
          {['Home', 'Office', 'Other'].map(l => (
            <TouchableOpacity 
              key={l} 
              style={[styles.labelBtn, selectedLabel === l && styles.activeLabel]}
              onPress={() => setSelectedLabel(l)}
            >
              <Text style={[styles.labelTxt, selectedLabel === l && {color: 'white'}]}>{l}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.inputBox}>
          <TextInput 
            style={styles.input} 
            placeholder="Enter address details..." 
            value={newAddress}
            onChangeText={setNewAddress}
          />
          <TouchableOpacity style={styles.plusBtn} onPress={handleAdd} disabled={loading}>
            {loading ? <ActivityIndicator color="white" /> : <Plus color="white" />}
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={user?.savedAddresses || []}
        keyExtractor={item => item._id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View style={styles.addrCard}>
            <View style={styles.iconBox}>{getIcon(item.label)}</View>
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={styles.addrLabel}>{item.label}</Text>
              <Text style={styles.addrText}>{item.address}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item._id)}>
              <Trash2 size={20} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  addSection: { padding: 20, backgroundColor: '#f8f9fa', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  labelRow: { flexDirection: 'row', marginBottom: 15 },
  labelBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, backgroundColor: 'white', marginRight: 10, borderWidth: 1, borderColor: '#eee' },
  activeLabel: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  labelTxt: { fontSize: 12, fontWeight: 'bold', color: COLORS.gray },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 20, paddingLeft: 15, elevation: 1 },
  input: { flex: 1, height: 55 },
  plusBtn: { backgroundColor: COLORS.primary, width: 55, height: 55, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  addrCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa', padding: 20, borderRadius: 25, marginBottom: 15 },
  iconBox: { width: 45, height: 45, borderRadius: 15, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' },
  addrLabel: { fontWeight: 'bold', fontSize: 15, color: COLORS.primary },
  addrText: { fontSize: 13, color: COLORS.gray, marginTop: 4 }
});