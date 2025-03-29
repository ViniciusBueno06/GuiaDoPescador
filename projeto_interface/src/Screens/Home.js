import { React } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, Dimensions } from 'react-native'

import { Button } from 'react-native-paper';

const largura = Dimensions.get('screen').width
const altura = Dimensions.get('screen').height
const logo = require('../../assets/logo.png')
export default function Home({ navigation }) {
    return (
        <View style={styles.container}>
            <Image style={styles.logo} source={logo}></Image>

            <Button labelStyle={{ fontSize: 18 }} style={styles.botao} icon="login-variant" mode="contained" onPress={() => navigation.navigate('Login')}>
                Login
            </Button>
            <Button labelStyle={{ fontSize: 18 }} style={styles.botao} icon="account-plus" mode="contained" onPress={() => navigation.navigate('Cadastro')}>
                Cadastro
            </Button>

        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#dadada',
        justifyContent: 'center',
        alignItems: 'center',

    },
    cabecalho_cadastro: {
        height: 200
    },
    txt_cabecalho: {
        marginTop: 70,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 40,
        textAlign: 'center'
    },
    view_inputs: {
        width: largura,
        alignItems: 'center',
        justifyContent: 'flex-start',
        alignContent: 'center',
        alignSelf: 'center',
        
        

    },
    texto_input: {
        color: 'white',
        alignSelf: 'flex-start'

    },
    inputs: {
        width: 300,
        height: 40,
        backgroundColor: 'white',
        margin: 10,
        borderRadius: 10
    },
    txt_btn: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 20

    },
    logo: {
        width: 300,
        height: 250
    },
    botao: {
        width: largura / 1.8,
        backgroundColor: 'darkblue',
        borderRadius: 6,
        margin: 10,
        height: 50,
        justifyContent: 'center',

        shadowColor: "#000",
        shadowOffset: {
            width: 1,
            height: 7,
        },
        shadowOpacity: 0.41,
        shadowRadius: 9.11,

        elevation: 14,

    }
})