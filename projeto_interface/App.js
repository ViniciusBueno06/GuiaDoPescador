import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import 'react-native-gesture-handler';
import Home from './src/Screens/Home';
import Cadastro from './src/Screens/Cadastro';
import Login from './src/Screens/Login';
import BemVindo from './src/Screens/BemVindo';
import TelaPeixe from './src/Screens/TelaPeixe';
import TelaDetalhesPeixe from './src/Screens/TelaDetalhesPeixe';
import RedefinirSenha from './src/Screens/RedefinirSenha';
import TelaFavoritos from './src/Screens/TelaFavoritos';
import TelaPerfil from './src/Screens/TelaPerfil';
import TelaEditarPerfil from './src/Screens/TelaEditarPerfil';


const Stack = createStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name='Home' component={Home} options={{ headerShown: false }} />
        <Stack.Screen name='Login' component={Login} options={{ title: 'Tela de login', headerShown: false }} />
        <Stack.Screen name='Cadastro' component={Cadastro} options={{ title: 'Tela de Cadastro', headerShown: false }} />
        <Stack.Screen name='BemVindo' component={BemVindo} options={{ title: 'Tela de Bem vindo', headerShown: false }} />
        <Stack.Screen name='RedefinirSenha' component={RedefinirSenha} options={{ title: 'Tela de Bem vindo', headerShown: false }} />
        <Stack.Screen name='TelaPeixe' component={TelaPeixe} options={{ title: '', headerStyle: { backgroundColor: '#243770',  } }} />
        <Stack.Screen name='TelaFavoritos' component={TelaFavoritos} options={{ title: 'Tela de Favoritos', headerShown: false }} />
        <Stack.Screen name='TelaDetalhesPeixe' component={TelaDetalhesPeixe} options={{ title: '', headerStyle: { backgroundColor: 'transparent' } }} />
        <Stack.Screen name='TelaPerfil' component={TelaPerfil} options={{  headerStyle: { backgroundColor: 'transparent' }, }} />
        <Stack.Screen name='TelaEditarPerfil' component={TelaEditarPerfil} options={{ title: ' ', headerStyle: { backgroundColor: 'transparent' } }} />
       
      </Stack.Navigator>
    </NavigationContainer>
  );
}



