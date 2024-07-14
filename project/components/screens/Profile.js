import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, ScrollView, Image, ImageBackground } from 'react-native';
import { Input } from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Profile({ navigation }) {

  //index
  const [user, setUser] = useState(null)

  const logOut = () => {
    auth()
      .signOut()
      .then(() => emptyInputText());
  }

  useEffect(() => {
    const usersRef = firestore().collection('users');
    auth().onAuthStateChanged(user => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then((document) => {
            const userData = document.data()
            setUser(userData)
          })
          .catch((error) => {
            alert(error)
          });
      }
    });
  }, []);

  //login
  const [emailLogin, setEmailLogin] = useState('')
  const [passwordLogin, setPasswordLogin] = useState('')

  const [isValidEmailLogin, setIsValidEmailLogin] = useState(true)
  const [isValidPasswordLogin, setIsValidPasswordLogin] = useState(true)
  const errorMessageEmailLogin = isValidEmailLogin ? '' : 'Please enter a valid email address'
  const errorMessagePasswordLogin = isValidPasswordLogin ? '' : 'Please enter your password'


  const onLoginPress = () => {
    auth()
      .signInWithEmailAndPassword(emailLogin, passwordLogin)
      .then((response) => {
        const uid = response.user.uid
        const usersRef = firestore().collection('users')
        usersRef
          .doc(uid)
          .get()
          .then(firestoreDocument => {
            if (!firestoreDocument.exists) {
              alert("User does not exist anymore.")
              return;
            }
            const user = firestoreDocument.data()
            setUser(user)
          })
          .catch(error => {
            alert(error)
          });
      })
      .catch(error => {
        if (error.code === 'auth/invalid-email') {
          setIsValidEmailLogin(false)
          setPasswordLogin('')
          setEmailLogin('')
        }
        if (error.code === 'auth/wrong-password') {
          setIsValidPasswordLogin(false)
          setPasswordLogin('')
        }
        if (error.code === 'auth/user-not-found') {
          setIsValidEmailLogin(false)
          setIsValidPasswordLogin(false)
          setPasswordLogin('')
        }
      })
  }

  //signin
  const [formReg, setFormReg] = useState(false)

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [isValidEmail, setIsValidEmail] = useState(true)
  const [isValidPassword, setIsValidPassword] = useState(true)
  const [isValidConfirmPassword, setIsValidConfirmPassword] = useState(true)
  const errorMessageEmail = isValidEmail ? '' : "That email address is invalid or it's already in use!";
  const errorMessagePassword = isValidPassword ? '' : 'Password should be at least 6 characters!';
  const errorMessageConfirmPassword = isValidConfirmPassword ? '' : "Passwords don't match!";

  const onRegisterPress = () => {
    if (password !== confirmPassword) {
      cancelErrorMessage()
      setIsValidConfirmPassword(false)
      setConfirmPassword('')
      return
    }
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        const uid = response.user.uid
        const data = {
          uid: uid,
          email,
          fullName,
        };
        const usersRef = firestore().collection('users')
        usersRef
          .doc(uid)
          .set(data)
          .then(() => {
            setUser(data)
          })
          .catch((error) => {
            alert(error)
          });
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use' || error.code === 'auth/invalid-email') {
          setIsValidEmail(false)
          setIsValidPassword(true)
          setIsValidConfirmPassword(true)
        }
        if (error.code === 'auth/weak-password') {
          setIsValidPassword(false)
          setPassword('')
          setConfirmPassword('')
          setIsValidEmail(true)
        }
      });
  }

  // other
  const onFooterLinkPress = () => {
    setFormReg(!formReg)
    cancelErrorMessage()
    emptyInputText()
  }

  const emptyInputText = () => {
    setEmailLogin('')
    setPasswordLogin('')
    setFullName('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
  }

  const cancelErrorMessage = () => {
    setIsValidEmailLogin(true)
    setIsValidPasswordLogin(true)
    setIsValidEmail(true)
    setIsValidPassword(true)
    setIsValidConfirmPassword(true)
  }


  //screen
  return (
    <View style={styles.container}>
      {user ? (
        <View style={{ flex: 1, backgroundColor: '#EDE7F6', justifyContent: 'space-between' }}>
          <View style={{ flex: 0.45, justifyContent: 'flex-start', paddingHorizontal: 10 }}>
            <View style={{ flex: 0.2, marginTop: 10, justifyContent: 'center' }}>
              <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold', fontStyle: 'italic' }}>
                Hello {user.fullName}, {'\n'} Welcome in your MyMusic profile
              </Text>
            </View>
            <View style={{ flex: 0.75, flexDirection: 'row' }}>
              <View style={{ flex: 0.5 }}>
                <Image
                  source={require('../../img/logo.png')}
                  style={{ width: '100%', height: '100%' }}
                />
              </View>
              <View style={{ flex: 0.5, justifyContent: 'space-evenly', marginVertical: 30 }}>
                <Button
                  title='MY ACCOUNT'
                  color='#673AB7'
                  onPress={() => {
                    navigation.navigate('Manage profile')
                  }}
                />
                <Button
                  title='LOGOUT'
                  color='#673AB7'
                  onPress={() => {
                    logOut()
                    setUser(null)
                    setFormReg(false)
                  }}
                />
              </View>
            </View>
          </View>
          <View style={{ flex: 0.54, justifyContent: 'space-between' }}>
            <View style={{ flex: 0.30 }}>
              <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold', marginTop: 5, color: '#673AB7' }}>
                MyMusic Favourites
              </Text>
              <Text style={{ textAlign: 'center', fontSize: 16, marginTop: 10, fontStyle: 'italic' }}>
                With MyMusic, you can access your {'\n'} favourite songs and artists everywhere
              </Text>
            </View>
            <View style={{ flex: 0.68, flexDirection: 'row' }}>
              <ImageBackground
                source={require('../../img/background.png')}
                style={{ flex: 1, resizeMode: 'cover', justifyContent: 'center' }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: '35%' }}>
                  <Button
                    title='MY SONGS'
                    color='#673AB7'
                    onPress={() => {
                      navigation.navigate('Favorite song')
                    }}
                  />
                  <Button
                    title='MY ARTISTS'
                    color='#673AB7'
                    onPress={() => {
                      navigation.navigate('Favorite artist')
                    }}
                  />
                </View>
              </ImageBackground>
            </View>
          </View>
        </View>
      ) : (
        formReg ? (
          <ScrollView>
            <Text style={styles.textTitle}>
              Do you have a MyMusic account? {'\n'}
              Sign in immediately!
            </Text>
            <View style={styles.button}>
              <Button
                title='SIGN IN'
                color='#673AB7'
                onPress={() => {
                  emptyInputText()
                  onFooterLinkPress()
                }}
              />
            </View>
            <View
              style={styles.titleRow}
            />
            <Text style={styles.textTitle}>
              Create your MyMusic account
            </Text>
            <Input
              placeholder='Full Name'
              onChangeText={(text) => setFullName(text)}
              value={fullName}
            />
            <Input
              placeholder='E-mail'
              onChangeText={(text) => setEmail(text)}
              value={email}
              errorMessage={errorMessageEmail}
            />
            <Input
              secureTextEntry
              placeholder='Password'
              onChangeText={(text) => setPassword(text)}
              value={password}
              errorMessage={errorMessagePassword}
            />
            <Input
              secureTextEntry
              placeholder='Confirm Password'
              onChangeText={(text) => setConfirmPassword(text)}
              value={confirmPassword}
              errorMessage={errorMessageConfirmPassword}
            />
            <View style={styles.button}>
              <Button
                title='REGISTER'
                color='#673AB7'
                onPress={() => {
                  if (fullName == "" || email == "" || password == "" || confirmPassword == "") {
                    alert("compila ogni spazio") 
                  } else {
                    onRegisterPress()
                  }
                }}
              />
            </View>
          </ScrollView>
        ) : (
          <View>
            <Text style={styles.textTitle}>
              Sign in with your MyMusic Account
            </Text>
            <Input
              placeholder='E-mail'
              onChangeText={(text) => setEmailLogin(text)}
              value={emailLogin}
              errorMessage={errorMessageEmailLogin}
              leftIcon={
                <MaterialCommunityIcons
                  name='email'
                  size={22}
                  color='grey'
                />
              }
            />
            <Input
              secureTextEntry
              placeholder='Password'
              onChangeText={(text) => setPasswordLogin(text)}
              value={passwordLogin}
              errorMessage={errorMessagePasswordLogin}
              leftIcon={
                <MaterialCommunityIcons
                  name='lock'
                  size={22}
                  color='grey'
                />
              }
            />
            <View style={styles.button}>
              <Button
                title='SIGN IN'
                color='#673AB7'
                onPress={() => {
                  if (emailLogin == "" && passwordLogin == "") {
                    setIsValidEmailLogin(false)
                    setIsValidPasswordLogin(false)
                  }
                  else if (emailLogin == "") {
                    setIsValidEmailLogin(false)
                    setIsValidPasswordLogin(true)
                    setPasswordLogin('')
                  }
                  else if (passwordLogin == "") {
                    setIsValidPasswordLogin(false)
                    setIsValidEmailLogin(true)
                  }
                  else {
                    onLoginPress()
                    cancelErrorMessage()
                    emptyInputText()
                  }
                }}
              />
            </View>
            <View
              style={styles.titleRow}
            />
            <Text style={styles.textTitle}>
              Don't you have a MyMusic account?
              Create it immediately!
            </Text>
            <View style={styles.button}>
              <Button
                title='CREATE NEW ACCOUNT'
                color='#673AB7'
                onPress={() => {
                  onFooterLinkPress()
                }}
              />
            </View>
          </View>
        )
      )}
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDE7F6'
  },
  textTitle: {
    fontSize: 18,
    alignItems: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    padding: 30
  },
  button: {
    marginTop: 10,
    marginLeft: 40,
    marginRight: 40,
    marginBottom: 50
  },
  titleRow: {
    borderBottomColor: 'black',
    borderBottomWidth: 0.9,
    marginHorizontal: 10
  },
  textUpProfile: {
    fontSize: 16,
    alignItems: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    paddingTop: 30
  },
  logo: {
    width: '50%',
    height: '100%'
  },
  logoSection: {
    flexDirection: 'row',
    marginHorizontal: 25,
    justifyContent: 'space-evenly',
    marginRight: 50
  },
  buttonSection: {
    marginVertical: 50,
    alignItems: 'center',
  }
});