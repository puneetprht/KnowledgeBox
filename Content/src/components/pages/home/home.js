/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	Image,
	SafeAreaView,
	ScrollView,
	Platform,
	StatusBar,
	StyleSheet,
	TouchableOpacity,
	Alert
} from 'react-native';
import ElevatedView from 'react-native-elevated-view';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Constants from '../../../constants/constants';
import PButton from '../../../widgets/Button/pButton';
import axios from 'axios';

const Home = (props) => {
	const [ testList, setTestList ] = useState([
		{
			id: 1,
			value: 'test 1'
		},
		{
			id: 2,
			value: 'test 2'
		},
		{
			id: 3,
			value: 'test 3'
		},
		{
			id: 4,
			value: 'test 4'
		}
	]);

	const fetchListData = (index) => {
		//getdata for all/topic
	};

	if (global.selectedTopic.length) {
		var topic = [ { value: 0, label: 'All', isSelected: 1 } ];
		//Alert.alert(JSON.stringify(global.selectedTopic));
		global.selectedTopic.forEach((element) => {
			topic.push({ value: element.id, label: element.name, isSelected: 0 });
		});
		fetchListData(0);
	}
	const [ dropdownList, setDropdownList ] = useState(topic);

	const [ objectList, setObjectList ] = useState([
		{
			object: 'video',
			objectName: 'Video 1',
			id: 2,
			subject: 'Science',
			count: 1,
			timeAgo: 'now'
		},
		{
			object: 'quiz',
			objectName: 'Quiz 6',
			id: 2,
			subject: 'Geography',
			count: 2,
			timeAgo: '2h'
		},
		{
			object: 'quiz',
			objectName: 'Quiz',
			id: 2,
			subject: 'History',
			count: 3,
			timeAgo: '3h'
		},
		{
			object: 'video',
			objectName: 'Video 7',
			id: 2,
			subject: 'Math',
			count: 4,
			timeAgo: '10d'
		},
		{
			object: 'test',
			objectName: 'Test  1',
			id: 2,
			subject: 'Science',
			count: 5,
			timeAgo: '20d'
		}
	]);

	const onTestPress = (test) => {
		Alert.alert('WIll reDirect to test.');
	};

	const openDrawer = () => {
		Alert.alert('Open drawer.');
	};

	const openTopicList = () => {
		props.navigation.navigate('TopicList', {
			stateId: global.stateId,
			title: global.title,
			user: global.user,
			isChange: false
		});
	};

	const changeSelection = (topic) => {
		const list = JSON.parse(JSON.stringify(dropdownList));
		list.forEach((element) => {
			element.isSelected = false;
			if (element.value === topic.value) {
				element.isSelected = true;
			}
		});
		setDropdownList(list);
		//load list as well.
		fetchListData(topic.value);
	};

	return (
		<SafeAreaView>
			<ScrollView style={{ backgroundColor: '#ffffff', minHeight: '100%' }}>
				<View
					style={{
						height: 400,
						alignItems: 'center'
						//paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
					}}
				>
					<Image
						style={{ height: '100%', width: '100%' }}
						ImageResizeMode="contain"
						source={require('../../../assets/home.png')}
					/>
					<View style={styles.topMenu} flexDirection="row">
						<TouchableOpacity
							style={{ alignSelf: 'flex-start', marginRight: 10 }}
							onPress={() => openDrawer()}
						>
							<Icon name="menu" size={40} style={{ color: '#ffffff' }} />
						</TouchableOpacity>
						<TouchableOpacity
							style={{ flex: 1, alignSelf: 'flex-start', marginRight: 10 }}
							onPress={() => openTopicList()}
						>
							<View
								style={{
									borderWidth: 2,
									borderRadius: 5,
									padding: 2,
									paddingHorizontal: 5,
									borderColor: '#ffffff',
									maxWidth: 200
								}}
								flexDirection="row"
							>
								<Text
									style={{
										flex: 10,
										color: 'white',
										fontSize: 20,
										fontWeight: 'bold'
									}}
								>
									Raj. govt exams
								</Text>
								<Icon
									name="arrow-drop-down"
									size={30}
									style={{ flex: 2, alignSelf: 'flex-end', color: '#ffffff' }}
								/>
							</View>
						</TouchableOpacity>
					</View>
				</View>
				<View>
					<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
						{testList.length ? (
							testList.map((test) => {
								return (
									<View key={test.id}>
										<TouchableOpacity onPress={onTestPress.bind(this, test.id)}>
											<ElevatedView elevation={5} style={styles.stayElevated}>
												<Icon name="timer" style={{ color: Constants.textColor1 }} size={50} />
											</ElevatedView>
										</TouchableOpacity>
										<Text style={styles.textItem}>{test.value}</Text>
									</View>
								);
							})
						) : (
							<View
								style={{
									width: '100%',
									height: 50,
									justifyContent: 'center',
									alignContent: 'center'
								}}
							>
								<Text
									style={{
										fontSize: 23,
										margin: 20,
										color: Constants.textColor1,
										justifyContent: 'center',
										textAlign: 'center',
										textAlignVertical: 'center'
									}}
								>
									No Test available for you.
								</Text>
							</View>
						)}
					</ScrollView>
				</View>
				<View>
					<ScrollView
						horizontal={true}
						showsHorizontalScrollIndicator={false}
						style={{
							marginTop: 10,
							height: 45,
							backgroundColor: Constants.gradientColor2
						}}
						contentContainerStyle={{ justifyContent: 'center' }}
					>
						{dropdownList.map((test) => {
							return (
								<View key={test.value}>
									<TouchableOpacity
										onPress={changeSelection.bind(this, test)}
										style={{
											margin: 3,
											marginHorizontal: 10,
											padding: 5,
											borderRadius: 5,
											backgroundColor: test.isSelected ? '#ff621c' : Constants.gradientColor2
										}}
									>
										<Text style={styles.textItemHorizontal}>{test.label.toUpperCase()}</Text>
									</TouchableOpacity>
								</View>
							);
						})}
					</ScrollView>
				</View>
				<View style={{ marginVertical: 20 }}>
					{objectList.length ? (
						objectList.map((object) => {
							return (
								<View key={object.count}>
									<ElevatedView elevation={7} style={styles.stayElevatedCard}>
										<View style={{ flex: 1, flexDirection: 'row' }}>
											<View>
												<Image
													source={require('../../../assets/icon2.png')}
													style={{
														height: 60,
														width: 60,
														borderRadius: 30
													}}
												/>
											</View>
											<View style={styles.textWrapper}>
												<Text style={styles.textTitle}>
													{object.subject} {object.object}
												</Text>
												<Text style={styles.textTime}>{object.timeAgo}</Text>
											</View>
										</View>
										<View>
											<Text style={styles.textObject}>{object.objectName}</Text>
										</View>
										<View style={{ margin: 20 }}>
											<PButton
												title={object.object === 'video' ? 'Start' : 'Attempt'}
												onPress={() => setEditMode(true)}
												viewStyle={{
													width: '70%',
													flexDirection: 'row',
													justifyContent: 'center'
												}}
												elementStyle={{
													flexDirection: 'row',
													justifyContent: 'center'
												}}
											/>
										</View>
									</ElevatedView>
								</View>
							);
						})
					) : (
						<View
							style={{
								width: '100%',
								height: 50,
								justifyContent: 'center',
								alignContent: 'center'
							}}
						>
							<Text
								style={{
									fontSize: 23,
									margin: 20,
									color: Constants.textColor1,
									justifyContent: 'center',
									textAlign: 'center',
									textAlignVertical: 'center'
								}}
							>
								Please comeback again later.
							</Text>
						</View>
					)}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	textWrapper: {
		paddingHorizontal: 10
	},
	textObject: {
		fontSize: 30,
		color: Constants.textColor1,
		textAlign: 'center'
	},
	textTitle: {
		fontWeight: 'bold',
		fontSize: 25
	},
	textTime: {
		color: 'gray',
		fontSize: 18
	},
	stayElevated: {
		margin: 15,
		marginBottom: 5,
		padding: 20,
		backgroundColor: 'white',
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center'
	},
	stayElevatedCard: {
		margin: 15,
		marginBottom: 5,
		padding: 20,
		backgroundColor: 'white',
		borderRadius: 10
	},
	textItem: {
		textAlign: 'center',
		color: Constants.textColor1,
		fontSize: 15,
		fontWeight: 'bold',
		flex: 1,
		justifyContent: 'center',
		alignSelf: 'center',
		flexWrap: 'wrap',
		maxWidth: 70
	},
	textItemHorizontal: {
		textAlign: 'center',
		color: 'white',
		fontSize: 20,
		//fontWeight: 'bold',
		//flex: 1,
		justifyContent: 'center'
		//alignSelf: 'center',
	},
	topMenu: {
		position: 'absolute',
		flex: 1,
		alignItems: 'flex-start',
		alignContent: 'flex-start',
		justifyContent: 'flex-start',
		margin: 20
	},
	answerText: {
		textAlign: 'left',
		fontSize: 20,
		fontWeight: 'bold',
		margin: 10

		//color:
	}
});

export default Home;
