import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';

const ip_maquina = '192.168.1.4';
const largura = Dimensions.get('screen').width;

const TelaFavoritos = ({ route, navigation }) => {
  const { user } = route.params;
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar favoritos do usuário
  const fetchFavoritos = async () => {
    try {
      const response = await fetch(`http://${ip_maquina}:3000/api/favoritos?id_user=${user}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar favoritos');
      }

      const data = await response.json();
      setFavoritos(data);
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Atualizar os favoritos toda vez que o usuário mudar
  useFocusEffect(
    useCallback(() => {
      fetchFavoritos();
    }, [user])
  );

  // Renderiza cada item de peixe favoritado
  const renderFavorito = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('TelaDetalhesPeixe', { peixe: item, user })}>
      <View style={styles.card}>
        <Image source={{ uri: item.img_peixe }} style={styles.image} />
        <Text style={styles.nomePeixe}>{item.nome_peixe}</Text>
        <Text style={styles.descricao}>{item.desc_peixe}</Text>
      </View>
    </TouchableOpacity>
  );

  // Exibe o indicador de carregamento enquanto os dados são obtidos
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Botão de voltar */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={30} color="#000" />
      </TouchableOpacity>

      {/* Título da tela */}
      <Text style={styles.title}>Peixes Favoritados</Text>

      {/* Lista de peixes favoritados */}
      <FlatList
        data={favoritos}
        keyExtractor={(item) => item.id_peixe.toString()}
        renderItem={renderFavorito}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2', // Cor de fundo mais suave
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    marginBottom: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333', // Cor mais suave para o título
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  image: {
    width: largura * 0.8, // Ajusta a imagem para se adequar ao tamanho da tela
    height: 160,
    borderRadius: 10,
    marginBottom: 12,
  },
  nomePeixe: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  descricao: {
    fontSize: 16,
    textAlign: 'center',
    color: '#777',
    marginTop: 5,
  },
});

export default TelaFavoritos;
