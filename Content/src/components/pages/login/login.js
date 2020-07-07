/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Image, Dimensions} from 'react-native';
import LoginBackground from './loginBackground';
import * as Constants from '../../../constants/constants';
import PButton from '../../../widgets/Button/pButton';

const Login = props => {
  var icon = require('../../../assets/iconLogin.png');
  global.isAdmin = false;
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
          title="As Admin"
          onPress={() => {
            props.navigation.navigate('StateList');
            global.isAdmin = true;
          }}
          viewStyle={{
            backgroundColor: '#ffffff',
            width: '75%',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
          textStyle={{color: Constants.textColor1, fontFamily: 'Roboto'}}
          elementStyle={{flexDirection: 'row', justifyContent: 'center'}}
        />
        <PButton
          title="As User"
          onPress={() => props.navigation.navigate('StateList')}
          viewStyle={{
            backgroundColor: '#ffffff',
            width: '75%',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
          textStyle={{color: Constants.textColor1, fontFamily: 'Roboto'}}
          elementStyle={{flexDirection: 'row', justifyContent: 'center'}}
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
