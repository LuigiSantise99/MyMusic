import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button } from 'react-native';
import { Input } from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const ManageProfile = () => {

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [isValidPassword, setIsValidPassword] = useState(true);
  const errorMessagePassword = isValidPassword ? '' : "Passwords don't match or not valid!";

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        setEmail(user.email)
        const userRef = firestore().collection('users').doc(user.uid)
        userRef
          .onSnapshot((querySnapshot) => {

            setFullName(querySnapshot.data().fullName)
          })
      }
    })
    return unsubscribe;
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#EDE7F6' }}>
      <View style={{ flex: 0.15, flexDirection: 'row' }}>
        <Text style={{ marginVertical: 20, fontSize: 16, marginHorizontal: 20 }}>
          Name: {'\n'}
          Email:
        </Text>
        <Text style={{ marginTop: 20, fontSize: 16 }}>
          {fullName} {'\n'}
          {email}
        </Text>
      </View>
      <View
        style={{ borderBottomColor: 'black', borderBottomWidth: 0.9, marginHorizontal: 10 }}
      />
      <View style={{ flex: 0.85, marginTop: 15, marginHorizontal: 15 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}>
          Change password
        </Text>
        <Input
          secureTextEntry
          placeholder='Insert new password'
          onChangeText={(text) => setNewPassword(text)}
          value={newPassword}
        />
        <Input
          secureTextEntry
          placeholder='Confirm new password'
          onChangeText={(text) => setConfirmNewPassword(text)}
          value={confirmNewPassword}
          errorMessage={errorMessagePassword}
        />
        <View style={{ marginTop: 10, marginLeft: 40, marginRight: 40, marginBottom: 50 }}>
          <Button
            title='CHANGE PASSWORD'
            color='#673AB7'
            onPress={() => {
              if (newPassword == confirmNewPassword && (newPassword != '' && confirmNewPassword != '')) {
                auth().currentUser.updatePassword(newPassword)
                  .then(() => {
                    alert('Updated password')
                    setIsValidPassword(true)
                    setNewPassword('')
                    setConfirmNewPassword('')
                  })
                  .catch(error => {
                    setIsValidPassword(false)
                    setNewPassword('')
                    setConfirmNewPassword('')
                  })
              } else {
                setIsValidPassword(false)
                setNewPassword('')
                setConfirmNewPassword('')
              }
            }}
          />
        </View>
      </View>
    </ScrollView>
  )
}

export default ManageProfile;