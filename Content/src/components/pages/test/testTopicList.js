/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native';
import ContainerList from '../../../widgets/List/containerList';
import * as Constants from '../../../constants/constants';

const TestTopicList = (props) => {
	const [ list, setList ] = useState([
		{ id: 1, subject: 'Algebra', count: 12 },
		{ id: 2, subject: 'Calculus', count: 15 },
		{ id: 3, subject: 'Geometry', count: 43 },
		{ id: 4, subject: 'Number Theory', count: 1 },
		{ id: 5, subject: 'Topolody', count: 8 },
		{ id: 6, subject: 'Permutations', count: 4 },
		{ id: 7, subject: 'Combinations', count: 7 },
		{ id: 8, subject: 'Probability', count: 9 },
		{ id: 9, subject: 'Set theory', count: 10 },
		{ id: 10, subject: 'Game Theory', count: 0 },
		{ id: 11, subject: 'Airthmatic', count: 3 }
	]);

	const openTopic = (index, evt) => {
		props.navigation.navigate('TestList');
	};

	return (
		<ContainerList title="Math topics" onPress={() => props.navigation.goBack()}>
			<ScrollView style={{ marginBottom: 30 }}>
				<View style={styles.Container}>
					{list.map((l) => {
						return (
							<View key={l.id} style={styles.boxSimple}>
								<View style={styles.boxLeft}>
									<Text style={styles.textLeft}>{l.subject}</Text>
								</View>
								<View style={styles.boxRight}>
									<TouchableOpacity onPress={openTopic.bind(this, l.id)}>
										<Text style={styles.textRight}>
											{l.count > 1 ? l.count + ' Tests' : l.count + ' Test'}
										</Text>
									</TouchableOpacity>
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
	}
});

export default TestTopicList;
