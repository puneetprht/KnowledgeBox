/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
//import { TextInput } from 'react-native-paper';
import {
  View,
  Text,
  StatusBar,
  AsyncStorage,
  KeyboardAvoidingView,
  TextInput,
  Alert,
} from 'react-native';
import PButton from '../../../widgets/Button/pButton';
import axios from 'axios';

const SignUp = props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const sendCred = () => {
    axios
      .post('http://3.7.66.184:3000/user/authenticate', {
        email: email,
        password: password,
      })
      .then(response => {
        AsyncStorage.setItem('token', response.data.token);
        props.navigation.navigate('StateList');
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <KeyboardAvoidingView behavior="position">
      <StatusBar backgroundColor="blue" barStyle="light-content" />
      <View
        style={{
          borderBottomColor: 'blue',
          borderBottomWidth: 4,
          borderRadius: 10,
          marginLeft: 20,
          marginRight: 150,
          marginTop: 4,
        }}
      />
      <Text
        style={{
          fontSize: 20,
          marginLeft: 18,
          marginTop: 20,
        }}>
        Login with email
      </Text>
      <TextInput
        label="Email"
        mode="outlined"
        value={user.email}
        style={{marginLeft: 18, marginRight: 18, marginTop: 18}}
        theme={{colors: {primary: 'blue'}}}
        onChangeText={text => setEmail(text)}
      />
      <TextInput
        label="password"
        mode="outlined"
        secureTextEntry={true}
        value={user.password}
        onChangeText={text => {
          setPassword(text);
        }}
        style={{marginLeft: 18, marginRight: 18, marginTop: 18}}
        theme={{colors: {primary: 'blue'}}}
      />
      <PButton
        title="Sign In"
        onPress={() => {
          sendCred();
        }}
        viewStyle={{
          width: '50%',
          flexDirection: 'row',
          justifyContent: 'center',
        }}
        elementStyle={{
          flexDirection: 'row',
          justifyContent: 'center',
          margin: 5,
        }}
      />
    </KeyboardAvoidingView>
  );
};

export default SignUp;
