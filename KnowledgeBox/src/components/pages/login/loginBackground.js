/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Constants from '../../../constants/constants';

const LoginBackground = () => {
  return (
    <LinearGradient
      colors={[Constants.gradientColor1, Constants.gradientColor2]}
      style={{height: '100%', borderBottomLeftRadius: 40}}>
      <View style={{alignItems: 'center'}}>
        <Text
          style={{
            fontFamily: 'Roboto-Medium',
            fontSize: 18,
            marginTop: 20,
            color: 'white',
          }}>
          Login
        </Text>
      </View>
      <View style={{alignItems: 'center', justifyContent: 'flex-start'}} />
    </LinearGradient>
  );
};

export default LoginBackground;
