/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import ContainerList from '../../../widgets/List/containerList';
import * as Constants from '../../../constants/constants';
import PButton from '../../../widgets/Button/pButton';
import axios from 'axios';
import Icon from 'react-native-vector-icons/AntDesign';

const TestList = (props) => {
	const [ list, setList ] = useState([]);
	const { SubTopicId, title, user, stateId, catergoryId, subjectId } = props.route.params;
	let { refresh } = props.route.params;

	const fetchAllTopics = () => {
		axios
			.get('http://10.0.2.2:3000/test/getTestList', {
				params: {
					id: SubTopicId
				}
			})
			.then((response) => {
				if (response.data) {
					setList(response.data);
				} else {
					setList([]);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};
	useEffect(
		() => {
			fetchAllTopics();
			refresh = false;
		},
		[ refresh ]
	);

	const openDetail = (index, evt) => {
		props.navigation.navigate('TestQuestionnaire', {
			testId: index.id,
			title: index.value,
			user: user,
			stateId: stateId,
			catergoryId: catergoryId
		});
	};

	const deleteTest = (id) => {
		if (id) {
			axios
				.delete('http://10.0.2.2:3000/test/deleteTest', {
					data: {
						id: id
					}
				})
				.then((response) => {
					fetchAllTopics();
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};

	const addTest = () => {
		props.navigation.navigate('TestAdmin', {
			user: user,
			stateId: stateId,
			catergoryId: catergoryId,
			subjectId: subjectId,
			subTopicId: SubTopicId,
			title: title
		});
	};

	return (
		<ContainerList title={title + ' testes'} onPress={() => props.navigation.goBack()}>
			<ScrollView style={{ marginBottom: 30 }}>
				<View style={styles.Container}>
					{list.map((l) => {
						return (
							<View key={l.id} style={styles.boxSimple}>
								<View style={styles.boxLeft}>
									<Text style={styles.textLeft}>{l.value}</Text>
								</View>
								<View style={styles.boxRight}>
									<PButton
										title="Start"
										onPress={openDetail.bind(this, l)}
										viewStyle={styles.button}
										textStyle={{ fontSize: 17 }}
										elementStyle={{
											flexDirection: 'row',
											justifyContent: 'center'
										}}
									/>
								</View>
								{user.isAdmin ? (
									<TouchableOpacity
										onPress={deleteTest.bind(this, l.id)}
										style={{
											...styles.icon,
											position: 'absolute',
											backgroundColor: '#de3500'
										}}
									>
										<Icon name="delete" style={{ color: 'white' }} size={15} />
									</TouchableOpacity>
								) : (
									<View />
								)}
							</View>
						);
					})}
					{user.isAdmin ? (
						<View style={{ marginTop: 10 }}>
							<PButton
								title="Add Test"
								onPress={() => addTest()}
								viewStyle={{
									width: '55%',
									flexDirection: 'row',
									justifyContent: 'center'
								}}
								elementStyle={{
									flexDirection: 'row',
									justifyContent: 'center'
								}}
							/>
						</View>
					) : (
						<View />
					)}
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
	boxRightOptions: {
		flex: 1,
		justifyContent: 'space-around',
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
	textArea: {
		borderWidth: 1,
		borderColor: Constants.textColor1,
		width: '90%',
		fontSize: 20
	},
	icon: {
		padding: 10,
		borderRadius: 100
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

export default TestList;
