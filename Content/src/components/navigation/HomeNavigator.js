/* eslint-disable prettier/prettier */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../pages/home/home';

const HomeStack = createStackNavigator();
const HomeStackScreen = () => (
	<HomeStack.Navigator headerMode="none">
		<HomeStack.Screen name="Home" component={Home} />
	</HomeStack.Navigator>
);

export default HomeStackScreen;
