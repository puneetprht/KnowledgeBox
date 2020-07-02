/* eslint-disable prettier/prettier */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TestHome from '../pages/test/testHome';
import TestTopicList from '../pages/test/testTopicList';
import TestList from '../pages/test/testList';
import TestQuestionnaire from '../pages/test/testQuestions';

const TestStack = createStackNavigator();
const TestStackScreen = () => (
	<TestStack.Navigator headerMode="none">
		<TestStack.Screen name="TestHome" component={TestHome} />
		<TestStack.Screen name="TestTopicList" component={TestTopicList} />
		<TestStack.Screen name="TestList" component={TestList} />
		<TestStack.Screen name="TestQuestionnaire" component={TestQuestionnaire} />
	</TestStack.Navigator>
);

export default TestStackScreen;
