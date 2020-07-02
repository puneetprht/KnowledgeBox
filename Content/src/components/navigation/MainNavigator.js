/* eslint-disable prettier/prettier */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import StateNavigator from './StateNavigator';
import QuizNavigator from './QuizNavigator';
import TestNavigator from './TestNavigator';
import HomeNavigator from './HomeNavigator';
import VideoNavigator from './VideoNavigator';

const Tabs = createBottomTabNavigator();
const TabsScreen = () => (
	<Tabs.Navigator
		options={({ route }) => ({
			tabBarVisible: getTabBarVisibility(route)
		})}
	>
		<Tabs.Screen name="HOME" component={HomeNavigator} />
		<Tabs.Screen
			name="QUIZ"
			component={QuizNavigator}
			options={({ route }) => ({
				tabBarVisible: getTabBarVisibility(route)
			})}
		/>
		<Tabs.Screen
			name="VIDEO"
			component={VideoNavigator}
			options={({ route }) => ({
				tabBarVisible: getTabBarVisibility(route)
			})}
		/>
		<Tabs.Screen
			name="TEST"
			component={TestNavigator}
			options={({ route }) => ({
				tabBarVisible: getTabBarVisibility(route)
			})}
		/>
	</Tabs.Navigator>
);

const getTabBarVisibility = (route) => {
	const routeName = route.state ? route.state.routes[route.state.index].name : '';

	if (routeName === 'QuizQuestionnaire' || routeName === 'videoPlayback' || routeName === 'TestQuestionnaire') {
		return false;
	}

	return true;
};

const RootStack = createStackNavigator();
const RootStackScreen = () => (
	<RootStack.Navigator headerMode="none">
		<RootStack.Screen name="State" component={StateNavigator} />
		<RootStack.Screen name="Tabs" component={TabsScreen} />
	</RootStack.Navigator>
);

export default RootStackScreen;
