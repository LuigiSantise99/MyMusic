import React, { useState } from 'react';
import { StyleSheet, View, Button, Text, Image, ImageBackground } from 'react-native';
import { Input } from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';

function SongSearch({ navigation }) {

  const [textArtist, onChangeTextArtist] = useState('');
  const [textSong, onChangeTextSong] = useState('');

  const [isValidArtist, setIsValidArtist] = useState(true);
  const [isValidSong, setIsValidSong] = useState(true);
  const errorMessageArtist = isValidArtist ? '' : 'Enter something!';
  const errorMessageSong = isValidSong ? '' : 'Enter something!';
  const xColorArtist = textArtist != '' ? 'grey' : '#EDE7F6';
  const xColorSong = textSong != '' ? 'grey' : '#EDE7F6';

  return (
    <View style={styles.container}>
      <View style={{ padding: 10 }}>
        <Text style={styles.textTitle}>
          Insert artist name and song name which you want to see video and lyrics:
      </Text>
        <Input
          placeholder="Artist's name"
          style={styles.input}
          onChangeText={onChangeTextArtist}
          value={textArtist}
          errorMessage={errorMessageArtist}
          rightIcon={  
            <AntDesign
              name='close'
              color={xColorArtist}
              size={24}
              onPress={() => onChangeTextArtist('')}
            />
          }
        />
        <Input
          placeholder="Song's name"
          style={styles.input}
          onChangeText={onChangeTextSong}
          value={textSong}
          errorMessage={errorMessageSong}
          rightIcon={
            <AntDesign
              name='close'
              color={xColorSong}
              size={24}
              onPress={() => onChangeTextSong('')}
            />
          }
        />
        <View style={styles.button}>
          <Button
            title="SEARCH"
            color='#673AB7'
            onPress={() => {
              if (textArtist.trim() == "" && textSong.trim() == "") {
                onChangeTextArtist('')
                setIsValidArtist(false)
                onChangeTextSong('')
                setIsValidSong(false)
              }
              else if (textArtist.trim() == "") {
                onChangeTextArtist('')
                setIsValidArtist(false)
                setIsValidSong(true)
              }
              else if (textSong.trim() == "") {
                onChangeTextSong('')
                setIsValidSong(false)
                setIsValidArtist(true)
              }
              else {
                navigation.navigate('Search song', { textArtist, textSong })
                onChangeTextArtist('')
                onChangeTextSong('')
                setIsValidSong(true)
                setIsValidArtist(true)
              }
            }}
          />
        </View>
      </View>
      <Image
        source={require('../../img/background.png')}
        style={styles.image}
      />
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDE7F6'
  },
  textTitle: {
    fontSize: 16,
    alignItems: 'center',
    textAlign: 'center',
    padding: 25
  },
  button: {
    marginTop: 10,
    marginLeft: 40,
    marginRight: 40,
  },
  image: {
    marginTop: 33.1,
    width: '100%',
    height: '40%'
  }
});

export default SongSearch;