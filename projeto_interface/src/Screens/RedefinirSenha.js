import { View, StyleSheet, Text, Dimensions, Image } from 'react-native';
import React, { useState } from 'react';
import { Button, TextInput } from 'react-native-paper';
import AwesomeAlert from 'react-native-awesome-alerts';

const largura = Dimensions.get('screen').width;
const altura = Dimensions.get('screen').height;
const logo = require('../../assets/logo.png');
const ip_maquina = '192.168.1.4';

export default function RedefinirSenha({ navigation }) {
  const [email, setEmail] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const enviarRedefinicao = async () => {
    if (!email) {
      setAlertType('warning');
      setAlertMessage('Por favor, insira seu email.');
      setShowAlert(true);
      return;
    }

    try {
      const response = await fetch(`http://${ip_maquina}:3000/api/redefinir_senha`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar a solicitação de redefinição de senha');
      }

      const data = await response.json();
      setAlertType('success');
      setAlertMessage('Instruções de redefinição de senha foram enviadas para seu email.');
      setShowAlert(true);
    } catch (error) {
      console.error('Erro ao enviar redefinição de senha:', error.message);
      setAlertType('error');
      setAlertMessage('Houve um problema ao enviar a solicitação. Tente novamente.');
      setShowAlert(true);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    if (alertType === 'success') {
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={logo} />

      <View style={styles.view_inputs}>
        <Text style={styles.txt_cabecalho}>Redefinir Senha</Text>

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
        />

        <Button
          labelStyle={{ fontSize: 18 }}
          style={styles.botao}
          icon="send"
          mode="contained"
          onPress={enviarRedefinicao}
        >
          Enviar
        </Button>
      </View>

      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title={alertType === 'success' ? 'Sucesso' : 'Erro'}
        message={alertMessage}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor={alertType === 'success' ? '#28a745' : '#dc3545'}
        onConfirmPressed={handleCloseAlert}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A8AAA7',
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
    marginBottom: 20
  },
  view_inputs: {
    width: largura / 1.1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  botao: {
    width: largura / 1.2,
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
  }
});
