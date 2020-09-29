/* eslint-disable prettier/prettier */
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Start from '../pages/splash/splash';
import AuthPage from '../pages/login/login';
import SignIn from '../pages/login/signin';
import SignUp from '../pages/login/signup';

const AuthStack = createStackNavigator();
const AuthStackScreen = () => (
  <AuthStack.Navigator headerMode="none">
    <AuthStack.Screen name="Start" component={Start} />
    <AuthStack.Screen name="AuthPage" component={AuthPage} />
    <AuthStack.Screen name="SignIn" component={SignIn} />
    <AuthStack.Screen name="SignUp" component={SignUp} />
  </AuthStack.Navigator>
);

export default AuthStackScreen;
