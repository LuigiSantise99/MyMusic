import React, { useState } from 'react';
import { StyleSheet, View, Button, Text, Image } from 'react-native';
import { Input } from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';

function ArtistSearch({ navigation }) {

  const [textArtist, onChangeTextArtist] = useState('');
  const [isValid, setIsValid] = useState(true);
  const errorMessage = isValid ? '' : 'Enter something!';
  const xColor = textArtist != '' ? 'grey' : '#EDE7F6';

  return (
    <View style={styles.container}>
      <View style={{ padding: 10 }}>
        <Text style={styles.textTitle}>
          Insert artist name which you want to see details:
        </Text>
        <Input
          placeholder="Artist's name"
          onChangeText={onChangeTextArtist}
          value={textArtist}
          errorMessage={errorMessage}
          rightIcon={
            <AntDesign
              name='close'
              color={xColor}
              size={24}
              onPress={() => onChangeTextArtist('')}
            />}
        />
        <View style={styles.button}>
          <Button
            title='SEARCH'
            color='#673AB7'
            onPress={() => {
              if (textArtist.trim() != "") {
                navigation.navigate('Search artist', textArtist)
                onChangeTextArtist('')
                setIsValid(true)
              } else {
                onChangeTextArtist('')
                setIsValid(false)
              }
            }}
          />
        </View>
      </View>
      <Image
        source={require('../../img/background.png')}
        style={styles.image}
      />
    </View>
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
    marginTop: 109.5,
    width: '100%',
    height: '40%',
  }
});

export default ArtistSearch;