import { View, StyleSheet, Text, Dimensions, Image } from 'react-native';
import React, { useState } from 'react';
import { Button, TextInput } from 'react-native-paper';
import AwesomeAlert from 'react-native-awesome-alerts';

const largura = Dimensions.get('screen').width;
const altura = Dimensions.get('screen').height;
const logo = require('../../assets/logo.png');
const ip_maquina = '';  //ip da maquina

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const verificarLogin = async () => {
    if (!email) {
      setAlertType('warning');
      setAlertMessage('Por favor, insira seu email.');
      setShowAlert(true);
      return;
    }

    if (!senha) {
      setAlertType('warning');
      setAlertMessage('Por favor, insira sua senha.');
      setShowAlert(true);
      return;
    }

    try {
      const response = await fetch(`http://${ip_maquina}:3000/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      if (response.status === 401) {
        setAlertType('error');
        setAlertMessage('Email ou senha incorretos.');
        setShowAlert(true);
        return;
      }

      if (!response.ok) {
        throw new Error('Erro ao fazer login');
      }

      const data = await response.json();
      navigation.navigate('BemVindo', { user: data });
    } catch (error) {
      console.error('Erro ao fazer login:', error.message);
      setAlertType('error');
      setAlertMessage('Houve um problema ao realizar o login. Tente novamente.');
      setShowAlert(true);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    if (alertType === 'success') {
      navigation.navigate('BemVindo');
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={logo} />

      <View style={styles.view_inputs}>
        <Text style={styles.txt_cabecalho}>Login</Text>

        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          label="Email"
          placeholder='Digite seu email'
          placeholderTextColor={'#c5c5c5b9'}
          underlineColor='#077e0f'
          activeUnderlineColor='#036800'
          theme={{ colors: { text: 'white' } }}
          left={<TextInput.Icon icon="at" color={"#626262"} />}
        />
        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          label="Senha"
          secureTextEntry={true}
          placeholder='Senha'
          placeholderTextColor={'#c5c5c5b9'}
          underlineColor='#077e0f'
          activeUnderlineColor='#036800'
          left={<TextInput.Icon icon="eye" color={"#626262"} />}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: largura }}>
          <Button
            labelStyle={{ fontSize: 18 }}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: largura / 3.5,
              backgroundColor: 'red',
              height: 50,
              borderRadius: 5
            }}
            icon="login-variant"
            mode="contained"
            onPress={() => navigation.navigate('Home')}
          >
            Voltar
          </Button>
          <Button
            labelStyle={{ fontSize: 18 }}
            style={styles.botao}
            icon="login-variant"
            mode="contained"
            onPress={verificarLogin}
          >
            Login
          </Button>
        </View>

        
      </View>

      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title={alertType === 'success' ? 'Sucesso' : alertType === 'warning' ? 'Aviso' : 'Erro'}
        message={alertMessage}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor={alertType === 'success' ? '#28a745' : alertType === 'warning' ? '#ffc107' : '#dc3545'}
        onConfirmPressed={handleCloseAlert}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dadada',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: 280,
    height: 180,
    marginBottom: 20
  },
  txt_cabecalho: {
    fontWeight: 'bold',
    fontSize: 28,
    alignSelf: 'baseline',
    marginLeft: 20
  },
  view_inputs: {
    width: largura / 1.1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    height: altura / 2.5,
  },
  botao: {
    width: largura / 2.1,
    backgroundColor: '#166716',
    borderRadius: 5,
    margin: 10,
    height: 50,
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
  },
  input: {
    backgroundColor: "#c7c7c762",
    width: largura / 1.2,
    margin: 10,
  },
  linkButton: {
    marginTop: 10,
    color: '#007BFF',
  },
});
