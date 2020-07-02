/* eslint-disable prettier/prettier */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Start from '../pages/splash/splash';
import AuthPage from '../pages/login/login';
import StateList from '../pages/login/stateList';
import TopicList from '../pages/login/topicList';

const StateStack = createStackNavigator();
const StateStackScreen = () => (
	<StateStack.Navigator headerMode="none">
		<StateStack.Screen name="Start" component={Start} />
		<StateStack.Screen name="AuthPage" component={AuthPage} />
		<StateStack.Screen name="StateList" component={StateList} />
		<StateStack.Screen name="TopicList" component={TopicList} />
	</StateStack.Navigator>
);

export default StateStackScreen;
