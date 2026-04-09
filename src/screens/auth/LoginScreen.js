import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { COLORS } from '../../constants/theme';
import useAuthStore from '../../store/useAuthStore';
import { authService } from '../../api/authService';
import { Mail, Lock, ArrowRight } from 'lucide-react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const data = await authService.login(email.trim(), password);
      setUser(data.user, data.token);
    } catch (error) {
      const msg = error.response?.data?.message || "Invalid Email or Password";
      Alert.alert("Login Failed", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Kitchens</Text>
      </View>
      <View style={styles.sheet}>
        <Text style={styles.sheetTitle}>Login</Text>
        <View style={styles.inputBox}>
          <Mail color={COLORS.primary} size={20} />
          <TextInput 
            style={styles.input} 
            placeholder="Email" 
            autoCapitalize="none" 
            keyboardType="email-address"
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputBox}>
          <Lock color={COLORS.primary} size={20} />
          <TextInput 
            style={styles.input} 
            placeholder="Password" 
            secureTextEntry 
            onChangeText={setPassword}
          />
        </View>
        <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color={COLORS.primary} /> : <Text style={styles.btnText}>Login</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={{marginTop: 20}} onPress={() => navigation.navigate('Signup')}>
          <Text style={{color: COLORS.primary, textAlign: 'center'}}>New here? Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },
  header: { height: '35%', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 40, fontWeight: 'bold', color: '#fff' },
  sheet: { flex: 1, backgroundColor: '#F5F5F5', borderTopLeftRadius: 50, borderTopRightRadius: 50, padding: 30 },
  sheetTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary, marginBottom: 30 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 15, height: 60, marginBottom: 15 },
  input: { flex: 1, marginLeft: 10, color: COLORS.primary },
  btn: { backgroundColor: '#FFC107', height: 65, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  btnText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 18 }
});