import React, { useState, useEffect } from 'react';
import { View, Image, FlatList, TouchableHighlight } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { StackActions } from '@react-navigation/native';
import { Card } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const FavoriteSongs = ({ navigation }) => {

  const [arraySongs, setArraySongs] = useState([]);
  const [uid, setUid] = useState();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        setUid(user.uid)
        const preferredSongRef = firestore().collection('users').doc(user.uid).collection('preferredSong')
        preferredSongRef
          .onSnapshot((querySnapshot) => {
            const songs = []
            querySnapshot.forEach(doc => {
              let data = { 'artist': doc.data().artist, 'song': doc.data().song, 'id': doc.id }
              songs.push(data)
            })
            setArraySongs(songs)
          })
      }
    })
    return unsubscribe;
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 0.7 }}>
        <FlatList
          data={arraySongs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ paddingHorizontal: 16, paddingVertical: '1%' }}>
              <TouchableHighlight
                onPress={() => navigation.dispatch(StackActions.push('Search song', { textArtist: item.artist, textSong: item.song }))}
              >
                <Card>
                  <Card.Title
                    title={item.song}
                    subtitle={item.artist}
                    right={() =>
                      <MaterialIcons
                        name='delete'
                        color='#D21212'
                        size={30}
                        onPress={() => {
                          firestore()
                            .collection('users')
                            .doc(uid)
                            .collection('preferredSong')
                            .doc(item.id)
                            .delete()
                            .then(() => {
                              console.log('Song remove')
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
      <View style={{ flex: 0.3 }}>
        <Image
          source={require('../../img/background.png')}
          style={{ width: '100%', height: '100%' }}
        />
      </View>
    </View>
  )
}

export default FavoriteSongs;