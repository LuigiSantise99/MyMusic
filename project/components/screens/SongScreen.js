import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, Text, ActivityIndicator, View, Button } from 'react-native';
import { StackActions } from '@react-navigation/native';
import { Card } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import YoutubePlayer from "react-native-youtube-iframe";
import FontAwesome from 'react-native-vector-icons/FontAwesome';


const SongScreen = ({ route, navigation }) => {

  const { textArtist, textSong } = route.params;

  const lyricsUrl = 'https://api.lyrics.ovh/v1/';
  const geniusUrl = 'https://api.genius.com';
  const geniusToken = 'ATLEl9evISXiSVlbNK5y3uZZEDF_Z1d4jJuiXenpfxARKC428iz5kjLvYsQzQyGe';

  const [isLoading, setLoading] = useState(true);

  const [dataLyrics, setDataLyrics] = useState([]);


  const [videoYTId, setVideoYTId] = useState([]);
  const [videoNotFound, setVideoNotFound] = useState(false);

  const [artistName, setArtistName] = useState([]);
  const [songName, setSongName] = useState([]);

  const [uid, setUid] = useState();
  const [documentId, setDocumentId] = useState();

  const [signedUser, isSignedUser] = useState();
  const visibleIcon = signedUser ? 30 : 0;

  const [preferred, setPreferred] = useState();
  const star = preferred ? 'star' : 'star-o';

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        isSignedUser(true)
        setUid(user.uid)
        const preferredSongRef = firestore().collection('users').doc(uid).collection('preferredSong')
        preferredSongRef
          .get()
          .then(doc => {
            doc.forEach((result) => {
              if (result.data().artist == artistName && result.data().song == songName) {
                setDocumentId(result.id)
                setPreferred(true)
              }
            })
          })
      } else {
        isSignedUser(false)
      }
    })
    return unsubscribe;
  });

  const LeftCardContent = () =>
    <FontAwesome
      name={star}
      color='#673AB7'
      size={visibleIcon}
      onPress={() => {
        const preferredSongRef = firestore().collection('users').doc(uid).collection('preferredSong')
        if (preferred) {
          setPreferred(false)
          preferredSongRef
            .doc(documentId)
            .delete()
            .then(() => {
              console.log('Artist remove')
            })
            .catch((error) => alert(error))
        } else {
          setPreferred(true)
          preferredSongRef
            .doc()
            .set({
              song: songName,
              artist: artistName
            })
            .then(() => {
              console.log('Artist added in prefer')
              preferredSongRef
                .get()
                .then(doc => {
                  doc.forEach((result) => {
                    if (result.data().artist == artistName && result.data().song == songName) {
                      setDocumentId(result.id)
                    }
                  })
                })

            })
            .catch((error) => alert(error))
        }
      }}
      style={{ alignSelf: 'center' }}
    />

  const RightCardContent = () =>
    <View style={{ margin: '8%' }}>
      <Button
        title='ARTIST INFO'
        color='#673AB7'
        onPress={() => {
          navigation.dispatch(StackActions.push('Search artist', artistName))
        }}
      />
    </View>

  useEffect(async () => {

    fetch(geniusUrl + '/search?q=' + textSong, {
      headers: { 'Authorization': 'Bearer ' + geniusToken }
    })
      .then((response) => response.json())
      .then((data) => {

        for (const value of data.response.hits) {

          let firstArtist
          let secondArtist
          if ((value.result.title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() ==
            textSong.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()) &&
            (value.result.primary_artist.name.indexOf(' & ') != -1)) {
            firstArtist = value.result.primary_artist.name.substring(0, value.result.primary_artist.name.indexOf(' & '))
            secondArtist = value.result.primary_artist.name.substring(value.result.primary_artist.name.indexOf(' & ') + 3, value.result.primary_artist.name.length)

          }

          if ((value.result.title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() ==
            textSong.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()) &&
            (value.result.primary_artist.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() ==
              textArtist.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim() ||
              ((firstArtist.toLowerCase() == textArtist.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()) ||
                (secondArtist.toLowerCase() == textArtist.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim())))) {

            setArtistName(value.result.primary_artist.name)
            setSongName(value.result.title)

            return fetch(geniusUrl + value.result.api_path, {
              headers: { 'Authorization': 'Bearer ' + geniusToken }
            })
              .then((response) => response.json())
              .then((text) => {
                for (const value of text.response.song.media) {
                  if (value.provider == 'youtube') {
                    let id = value.url.substring(value.url.indexOf('?v=') + 3, value.url.length)
                    setVideoYTId(id)
                    setVideoNotFound(false)
                    //setVideoFound(true)
                  }
                }
              })
              .catch((error) => setVideoNotFound(true))
              .finally(() => setLoading(false))

          }
        }
      })
      .catch((error) =>setVideoNotFound(true))
      .finally(() => setLoading(false));

    fetch(lyricsUrl + textArtist + '/' + textSong)
      .then((response) => {
        if (response.status == 200)
          return response.json()
      })
      .then((text) => {
        setDataLyrics(text.lyrics.replace(/\n\n/g, '\n'))
      })
      .catch((error) => alert("The lyrics was not found"))
      .finally(() => setLoading(false));

  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator
            size='large'
            color='#673AB7'
          />
        </View>
      ) : (
        videoNotFound ? (
          <View style={styles.loading}>
            <Text>
              Sorry!
            </Text>
            <Text>
              Your request didin't produce any result
            </Text>
          </View>
        ) : (
          <View style={styles.screen}>
            <YoutubePlayer
              height={230}
              videoId={videoYTId}
            />
            <Card>
              <Card.Title
                title={songName}
                subtitle={artistName}
                left={LeftCardContent}
                right={RightCardContent}
              />
            </Card>
            <ScrollView>
              <Text style={styles.lyrics}>
                {dataLyrics}
              </Text>
            </ScrollView>
          </View>
        )
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#EDE7F6'
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  screen: {
    flex: 1
  },
  lyrics: {
    fontSize: 18,
    paddingHorizontal: '5%',
    paddingVertical: '3.5%'
  },
});

export default SongScreen;