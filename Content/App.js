/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { StyleSheet, ScrollView, View, Text, StatusBar, KeyboardAvoidingView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import Home from './src/components/pages/home/home';
import TopicList from './src/components/pages/login/topicList';
import QuizList from './src/components/pages/quiz/quizList';
import QuizAdmin from './src/components/pages/quiz/quizAdmin';
import QuizStackScreen from './src/components/navigation/QuizNavigator';
import VideoStackScreen from './src/components/navigation/VideoNavigator';
import TestStackScreen from './src/components/navigation/TestNavigator';
import StateStackScreen from './src/components/navigation/StateNavigator';
import RootStackScreen from './src/components/navigation/MainNavigator';

const App = () => {
	return (
		<NavigationContainer>
			<StatusBar backgroundColor="blue" barStyle="light-content" />
			<RootStackScreen />
		</NavigationContainer>
	);
};

export default App;
