import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import AwesomeAlert from 'react-native-awesome-alerts';

const ip_maquina = '';  //ip da maquina

const TelaEditarPerfil = ({ navigation, route }) => {
  const { user } = route.params;
  
  // Estados para os campos de nome, email e senha
  const [nome, setNome] = useState(user.nome);
  const [login, setLogin] = useState(user.login);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  // Estados para controle de alerta
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  // Função para validar a senha atual
  const verificarSenhaAtual = async () => {
    try {
      const response = await axios.post(`http://${ip_maquina}:3000/api/validar_senha`, {
        id_user: user.id_user,
        senha_atual: senhaAtual,
      });

      if (response.status === 200) {
        return true; // Senha atual está correta
      } else {
        setAlertType('error');
        setAlertMessage('A senha atual está incorreta.');
        setShowAlert(true);
        return false;
      }
    } catch (error) {
      console.error("Erro ao verificar senha atual:", error);
      setAlertType('error');
      setAlertMessage('Erro ao verificar senha atual. Tente novamente.');
      setShowAlert(true);
      return false;
    }
  };

  // Função para atualizar o perfil
  const atualizarPerfil = async () => {
    // Verifica se a nova senha tem pelo menos 6 caracteres
    if (novaSenha.length < 6) {
      setAlertType('error');
      setAlertMessage('A nova senha deve ter pelo menos 6 caracteres.');
      setShowAlert(true);
      return;
    }

    // Verifica se a nova senha é igual à confirmação
    if (novaSenha !== confirmarSenha) {
      setAlertType('error');
      setAlertMessage('As senhas não coincidem.');
      setShowAlert(true);
      return;
    }

    // Verifica a senha atual
    const senhaValida = await verificarSenhaAtual();
    if (!senhaValida) {
      return;
    }

    try {
      const response = await axios.post(`http://${ip_maquina}:3000/api/atualizar_usuario`, {
        id_user: user.id_user,
        nome,
        senha: novaSenha || senhaAtual, // Se não houver nova senha, mantém a atual
      });

      if (response.status === 200) {
        setAlertType('success');
        setAlertMessage('Perfil atualizado com sucesso.');
        setShowAlert(true);
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      setAlertType('error');
      setAlertMessage('Erro ao atualizar perfil.');
      setShowAlert(true);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    if (alertType === 'success') {
      navigation.goBack(); // Volta para a tela anterior em caso de sucesso
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

      <Text style={styles.label}>Nome:</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Digite o seu nome"
      />

      <Text style={styles.label}>E-mail Atual:</Text>
      <TextInput
        style={styles.input}
        value={login}
        editable={false} // O email/login não pode ser alterado diretamente
      />

      <Text style={styles.label}>Senha Atual:</Text>
      <TextInput
        style={styles.input}
        value={senhaAtual}
        onChangeText={setSenhaAtual}
        secureTextEntry
        placeholder="Digite a senha atual"
      />

      <Text style={styles.label}>Nova Senha:</Text>
      <TextInput
        style={styles.input}
        value={novaSenha}
        onChangeText={setNovaSenha}
        secureTextEntry
        placeholder="Digite a nova senha"
      />

      <Text style={styles.label}>Confirmar Nova Senha:</Text>
      <TextInput
        style={styles.input}
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        secureTextEntry
        placeholder="Confirme a nova senha"
      />

      <TouchableOpacity style={styles.button} onPress={atualizarPerfil}>
        <Text style={styles.buttonText}>Salvar Alterações</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonCancel}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Cancelar</Text>
      </TouchableOpacity>

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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#F9F9F9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
    backgroundColor: '#FFF',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonCancel: {
    backgroundColor: '#f44336',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default TelaEditarPerfil;
