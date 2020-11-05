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
  KeyboardAvoidingView,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import * as Constants from './src/constants/constants';

import Home from './src/components/pages/home/home';
import Profile from './src/components/pages/home/profile';
import TopicList from './src/components/pages/login/signup';
import VideoList from './src/components/pages/video/videoPlayback';
import QuizAdmin from './src/components/pages/quiz/quizAdmin';
import TestList from './src/components/pages/test/testList';
import TestStackScreen from './src/components/navigation/TestNavigator';
import RootStackScreen from './src/components/navigation/MainNavigator';

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#009CDE" barStyle="light-content" />
      <RootStackScreen />
    </NavigationContainer>
  );
};

export default App;
