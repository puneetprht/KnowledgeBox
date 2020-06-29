/* eslint-disable prettier/prettier */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import QuizHome from '../pages/quiz/quizHome';
import QuizTopicList from '../pages/quiz/quizTopicList';
import QuizList from '../pages/quiz/quizList';
import QuizQuestionnaire from '../pages/quiz/quizQuestions';

const QuizStack = createStackNavigator();
const QuizStackScreen = () => (
	<QuizStack.Navigator headerMode="none">
		<QuizStack.Screen name="QuizHome" component={QuizHome} />
		<QuizStack.Screen name="QuizTopicList" component={QuizTopicList} />
		<QuizStack.Screen name="QuizList" component={QuizList} />
		<QuizStack.Screen name="QuizQuestionnaire" component={QuizQuestionnaire} />
	</QuizStack.Navigator>
);

export default QuizStackScreen;
