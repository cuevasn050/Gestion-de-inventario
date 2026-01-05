import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import DashboardScreen from '../screens/DashboardScreen';
import EquiposScreen from '../screens/EquiposScreen';
import TrabajadoresScreen from '../screens/TrabajadoresScreen';
import ObrasScreen from '../screens/ObrasScreen';
import QRScannerScreen from '../screens/QRScannerScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const insets = useSafeAreaInsets();
  
  // Calcular padding dinámico basado en el espacio del sistema de navegación
  // En Android, bottom inset indica el espacio de los botones de navegación
  const bottomPadding = Platform.OS === 'android' 
    ? Math.max(insets.bottom, 8) + 8  // Al menos 8px + el espacio del sistema
    : 8;
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1F2937',
          borderTopWidth: 1,
          borderTopColor: 'rgba(255, 255, 255, 0.1)',
          height: 65 + (Platform.OS === 'android' ? Math.max(insets.bottom, 0) : 0), // Ajustar altura si hay inset
          paddingBottom: bottomPadding,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarActiveTintColor: '#667eea',
        tabBarInactiveTintColor: '#6B7280',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, size, focused }) => {
            const iconSize = focused ? 26 : 24;
            return <MaterialIcons name="dashboard" size={iconSize} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Equipos"
        component={EquiposScreen}
        options={{
          tabBarLabel: 'Equipos',
          tabBarIcon: ({ color, size, focused }) => {
            const iconSize = focused ? 26 : 24;
            return <MaterialIcons name="computer" size={iconSize} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="QRScanner"
        component={QRScannerScreen}
        options={{
          tabBarLabel: 'Scanner',
          tabBarIcon: ({ focused }) => {
            return (
              <View style={styles.scannerButton}>
                <LinearGradient
                  colors={focused ? ['#667eea', '#764ba2'] : ['#4B5563', '#374151']}
                  style={styles.scannerButtonGradient}
                >
                  <MaterialIcons 
                    name="qr-code-scanner" 
                    size={28} 
                    color="#FFFFFF" 
                  />
                </LinearGradient>
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Trabajadores"
        component={TrabajadoresScreen}
        options={{
          tabBarLabel: 'Trabajadores',
          tabBarIcon: ({ color, size, focused }) => {
            const iconSize = focused ? 26 : 24;
            return <MaterialIcons name="people" size={iconSize} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Obras"
        component={ObrasScreen}
        options={{
          tabBarLabel: 'Obras',
          tabBarIcon: ({ color, size, focused }) => {
            const iconSize = focused ? 26 : 24;
            return <MaterialIcons name="construction" size={iconSize} color={color} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  scannerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    marginTop: -28,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#1F2937',
  },
  scannerButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
