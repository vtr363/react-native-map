import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, PermissionsAndroid } from 'react-native';
import { Text, Button } from 'react-native-elements';
import localizacoes from './localizacoes';
import Geolocation from 'react-native-geolocation-service';


export default function App() {
  const [regiao, setRegiao] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 15,
    longitudeDelta: 15,
  });
  


  async function requisicaoLocalidade() {
    try {
      const garantia = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (garantia === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            setRegiao({ ...regiao, latitude, longitude });
          },
          (error) => console.error(error),
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
      } else {
        console.log('Localização negada.');
      }
    } catch (erro) {
      console.warn(erro);
    }
  }
  
  useEffect(() => {

    requisicaoLocalidade();
  });

  const moverMaravilha = (coord) => {
    setRegiao({ ...regiao, ...coord });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        <Text style={styles.tituloText}>
          localizacoes
        </Text>
      </Text>
      <MapView style={styles.mapa} region={regiao}>
        {localizacoes.map((maravilha, index) => (
          <Marker
            key={index}
            coordinate={maravilha.coordinates}
            title={maravilha.name}
          />
        ))}
      </MapView>

      <View style={styles.divisor}></View>

      
      <ButtonGroup botoes={localizacoes} moverMaravilha={moverMaravilha} />
      <Button 
        style={styles.botaoGrupo} 
        title={"sua localização"}
        onPress={requisicaoLocalidade} 
      />
    </View>
  );
}

function ButtonGroup({ botoes, moverMaravilha }) {
  return (
    <View style={styles.botaoGrupo}>
      {botoes.map((maravilha, index) => (
        <Button
          key={index}
          title={`${maravilha.name}`}
          onPress={() => moverMaravilha(maravilha.coordinates)}
          buttonStyle={styles.botao}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'black',
    marginTop: 30,
  },

  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },

  tituloText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },

  divisor: {
    borderTopColor: 'white',
    borderWidth: 1,
    marginTop: 20,
  },

  mapa: {
    flex: 1,
  },

  botaoGrupo: {
    flex: 1,
    alignItems: 'center',
  },

  botao: {
    margin: 5,
    backgroundColor: '#0078D7',
    borderWidth: 2,
    borderColor: '#s54b0f7',
    borderRadius: 9,
  },
});