import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TextInput, TouchableOpacity, StyleSheet, Dimensions, Modal, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const largura = Dimensions.get('screen').width;

export default function TelaPeixe({ navigation, route }) {
  const { user } = route.params;


  const [dados, setDados] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // Filtros
  const [filtros, setFiltros] = useState({
    pesoMin: '',
    pesoMax: '',
    tamanhoMin: '',
    tamanhoMax: '',
    anzol: '',
    epoca: '',
    profundidadeMin: '',
    profundidadeMax: '',
    horario: '',
  });

  const ip_maquina = '192.168.1.4';

  const fetchPeixes = async () => {
    try {
      const response = await fetch(`http://${ip_maquina}:3000/api/buscapeixe`);
      const data = await response.json();
      setDados(data);
    } catch (error) {
      console.error('Erro ao buscar peixes:', error);
    }
  };



  useEffect(() => {
    fetchPeixes();
  }, []);

  const filteredData = dados.filter(peixe => {
    const {
      pesoMin, pesoMax, tamanhoMin, tamanhoMax, anzol, epoca, profundidadeMin, profundidadeMax, horario
    } = filtros;

    return (
      peixe.nome_peixe.toLowerCase().includes(searchText.toLowerCase()) &&
      (!pesoMin || peixe.peso_min >= parseFloat(pesoMin)) &&
      (!pesoMax || peixe.peso_max <= parseFloat(pesoMax)) &&
      (!tamanhoMin || peixe.tamanho_min >= parseFloat(tamanhoMin)) &&
      (!tamanhoMax || peixe.tamanho_max <= parseFloat(tamanhoMax)) &&
      (!anzol || peixe.anzol === anzol) &&
      (!epoca || peixe.epoca.includes(epoca)) &&
      (!profundidadeMin || peixe.profundidade_min >= parseFloat(profundidadeMin)) &&
      (!profundidadeMax || peixe.profundidade_max <= parseFloat(profundidadeMax)) &&
      (!horario || peixe.horario.includes(horario))
    );
  });

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => navigation.navigate('TelaDetalhesPeixe', { peixe: item, user: user })}>
        <Image source={{ uri: item.img_peixe }} style={styles.image} />
        <Text style={styles.cardText}>{item.nome_peixe}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container_1}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar"
          value={searchText}
          onChangeText={text => setSearchText(text)}
        />
        <TouchableOpacity style={styles.searchButton} onPress={() => setModalVisible(true)}>
          <Image style={{ width: 20, height: 20 }} source={require('../../assets/funil.png')} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
      />

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Filtros</Text>

          {/* Grupo: Peso */}
          <View style={styles.filterGroup}>
            <TextInput
              style={styles.filterInput}
              placeholder="Peso Min(Kg)"
              value={filtros.pesoMin}
              onChangeText={(text) => setFiltros(prev => ({ ...prev, pesoMin: text }))}
            />
            <TextInput
              style={styles.filterInput}
              placeholder="Peso Max(Kg)"
              value={filtros.pesoMax}
              onChangeText={(text) => setFiltros(prev => ({ ...prev, pesoMax: text }))}
            />
          </View>

          {/* Grupo: Tamanho */}
          <View style={styles.filterGroup}>
            <TextInput
              style={styles.filterInput}
              placeholder="Tamanho Min(Cm)"
              value={filtros.tamanhoMin}
              onChangeText={(text) => setFiltros(prev => ({ ...prev, tamanhoMin: text }))}
            />
            <TextInput
              style={styles.filterInput}
              placeholder="Tamanho Max(Cm)"
              value={filtros.tamanhoMax}
              onChangeText={(text) => setFiltros(prev => ({ ...prev, tamanhoMax: text }))}
            />
          </View>

          {/* Grupo: Anzol */}


          {/* Grupo: Época */}
          <View style={styles.filterGroup}>
            <Text>Escolha a Época:</Text>
            <Picker
              selectedValue={filtros.epoca}
              style={styles.picker}
              onValueChange={(itemValue) => setFiltros(prev => ({ ...prev, epoca: itemValue }))}
            >
              <Picker.Item label="Selecione a Época" value="" />
              <Picker.Item label="Verão" value="Verão" />
              <Picker.Item label="Outono" value="Outono" />
              <Picker.Item label="Inverno" value="Inverno" />
              <Picker.Item label="Primavera" value="Primavera" />
            </Picker>
          </View>

          {/* Grupo: Horário */}
          <View style={styles.filterGroup}>
            <Text>Escolha o Horário:</Text>
            <Picker
              selectedValue={filtros.horario}
              style={styles.picker}
              onValueChange={(itemValue) => setFiltros(prev => ({ ...prev, horario: itemValue }))}
            >
              <Picker.Item label="Selecione o Horário" value="" />
              <Picker.Item label="Manhã" value="Manhã" />
              <Picker.Item label="Tarde" value="Tarde" />
              <Picker.Item label="Noite" value="Noite" />
            </Picker>
          </View>

          <Button title="Aplicar Filtros" onPress={() => setModalVisible(false)} />
          <Button title="Cancelar" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container_1: {
    flex: 1, padding: 10,
    backgroundColor: '#f2f2f2'
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 0
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10
  },
  searchButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ffff',
    borderRadius: 5
  },
  card: {
    backgroundColor: '#fff',
    flex: 1,
    margin: 5,
    borderRadius: 5,
    overflow: 'hidden',
    alignItems: 'center',
    maxWidth: 180
  },
  image: {
    width: 200,
    height: 100
  },
  cardText: {
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modalContent: {
    flex: 1,
    padding: 20
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  filterGroup: {
    marginBottom: 15
  },
  filterInput: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5
  },
  picker: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5
  },
});
