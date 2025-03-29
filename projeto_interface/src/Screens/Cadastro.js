import { useState } from 'react';
import { View, StyleSheet, Text, Dimensions, Image } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import AwesomeAlert from 'react-native-awesome-alerts';

const logo = require('../../assets/logo.png');
const largura = Dimensions.get('screen').width;
const altura = Dimensions.get('screen').height;
const ip_maquina = '192.168.1.4';

export default function Cadastro({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const adicionarCadastro = async () => {
    if (!isValidEmail(email)) {
      setAlertType('warning');
      setAlertMessage('Por favor, insira um email válido.');
      setShowAlert(true);
      return;
    }

    if (senha.length < 6) {
      setAlertType('warning');
      setAlertMessage('A senha deve ter pelo menos 6 caracteres.');
      setShowAlert(true);
      return;
    }

    // Verificar se o email já está em uso
    try {
      const emailCheckResponse = await fetch(`http://${ip_maquina}:3000/api/verificar_email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (emailCheckResponse.status === 409) {
        const data = await emailCheckResponse.json();
        setAlertType('error');
        setAlertMessage(data.msg);
        setShowAlert(true);
        return;
      }
    } catch (error) {
      console.error('Erro ao verificar email:', error.message);
      setAlertType('error');
      setAlertMessage('Erro ao verificar email. Tente novamente.');
      setShowAlert(true);
      return;
    }

    // Se tudo estiver válido, tentar cadastrar o usuário
    try {
      const response = await fetch(`http://${ip_maquina}:3000/api/cadastro_usuario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, email, senha }),
      });

      if (!response.ok) {
        throw new Error('Credenciais inválidas');
      }

      const data = await response.json();
      setAlertType('success');
      setAlertMessage('Seu cadastro foi realizado com sucesso!');
      setShowAlert(true);
    } catch (error) {
      console.error('Erro ao fazer cadastro:', error.message);
      setAlertType('error');
      setAlertMessage('Houve um problema ao realizar o cadastro. Por favor, tente novamente.');
      setShowAlert(true);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    if (alertType === 'success') {
      navigation.navigate('Home');
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={logo} />
      <View style={styles.view_inputs}>
        <Text style={styles.txt_cabecalho}>Cadastre-se</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          label="Nome de usuário"
          placeholder='Digite seu nome'
          textColor='#1a1a1a'
          placeholderTextColor={'#c5c5c5b9'}
          underlineColor='#077e0f'
          activeUnderlineColor='#036800'
          left={<TextInput.Icon icon="account" color={"#626262"} />}
        />
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          label="Email"
          placeholder='Email pessoal'
          textColor='#1a1a1a'
          placeholderTextColor={'#c5c5c5b9'}
          underlineColor='#077e0f'
          activeUnderlineColor='#036800'
          left={<TextInput.Icon icon="at" color={"#626262"} />}
        />
        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          label="Senha"
          secureTextEntry={true}
          labelStyle={{ color: 'white' }}
          placeholder='Senha'
          textColor='#1a1a1a'
          placeholderTextColor={'#c5c5c5b9'}
          underlineColor='#077e0f'
          activeUnderlineColor='#036800'
          left={<TextInput.Icon icon="lock-outline" color={"#626262"} />}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Button
            labelStyle={{ fontSize: 18 }}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: largura / 4,
              backgroundColor: 'red',
              height: 50,
              borderRadius: 10
            }}
            icon="arrow-left-bold-box-outline"
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
            onPress={adicionarCadastro}
          >
            Cadastrar
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
    flexDirection: 'center',
    alignItems: 'center'
  },
  logo: {
    width: 200,
    height: 130,
    marginTop: 50,
    marginBottom: 50
  },
  botao: {
    width: largura / 2.1,
    backgroundColor: '#166716',
    borderRadius: 10,
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
  txt_cabecalho: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 32,
    alignSelf: 'flex-start',
    paddingLeft: 16,
    textAlign: 'center',
    marginBottom: 10
  },
  view_inputs: {
    width: largura / 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    height: altura / 2,
  },
  input: {
    width: 300,
    height: altura / 15,
    margin: 10,
    paddingLeft: 10
  }
});
