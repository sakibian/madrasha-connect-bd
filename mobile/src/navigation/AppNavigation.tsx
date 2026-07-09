
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import JobsScreen from '../screens/JobsScreen';
import KnowledgeScreen from '../screens/KnowledgeScreen';
import CommunityScreen from '../screens/CommunityScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DashboardScreen from '../screens/DashboardScreen';
import InstitutionDirectoryScreen from '../screens/InstitutionDirectoryScreen';
import FatwaScreen from '../screens/FatwaScreen';
import LoginScreen from '../screens/LoginScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const getTabBarIcon = (name: string, color: string, size: number) => (
  <Ionicons name={name as any} size={size} color={color} />
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#006a4e',
      tabBarInactiveTintColor: '#9CA3AF',
      tabBarStyle: { paddingBottom: 8, paddingTop: 8, height: 64 },
      tabBarLabelStyle: { fontSize: 10, fontWeight: '700' },
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarLabel: 'হোম',
        tabBarIcon: ({ color, size }) => getTabBarIcon('home', color, size),
      }}
    />
    <Tab.Screen
      name="Jobs"
      component={JobsScreen}
      options={{
        tabBarLabel: 'চাকরি',
        tabBarIcon: ({ color, size }) => getTabBarIcon('briefcase', color, size),
      }}
    />
    <Tab.Screen
      name="Knowledge"
      component={KnowledgeScreen}
      options={{
        tabBarLabel: 'শিক্ষা',
        tabBarIcon: ({ color, size }) => getTabBarIcon('book', color, size),
      }}
    />
    <Tab.Screen
      name="Community"
      component={CommunityScreen}
      options={{
        tabBarLabel: 'কমিউনিটি',
        tabBarIcon: ({ color, size }) => getTabBarIcon('chatbubbles', color, size),
      }}
    />
    <Tab.Screen
      name="Dashboard"
      component={DashboardScreen}
      options={{
        tabBarLabel: 'ড্যাশবোর্ড',
        tabBarIcon: ({ color, size }) => getTabBarIcon('grid', color, size),
      }}
    />
  </Tab.Navigator>
);

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Institutions" component={InstitutionDirectoryScreen} />
        <Stack.Screen name="Fatwa" component={FatwaScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
