/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, Image, Dimensions, Text, TextInput,Alert, AsyncStorage, KeyboardAvoidingView} from 'react-native';
import LoginBackground from './loginBackground';
import * as Constants from '../../../constants/constants';
import PButton from '../../../widgets/Button/pButton';

const Login = props => {
  var icon = require('../../../assets/iconLogin.png');
  global.isAdmin = false;
  const [editMode, setEditMode] = useState(0);
  const [email, setEmail] = useState(0);
  const [password, setPassword] = useState(0);

  const storeCookieData = async (isAdmin) => {
    try {
      await AsyncStorage.setItem(
        'userId',
        1
      );
      await AsyncStorage.setItem(
        'userAdmin',
        isAdmin
      );
    } catch (error) {
      // Error saving data
    }
  };

  return (
    <>
      <View style={{flex: 46}}>
        <LoginBackground />
      </View>
      <View
        style={{
          flex: 10,
          backgroundColor: Constants.gradientColor2,
        }}>
        <View
          style={{
            borderTopRightRadius: 40,
            height: '100%',
            backgroundColor: '#fff',
          }}
        />
      </View>
      <View
        style={{
          flex: 44,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <PButton
          title="Login as Admin"
          onPress={() => {
            //storeCookieData(0);
            props.navigation.navigate('StateList',{user:{id:1, isAdmin: 1}});
            //global.isAdmin = true;
          }}
          viewStyle={{

            width: '75%',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
          textStyle={{fontFamily: 'Roboto'}}
          elementStyle={{flexDirection: 'row', justifyContent: 'center', margin: 20}}
        />
        <PButton
          title="Login as User"
          onPress={() => {
            //storeCookieData(0);
            props.navigation.navigate('StateList',{user:{id:1, isAdmin: 0}}
            );}}
          viewStyle={{
            width: '75%',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
          textStyle={{fontFamily: 'Roboto'}}
          elementStyle={{flexDirection: 'row', justifyContent: 'center',margin: 20}}
        />
      </View>
      <Image
        source={icon}
        style={{
          flex: 1,
          width: Dimensions.get('window').width * 0.7,
          height: Dimensions.get('window').width * 0.7,
          marginHorizontal: Dimensions.get('window').width * 0.15,
          marginTop: Dimensions.get('window').height * 0.075,
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        resizeMode="contain"
      />
    </>
  );
};

export default Login;
