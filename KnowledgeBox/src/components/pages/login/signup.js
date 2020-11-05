/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import axios from '../../../services/axios';
import PButton from '../../../widgets/Button/pButton';
import * as Constants from '../../../constants/constants';
import Icon from 'react-native-vector-icons/FontAwesome5';

const SignUp = (props) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  //  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(false);
  const [phoneNumberValid, setPhoneNumberValid] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isEmailExist, setIsEmailExist] = useState(false);

  const registerUser = () => {
    setIsSubmit(true);
    axios
      .post('/user/register', {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
      })
      .then((response) => {
        //await AsyncStorage.setItem('token', response.data.token);
        setIsSubmit(false);
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setPhoneNumber('');
        global.user = response;
        props.navigation.replace('State');
      })
      .catch((err) => {
        setIsSubmit(false);
        console.log(err.message);
        setIsEmailExist(true);
      });
  };

  /*const checkEmail = text => {
    //call backend to check email.
    setPasswordValid(validate(text));
  };*/

  const checkPassword = (text) => {
    if (text.length > 7) {
      setPasswordValid(true);
    } else {
      setPasswordValid(false);
    }
  };

  const checkConfirmPassword = (text, confirmText) => {
    if (text === confirmText && text.length >= 8) {
      setConfirmPasswordValid(true);
    } else {
      setConfirmPasswordValid(false);
    }
  };

  const checkPhoneNumber = (text) => {
    if (text.length === 10) {
      setPhoneNumberValid(true);
    } else {
      setPhoneNumberValid(false);
    }
  };

  const checkFormValid = (text, type) => {
    switch (type) {
      case 'FirstName':
        setFormValid(
          text.length &&
            lastName.length &&
            email.length &&
            passwordValid &&
            confirmPasswordValid &&
            phoneNumberValid,
        );
        break;
      case 'LastName':
        setFormValid(
          firstName.length &&
            text.length &&
            email.length &&
            passwordValid &&
            confirmPasswordValid &&
            phoneNumberValid,
        );
        break;
      case 'Email':
        setFormValid(
          firstName.length &&
            lastName.length &&
            text.length &&
            passwordValid &&
            confirmPasswordValid &&
            phoneNumberValid,
        );
        break;
      case 'Password':
        setFormValid(
          firstName.length &&
            lastName.length &&
            email.length &&
            text.length >= 8 &&
            text === confirmPassword &&
            phoneNumberValid,
        );
        break;
      case 'ConfirmPassword':
        setFormValid(
          firstName.length &&
            lastName.length &&
            email.length &&
            passwordValid &&
            text === password &&
            text.length >= 8 &&
            phoneNumberValid,
        );
        break;
      case 'PhoneNumber':
        setFormValid(
          firstName.length &&
            lastName.length &&
            email.length &&
            passwordValid &&
            confirmPasswordValid &&
            text.length === 10,
        );
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
        paddingBottom: 50,
      }}>
      <ScrollView>
        <Image
          source={require('../../../assets/icon.png')}
          style={{alignSelf: 'center', marginTop: 10}}
        />
        <Text
          style={{
            textAlign: 'center',
            fontFamily: 'z-arista.regular',
            fontSize: 40,
            color: Constants.textColor2,
            marginLeft: 18,
            marginBottom: 10,
          }}>
          Knowledge Box
        </Text>
        <TextInput
          label="FirstName"
          maxLength={40}
          placeholder="Enter First name."
          autoFocus={true}
          value={firstName}
          style={styles.text}
          theme={{colors: {primary: 'blue'}}}
          onChangeText={(text) => {
            setFirstName(text);
            checkFormValid(text, 'FirstName');
          }}
        />
        <TextInput
          label="LastName"
          maxLength={40}
          placeholder="Enter Last name."
          value={lastName}
          style={styles.text}
          theme={{colors: {primary: 'blue'}}}
          onChangeText={(text) => {
            setLastName(text);
            checkFormValid(text, 'LastName');
          }}
        />
        {/* <View style={{justifyContent: 'center'}}> */}
        <TextInput
          label="Email"
          keyboardType="email-address"
          maxLength={40}
          placeholder="Enter Valid Email."
          value={email}
          style={styles.text}
          theme={{colors: {primary: 'blue'}}}
          onChangeText={(text) => {
            setEmail(text);
            //checkEmail(text);
            checkFormValid(text, 'Email');
          }}
        />
        {/* <Icon
          name={emailValid ? 'check' : 'ban'}
          size={20}
          style={{
            position: 'absolute',
            flex: 1,
            alignSelf: 'flex-end',
            paddingRight: 30,
            paddingTop: 15,
            color: emailValid ? Constants.success : Constants.error,
          }}
        />
      </View> */}
        <View style={{justifyContent: 'center'}}>
          <TextInput
            label="password"
            mode="outlined"
            secureTextEntry={true}
            placeholder="Enter Password(Min 8 characters)."
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              checkPassword(text);
              checkConfirmPassword(text, confirmPassword);
              checkFormValid(text, 'Password');
            }}
            style={styles.text}
            theme={{colors: {primary: 'blue'}}}
          />
          <Icon
            name={passwordValid ? 'check' : 'ban'}
            size={20}
            style={{
              position: 'absolute',
              flex: 1,
              alignSelf: 'flex-end',
              paddingRight: 30,
              paddingTop: 15,
              color: passwordValid ? Constants.success : Constants.error,
            }}
          />
        </View>
        <View style={{justifyContent: 'center'}}>
          <TextInput
            label="ConfirmPassword"
            mode="outlined"
            secureTextEntry={true}
            placeholder="Confirm Password."
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              checkConfirmPassword(password, text);
              checkFormValid(text, 'ConfirmPassword');
            }}
            style={styles.text}
            theme={{colors: {primary: 'blue'}}}
          />
          <Icon
            name={confirmPasswordValid ? 'check-double' : 'ban'}
            size={20}
            style={{
              position: 'absolute',
              flex: 1,
              alignSelf: 'flex-end',
              paddingRight: 30,
              paddingTop: 15,
              color: confirmPasswordValid ? Constants.success : Constants.error,
            }}
          />
        </View>
        <View style={{justifyContent: 'center'}}>
          <TextInput
            label="PhoneNumber"
            maxLength={10}
            placeholder="Enter Phone number (No 0 or +91)."
            value={phoneNumber}
            style={styles.text}
            theme={{colors: {primary: 'blue'}}}
            keyboardType="phone-pad"
            onChangeText={(text) => {
              setPhoneNumber(text);
              checkPhoneNumber(text);
              checkFormValid(text, 'PhoneNumber');
            }}
          />
          <Icon
            name={phoneNumberValid ? 'check' : 'ban'}
            size={20}
            style={{
              position: 'absolute',
              flex: 1,
              alignSelf: 'flex-end',
              paddingRight: 30,
              paddingTop: 15,
              color: phoneNumberValid ? Constants.success : Constants.error,
            }}
          />
        </View>
        {isEmailExist ? (
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
                fontSize: 14,
                color: 'red',
              }}>
              Email already exists.
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
            title="Sign Up."
            onPress={() => {
              registerUser();
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  text: {
    marginLeft: 18,
    marginRight: 18,
    marginTop: 15,
    paddingLeft: 15,
    color: Constants.textColor1,
    fontFamily: 'Roboto-Medium',
    fontSize: 15,
    borderWidth: 2,
    borderColor: Constants.textColor1,
    borderRadius: 5,
  },
});

export default SignUp;
