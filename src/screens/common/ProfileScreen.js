import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { User, MapPin, CreditCard, LogOut, ChevronRight, Store, BarChart3, Settings } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';
import useAuthStore from '../../store/useAuthStore';

export default function ProfileScreen({ navigation }) {
  const { user, logout, role } = useAuthStore();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => logout() }
    ]);
  };

  const MenuItem = ({ icon: Icon, title, subtitle, onPress, color = COLORS.primary }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={[styles.iconBox, { backgroundColor: color + '10' }]}>
        <Icon color={color} size={22} />
      </View>
      <View style={{ flex: 1, marginLeft: 15 }}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <ChevronRight color={COLORS.gray} size={20} />
    </TouchableOpacity>
  );

  if (!user) return null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.profileImgContainer}>
          <User size={40} color={COLORS.gray} />
        </View>
        <Text style={styles.userName}>{user?.name || "User Name"}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{role?.toUpperCase() || ""}</Text>
        </View>
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.sectionLabel}>Account Settings</Text>
        <MenuItem 
          icon={User} 
          title="Personal Information" 
          subtitle="Name, Phone, Email" 
          onPress={() => navigation.navigate('EditProfile')}
        />
        <MenuItem 
          icon={MapPin} 
          title="Saved Addresses" 
          subtitle="Home, Office, etc." 
          onPress={() => navigation.navigate('AddressManager')}
        />
        
        {role === 'customer' && (
          <MenuItem 
            icon={Store} 
            title="Become a Home Chef" 
            subtitle="Start selling your homemade food" 
            color="#F2BB05"
          />
        )}

        {role === 'chef' && (
          <>
            <Text style={styles.sectionLabel}>Chef Dashboard</Text>
            <MenuItem 
              icon={BarChart3} 
              title="Earnings & Analytics" 
              subtitle="View your sales history" 
            />
            <MenuItem 
              icon={Settings} 
              title="Kitchen Settings" 
              subtitle="Description, Opening hours" 
            />
          </>
        )}

        <Text style={styles.sectionLabel}>System</Text>
        <MenuItem icon={CreditCard} title="Payment Methods" />
        <MenuItem 
          icon={LogOut} 
          title="Logout" 
          onPress={handleLogout} 
          color="#e74c3c" 
        />
      </View>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { alignItems: 'center', paddingTop: 60, paddingBottom: 30, backgroundColor: '#f8f9fa' },
  profileImgContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  userName: { fontSize: 22, fontWeight: 'bold', color: COLORS.primary },
  userEmail: { color: COLORS.gray, marginTop: 5 },
  roleBadge: { marginTop: 10, backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  roleText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  menuSection: { padding: 20 },
  sectionLabel: { fontSize: 13, fontWeight: 'bold', color: COLORS.gray, marginTop: 25, marginBottom: 15, textTransform: 'uppercase', letterSpacing: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  iconBox: { width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  menuTitle: { fontSize: 16, fontWeight: '600', color: COLORS.primary },
  menuSubtitle: { fontSize: 12, color: COLORS.gray, marginTop: 2 }
});