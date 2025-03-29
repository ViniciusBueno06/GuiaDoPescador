// TelaDetalhesPeixe.js
import React, { useEffect, useState } from 'react';

import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { List } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import Favoritar from '../Components/Favoritar';

const largura = Dimensions.get('screen').width
const altura = Dimensions.get('screen').height
const ip_maquina = '192.168.1.4';

const TelaDetalhesPeixe = ({ route }) => {

  const [expanded, setExpanded] = React.useState(true);
  const handlePress = () => setExpanded(!expanded);
  const { peixe, user } = route.params;
  const [estado, setEstado] = useState(false);


  const verificarFav = async () => {
    try {

      const response = await fetch(`http://${ip_maquina}:3000/verificar_fav/?id_user=${user}&id_peixe=${peixe.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      return data


    } catch (error) {

    }
  }



  useEffect(() => {
    const estado_att = async () => {
      const resultado = await verificarFav();
      setEstado(Boolean(resultado));
      console.log("Novo estado:", resultado)
    };

    estado_att();
  }, [user, peixe]);




  console.log("estado atualizado:", estado)

  const obterQuatroPrimeiros = (texto) => {
    const texto_com_string = String(texto)
    return texto_com_string.substring(0, 4); // ou texto.slice(0, 4);
  };

  return (
  <ScrollView>
    <View style={styles.container} >
      <Image source={{ uri: peixe.img_peixe }} style={styles.image} />


      <View style={styles.ViewPeixe}>
        <View style={styles.ViewNomePeixe}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.nome}>{peixe.nome_peixe}</Text><Favoritar usuario={user} idPeixe={peixe.id} estadoEstrela={estado} /></View>
          <Text style={styles.descricao}>{peixe.desc_peixe}</Text>
        </View>

        <View style={styles.ViewCompPeixe}>
          <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Especificações</Text>
          <Text>Tamanho: {peixe.tamanho_min}cm a {peixe.tamanho_max}cm</Text>
          <Text>Peso: {obterQuatroPrimeiros(peixe.peso_min)}kg a {obterQuatroPrimeiros(peixe.peso_max)}kg</Text>

        </View>
      </View>
      <List.Section style={styles.ListClass} title='Dicas' >

            <List.Accordion
              style={styles.listStyle}
              title="Isca"
              left={props => <List.Icon {...props} icon="fish" />}>
              <List.Item title={peixe.isca_pref} style={styles.listStyle} />
            </List.Accordion>

            <List.Accordion
              style={styles.listStyle}
              title="Anzol"
              left={props => <List.Icon {...props} icon="hook" />}
              onPress={handlePress}>
              <List.Item title={peixe.anzol.split(',')[0]} style={styles.listStyle} />

              
            </List.Accordion>
            <List.Accordion
              style={styles.listStyle}
              title="Local de pesca"
              left={props => <List.Icon {...props} icon="hook" />}
              onPress={handlePress}>
              <List.Item title={peixe.local_pesca} style={styles.listStyle} />

              
            </List.Accordion>
            <List.Accordion
              style={styles.listStyle}
              title="Técnica"
              left={props => <List.Icon {...props} icon="hook" />}
              onPress={handlePress}>
              <List.Item title={peixe.tecnica} style={styles.listStyle} />
            </List.Accordion>
          
        
          
        
      </List.Section>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: largura,
    height: 250,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginBottom: 20,
  },
  nome: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingRight: 10,
    maxWidth: largura / 1.1,

  },
  descricao: {
    fontSize: 16,
    textAlign: 'left',
  },
  texto_nome: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    width: largura / 1.1,
    margin: 10,

  },
  ViewPeixe: {

    width: '100%',
    flexDirection: 'column',

    // Para distribuir o espaço entre nome/descrição e tamanhos
    padding: 10,
    borderRadius: 5,
  },
  ViewNomePeixe: {
    width: '100%', // Ajuste a largura como preferir
    justifyContent: 'center'
  },
  ViewCompPeixe: {
    alignItems: 'flex-start', // Alinha os tamanhos à direita
    paddingTop: 10,
    width: '60%'
  },
  ListClass: {
    width: '100%',

  },
  listStyle: {

  }
});

export default TelaDetalhesPeixe;
