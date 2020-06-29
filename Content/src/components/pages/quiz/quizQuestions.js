/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import LinearGradient from 'react-native-linear-gradient';
import ContainerList from '../../../widgets/List/containerList';
import * as Constants from '../../../constants/constants';
import PButton from '../../../widgets/Button/pButton';
import ElevatedView from 'react-native-elevated-view';

const QuizQuestionnaire = (props) => {
	const [ questionsList, setQuestionsList ] = useState([
		{
			id: 1,
			question: 'This is the first question, are we going to complete it in next 6 days?',
			options: [
				{
					id: 1,
					value:
						'yeaionsyeaionsdouiaduonAOIDNOANDOILANODNPIANDLOANOLSDNOLANOSDsyeaionsdouiaduonAOIDNOANDOILANODNPIANDLOANOLSDNOLANOSDsdouiaduonAOIDNOANDOILANODNPIANDLOANOLSDNOLANOSDs'
				},
				{
					id: 2,
					value: 'NoASD ADBJAH DJHA DJHADB AJH DA DJHA DJH ADH AJ D A.LSDJASD'
				},
				{
					id: 3,
					value: 'AJHBDIABDILBAIBDOUANDABUDBALUBDUABSDBADUBAODSLABUOSDJALS'
				},
				{ id: 4, value: 'MASDAMSDPALSDMLSMDKLANSDO0I13U9' }
			],
			correctOption: '1'
		},
		{
			id: 2,
			question:
				'Eleanor bought 5 pints of frozen yogurt and a tray of jumbo shrimp from The Food Place for a total of $45. If the price of a tray of jumbo shrimp is $25, what is the price of a pint of frozen yogurt?And if he bought the yogurt did he eat it?',
			options: [ { id: 1, value: '5' }, { id: 2, value: '9' }, { id: 3, value: '4' }, { id: 4, value: '14' } ],
			correctOption: '3'
		},
		{
			id: 3,
			question:
				"At Honey Beepot, the bulk price for honey is $2.50 per pound, with a minimum purchase of 20 pounds. If Bobby paid $80 for some honey, by how many pounds did Bobby's purchase exceed the minimum?",
			options: [ { id: 1, value: '10' }, { id: 2, value: '12' }, { id: 3, value: '16' }, { id: 4, value: '24' } ],
			correctOption: '2'
		},
		{
			id: 4,
			question:
				"The 22 students in Ms. Smith's 2nd grade class each have a sibling or a pet. If 14 students have a sibling and 18 students have a pet, how many students have both a sibling and a pet?",
			options: [ { id: 1, value: '4' }, { id: 2, value: '14' }, { id: 3, value: '18' }, { id: 4, value: '10' } ],
			correctOption: '4'
		}
	]);
	const countQuestions = questionsList.length;
	const [ key, setKey ] = useState(0);

	const [ chosen, setChosen ] = useState([ [], [], [], [] ]);
	const checkAnswer = (index, evt) => {
		var list = Array.from(chosen);
		if (!list[key].includes(index)) {
			list[key].push(index);
		}
		setChosen(list);
	};

	const nextQuestion = (index, evt) => {
		if (index < questionsList.length - 1) {
			setKey(index + 1);
		} else {
			Alert.alert('Call backend');
		}
	};
	const prevQuestion = (index, evt) => {
		//if (index < questionsList.length - 1) {
		setKey(index - 1);
		//}
	};

	return (
		<ScrollView style={{ marginBottom: 30 }}>
			<LinearGradient
				colors={[ Constants.gradientColor1, Constants.gradientColor2 ]}
				style={{
					paddingVertical: 20,
					//height: '100%',
					//minHeight: 250,
					borderBottomLeftRadius: 15,
					borderBottomRightRadius: 15
				}}
			>
				<View>
					<View style={{ flex: 1, justifyContent: 'center' }}>
						<Text
							style={{
								color: 'white',
								textAlign: 'center',
								textAlignVertical: 'center',
								flex: 1,
								fontSize: 25
							}}
						>
							Algebra 1
						</Text>
						<View style={{ position: 'absolute', paddingLeft: 15 }}>
							<TouchableOpacity onPress={() => props.navigation.goBack()}>
								<Icon name="chevron-left" style={{ color: 'white' }} size={35} />
							</TouchableOpacity>
						</View>
					</View>
				</View>
				<View style={{ alignItems: 'center' }}>
					{renderProgressBar(questionsList.length, questionsList[key].id)}
				</View>
				<View style={{ alignItems: 'center', justifyContent: 'center' }}>
					<Text style={{ fontSize: 20, marginTop: 10, color: 'white' }}>
						Question {questionsList[key].id}
					</Text>
					<Text style={{ fontSize: 18, margin: 10, color: 'white' }}>
						Question {questionsList[key].question}
					</Text>
				</View>
			</LinearGradient>
			<View style={{ alignItems: 'center', margin: 20 }}>
				{questionsList[key].options.map((option) => {
					return (
						<View
							key={option.id}
							style={{
								...styles.stayElevated,
								borderWidth: 3,
								borderColor: chosen[key].includes(option.id) ? Constants.textColor1 : 'white'
							}}
						>
							<TouchableOpacity onPress={checkAnswer.bind(this, option.id)}>
								<ElevatedView elevation={5} style={{ borderRadius: 10 }}>
									<Text
										style={{
											...styles.answerText,
											color: Constants.textColor1
										}}
									>
										{option.value}
									</Text>
								</ElevatedView>
							</TouchableOpacity>
						</View>
					);
				})}
			</View>
			<View flexDirection={'row'} style={{ marginHorizontal: 20, justifyContent: 'space-between' }}>
				<View style={{ paddingLeft: 15, justifyContent: 'center', alignItems: 'center' }}>
					{key ? (
						<TouchableOpacity onPress={prevQuestion.bind(this, key)}>
							<Icon
								name="chevron-left"
								style={{ color: Constants.textColor1, justifyContent: 'center', alignItems: 'center' }}
								size={35}
							/>
						</TouchableOpacity>
					) : (
						<View />
					)}
				</View>
				<PButton
					title={key == questionsList.length - 1 ? 'Submit' : 'Next'}
					onPress={nextQuestion.bind(this, key)}
					viewStyle={{
						flexDirection: 'row',
						justifyContent: 'center'
					}}
					elementStyle={{ flexDirection: 'row', justifyContent: 'center' }}
				/>
			</View>
		</ScrollView>
	);
};

const renderProgressBar = (length, inFocus) => {
	let junctions = [];
	for (var i = 0; i < length; i++) {
		if (i === inFocus - 1) {
			junctions.push({ key: i, color: 'yellow' });
		} else {
			junctions.push({ key: i, color: 'white' });
		}
	}
	return (
		<View
			style={{
				width: '60%',
				flexDirection: 'row',
				justifyContent: 'center',
				alignContent: 'center',
				marginTop: 10
			}}
		>
			{junctions.map((j) => {
				return (
					<View
						key={j.key}
						style={{
							height: 7,
							width: 1 / length * 100 + '%',
							backgroundColor: j.color,
							borderRadius: 4
						}}
					/>
				);
			})}
		</View>
	);
};

const styles = StyleSheet.create({
	stayElevated: {
		width: '100%',
		//height: 10,
		margin: 10,
		//padding: 10,
		backgroundColor: 'white',
		borderRadius: 10
	},
	answerText: {
		textAlign: 'left',
		fontSize: 20,
		fontWeight: 'bold',
		margin: 10

		//color:
	}
});

export default QuizQuestionnaire;
