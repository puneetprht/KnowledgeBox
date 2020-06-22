/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { StyleSheet, ScrollView, View, Text, StatusBar, TouchableOpacity } from 'react-native';

import QuizHome from './src/components/pages/quiz/quizHome';
import QuizTopicList from './src/components/pages/quiz/quizTopicList';
import QuizList from './src/components/pages/quiz/quizList';

const App = () => {
	return <QuizList />;
};

export default App;
