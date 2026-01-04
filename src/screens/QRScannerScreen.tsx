import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, CommonActions, useIsFocused } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { equiposService } from '../services/equipos';
import { useAuth } from '../context/AuthContext';

export default function QRScannerScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused(); // Verificar si la pantalla está enfocada
  
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false); // Iniciar desactivado
  const [error, setError] = useState<string | null>(null);
  const [lastScannedId, setLastScannedId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showScanArea, setShowScanArea] = useState(false); // Controlar visibilidad del cuadro
  const lastScanTimeRef = React.useRef<number>(0);
  const hasScannedRef = React.useRef<boolean>(false);
  const alertShownRef = React.useRef<boolean>(false); // Controlar si el Alert ya se mostró
  
  // Solicitar permiso automáticamente cuando se entra a la pantalla
  React.useEffect(() => {
    if (!isFocused) {
      // Si la pantalla no está enfocada, desactivar todo
      setScanning(false);
      setIsProcessing(false);
      setShowScanArea(false);
      hasScannedRef.current = false;
      alertShownRef.current = false;
      return;
    }
    
    // Cuando se entra a la pantalla y está enfocada, solicitar permiso si no está concedido
    if (isFocused && permission && !permission.granted && requestPermission) {
      // Pequeño delay para asegurar que la pantalla esté lista
      const timer = setTimeout(() => {
        requestPermission();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isFocused, permission?.granted, requestPermission]);
  
  // Activar la cámara solo cuando la pantalla está enfocada y tiene permisos
  React.useEffect(() => {
    if (!isFocused) {
      // Si la pantalla no está enfocada, desactivar todo
      setScanning(false);
      setIsProcessing(false);
      setShowScanArea(false);
      hasScannedRef.current = false;
      alertShownRef.current = false;
      return;
    }
    
    // Solo activar si la pantalla está enfocada y tiene permisos
    if (isFocused && permission?.granted && !isProcessing) {
      // Delay para asegurar que la cámara esté lista
      const timer = setTimeout(() => {
        setScanning(true);
        hasScannedRef.current = false; // Resetear cuando se activa el scanner
        alertShownRef.current = false; // Resetear el flag del Alert
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isFocused, permission?.granted, isProcessing]);
  
  // Resetear todo cuando se sale de la pantalla
  React.useEffect(() => {
    if (!isFocused) {
      hasScannedRef.current = false;
      alertShownRef.current = false;
      setLastScannedId(null);
      setIsProcessing(false);
      setScanning(false);
      setShowScanArea(false);
      lastScanTimeRef.current = 0;
    }
  }, [isFocused]);

  const handleGoBack = () => {
    try {
      if (navigation && typeof navigation.goBack === 'function') {
        navigation.goBack();
      } else {
        console.warn('Navigation not available');
      }
    } catch (error: any) {
      console.error('Error navigating back:', error);
      setError(error?.message || 'Error de navegación');
    }
  };

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Error</Text>
          <TouchableOpacity onPress={handleGoBack}>
            <Text style={styles.backText}>← Volver</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{error}</Text>
        </View>
      </View>
    );
  }

  if (!permission) {
    // Camera permissions are still loading
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Escanear QR</Text>
          <TouchableOpacity onPress={handleGoBack}>
            <Text style={styles.backText}>← Volver</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>Cargando permisos...</Text>
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Escanear QR</Text>
          <TouchableOpacity onPress={handleGoBack}>
            <Text style={styles.backText}>← Volver</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>
            Necesitamos acceso a la cámara para escanear códigos QR
          </Text>
          <Text style={[styles.messageText, { fontSize: 14, marginTop: 10, color: '#9CA3AF' }]}>
            El permiso se solicita automáticamente al entrar a esta pantalla.
          </Text>
          <Text style={[styles.messageText, { fontSize: 14, marginTop: 5, color: '#9CA3AF' }]}>
            Si rechazaste el permiso, puedes permitirlo desde la configuración del dispositivo.
          </Text>
        </View>
      </View>
    );
  }

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    // Evitar procesar si ya se está procesando o si no está escaneando
    if (!scanning || isProcessing) {
      return;
    }
    
    // Validar que el data no esté vacío y sea un string válido
    if (!data || typeof data !== 'string' || data.trim().length === 0) {
      return;
    }
    
    // Validación más estricta: debe contener al menos "qr/equipo" para ser un QR válido
    if (!data.includes('qr/equipo') && !data.includes('qr\\/equipo')) {
      return; // No es un QR de equipo, ignorar silenciosamente
    }
    
    // Extraer ID del equipo de la URL del QR
    // El QR puede contener: http://ip:port/qr/equipo/{id} o solo /qr/equipo/{id}
    const match = data.match(/\/qr\/equipo\/(\d+)/);
    if (!match || !match[1]) {
      return; // QR no válido, ignorar silenciosamente
    }
    
    const id = parseInt(match[1]);
    
    // Validar que el ID sea un número válido
    if (isNaN(id) || id <= 0) {
      return;
    }
    
    const now = Date.now();
    
    // Si es el mismo QR escaneado en los últimos 10 segundos, ignorar completamente
    if (lastScannedId === id && (now - lastScanTimeRef.current) < 10000) {
      return;
    }
    
    // Si se escaneó cualquier QR en los últimos 5 segundos, ignorar (evitar detecciones rápidas)
    if ((now - lastScanTimeRef.current) < 5000 && lastScanTimeRef.current > 0) {
      return;
    }
    
    // Verificar que no se haya escaneado ya en esta sesión
    if (hasScannedRef.current || alertShownRef.current) {
      return;
    }
    
    // Marcar como escaneado y que el Alert se mostró antes de procesar
    hasScannedRef.current = true;
    alertShownRef.current = true;
    
    // Mostrar el cuadro de escaneo cuando se detecta un QR válido
    setShowScanArea(true);
    
    // Detener el escaneo inmediatamente para evitar múltiples detecciones
    setScanning(false);
    setIsProcessing(true);
    setLastScannedId(id);
    lastScanTimeRef.current = now;
    
    try {
      const info = await equiposService.obtenerInfoQR(id);
      
      // Obtener el equipo completo
      const equipo = await equiposService.getById(id);
      
      // Función para resetear el scanner después de un tiempo
      const resetScanner = (delay: number = 10000) => {
        setTimeout(() => {
          setLastScannedId(null);
          setIsProcessing(false);
          hasScannedRef.current = false; // Permitir escanear de nuevo
          alertShownRef.current = false; // Permitir mostrar Alert de nuevo
          setShowScanArea(false); // Ocultar el cuadro de escaneo
          setScanning(true);
          // No resetear lastScanTimeRef para mantener el control de tiempo
        }, delay);
      };
      
      // Mostrar información y permitir al usuario decidir qué hacer
      if (info.prestado) {
        Alert.alert(
          'Equipo Prestado',
          `Equipo: ${equipo.serie}\n${equipo.tipo} • ${equipo.marca} ${equipo.modelo}\n\nPrestado a: ${info.trabajador || 'N/A'}\n\n¿Deseas devolver este equipo?`,
          [
            {
              text: 'Cancelar',
              style: 'cancel',
              onPress: resetScanner,
            },
            {
              text: 'Devolver',
              onPress: () => {
                // Deshabilitar scanner por más tiempo cuando se navega
                setScanning(false);
                setIsProcessing(true);
                // Navegar a Equipos y abrir modal de devolución usando CommonActions
                navigation.dispatch(
                  CommonActions.navigate({
                    name: 'Equipos',
                    params: {
                      scannedEquipo: equipo,
                      action: 'devolver',
                    },
                  })
                );
                // Resetear después de más tiempo para evitar notificaciones múltiples
                resetScanner(12000);
              },
            },
          ],
          {
            cancelable: true,
            onDismiss: resetScanner,
          }
        );
      } else {
        Alert.alert(
          'Equipo Disponible',
          `Equipo: ${equipo.serie}\n${equipo.tipo} • ${equipo.marca} ${equipo.modelo}\n\nEstado: ${equipo.estado_dispositivo}\n\n¿Deseas prestar este equipo?`,
          [
            {
              text: 'Cancelar',
              style: 'cancel',
              onPress: resetScanner,
            },
            {
              text: 'Prestar',
              onPress: () => {
                // Deshabilitar scanner por más tiempo cuando se navega
                setScanning(false);
                setIsProcessing(true);
                // Navegar a Equipos y abrir modal de préstamo usando CommonActions
                navigation.dispatch(
                  CommonActions.navigate({
                    name: 'Equipos',
                    params: {
                      scannedEquipo: equipo,
                      action: 'prestar',
                    },
                  })
                );
                // Resetear después de más tiempo para evitar notificaciones múltiples
                resetScanner(12000);
              },
            },
          ],
          {
            cancelable: true,
            onDismiss: resetScanner,
          }
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.detail || 'Error al obtener información del equipo');
      setTimeout(() => {
        setLastScannedId(null);
        setIsProcessing(false);
        hasScannedRef.current = false; // Permitir intentar de nuevo
        alertShownRef.current = false; // Permitir mostrar Alert de nuevo
        setShowScanArea(false); // Ocultar el cuadro de escaneo
        setScanning(true);
        // No resetear lastScanTimeRef para mantener el control de tiempo
      }, 3000);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Escanear QR</Text>
      </View>

      <View style={styles.cameraContainer}>
        {isFocused && permission?.granted ? (
          <>
            <CameraView
              style={styles.camera}
              facing="back"
              onBarcodeScanned={scanning && !isProcessing ? handleBarCodeScanned : undefined}
              barcodeScannerSettings={{
                barcodeTypes: ['qr'],
                interval: 1000, // Reducir frecuencia de escaneo a 1 segundo
              }}
            />
            {showScanArea && (
              <View style={styles.overlay}>
                <View style={styles.scanArea} />
              </View>
            )}
          </>
        ) : (
          <View style={styles.cameraPlaceholder}>
            <Text style={styles.placeholderText}>
              {!permission?.granted 
                ? 'Permiso de cámara requerido' 
                : 'Cámara desactivada'}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionsText}>
          Apunta la cámara al código QR del equipo
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1F2937',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  backText: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  placeholderText: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#10B981', // Verde esmeralda profesional
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.1)', // Fondo sutil verde
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 8,
  },
  instructions: {
    padding: 16,
    alignItems: 'center',
  },
  instructionsText: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
