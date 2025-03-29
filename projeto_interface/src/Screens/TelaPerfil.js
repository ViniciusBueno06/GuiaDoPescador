import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Image, Modal, FlatList } from 'react-native';
import axios from 'axios';
import AwesomeAlert from 'react-native-awesome-alerts';

// IP da máquina para chamadas API
const ip_maquina = '';  //ip da maquina

// Definindo um objeto estático para as imagens de perfil
const imagensPredefinidas = {
  'foto-1.png': require('../../assets/foto_perfil/foto-1.png'),
  'foto-2.png': require('../../assets/foto_perfil/foto-2.png'),
  'foto-3.png': require('../../assets/foto_perfil/foto-3.png'),
  'foto-4.png': require('../../assets/foto_perfil/foto-4.png'),
  'foto-5.png': require('../../assets/foto_perfil/foto-5.png'),
  'foto-6.png': require('../../assets/foto_perfil/foto-6.png'),
  'foto-7.png': require('../../assets/foto_perfil/foto-7.png'),
  'foto-8.png': require('../../assets/foto_perfil/foto-8.png'),
  'foto-9.png': require('../../assets/foto_perfil/foto-9.png'),
  'foto-10.png': require('../../assets/foto_perfil/foto-10.png'),
  'foto-11.png': require('../../assets/foto_perfil/foto-11.png'),
  'foto-12.png': require('../../assets/foto_perfil/foto-12.png'),
  'foto-13.png': require('../../assets/foto_perfil/foto-13.png'),
  'foto-14.png': require('../../assets/foto_perfil/foto-14.png'),
  'foto-15.png': require('../../assets/foto_perfil/foto-15.png'),
};

const TelaPerfil = ({ navigation, route }) => {
  const { user } = route.params;
  const [profileImage, setProfileImage] = useState(require('../../assets/user.png'));
  const [modalVisible, setModalVisible] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  // Carregar a imagem de perfil
  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await axios.get(`http://${ip_maquina}:3000/api/get_imagem_perfil?id_user=${user.id_user}`);
        const imagePath = response.data.imagem_perfil; // Nome da imagem retornada pela API

        // Verifica se a imagem existe nas predefinidas
        if (imagePath && imagensPredefinidas[imagePath]) {
          setProfileImage(imagensPredefinidas[imagePath]); // Atualiza com a imagem estática
        } else {
          setProfileImage(require('../../assets/user.png')); // Imagem padrão caso não exista
        }
      } catch (error) {
        console.error("Erro ao carregar a imagem de perfil:", error);
        setProfileImage(require('../../assets/user.png')); // Imagem padrão em caso de erro
      }
    };

    fetchProfileImage();
  }, [user.id_user]);

  // Selecionar imagem e atualizar perfil
  const selecionarImagem = async (imagem) => {
    console.log(`Imagem selecionada: ${imagem}`);

    const imagemSelecionada = imagensPredefinidas[imagem];
    setProfileImage(imagemSelecionada);  // Atualiza a imagem de perfil
    setModalVisible(false);  // Fecha o modal

    try {
      await axios.post(`http://${ip_maquina}:3000/api/atualizar_foto_perfil`, {
        id_user: user.id_user,
        imagem_perfil: imagem,
      });
      setAlertType('success');
      setAlertMessage('Foto de perfil atualizada!');
      setShowAlert(true);
    } catch (error) {
      setAlertType('error');
      setAlertMessage('Erro ao atualizar foto de perfil.');
      setShowAlert(true);
    }
  };

  // Fechar o alerta e realizar navegação se necessário
  const handleCloseAlert = () => {
    setShowAlert(false);
    if (alertType === 'success') {
      navigation.navigate('TelaPerfil', { user }); // Redireciona para a tela de perfil
    }
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity onPress={() => setModalVisible(true)}>
        {profileImage ? (
          <Image source={profileImage} style={styles.profileImage} />
        ) : (
          <Text style={styles.noProfileImage}>Selecione uma foto de perfil</Text>
        )}</TouchableOpacity>
      <Text style={styles.userName}>{user.nome}</Text>
      <Text style={styles.userLogin}>{user.login}</Text>
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Editar foto de perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TelaEditarPerfil', { user: user })}>
        <Text style={styles.buttonText}>Editar Perfil</Text>
      </TouchableOpacity>

      {/* Modal para selecionar imagem */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <FlatList
            data={Object.keys(imagensPredefinidas)} // Exibe as chaves (nomes das imagens)
            keyExtractor={(item) => item}
            numColumns={3}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => selecionarImagem(item)}>
                <Image
                  source={imagensPredefinidas[item]} // Mostra as imagens no modal
                  style={styles.thumbnail}
                />
              </TouchableOpacity>
            )}
          />
          <Button style={styles.buttonFechar} title="Fechar" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>

      {/* Alerta de sucesso ou erro */}
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title={alertType === 'success' ? 'Sucesso' : alertType === 'error' ? 'Erro' : 'Aviso'}
        message={alertMessage}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor={alertType === 'success' ? '#28a745' : alertType === 'error' ? '#dc3545' : '#ffc107'}
        onConfirmPressed={handleCloseAlert}
      />
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userLogin: {
    fontSize: 18,
    color: '#555',
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 90,
    marginBottom: 20,

  },
  noProfileImage: {
    fontSize: 16,
    color: '#777',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 12,
    marginVertical: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
  },
  thumbnail: {
    width: 80,
    height: 80,
    margin: 5,
    borderRadius: 5,
  },
  buttonFechar: {
    marginTop: 20,
    backgroundColor: 'gray',
    padding: 12,
    borderRadius: 5,
  },
});

export default TelaPerfil;
