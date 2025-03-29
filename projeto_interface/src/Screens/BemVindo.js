import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
const largura = Dimensions.get('screen').width;
const altura = Dimensions.get('screen').height;

ip_maquina = ''  //ip da maquina

const BemVindo = ({ navigation, route }) => {
  const { user } = route.params;

  const [profileImage, setProfileImage] = useState(require('../../assets/user.png'));

  const dados = user;

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

  const [displayText, setDisplayText] = useState('');
  const fullText = `Olá ${user.nome.charAt(0).toUpperCase() + user.nome.slice(1)}!`;

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText((prev) => prev + fullText.charAt(index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [fullText]);


  const fetchProfileImage = async () => {
    try {
      const response = await axios.get(`http://${ip_maquina}:3000/api/get_imagem_perfil?id_user=${user.id_user}`);
      const imagePath = response.data.imagem_perfil;

      // Verifica se a imagem existe nas predefinidas
      if (imagePath && imagensPredefinidas[imagePath]) {
        setProfileImage(imagensPredefinidas[imagePath]);
      } else {
        setProfileImage(require('../../assets/user.png'));
      }
    } catch (error) {
      console.error("Erro ao carregar a imagem de perfil:", error);
      setProfileImage(require('../../assets/user.png'));
    }
  };  

  useFocusEffect(
    useCallback(() => {
      fetchProfileImage();
    }
    , [user]));

  const handleExit = () => {
    Alert.alert(
      "Sair",
      "Você realmente deseja sair?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Sair",
          onPress: () => navigation.navigate('Home')
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.ViewPai}>
        <View style={styles.ViewHome}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop:30,
            width: largura,
            marginRight:20
          }}>
            <TouchableOpacity onPress={handleExit}>
              <Icon name="exit" size={30} color="#000000" style={styles.icon} />
            </TouchableOpacity>
            <Image style={styles.LogoImg} source={require('../../assets/logo.png')} />
          </View>
        </View>

        <View style={styles.ViewImg}>
          {/* foto de perfil  */}
          <Image source={profileImage}
            style={styles.ImagemPerfil}
          />
          <Text style={styles.TextHome}>{displayText}</Text>
        </View>

        <View style={styles.ViewBtnHome}>
          <TouchableOpacity style={styles.btnHomeTopo} onPress={() => navigation.navigate('TelaPeixe', { user: user.id_user })}>
            <View style={styles.btnContent}>
              <Text style={styles.btnText}>Peixes</Text>
              <Icon name="search" size={20} color="#000" style={styles.icon} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnHome} onPress={() => navigation.navigate('TelaFavoritos', { user: user.id_user })}>
            <View style={styles.btnContent}>
              <Text style={styles.btnText}>Peixes favoritados</Text>
              <Icon name="star" size={20} color="#000" style={styles.icon} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnHomeFinal} onPress={() => navigation.navigate('TelaPerfil', { user: dados })}>
            <View style={styles.btnContent}>
              <Text style={styles.btnText}>Perfil</Text>
              <Icon name="person" size={20} color="#000" style={styles.icon} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  ImagemPerfil: {
    borderRadius: 100,
    width: 100,
    height: 100,
    margin: 20,
    borderColor:'#dbdbdb',
    borderWidth:1
  },
  ViewPai: {
    width: largura,
    height: altura,
  },
  ViewImg: {
    alignItems: 'center'
  },
  ViewHome: {
    backgroundColor: '#243770',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  TextHome: {
    fontSize: 36,
    color: '#000000',
    textAlign: 'center',
    fontWeight: 'bold',
    padding: 10,
  },
  btnHomeTopo: {
    backgroundColor: '#e6e6e6',
    width: '75%',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 0.5,
    borderColor: '#959595',
    marginTop: 10,
  },
  LogoImg: {
    height: 50,
    width: 50,
    
  },
  btnHome: {
    backgroundColor: '#e6e6e6',
    width: '75%',
    padding: 20,
    borderWidth: 0.5,
    borderColor: '#959595',

  },
  btnHomeFinal: {
    backgroundColor: '#e6e6e6',
    width: '75%',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 0.5,
    borderColor: '#959595',

  },
  ViewBtnHome: {
    backgroundColor: '#0000ff00',
    alignItems: 'center',
    marginTop: 50,
  },
  btnContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnText: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  icon: {
    marginLeft: 20,
  },
});

export default BemVindo;
