/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Image, Dimensions} from 'react-native';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import LoginBackground from './loginBackground';
import * as Constants from '../../../constants/constants';

const Login = () => {
	var icon = require('../../../assets/iconLogin.png');
	return (
		<>
			<View style={{ flex: 46 }}>
				<LoginBackground />
			</View>
			<View
				style={{
					flex: 10,
					backgroundColor: Constants.gradientColor2
				}}
			>
				<View
					style={{
						borderTopRightRadius: 40,
						height: '100%',
						backgroundColor: '#fff'
					}}
				/>
			</View>
			<View
				style={{
					flex: 44,
					backgroundColor: 'white',
					justifyContent: 'center',
					alignItems: 'center'
				}}
			>
        <GoogleSigninButton
          style={{ width: 250, height: 48 }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
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
					alignItems: 'center'
				}}
				resizeMode="contain"
			/>
		</>
	);
};

export default Login;
