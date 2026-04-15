import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, StatusBar, Animated, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { COLORS } from '../../constants/theme';
import useAuthStore from '../../store/useAuthStore';
import { authService } from '../../api/authService';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const setUser = useAuthStore((state) => state.setUser);

  const animateToggle = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.2, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    Keyboard.dismiss();
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const data = await authService.login(email.trim().toLowerCase(), password);
      setUser(data.user, data.token);
    } catch (error) {
      Alert.alert("Login Failed", error.response?.data?.message || "Invalid Email or Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.title}>Kitchens</Text>
        </View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.sheetContainer}
        >
          <View style={styles.sheet}>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Text style={styles.sheetTitle}>Login</Text>
              
              <View style={styles.inputBox}>
                <Mail color={COLORS.primary} size={20} />
                <TextInput 
                  style={styles.input} 
                  placeholder="Email" 
                  autoCapitalize="none" 
                  keyboardType="email-address"
                  onChangeText={setEmail}
                  returnKeyType="next"
                />
              </View>

              <View style={styles.inputBox}>
                <Lock color={COLORS.primary} size={20} />
                <TextInput 
                  style={styles.input} 
                  placeholder="Password" 
                  secureTextEntry={!showPassword} 
                  onChangeText={setPassword}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
                <TouchableOpacity onPress={animateToggle}>
                  <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    {showPassword ? <EyeOff color={COLORS.primary} size={20} /> : <Eye color={COLORS.primary} size={20} />}
                  </Animated.View>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
                {loading ? <ActivityIndicator color={COLORS.primary} /> : <Text style={styles.btnText}>Login</Text>}
              </TouchableOpacity>

              <TouchableOpacity style={{marginTop: 20, marginBottom: 40}} onPress={() => navigation.navigate('Signup')}>
                <Text style={{color: COLORS.primary, textAlign: 'center'}}>New here? <Text style={{fontWeight: 'bold'}}>Create Account</Text></Text>
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
  header: { height: '30%', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 40, fontWeight: 'bold', color: '#fff' },
  sheetContainer: { flex: 1 },
  sheet: { flex: 1, backgroundColor: '#F5F5F5', borderTopLeftRadius: 50, borderTopRightRadius: 50, paddingHorizontal: 30, paddingTop: 35 },
  sheetTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary, marginBottom: 30 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 15, height: 60, marginBottom: 15, elevation: 1 },
  input: { flex: 1, marginLeft: 10, color: COLORS.primary, fontWeight: '500' },
  btn: { backgroundColor: COLORS.secondary, height: 65, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginTop: 10, elevation: 4 },
  btnText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 18 }
});