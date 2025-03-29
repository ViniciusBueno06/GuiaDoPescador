// FavoriteButton.js
import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

ip_maquina = ''  //ip da maquina

const Favoritar = (props) => {
  useEffect(() => {
    setIsFavorite(props.estadoEstrela)
  }, [props.estadoEstrela])
  console.log(props)
  // const [isFavorite, setIsFavorite] = useState(props.estadoEstrela);
  const [isFavorite, setIsFavorite] = useState();
  const [user, setUser] = useState(props.usuario)
  const [idPeixe, setIdPeixe] = useState(props.idPeixe)
  console.log((props.estadoEstrela))
  console.log("estado da estrela dentro do componente:", isFavorite)

  const add_favorito = async () => {
    try {
      const response = await fetch(`http://${ip_maquina}:3000/add_fav`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "id_user": user, "id_peixe": idPeixe }),
      });
      if (!response.ok) {
        throw new Error('Erro');
      }
      const data = await response.json();
    } catch (error) {
      console.error('Erro ao buscar peixes:', error);
    }
  }
  const tirar_favorito = async () => {
    try {
      const response = await fetch(`http://${ip_maquina}:3000/tirar_fav`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "id_user": user, "id_peixe": idPeixe }),
      });
      if (!response.ok) {
        throw new Error('Erro');
      }
      const data = await response.json();
    } catch (error) {
      console.error('Erro ao buscar peixes:', error);
    }
  }

  const toggleFavorite = () => {
    if (isFavorite) {
      setIsFavorite(!isFavorite);
      tirar_favorito()
    } else {
      setIsFavorite(!isFavorite);
      add_favorito()
    }
  };

  return (
    <TouchableOpacity onPress={toggleFavorite} style={{ flexDirection: 'row', alignItems: 'center', marginTop: -7 }}>
      <Icon
        name={isFavorite ? 'star' : 'star-o'}
        size={30}
        color={isFavorite ? '#E6CC02' : 'black'}

      />

    </TouchableOpacity>
  );
};

export default Favoritar;
