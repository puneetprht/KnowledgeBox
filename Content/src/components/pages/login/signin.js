/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Text, Alert, KeyboardAvoidingView, TextInput, StyleSheet, Image } from 'react-native';
import PButton from '../../../widgets/Button/pButton';
import * as Constants from '../../../constants/constants';
import axios from 'axios';

const SignIn = (props) => {
	const [ email, setEmail ] = useState('');
	const [ password, setPassword ] = useState('');

	const sendCred = () => {
		axios
			.post('http://3.7.66.184:3000/user/authenticate', {
				email: email,
				password: password
			})
			.then((response) => {
				//AsyncStorage.setItem('token', response.data.token);
				setEmail('');
				setPassword('');
				global.user = response.data;
				props.navigation.replace('State');
			})
			.catch((err) => {
				Alert.alert('Wrong Email/Password.');
				console.log(err);
			});
	};

	return (
		<KeyboardAvoidingView
			behavior="height"
			style={{
				justifyContent: 'center',
				backgroundColor: 'white',
				height: '100%'
			}}
		>
			<Image source={require('../../../assets/icon.png')} style={{ alignSelf: 'center', marginTop: -50 }} />
			<Text
				style={{
					textAlign: 'center',
					fontSize: 30,
					color: Constants.textColor1,
					marginLeft: 18,
					marginTop: 20
				}}
			>
				Sign In.
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
				theme={{ colors: { primary: 'blue' } }}
				onChangeText={(text) => setEmail(text)}
			/>
			<TextInput
				label="password"
				mode="outlined"
				secureTextEntry={true}
				placeholder="Enter Password."
				value={password}
				onChangeText={(text) => {
					setPassword(text);
				}}
				style={styles.text}
				theme={{ colors: { primary: 'blue' } }}
			/>
			<PButton
				title="Sign In"
				onPress={() => {
					sendCred();
				}}
				viewStyle={{
					marginTop: 20,
					width: '50%',
					flexDirection: 'row',
					justifyContent: 'center'
				}}
				elementStyle={{
					flexDirection: 'row',
					justifyContent: 'center',
					margin: 5
				}}
			/>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	text: {
		marginLeft: 18,
		marginRight: 18,
		marginTop: 18,
		color: Constants.textColor1,
		fontSize: 20,
		borderWidth: 2,
		borderColor: Constants.textColor1,
		borderRadius: 5
	}
});
export default SignIn;
