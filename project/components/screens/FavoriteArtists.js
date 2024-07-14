import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, FlatList, TouchableHighlight } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { StackActions } from '@react-navigation/native';
import { Card } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const FavoriteArtists = ({ navigation }) => {

  const [arrayArtists, setArrayArtists] = useState([]);
  const [uid, setUid] = useState();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        setUid(user.uid)
        const preferredArtistRef = firestore().collection('users').doc(user.uid).collection('preferredArtist')
        preferredArtistRef
          .where('uid', '==', user.uid)
          .onSnapshot((querySnapshot) => {
            const artists = []
            querySnapshot.forEach(doc => {
              let data = { 'artist': doc.data().artist, 'id': doc.id }
              artists.push(data)
            })
            setArrayArtists(artists)
          })
      }
    })
    return unsubscribe;
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 0.7 }}>
        <FlatList
          data={arrayArtists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ paddingHorizontal: 16, paddingVertical: '1%' }}>
              <TouchableHighlight
                onPress={() => navigation.dispatch(StackActions.push('Search artist', item.artist))}
              >
                <Card>
                  <Card.Title
                    title={item.artist}
                    right={() =>
                      <MaterialIcons
                        name='delete'
                        color='#D21212'
                        size={30}
                        onPress={() => {
                          firestore()
                            .collection('users')
                            .doc(uid)
                            .collection('preferredArtist')
                            .doc(item.id)
                            .delete()
                            .then(() => {
                              console.log('Artist remove')
                            })
                            .catch((error) => alert(error))
                        }}
                        style={{ justifyContent: 'center', padding: 20 }}
                      />
                    }
                  />
                </Card>
              </TouchableHighlight>
            </View>
          )}
        />
      </View>
      <View style={{flex:0.3}}>
        <Image
        source={require('../../img/background.png')}
        style={{width:'100%', height:'100%'}}
        />
      </View>
    </View>
  )
}

export default FavoriteArtists;