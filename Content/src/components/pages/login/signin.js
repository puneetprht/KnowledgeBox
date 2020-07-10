/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Text, AsyncStorage, KeyboardAvoidingView, TextInput } from 'react-native';
import PButton from '../../../widgets/Button/pButton';
import * as Constants from '../../../constants/constants';
import axios from 'axios';

const SignIn = (props) => {
	const [ email, setEmail ] = useState('');
	const [ password, setPassword ] = useState('');

	const sendCred = () => {
		axios
			.post('http://10.0.2.2:3000/user/authenticate', {
				email: email,
				password: password
			})
			.then((response) => {
				AsyncStorage.setItem('token', response.data.token);
				props.navigation.navigate('StateList');
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<KeyboardAvoidingView behavior="position" style={{ justifyContent: 'center' }}>
			<Text
				style={{
					fontSize: 20,
					marginLeft: 18,
					marginTop: 20
				}}
			>
				Login with email
			</Text>
			<TextInput
				label="Email"
				mode="outlined"
				value={email}
				style={{
					marginLeft: 18,
					marginRight: 18,
					marginTop: 18,
					borderWidth: 2,
					borderColor: Constants.textColor1,
					borderRadius: 5
				}}
				theme={{ colors: { primary: 'blue' } }}
				onChangeText={(text) => setEmail(text)}
			/>
			<TextInput
				label="password"
				mode="outlined"
				secureTextEntry={true}
				value={password}
				onChangeText={(text) => {
					setPassword(text);
				}}
				style={{
					marginLeft: 18,
					marginRight: 18,
					marginTop: 18,
					borderWidth: 2,
					borderColor: Constants.textColor1
				}}
				theme={{ colors: { primary: 'blue' } }}
			/>
			<PButton
				title="Sign In"
				onPress={() => {
					sendCred();
				}}
				viewStyle={{
					width: '50%',
					flexDirection: 'row',
					justifyContent: 'center'
				}}
				elementStyle={{ flexDirection: 'row', justifyContent: 'center', margin: 5 }}
			/>
		</KeyboardAvoidingView>
	);
};

export default SignIn;
