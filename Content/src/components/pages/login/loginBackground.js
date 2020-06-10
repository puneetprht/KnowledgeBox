import React from 'react';
import {View, Image, Text} from 'react-native';
import ContainerGradient from '../../../widgets/Theme/containerGradient';
import LinearGradient from 'react-native-linear-gradient';
import PButton from '../../../widgets/Button/pButton';
import * as Constants from '../../../constants/constants';

const LoginBackground = () => {
  var icon = require('../../../assets/iconLogin.png');
  return (
    <LinearGradient
      colors={[Constants.gradientColor1, Constants.gradientColor2]}
      style={{height: '100%', borderBottomLeftRadius: 40}}>
      <View style={{alignItems: 'center'}}>
        <Text style={{fontSize: 20, marginTop: 20, color: 'white'}}>Login</Text>
      </View>
      <View style={{alignItems: 'center', justifyContent: 'flex-start'}} />
    </LinearGradient>
  );
};

export default LoginBackground;
