/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import ContainerList from '../../../widgets/List/containerList';
import LinearGradient from 'react-native-linear-gradient';
import PButton from '../../../widgets/Button/pButton';
import * as Constants from '../../../constants/constants';
import Icon from 'react-native-vector-icons/Entypo';
import Icon3 from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/AntDesign';
import axios from 'axios';

const TopicList = (props) => {
	const [ Topics, setTopics ] = useState([]);

	const { stateId, title, user } = props.route.params; //props.route.params;
	const [ editMode, setEditMode ] = useState(false);
	const [ addMode, setAddMode ] = useState(false);
	const [ newCategory, setNewCategory ] = useState('');

	global.stateId = stateId;
	global.user = user;

	/*const retrieveData = async () => {
		try {
			const value = await AsyncStorage.getItem('userId');
			const value2 = await AsyncStorage.getItem('userAdmin');
			user.id = value || 1;
			user.isAdmin = value2 || 0;
			console.log('Value1: ', value, ' Value2: ', value2);
		} catch (error) {
			// Error retrieving data
		}
	};*/

	const fetchAllTopics = () => {
		axios
			.get('http://10.0.2.2:3000/common/getCategoryList', {
				params: {
					id: stateId
				}
			})
			.then((response) => {
				if (response.data) {
					setTopics(response.data);
				} else {
					setTopics([]);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	useEffect(() => {
		fetchAllTopics();
	}, []);

	const [ selectedTopic, setSelectedTopic ] = useState([]);

	const selectTopic = (index, evt) => {
		const topic = Array.from(selectedTopic);
		if (topic.includes(index.id)) {
			topic.splice(topic.indexOf(index.id), 1);
		} else {
			topic.push(index.id);
		}
		setSelectedTopic(topic);
		//setSelectedTopic([ ...topic, index.id ]);
		//Alert.alert(selectTopic.toString());
	};

	const continueForm = (index, evt) => {
		postCategoryForUser();
		props.navigation.navigate('Tabs', { stateId, user });
	};

	const postCategoryForUser = () => {
		axios
			.post('http://10.0.2.2:3000/common/postCategoryForUser', {
				stateId: stateId,
				userId: user.id,
				selectedTopic: selectedTopic
			})
			.then((response) => {})
			.catch((err) => {});
	};

	const saveCategory = (id) => {
		axios
			.post('http://10.0.2.2:3000/common/postCategory', {
				id: id,
				stateId: stateId,
				categoryName: newCategory
			})
			.then((response) => {
				fetchAllTopics();
				setAddMode(false);
			})
			.catch((err) => {
				setAddMode(false);
				console.log(err);
			});
	};

	const deleteCategory = (id) => {
		console.log(id);
		axios
			.delete('http://10.0.2.2:3000/common/deleteCategory', {
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
	};

	return (
		<ContainerList title={title} onPress={() => props.navigation.goBack()}>
			<ScrollView style={{ marginBottom: 50 }}>
				<View style={styles.container}>
					{Topics.map((Topic) => {
						return (
							<View key={Topic.id}>
								<TouchableOpacity onPress={selectTopic.bind(this, Topic)}>
									<View style={{ ...styles.boxSimple }}>
										<LinearGradient
											colors={[
												selectedTopic.includes(Topic.id) ? Constants.gradientColor1 : 'white',
												selectedTopic.includes(Topic.id) ? Constants.gradientColor2 : 'white'
											]}
											style={styles.gradientBox}
										>
											<Icon
												name="open-book"
												style={{
													color: selectedTopic.includes(Topic.id) ? 'white' : 'grey',
													marginBottom: 10
												}}
												size={80}
											/>
											{editMode === Topic.id ? (
												<TextInput
													textAlign="center"
													style={styles.text}
													placeholder="Enter Category"
													onChangeText={(val) => setNewCategory(val)}
													value={Topic.name}
												/>
											) : (
												<Text
													style={{
														...styles.text,
														color: selectedTopic.includes(Topic.id)
															? 'white'
															: Constants.textColor1
													}}
												>
													{Topic.name}
												</Text>
											)}
											{user.isAdmin ? (
												<TouchableOpacity
													onPress={deleteCategory.bind(this, Topic.id)}
													style={{
														...styles.icon,
														//position: 'absolute',
														backgroundColor: '#de3500'
													}}
												>
													<Icon2 name="delete" style={{ color: 'white' }} size={15} />
												</TouchableOpacity>
											) : (
												<View />
											)}
										</LinearGradient>
									</View>
								</TouchableOpacity>
							</View>
						);
					})}
					{user.isAdmin ? (
						<View style={{ ...styles.boxSimple }}>
							{!addMode ? (
								<TouchableOpacity onPress={() => setAddMode(true)}>
									<Icon
										name="plus"
										style={{
											color: Constants.textColor1,
											marginBottom: 10,
											alignSelf: 'center'
										}}
										size={80}
									/>
									<Text style={styles.text}>Add Category</Text>
								</TouchableOpacity>
							) : (
								<View>
									<TextInput
										textAlign="center"
										style={{
											...styles.text,
											marginTop: 20,
											borderWidth: 1,
											borderRadius: 5,
											borderColor: Constants.textColor1,
											maxWidth: '90%',
											minWidth: '90%'
										}}
										maxLength={20}
										placeholder="Enter Category"
										onChangeText={(val) => setNewCategory(val)}
									/>
									<View flexDirection="row" style={styles.boxRightOptions}>
										<TouchableOpacity
											onPress={() => saveCategory()}
											style={{ ...styles.icon, backgroundColor: '#1fc281' }}
										>
											<Icon3 name="check" style={{ color: 'white' }} size={25} />
										</TouchableOpacity>
										<TouchableOpacity
											onPress={() => setAddMode(false)}
											style={{
												...styles.icon,
												backgroundColor: '#de3500'
											}}
										>
											<Icon2 name="close" style={{ color: 'white' }} size={25} />
										</TouchableOpacity>
									</View>
								</View>
							)}
						</View>
					) : (
						<View />
					)}
				</View>
				<PButton
					title="Continue"
					onPress={() => continueForm()}
					viewStyle={{
						width: '75%',
						flexDirection: 'row',
						justifyContent: 'center'
					}}
					elementStyle={{ flexDirection: 'row', justifyContent: 'center' }}
				/>
			</ScrollView>
		</ContainerList>
	);
};

const styles = StyleSheet.create({
	boxSimple: {
		backgroundColor: '#fff',
		borderRadius: 20,
		borderWidth: 2,
		borderColor: Constants.textColor1,
		marginTop: 10,
		marginLeft: 10,
		height: Dimensions.get('window').width * 0.45,
		width: Dimensions.get('window').width * 0.45,
		justifyContent: 'center',
		alignItems: 'center'
	},
	gradientBox: {
		height: '100%',
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 18
	},
	container: {
		marginHorizontal: 10,
		marginBottom: 20,
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
	block: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	text: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 10
	},
	boxRightOptions: {
		flex: 1,
		justifyContent: 'space-around',
		alignItems: 'center'
	},
	icon: {
		padding: 10,
		borderRadius: 100
	}
});

export default TopicList;
