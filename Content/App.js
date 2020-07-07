/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';

import Home from './src/components/pages/home/home';
import QuizTopicList from './src/components/pages/quiz/quizTopicList';
import QuizList from './src/components/pages/quiz/quizList';
import QuizQuestionnaire from './src/components/pages/quiz/quizQuestions';
import QuizStackScreen from './src/components/navigation/QuizNavigator';
import TestStackScreen from './src/components/navigation/TestNavigator';
import StateStackScreen from './src/components/navigation/StateNavigator';
import RootStackScreen from './src/components/navigation/MainNavigator';

const App = () => {
  return (
    <NavigationContainer>
      <QuizStackScreen />
    </NavigationContainer>
  );
};

export default App;
