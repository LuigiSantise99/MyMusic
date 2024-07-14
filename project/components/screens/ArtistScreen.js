import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ActivityIndicator, View, Image, Dimensions, FlatList } from 'react-native';
import { StackActions } from '@react-navigation/native';
import { Card } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const ArtistScreen = ({ route, navigation }) => {  

  const textArtist = route.params;

  const screen = Dimensions.get("screen");

  const geniusUrl = 'https://api.genius.com';
  const geniusToken = 'ATLEl9evISXiSVlbNK5y3uZZEDF_Z1d4jJuiXenpfxARKC428iz5kjLvYsQzQyGe';

  const [isLoading, setLoading] = useState(true);

  const [nameArtist, setNameArtist] = useState([]);
  const [picArtist, setPicArtist] = useState([]);
  const [bioArtist, setBioArtist] = useState([]);
  const [bioNotFound, setBioNotFound] = useState(true);

  const [topSongJson, setTopSongJson] = useState([]);
  const [idArtist, setIdArtist] = useState([]);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        isSignedUser(true)
        setUid(user.uid)
        const preferredArtistRef = firestore().collection('users').doc(uid).collection('preferredArtist')
        preferredArtistRef
          .get()
          .then(doc => {
            doc.forEach((result) => {
              if (result.data().uid == user.uid && result.data().artist == nameArtist) {
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

  const [uid, setUid] = useState();
  const [documentId, setDocumentId] = useState();

  const [signedUser, isSignedUser] = useState();
  const visibleIcon = signedUser ? 30 : 0;

  const [preferred, setPreferred] = useState();
  const star = preferred ? 'star' : 'star-o';

  const RightContent = () =>
    <FontAwesome
      name={star}
      color='#673AB7'
      size={visibleIcon}
      onPress={() => {
        const preferredArtistRef = firestore().collection('users').doc(uid).collection('preferredArtist')
        if (preferred) {
          setPreferred(false)
          preferredArtistRef
            .doc(documentId)
            .delete()
            .then(() => {
              console.log('Artist remove')
            })
            .catch((error) => alert(error))
        } else {
          setPreferred(true)
          preferredArtistRef
            .doc()
            .set({
              uid: uid,
              artist: nameArtist
            })
            .then(() => {
              console.log('Artist added in prefer')
              preferredArtistRef
                .get()
                .then(doc => {
                  doc.forEach((result) => {
                    if (result.data().uid == uid && result.data().artist == nameArtist) {
                      setDocumentId(result.id)
                    }
                  })
                })

            })
            .catch((error) => alert(error))
        }
      }}
      style={styles.star}
    />

  const ButtonSong = (textArtist, textSong) => {
    navigation.dispatch(StackActions.push('Search song', { textArtist, textSong }))
  }

  useEffect(async () => {
    await fetch(geniusUrl + '/search?q=' + textArtist, {
      headers: { 'Authorization': 'Bearer ' + geniusToken }
    })
      .then((response) => response.json())
      .then((data) => {

        setTopSongJson(data.response.hits)

        for (const value of data.response.hits) {

          if (value.result.primary_artist.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() ==
            textArtist.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()) {

            setNameArtist(value.result.primary_artist.name)
            setPicArtist(value.result.primary_artist.header_image_url)
            setIdArtist(value.result.primary_artist.id)

            return fetch(geniusUrl + value.result.primary_artist.api_path, {
              headers: { 'Authorization': 'Bearer ' + geniusToken }
            })
              .then((response) => response.json())
              .then((text) => {

                var buildBio = ""
                for (const child of text.response.artist.description.dom.children) {
                  if (child == '') {
                    buildBio = buildBio.concat('\n\n')
                  }
                  else if (child.tag == 'p') {
                    for (const childP of child.children) {
                      if (typeof childP == 'string')
                        buildBio = buildBio.concat(childP)
                      else {
                        if (childP.tag == 'a') {
                          for (const childA of childP.children) {
                            if (typeof childA == 'string')
                              buildBio = buildBio.concat(childA)
                            else {
                              if (childA.tag == 'em') {
                                for (const childEM of childA.children) {
                                  if (typeof childEM == 'string')
                                    buildBio = buildBio.concat(childEM)
                                }
                              }
                            }
                          }
                        }
                        else if (childP.tag == 'em') {
                          for (const childEM of childP.children) {
                            if (typeof childEM == 'string')
                              buildBio = buildBio.concat(childEM)
                            else {
                              if (childEM.tag == 'a') {
                                for (const childA of childEM.children) {
                                  if (typeof childA == 'string')
                                    buildBio = buildBio.concat(childA)
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
                if (buildBio != "" && buildBio != "?") {
                  setBioArtist(buildBio)
                  setBioNotFound(false)
                }

              })
              .catch((error) => console.log(error))
              .finally(() => setLoading(false))
          }
        }
      })
      .catch((error) => console.log(error))
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
        bioNotFound ? (
          <View style={styles.loading}>
            <Text>
              Sorry!
            </Text>
            <Text>
              Your request didin't produce any result
            </Text>
          </View>
        ) : (
          <FlatList
            ListHeaderComponent={
              <>
                <View style={styles.titleView}>
                  <Text style={styles.textTitle}>
                    {nameArtist}
                  </Text>
                  <RightContent />
                </View>
                <View
                  style={styles.titleRow}
                />
                <View style={{ padding: 10 }}>
                  <Image
                    source={{ uri: picArtist }}
                    style={[styles.image, { width: { screen }.width }]}
                  />
                  <Text style={styles.textBio}>
                    {bioArtist}
                  </Text>
                </View>
                <View style={{ paddingBottom: 20 }}>
                  <Text style={styles.titleTopSong}>
                    Top Song by {nameArtist}
                  </Text>
                  <View
                    style={styles.titleRow}
                  />
                </View>
              </>
            }
            data={topSongJson}
            keyExtractor={item => item.result.id}
            renderItem={({ item }) => (
              item.result.primary_artist.id == idArtist ?
                <View style={styles.card}>
                  <Card>
                    <Card.Title
                      title={item.result.title}
                      subtitle={item.result.primary_artist.name}
                      right={() =>
                        <FontAwesome5
                          name='headphones-alt'
                          color='#673AB7'
                          size={30}
                          onPress={() => ButtonSong(item.result.primary_artist.name, item.result.title)}
                          style={styles.headphones}
                        />
                      }
                    />
                  </Card>
                </View>
                : null
            )}
          />
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
  titleView: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  star: {
    alignSelf: 'center',
    paddingTop: 5
  },
  textTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    alignItems: 'flex-start',
    paddingBottom: 20,
    paddingTop: 20
  },
  titleRow: {
    borderBottomColor: 'black',
    borderBottomWidth: 0.9,
    marginHorizontal: 10
  },
  image: {
    height: 200,
    resizeMode: 'contain'
  },
  textBio: {
    fontSize: 16,
    color: 'black',
    padding: '5%',
    textAlign: 'justify'
  },
  titleTopSong: {
    padding: 10,
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 30
  },
  card: {
    paddingHorizontal: 16,
    paddingBottom: '2%'
  },
  headphones: {
    justifyContent: 'center',
    padding: 20
  },
});

export default ArtistScreen;