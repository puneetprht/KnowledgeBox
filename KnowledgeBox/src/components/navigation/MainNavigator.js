/* eslint-disable prettier/prettier */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AuthNavigator from './AuthNavigator';
import StateNavigator from './StateNavigator';
import QuizNavigator from './QuizNavigator';
import TestNavigator from './TestNavigator';
import HomeNavigator from './HomeNavigator';
import VideoNavigator from './VideoNavigator';

const Tabs = createBottomTabNavigator();
const TabsScreen = (props) => (
	<Tabs.Navigator
		options={({ route }) => ({
			tabBarVisible: getTabBarVisibility(route)
		})}
	>
		<Tabs.Screen
			name="HOME"
			component={HomeNavigator}
			options={({ route }) => ({
				tabBarVisible: getTabBarVisibility(route),
				tabBarIcon: ({ color, size }) => {
					let iconName;

					if (route.name === 'HOME') {
						iconName = 'ios-home';
					}
					return <Ionicons name={iconName} size={30} color={color} />;
				}
			})}
		/>
		<Tabs.Screen
			name="QUIZ"
			component={QuizNavigator}
			params={props.route.params}
			options={({ route }) => ({
				tabBarVisible: getTabBarVisibility(route),
				tabBarIcon: ({ color, size }) => {
					let iconName;

					if (route.name === 'QUIZ') {
						iconName = 'ios-checkbox-outline';
					}
					return <Ionicons name={iconName} size={30} color={color} />;
				}
			})}
		/>
		<Tabs.Screen
			name="VIDEO"
			component={VideoNavigator}
			params={props.route.params}
			options={({ route }) => ({
				tabBarVisible: getTabBarVisibility(route),
				tabBarIcon: ({ color, size }) => {
					let iconName;

					if (route.name === 'VIDEO') {
						iconName = 'md-videocam';
					}
					return <Ionicons name={iconName} size={30} color={color} />;
				}
			})}
		/>
		<Tabs.Screen
			name="TEST"
			component={TestNavigator}
			options={({ route }) => ({
				tabBarVisible: getTabBarVisibility(route),
				tabBarIcon: ({ color, size }) => {
					let iconName;

					if (route.name === 'TEST') {
						iconName = 'ios-checkbox';
					}
					return <Ionicons name={iconName} size={30} color={color} />;
				}
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
