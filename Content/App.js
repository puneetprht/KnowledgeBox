/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import ContainerList from './src/widgets/List/containerList';
const App = () => {
  return (
    <ContainerList title="Title">
      <Text>This will be child</Text>
    </ContainerList>
  );
};

export default App;
