// Importar gesture-handler primero (requerido para React Navigation)
import 'react-native-gesture-handler';

// Importar screens para asegurar que se registren
import 'react-native-screens';

import { registerRootComponent } from 'expo';
import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
