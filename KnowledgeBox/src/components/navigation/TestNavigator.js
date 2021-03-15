/* eslint-disable prettier/prettier */
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import TestHome from '../pages/test/testHome';
import TestList from '../pages/test/testList';
import TestAdmin from '../pages/test/testAdmin';
import TestResult from '../pages/test/testResult';
import TestTopicList from '../pages/test/testTopicList';
import TestQuestionnaire from '../pages/test/testQuestions';

const TestStack = createStackNavigator();
const TestStackScreen = props => (
  <TestStack.Navigator headerMode="none">
    <TestStack.Screen name="TestHome" component={TestHome} />
    <TestStack.Screen name="TestTopicList" component={TestTopicList} />
    <TestStack.Screen name="TestList" component={TestList} />
    <TestStack.Screen name="TestAdmin" component={TestAdmin} />
    <TestStack.Screen name="TestQuestionnaire" component={TestQuestionnaire} />
    <TestStack.Screen name="TestResult" component={TestResult} />
  </TestStack.Navigator>
);

export default TestStackScreen;
