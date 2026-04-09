import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, ShoppingBag, User as UserIcon, List, BarChart3 } from 'lucide-react-native';
import { COLORS } from '../constants/theme';
import useAuthStore from '../store/useAuthStore';

import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import HomeScreen from '../screens/customer/HomeScreen';
import ChefProfile from '../screens/customer/ChefProfile';
import Checkout from '../screens/customer/Checkout';
import OrdersHistory from '../screens/customer/OrdersHistory';
import OrderTracking from '../screens/customer/OrderTracking';
import ProfileScreen from '../screens/common/ProfileScreen';

import ChefDashboard from '../screens/chef/Dashboard';
import AddFoodItem from '../screens/chef/AddFoodItem';
import OrdersScreen from '../screens/chef/OrdersScreen';
import EarningsDashboard from '../screens/chef/EarningsDashboard';
import AdminDashboard from '../screens/admin/Dashboard';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function CustomerTabs() {
  return (
    <Tab.Navigator screenOptions={{ 
      headerShown: false, 
      tabBarActiveTintColor: COLORS.primary,
      tabBarStyle: { height: 70, paddingBottom: 10, backgroundColor: COLORS.surface }
    }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: ({ color }) => <Home color={color} /> }} />
      <Tab.Screen name="Orders" component={OrdersHistory} options={{ tabBarIcon: ({ color }) => <ShoppingBag color={color} /> }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ color }) => <UserIcon color={color} /> }} />
    </Tab.Navigator>
  );
}

function ChefTabs() {
  return (
    <Tab.Navigator screenOptions={{ 
      headerShown: false, 
      tabBarActiveTintColor: COLORS.primary,
      tabBarStyle: { height: 70, paddingBottom: 10, backgroundColor: COLORS.surface }
    }}>
      <Tab.Screen name="Dashboard" component={ChefDashboard} options={{ tabBarIcon: ({ color }) => <Home color={color} /> }} />
      <Tab.Screen name="MyOrders" component={OrdersScreen} options={{ tabBarIcon: ({ color }) => <List color={color} /> }} />
      <Tab.Screen name="Earnings" component={EarningsDashboard} options={{ tabBarIcon: ({ color }) => <BarChart3 color={color} /> }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ color }) => <UserIcon color={color} /> }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, role } = useAuthStore();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : (
          <>
            {role === 'customer' && (
              <>
                <Stack.Screen name="Main" component={CustomerTabs} />
                <Stack.Screen name="ChefProfile" component={ChefProfile} />
                <Stack.Screen name="Checkout" component={Checkout} />
                <Stack.Screen name="OrderTracking" component={OrderTracking} />
              </>
            )}
            {role === 'chef' && (
              <>
                <Stack.Screen name="Main" component={ChefTabs} />
                <Stack.Screen name="AddFoodItem" component={AddFoodItem} />
                <Stack.Screen name="OrdersList" component={OrdersScreen} />
              </>
            )}
            {role === 'admin' && (
              <Stack.Screen name="AdminHome" component={AdminDashboard} />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}