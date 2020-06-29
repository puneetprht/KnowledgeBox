/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native';
import ContainerList from '../../../widgets/List/containerList';
import * as Constants from '../../../constants/constants';
import PButton from '../../../widgets/Button/pButton';

const QuizList = (props) => {
	const [ list, setList ] = useState([
		{ id: 1, subject: 'Algebra 1', count: 12 },
		{ id: 2, subject: 'Algebra 2', count: 15 },
		{ id: 3, subject: 'Algebra 3', count: 43 },
		{ id: 4, subject: 'Algebra 4', count: 1 },
		{ id: 5, subject: 'Algebra 5', count: 8 },
		{ id: 6, subject: 'Algebra 6', count: 4 },
		{ id: 7, subject: 'Algebra 7', count: 7 },
		{ id: 8, subject: 'Algebra 8', count: 9 },
		{ id: 9, subject: 'Algebra 9', count: 10 },
		{ id: 10, subject: 'Algebra 10', count: 0 },
		{ id: 11, subject: 'Algebra 11', count: 3 }
	]);

	const openDetailList = (index, evt) => {
		props.navigation.navigate('QuizQuestionnaire');
	};

	return (
		<ContainerList title="Algebra Quizes" onPress={() => props.navigation.goBack()}>
			<ScrollView style={{ marginBottom: 30 }}>
				<View style={styles.Container}>
					{list.map((l) => {
						return (
							<View key={l.id} style={styles.boxSimple}>
								<View style={styles.boxLeft}>
									<Text style={styles.textLeft}>{l.subject}</Text>
								</View>
								<View style={styles.boxRight}>
									<PButton
										title="Start"
										onPress={openDetailList.bind(this, l.id)}
										viewStyle={styles.button}
										textStyle={{ fontSize: 17 }}
										elementStyle={{ flexDirection: 'row', justifyContent: 'center' }}
									/>
								</View>
							</View>
						);
					})}
				</View>
			</ScrollView>
		</ContainerList>
	);
};

const styles = StyleSheet.create({
	Container: {
		borderWidth: 1,
		borderRadius: 10,
		borderColor: '#ddd',
		borderBottomWidth: 0,
		shadowColor: '#000',
		shadowOpacity: 0.8,
		shadowRadius: 10,
		marginHorizontal: 10
	},
	boxSimple: {
		borderBottomWidth: 1,
		height: 70,
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 5
	},
	boxLeft: {
		flex: 1,
		borderRightWidth: 1,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center'
	},
	boxRight: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	textLeft: {
		fontSize: 20,
		fontWeight: 'bold'
	},
	textRight: {
		color: Constants.textColor1,
		fontSize: 20,
		fontWeight: 'bold'
	},
	button: {
		paddingVertical: 6,
		paddingHorizontal: 10,
		borderRadius: 25,
		width: '50%',
		flexDirection: 'row',
		justifyContent: 'center'
	}
});

export default QuizList;
