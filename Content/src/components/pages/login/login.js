/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {
  View,
  Image,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import LoginBackground from './loginBackground';
import * as Constants from '../../../constants/constants';
import PButton from '../../../widgets/Button/pButton';
import Icon from 'react-native-vector-icons/Entypo';
import axios from 'axios';

const Login = props => {
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
        {/* <PButton
          title="Login as Admin"
          onPress={() => {
            //storeCookieData(0);
            global.user = {id: 1, isAdmin: 1};
            props.navigation.navigate('State');
            //global.isAdmin = true;
          }}
          viewStyle={styles.buttonViewStyle}
          textStyle={styles.buttonTextStyle}
          elementStyle={styles.buttonElementStyle}
        />
        <PButton
          title="Login as User"
          onPress={() => {
            //storeCookieData(0);
            global.user = {id: 1, isAdmin: 0};
            props.navigation.navigate('State');
          }}
          viewStyle={styles.buttonViewStyle}
          textStyle={styles.buttonTextStyle}
          elementStyle={styles.buttonElementStyle}
        /> */}
        <View
          style={{
            marginTop: 30,
            justifyContent: 'flex-end',
            alignSelf: 'flex-end',
          }}
          flexDirection="row">
          <TouchableOpacity
            onPress={() => {
              global.user=null;
              props.navigation.replace('State');
            }}
            flexDirection="row">
            <Text style={{color: Constants.textColor1, fontSize: 10}}>
              Skip
              <Icon name="chevron-right" size={20} />
            </Text>
          </TouchableOpacity>
        </View>
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
  buttonParentView: {
    flex: 44,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default Login;
