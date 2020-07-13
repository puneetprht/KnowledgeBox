/* eslint-disable prettier/prettier */
import React from 'react';
import { Alert } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import QuizHome from '../pages/quiz/quizHome';
import QuizTopicList from '../pages/quiz/quizTopicList';
import QuizList from '../pages/quiz/quizList';
import QuizAdmin from '../pages/quiz/quizAdmin';
import QuizQuestionnaire from '../pages/quiz/quizQuestions';
import QuizResult from '../pages/quiz/quizResult';

const QuizStack = createStackNavigator();
const QuizStackScreen = (props) => (
	<QuizStack.Navigator headerMode="none">
		<QuizStack.Screen name="QuizHome" component={QuizHome} params={props.route.params} />
		<QuizStack.Screen name="QuizTopicList" component={QuizTopicList} />
		<QuizStack.Screen name="QuizList" component={QuizList} />
		<QuizStack.Screen name="QuizAdmin" component={QuizAdmin} />
		<QuizStack.Screen name="QuizQuestionnaire" component={QuizQuestionnaire} />
		<QuizStack.Screen name="QuizResult" component={QuizResult} />
	</QuizStack.Navigator>
);

export default QuizStackScreen;
