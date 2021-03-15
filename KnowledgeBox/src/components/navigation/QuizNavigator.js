/* eslint-disable prettier/prettier */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import QuizHome from '../pages/quiz/quizHome';
import QuizList from '../pages/quiz/quizList';
import QuizAdmin from '../pages/quiz/quizAdmin';
import QuizResult from '../pages/quiz/quizResult';
import QuizTopicList from '../pages/quiz/quizTopicList';
import QuizQuestionnaire from '../pages/quiz/quizQuestions';

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
