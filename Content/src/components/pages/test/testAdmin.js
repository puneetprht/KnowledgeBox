/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
	View,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	Alert,
	TouchableOpacity,
	ActivityIndicator,
	KeyboardAvoidingView
} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import LinearGradient from 'react-native-linear-gradient';
import * as Constants from '../../../constants/constants';
import PButton from '../../../widgets/Button/pButton';
import ElevatedView from 'react-native-elevated-view';
import axios from 'axios';

const TestAdmin = (props) => {
	const [ key, setKey ] = useState(0);
	const { user, stateId, catergoryId, subjectId, subTopicId, title } = props.route.params;
	const [ isSubmit, setIsSubmit ] = useState(false);
	const [ testName, setTestName ] = useState('');
	const questionObject = {
		question: '',
		option1: '',
		option2: '',
		option3: '',
		option4: '',
		isCorrect: [],
		isMultiple: false,
		isValid: false
	};
	const [ questionsList, setQuestionsList ] = useState([ questionObject ]);

	const onOptionPress = (index) => {
		const questions = JSON.parse(JSON.stringify(questionsList));
		if (questions[key].isCorrect.includes(index) && questions[key].isMultiple) {
			questions[key].isCorrect.splice(questions[key].isCorrect.indexOf(index), 1);
		} else if (questions[key].isCorrect.includes(index) && !questions[key].isMultiple) {
			questions[key].isCorrect = [];
		} else {
			if (questions[key].isMultiple) {
				questions[key].isCorrect.push(index);
				questions[key].isCorrect.sort();
			} else {
				questions[key].isCorrect = [];
				questions[key].isCorrect.push(index);
			}
		}
		setQuestionsList(questions);
	};

	const submitTest = () => {
		setIsSubmit(true);
		const submitAnswers = [];
		axios
			.post('http://10.0.2.2:3000/test/postTest', {
				subTopicId: subTopicId,
				subjectId: subjectId,
				categoryId: catergoryId,
				stateId: stateId,
				questions: questionsList,
				testName: testName
			})
			.then((response) => {
				setIsSubmit(false);
				props.navigation.navigate('TestList', {
					SubTopicId: subTopicId,
					title: title,
					user: user,
					stateId: stateId,
					catergoryId: catergoryId,
					subjectId: subjectId,
					refresh: true
				});
			})
			.catch((err) => {
				setIsSubmit(false);
				console.log(err);
			});
	};

	const nextQuestion = (index, evt) => {
		if (index < questionsList.length - 1) {
			setKey(index + 1);
		} else {
			const questions = JSON.parse(JSON.stringify(questionsList));
			questions.push(questionObject);
			setQuestionsList(questions);
			setKey(index + 1);
		}
	};

	const prevQuestion = (index, evt) => {
		setKey(index - 1);
	};

	const isMultiple = (bool) => {
		const questions = JSON.parse(JSON.stringify(questionsList));
		questions[key].isMultiple = bool;
		setQuestionsList(questions);
	};

	const saveQuestion = (val) => {
		const questions = JSON.parse(JSON.stringify(questionsList));
		questions[key].question = val;
		setQuestionsList(questions);
	};

	const saveOption = (val, index) => {
		const questions = JSON.parse(JSON.stringify(questionsList));
		questions[key]['option' + index] = val;
		setQuestionsList(questions);
	};

	return (
		<KeyboardAvoidingView>
			<ScrollView style={{ marginBottom: 30 }}>
				<LinearGradient
					colors={[ Constants.gradientColor1, Constants.gradientColor2 ]}
					style={{
						paddingVertical: 20,
						borderBottomLeftRadius: 15,
						borderBottomRightRadius: 15
					}}
				>
					<View>
						<View style={{ flex: 1, justifyContent: 'center' }}>
							<TextInput
								textAlign="center"
								style={{
									...styles.textArea2,
									width: '70%',
									alignSelf: 'center'
								}}
								placeholder="Enter Test Name"
								onChangeText={(val) => setTestName(val)}
							/>
							<View style={{ position: 'absolute', paddingLeft: 15 }}>
								<TouchableOpacity onPress={() => props.navigation.goBack()}>
									<Icon name="chevron-left" style={{ color: 'white' }} size={35} />
								</TouchableOpacity>
							</View>
						</View>
					</View>
					<View style={{ alignItems: 'center' }}>{renderProgressBar(questionsList.length, key)}</View>
					<View style={{ alignItems: 'center', justifyContent: 'center' }}>
						<Text style={{ fontSize: 20, marginTop: 10, color: 'white' }}>Question {key + 1}</Text>
						<TextInput
							textAlign="left"
							style={styles.textArea2}
							placeholder="Enter Question"
							multiline={true}
							scrollEnabled={true}
							numberOfLines={5}
							maxLength={1000}
							onChangeText={(val) => saveQuestion(val)}
							value={questionsList[key].question}
						/>
					</View>
				</LinearGradient>
				<View
					flexDirection="row"
					style={{
						alignItems: 'center',
						justifyContent: 'center'
					}}
				>
					<View
						style={{
							width: '40%',
							backgroundColor: !questionsList[key].isMultiple ? 'orange' : 'white',
							borderBottomRightRadius: 15,
							borderBottomLeftRadius: 15
						}}
					>
						<TouchableOpacity onPress={() => isMultiple(false)}>
							<Text
								style={{
									color: !questionsList[key].isMultiple ? 'white' : 'black',
									textAlign: 'center',
									fontSize: 20,
									margin: 3
								}}
							>
								Single Choice
							</Text>
						</TouchableOpacity>
					</View>
					<View
						style={{
							width: '40%',
							backgroundColor: questionsList[key].isMultiple ? 'orange' : 'white',
							borderBottomRightRadius: 15,
							borderBottomLeftRadius: 15
						}}
					>
						<TouchableOpacity onPress={() => isMultiple(true)}>
							<Text
								style={{
									color: !questionsList[key].isMultiple ? 'black' : 'white',
									textAlign: 'center',
									fontSize: 20,
									margin: 3
								}}
							>
								Multiple Choice
							</Text>
						</TouchableOpacity>
					</View>
				</View>
				<View
					flexDirection="row"
					style={{
						marginHorizontal: 10,
						marginVertical: 5,
						justifyContent: 'space-evenly'
					}}
				>
					<ElevatedView
						elevation={5}
						style={{
							...styles.elevatedStyle,
							borderColor: questionsList[key].isCorrect.includes(1) ? Constants.textColor1 : 'white'
						}}
					>
						<TouchableOpacity onPress={onOptionPress.bind(this, 1)} style={styles.elevatedStyleTO}>
							<Text
								style={{
									...styles.answerText2,
									color: Constants.textColor1
								}}
							>
								1
							</Text>
						</TouchableOpacity>
					</ElevatedView>
					<ElevatedView
						elevation={5}
						style={{
							...styles.elevatedStyle,
							borderColor: questionsList[key].isCorrect.includes(2) ? Constants.textColor1 : 'white'
						}}
					>
						<TouchableOpacity onPress={onOptionPress.bind(this, 2)} style={styles.elevatedStyleTO}>
							<Text
								style={{
									...styles.answerText2,
									color: Constants.textColor1
								}}
							>
								2
							</Text>
						</TouchableOpacity>
					</ElevatedView>
					<ElevatedView
						elevation={5}
						style={{
							...styles.elevatedStyle,
							borderColor: questionsList[key].isCorrect.includes(3) ? Constants.textColor1 : 'white'
						}}
					>
						<TouchableOpacity onPress={onOptionPress.bind(this, 3)} style={styles.elevatedStyleTO}>
							<Text
								style={{
									...styles.answerText2,
									color: Constants.textColor1
								}}
							>
								3
							</Text>
						</TouchableOpacity>
					</ElevatedView>
					<ElevatedView
						elevation={5}
						style={{
							...styles.elevatedStyle,
							borderColor: questionsList[key].isCorrect.includes(4) ? Constants.textColor1 : 'white'
						}}
					>
						<TouchableOpacity onPress={onOptionPress.bind(this, 4)} style={styles.elevatedStyleTO}>
							<Text
								style={{
									...styles.answerText2,
									color: Constants.textColor1
								}}
							>
								4
							</Text>
						</TouchableOpacity>
					</ElevatedView>
				</View>
				<View style={{ alignItems: 'center', margin: 10, marginTop: 15 }}>
					<View
						style={{
							...styles.stayElevated,
							borderWidth: 3,
							borderColor: questionsList[key].isCorrect.includes(1) ? Constants.textColor1 : 'white'
						}}
					>
						<ElevatedView elevation={5} style={{ borderRadius: 10 }}>
							<TextInput
								textAlign="left"
								style={styles.textArea}
								placeholder="Enter Question"
								multiline={true}
								scrollEnabled={true}
								numberOfLines={2}
								maxLength={200}
								onChangeText={(val) => saveOption(val, 1)}
								value={questionsList[key].option1}
							/>
						</ElevatedView>
					</View>
					<View
						style={{
							...styles.stayElevated,
							borderWidth: 3,
							borderColor: questionsList[key].isCorrect.includes(2) ? Constants.textColor1 : 'white'
						}}
					>
						<ElevatedView elevation={5} style={{ borderRadius: 10 }}>
							<TextInput
								textAlign="left"
								style={styles.textArea}
								placeholder="Enter Question"
								multiline={true}
								scrollEnabled={true}
								numberOfLines={2}
								maxLength={200}
								onChangeText={(val) => saveOption(val, 2)}
								value={questionsList[key].option2}
							/>
						</ElevatedView>
					</View>
					<View
						style={{
							...styles.stayElevated,
							borderWidth: 3,
							borderColor: questionsList[key].isCorrect.includes(3) ? Constants.textColor1 : 'white'
						}}
					>
						<ElevatedView elevation={5} style={{ borderRadius: 10 }}>
							<TextInput
								textAlign="left"
								style={styles.textArea}
								placeholder="Enter Question"
								multiline={true}
								scrollEnabled={true}
								numberOfLines={2}
								maxLength={200}
								onChangeText={(val) => saveOption(val, 3)}
								value={questionsList[key].option3}
							/>
						</ElevatedView>
					</View>
					<View
						style={{
							...styles.stayElevated,
							borderWidth: 3,
							borderColor: questionsList[key].isCorrect.includes(4) ? Constants.textColor1 : 'white'
						}}
					>
						<ElevatedView elevation={5} style={{ borderRadius: 10 }}>
							<TextInput
								textAlign="left"
								style={styles.textArea}
								placeholder="Enter Question"
								multiline={true}
								scrollEnabled={true}
								numberOfLines={2}
								maxLength={200}
								onChangeText={(val) => saveOption(val, 4)}
								value={questionsList[key].option4}
							/>
						</ElevatedView>
					</View>
				</View>
				<View flexDirection={'row'} style={{ marginHorizontal: 20, justifyContent: 'space-between' }}>
					<View
						style={{
							paddingLeft: 15,
							justifyContent: 'center',
							alignItems: 'center'
						}}
					>
						{key ? (
							<TouchableOpacity
								onPress={prevQuestion.bind(this, key)}
								disabled={
									!(
										questionsList[key].question &&
										questionsList[key].option1 &&
										questionsList[key].option2 &&
										questionsList[key].option3 &&
										questionsList[key].option4 &&
										questionsList[key].isCorrect.length
									)
								}
							>
								<Icon
									name="chevron-left"
									style={{
										color:
											questionsList[key].question &&
											questionsList[key].option1 &&
											questionsList[key].option2 &&
											questionsList[key].option3 &&
											questionsList[key].option4 &&
											questionsList[key].isCorrect.length
												? Constants.textColor1
												: '#acc3f8',
										justifyContent: 'center',
										alignItems: 'center'
									}}
									size={35}
								/>
							</TouchableOpacity>
						) : (
							<View />
						)}
					</View>
					<View>
						{isSubmit ? (
							<View style={{ justifyContent: 'center', alignContent: 'center' }}>
								<ActivityIndicator size="large" color="#0000ff" />
							</View>
						) : (
							<PButton
								title={'Submit Test'}
								onPress={() => submitTest()}
								disable={
									!(
										questionsList[key].question &&
										questionsList[key].option1 &&
										questionsList[key].option2 &&
										questionsList[key].option3 &&
										questionsList[key].option4 &&
										questionsList[key].isCorrect.length
									)
								}
								viewStyle={{
									backgroundColor:
										questionsList[key].question &&
										questionsList[key].option1 &&
										questionsList[key].option2 &&
										questionsList[key].option3 &&
										questionsList[key].option4 &&
										questionsList[key].isCorrect.length
											? Constants.textColor1
											: '#acc3f8',
									flexDirection: 'row',
									justifyContent: 'center'
								}}
								elementStyle={{ flexDirection: 'row', justifyContent: 'center' }}
							/>
						)}
					</View>
					<PButton
						title={key == questionsList.length - 1 ? 'Add' : 'Next'}
						onPress={nextQuestion.bind(this, key)}
						disable={
							!(
								questionsList[key].question &&
								questionsList[key].option1 &&
								questionsList[key].option2 &&
								questionsList[key].option3 &&
								questionsList[key].option4 &&
								questionsList[key].isCorrect.length
							)
						}
						viewStyle={{
							backgroundColor:
								questionsList[key].question &&
								questionsList[key].option1 &&
								questionsList[key].option2 &&
								questionsList[key].option3 &&
								questionsList[key].option4 &&
								questionsList[key].isCorrect.length
									? Constants.textColor1
									: '#acc3f8',
							flexDirection: 'row',
							justifyContent: 'center'
						}}
						elementStyle={{ flexDirection: 'row', justifyContent: 'center' }}
					/>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

const renderProgressBar = (length, inFocus) => {
	let junctions = [];
	for (var i = 0; i < length; i++) {
		if (i === inFocus) {
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
		margin: 10,
		backgroundColor: 'white',
		borderRadius: 10
	},
	answerText: {
		textAlign: 'left',
		fontSize: 20,
		fontWeight: 'bold',
		margin: 10
	},
	answerText2: {
		textAlign: 'left',
		fontSize: 20,
		fontWeight: 'bold'
	},
	textArea: {
		color: Constants.textColor1,
		borderRadius: 5,
		fontSize: 20
	},
	textArea2: {
		borderWidth: 1,
		borderColor: 'white',
		color: 'white',
		borderRadius: 5,
		width: '90%',
		fontSize: 20
	},
	elevatedStyle: {
		borderWidth: 3,
		alignItems: 'center',
		justifyContent: 'center',
		width: 50,
		height: 50,
		backgroundColor: '#fff',
		borderRadius: 25
	},
	elevatedStyleTO: {
		height: '100%',
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center'
	}
});

export default TestAdmin;
