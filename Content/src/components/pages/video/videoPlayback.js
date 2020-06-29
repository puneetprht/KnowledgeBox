/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import ContainerList from '../../../widgets/List/containerList';

const QuizQuestionnaire = (props) => {
	return (
		<ContainerList title="Video Player" onPress={() => props.navigation.goBack()}>
			<Text>Video will be embedded here tomorrow.</Text>
		</ContainerList>
	);
};

export default QuizQuestionnaire;
