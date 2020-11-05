/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Image, Dimensions, StyleSheet} from 'react-native';
import LoginBackground from './loginBackground';
import * as Constants from '../../../constants/constants';
import PButton from '../../../widgets/Button/pButton';

const Login = (props) => {
  var icon = require('../../../assets/iconLogin.png');

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
      <View style={styles.buttonParentView}>
        <PButton
          title="Sign In."
          onPress={() => {
            props.navigation.navigate('SignIn');
          }}
          viewStyle={styles.buttonViewStyle}
          textStyle={styles.buttonTextStyle}
          elementStyle={styles.buttonElementStyle}
        />
        <PButton
          title="Sign Up!"
          onPress={() => {
            props.navigation.navigate('SignUp');
          }}
          viewStyle={styles.buttonViewStyle}
          textStyle={styles.buttonTextStyle}
          elementStyle={styles.buttonElementStyle}
        />
        <PButton
          title="Skip for now"
          onPress={() => {
            global.user = null;
            props.navigation.navigate('State', {
              screen: 'TopicList',
            });
          }}
          viewStyle={styles.buttonViewStyle2}
          textStyle={styles.buttonTextStyle2}
          elementStyle={styles.buttonElementStyle}
        />
      </View>
      <Image source={icon} style={styles.imageStyle} resizeMode="contain" />
    </>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    flex: 1,
    width: Dimensions.get('window').width * 0.7,
    height: Dimensions.get('window').width * 0.7,
    marginHorizontal: Dimensions.get('window').width * 0.15,
    marginTop: Dimensions.get('window').height * 0.075,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonElementStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 20,
  },
  buttonTextStyle: {fontFamily: 'Roboto'},
  buttonViewStyle: {
    width: '75%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonTextStyle2: {
    fontFamily: 'Roboto',
    color: Constants.textColor1,
  },
  buttonViewStyle2: {
    width: '75%',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  buttonParentView: {
    flex: 44,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default Login;
