/* eslint-disable prettier/prettier */
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import AuthNavigator from './AuthNavigator';
import QuizNavigator from './QuizNavigator';
import TestNavigator from './TestNavigator';
import HomeNavigator from './HomeNavigator';
import StateNavigator from './StateNavigator';
import VideoNavigator from './VideoNavigator';

import * as Constants from '../../constants/constants';

const Tabs = createBottomTabNavigator();
const TabsScreen = (props) => (
	<Tabs.Navigator
		options={({ route }) => ({
			tabBarVisible: getTabBarVisibility(route),
		})}
	>
		<Tabs.Screen
			name="HOME"
			component={HomeNavigator}
			options={({ route }) => ({
				tabBarVisible: getTabBarVisibility(route),
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;
					let overridenColor = focused ? Constants.gradientColor1 : color;

					if (route.name === 'HOME') {
						iconName = 'home-outline';
					}
					return <Ionicons name={iconName} size={25} color={overridenColor} />;
				},
				unmountOnBlur: true,
			})}
		/>
		<Tabs.Screen
			name="QUIZ"
			component={QuizNavigator}
			params={props.route.params}
			options={({ route }) => ({
				tabBarVisible: getTabBarVisibility(route),
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;
					let overridenColor = focused ? Constants.gradientColor1 : color;

					if (route.name === 'QUIZ') {
						iconName = 'document-text-outline';
					}
					return <Ionicons name={iconName} size={25} color={overridenColor} />;
				},
				unmountOnBlur: true,
			})}
		/>
		<Tabs.Screen
			name="VIDEO"
			component={VideoNavigator}
			params={props.route.params}
			options={({ route }) => ({
				tabBarVisible: getTabBarVisibility(route),
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;
					let overridenColor = focused ? Constants.gradientColor1 : color;

					if (route.name === 'VIDEO') {
						iconName = 'video-vintage';
					}
					return <MaterialCommunityIcons name={iconName} size={25} color={overridenColor} />;
				},
				unmountOnBlur: true,
			})}
		/>
		<Tabs.Screen
			name="TEST"
			component={TestNavigator}
			options={({ route }) => ({
				tabBarVisible: getTabBarVisibility(route),
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;
					let overridenColor = focused ? Constants.gradientColor1 : color;

					if (route.name === 'TEST') {
						iconName = 'clipboard-list-outline';
					}
					return <MaterialCommunityIcons name={iconName} size={25} color={overridenColor} />;
				},
				unmountOnBlur: true,
			})}
		/>
	</Tabs.Navigator>
);

const getTabBarVisibility = (route) => {
	//const routeName = route.state ? route.state.routes[route.state.index].name : '';
	 const routeName = getFocusedRouteNameFromRoute(route);

	if (routeName === 'QuizQuestionnaire' || routeName === 'VideoPlayback' || routeName === 'TestQuestionnaire' || routeName === 'QuizAdmin'
	|| routeName === 'QuizResult' || routeName === 'TestAdmin' || routeName === 'TestResult') {
		return false;
	}

	return true;
};

const RootStack = createStackNavigator();
const RootStackScreen = () => (
	<RootStack.Navigator headerMode="none">
		<RootStack.Screen name="Auth" component={AuthNavigator} />
		<RootStack.Screen name="State" component={StateNavigator} />
		<RootStack.Screen name="Tabs" component={TabsScreen} />
	</RootStack.Navigator>
);

export default RootStackScreen;
