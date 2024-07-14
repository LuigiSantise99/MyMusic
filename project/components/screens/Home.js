import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, ScrollView, Text } from 'react-native';
import { StackActions } from '@react-navigation/native';
import { Card } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';

function Home({ navigation }) {

  const ButtonSong = (textArtist, textSong) => {
    navigation.dispatch(StackActions.push('Search song', { textArtist, textSong }))
  }

  const ButtonArtist = (textArtist) => {
    navigation.dispatch(StackActions.push('Search artist', textArtist))
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../../img/home.png')}
        style={{
          width: '100%',
          height: '41%'
        }}
      />
      <ScrollView style={styles.scroll}>
        <Text style={styles.title}>
          Suggested song by MyMusic team
              </Text>
        <View
          style={styles.titleRow}
        />
        <View style={styles.cards}>
          <Card>
            <Card.Title
              title='Yellow'
              subtitle='Coldplay'
              right={() =>
                <FontAwesome5
                  name='headphones-alt'
                  color='#673AB7'
                  size={30}
                  onPress={() => ButtonSong('Coldplay', 'Yellow')}
                  style={styles.headphones}
                />
              }
            />
          </Card>
        </View>
        <View style={styles.cards}>
          <Card>
            <Card.Title
              title='Demons'
              subtitle='Imagine Dragons'
              right={() =>
                <FontAwesome5
                  name='headphones-alt'
                  color='#673AB7'
                  size={30}
                  onPress={() => ButtonSong('Imagine Dragons', 'Demons')}
                  style={styles.headphones}
                />
              }
            />
          </Card>
        </View>
        <View style={styles.cards}>
          <Card>
            <Card.Title
              title='Fall'
              subtitle='Eminem'
              right={() =>
                <FontAwesome5
                  name='headphones-alt'
                  color='#673AB7'
                  size={30}
                  onPress={() => ButtonSong('Eminem', 'Fall')}
                  style={styles.headphones}
                />
              }
            />
          </Card>
        </View>

        <Text style={styles.title}>
          Suggested artist by MyMusic team
              </Text>
        <View
          style={styles.titleRow}
        />
        <View style={styles.cards}>
          <Card>
            <Card.Title
              title='Rihanna'
              right={() =>
                <Feather
                  name='file-text'
                  color='#673AB7'
                  size={30}
                  onPress={() => ButtonArtist('Rihanna')}
                  style={styles.headphones}
                />
              }
            />
          </Card>
        </View>
        <View style={styles.cards}>
          <Card>
            <Card.Title
              title='The Beatles'
              right={() =>
                <Feather
                  name='file-text'
                  color='#673AB7'
                  size={30}
                  onPress={() => ButtonArtist('The Beatles')}
                  style={styles.headphones}
                />
              }
            />
          </Card>
        </View>
        <View style={styles.cards}>
          <Card>
            <Card.Title
              title='Nirvana'
              right={() =>
                <Feather
                  name='file-text'
                  color='#673AB7'
                  size={30}
                  onPress={() => ButtonArtist('Nirvana')}
                  style={styles.headphones}
                />
              }
            />
          </Card>
        </View>
        <View style={styles.space} />
      </ScrollView>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#EDE7F6'
  },
  scroll: {
    paddingVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingBottom: 7,
    paddingTop: 15
  },
  titleRow: {
    borderBottomColor: 'black',
    borderBottomWidth: 0.9,
    marginHorizontal: 10,
    marginBottom: 5
  },
  cards: {
    paddingHorizontal: 16,
    paddingVertical: '1%'
  },
  headphones: {
    justifyContent: 'center',
    padding: 20
  },
  space: {
    marginBottom: 20
  }
});

export default Home;