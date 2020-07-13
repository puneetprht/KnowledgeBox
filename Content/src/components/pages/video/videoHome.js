/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
	View,
	ScrollView,
	StyleSheet,
	Text,
	Dimensions,
	TextInput,
	Image,
	TouchableOpacity,
	Alert
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DropDownPicker from 'react-native-dropdown-picker';
import * as Constants from '../../../constants/constants';
import PButton from '../../../widgets/Button/pButton';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/AntDesign';
import axios from 'axios';

const VideoHome = (props) => {
	const [ category, setCategory ] = useState(0);
	const [ list, setList ] = useState([]);
	const [ dropdownList, setDropdownList ] = useState([ { value: 0, label: 'No categories' } ]);
	const [ user, setUser ] = useState(global.user);
	const [ state, setState ] = useState(global.stateId);
	const [ editMode, setEditMode ] = useState(false);
	const [ newSubject, setNewSubject ] = useState('');
	// setState(global.stateId);
	// setUser(global.user);

	useEffect(
		() => {
			axios
				.get('http://10.0.2.2:3000/common/getDropdown', {
					params: {
						userId: user.id,
						stateId: state
					}
				})
				.then((response) => {
					//console.log(response);
					setDropdownList(response.data);
				})
				.catch((err) => {
					console.log(err);
				});
			fetchAllSubjects();
			// eslint-disable-next-line react-hooks/exhaustive-deps
		},
		[ state, user ]
	);

	const fetchAllSubjects = () => {
		axios
			.get('http://10.0.2.2:3000/common/getAllSubjectForUser', {
				params: {
					userId: user.id,
					stateId: state
				}
			})
			.then((response) => {
				//console.log(response);
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

	const fetchSubjectList = (categoryId) => {
		axios
			.get('http://10.0.2.2:3000/common/getSubjectList', {
				params: {
					id: categoryId
				}
			})
			.then((response) => {
				//console.log(response);
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

	const onDropdownChange = (index) => {
		if (index > 0) {
			fetchSubjectList(index);
		} else {
			fetchAllSubjects();
		}
	};

	const openTopic = (index, evt) => {
		props.navigation.navigate('VideoTopicList', {
			subjectId: index.id,
			title: index.subject,
			user: user,
			stateId: state,
			catergoryId: index.category
		});
	};

	const saveSubject = (value) => {
		if (value) {
			axios
				.post('http://10.0.2.2:3000/common/addSubject', {
					subjectName: value,
					categoryId: category,
					stateId: state
				})
				.then((response) => {
					setNewSubject('');
					onDropdownChange(category);
				})
				.catch((err) => {
					console.log(err);
				});
		}
		setEditMode(false);
	};
	const deleteSubject = (id) => {
		if (id) {
			axios
				.delete('http://10.0.2.2:3000/common/deleteSubject', {
					data: {
						id: id
					}
				})
				.then((response) => {
					onDropdownChange(category);
				})
				.catch((err) => {
					console.log(err);
				});
		}
		setEditMode(false);
	};

	return (
		<View>
			<ScrollView>
				<View style={{ height: Dimensions.get('window').width * 0.55 }}>
					<LinearGradient
						colors={[ Constants.gradientColor1, Constants.gradientColor2 ]}
						style={{ height: '100%' }}
					>
						<View style={{ alignItems: 'center' }}>
							<Text style={{ fontSize: 20, marginTop: 20, color: 'white' }}>Video</Text>
						</View>
						<View style={{ margin: 20, alignItems: 'center' }}>
							<Image source={require('../../../assets/video4.jpg')} />
						</View>
					</LinearGradient>
				</View>
				<View
					style={{
						margin: 20,
						alignItems: 'center',
						minHeight: dropdownList.length * 60
					}}
				>
					<DropDownPicker
						zindex={10}
						items={dropdownList}
						defaultValue={category}
						containerStyle={{ height: 50, width: '100%' }}
						searchableStyle={{ fontSize: 15 }}
						style={{
							backgroundColor: Constants.textColor1,
							borderWidth: 2,
							borderTopLeftRadius: 25,
							borderTopRightRadius: 25,
							borderBottomLeftRadius: 25,
							borderBottomRightRadius: 25
						}}
						labelStyle={{
							fontSize: 17,
							textAlign: 'left',
							color: 'white'
						}}
						dropDownStyle={{ backgroundColor: Constants.textColor1, zindex: 10 }}
						onChangeItem={(item) => {
							setCategory(item.value);
							onDropdownChange(item.value);
						}}
					/>
					<View style={styles.Container}>
						{list.length ? (
							list.map((l) => {
								return (
									<View key={l.id} style={styles.boxSimple}>
										<View style={styles.boxLeft}>
											<Text style={styles.textLeft}>{l.subject}</Text>
										</View>
										<View style={styles.boxRight} flexDirection="row">
											<TouchableOpacity onPress={openTopic.bind(this, l)}>
												<Text style={styles.textRight}>
													{l.count > 1 ? l.count + ' Topics' : l.count + ' Topic'}
												</Text>
											</TouchableOpacity>
										</View>
										{user.isAdmin ? (
											<TouchableOpacity
												onPress={deleteSubject.bind(this, l.id)}
												style={{
													...styles.icon,
													position: 'absolute',
													//justifyContent: 'flex-end',
													backgroundColor: '#de3500'
												}}
											>
												<Icon2 name="delete" style={{ color: 'white' }} size={15} />
											</TouchableOpacity>
										) : (
											<View />
										)}
									</View>
								);
							})
						) : (
							<View>
								<Text>No Items for Now.</Text>
							</View>
						)}
					</View>
					{category > 0 && user.isAdmin ? (
						<View style={{ padding: 5 }}>
							{editMode ? (
								<View style={styles.boxSimple}>
									<View style={styles.boxLeft}>
										<TextInput
											textAlign="center"
											style={styles.textArea}
											placeholder="Enter Subject"
											onChangeText={(val) => setNewSubject(val)}
										/>
									</View>
									<View flexDirection="row" style={styles.boxRightOptions}>
										<TouchableOpacity
											onPress={saveSubject.bind(this, newSubject)}
											style={{ ...styles.icon, backgroundColor: '#1fc281' }}
										>
											<Icon name="check" style={{ color: 'white' }} size={25} />
										</TouchableOpacity>
										<TouchableOpacity
											onPress={() => setEditMode(false)}
											style={{
												...styles.icon,
												backgroundColor: '#de3500'
											}}
										>
											<Icon2 name="close" style={{ color: 'white' }} size={25} />
										</TouchableOpacity>
									</View>
								</View>
							) : (
								<PButton
									title="Add"
									onPress={() => setEditMode(true)}
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
							)}
						</View>
					) : (
						<View />
					)}
				</View>
			</ScrollView>
		</View>
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
		//elevation: 3,
		marginTop: 10
	},
	boxSimple: {
		borderBottomWidth: 1,
		height: 60,
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
	}
});

export default VideoHome;
