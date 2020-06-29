/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { StyleSheet, ScrollView, View, Text, StatusBar, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import QuizHome from './src/components/pages/quiz/quizHome';
import QuizTopicList from './src/components/pages/quiz/quizTopicList';
import QuizList from './src/components/pages/quiz/quizList';
import QuizQuestionnaire from './src/components/pages/quiz/quizQuestions';
import QuizStackScreen from './src/components/navigation/QuizNavigator';
import VideoStackScreen from './src/components/navigation/VideoNavigator';

const App = () => {
	return (
		<NavigationContainer>
			<VideoStackScreen />
		</NavigationContainer>
	);
};

export default App;
