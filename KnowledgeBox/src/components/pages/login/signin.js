/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import PButton from '../../../widgets/Button/pButton';
import * as Constants from '../../../constants/constants';
import axios from '../../../services/axios';
import Icon from 'react-native-vector-icons/Ionicons';

const SignIn = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formValid, setFormValid] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isShow, setIsShow] = useState(false);

  const sendCred = () => {
    setIsSubmit(true);
    setIsError(false);
    axios
      .post('/user/authenticate', {
        email: email,
        password: password,
      })
      .then((response) => {
        //AsyncStorage.setItem('token', response.data.token);
        setEmail('');
        setPassword('');
        setFormValid(false);
        setIsSubmit(false);
        setIsError(false);
        global.user = response.data;
        if (global.user && global.user.stateId) {
          props.navigation.navigate('State', {
            screen: 'TopicList',
          });
        } else {
          props.navigation.navigate('State');
        }
      })
      .catch((err) => {
        setIsSubmit(false);
        setIsError(true);
        console.log(err);
      });
  };

  const checkFormValid = (text, type) => {
    switch (type) {
      case 'Email':
        setFormValid(text.length && password.length >= 8);
        break;
      case 'Password':
        setFormValid(email.length && text.length >= 8);
        break;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="height"
      style={{
        justifyContent: 'center',
        backgroundColor: 'white',
        height: '100%',
      }}>
      <Image
        source={require('../../../assets/icon.png')}
        style={{alignSelf: 'center', marginTop: -50}}
      />
      <Text
        style={{
          textAlign: 'center',
          fontFamily: 'z-arista.regular',
          fontSize: 40,
          color: Constants.textColor2,
          marginLeft: 18,
          marginBottom: 20,
        }}>
        Knowledge Box
      </Text>
      <TextInput
        label="Email"
        mode="outlined"
        autoCompleteType="email"
        maxLength={40}
        placeholder="Enter Registered Email."
        autoFocus={true}
        value={email}
        style={styles.text}
        theme={{colors: {primary: 'blue'}}}
        onChangeText={(text) => {
          setEmail(text);
          checkFormValid(text, 'Email');
        }}
      />
      <View style={{justifyContent: 'center'}}>
        <TextInput
          label="password"
          mode="outlined"
          secureTextEntry={!isShow}
          placeholder="Enter Password."
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            checkFormValid(text, 'Password');
          }}
          style={styles.text}
          theme={{colors: {primary: 'blue'}}}
        />
        <View
          style={{
            position: 'absolute',
            flex: 1,
            alignSelf: 'flex-end',
            paddingRight: 30,
            paddingTop: 15,
          }}>
          <TouchableOpacity
            style={{padding: 3}}
            onPress={() => setIsShow(!isShow)}>
            <Icon
              name={isShow ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              style={{
                color: Constants.textColor1,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>

      {isError ? (
        <View
          style={{
            justifyContent: 'center',
            alignContent: 'center',
            marginTop: 10,
          }}>
          <Text
            style={{
              fontFamily: 'Roboto',
              textAlign: 'center',
              fontSize: 13,
              color: 'red',
            }}>
            Wrong Email or Password.
          </Text>
        </View>
      ) : (
        <View />
      )}
      {isSubmit ? (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <PButton
          disable={!formValid}
          title="Sign In"
          onPress={() => {
            sendCred();
          }}
          viewStyle={{
            marginTop: 20,
            width: '50%',
            flexDirection: 'row',
            justifyContent: 'center',
            backgroundColor: !formValid ? '#5aa0ff' : Constants.textColor1,
          }}
          elementStyle={{
            flexDirection: 'row',
            justifyContent: 'center',
            margin: 5,
          }}
        />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  text: {
    marginLeft: 18,
    marginRight: 18,
    marginTop: 18,
    color: Constants.textColor1,
    fontFamily: 'Roboto-Medium',
    fontSize: 15,
    borderWidth: 2,
    borderColor: Constants.textColor1,
    borderRadius: 5,
  },
});
export default SignIn;
