/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, Dimensions, Alert, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DropDownPicker from 'react-native-dropdown-picker';
import * as Constants from '../../../constants/constants';

const TestHome = (props) => {
	const [ category, setCategory ] = useState(1);
	const [ list, setList ] = useState([
		{ id: 1, subject: 'English', count: 12 },
		{ id: 2, subject: 'Hindi', count: 15 },
		{ id: 3, subject: 'Math', count: 43 },
		{ id: 4, subject: 'History', count: 1 },
		{ id: 5, subject: 'Geography', count: 8 },
		{ id: 6, subject: 'Physics', count: 4 },
		{ id: 7, subject: 'Biology', count: 7 },
		{ id: 8, subject: 'Chemistry', count: 9 },
		{ id: 9, subject: 'General Knowledge', count: 10 },
		{ id: 10, subject: 'Political Science', count: 0 },
		{ id: 11, subject: 'Mewari', count: 3 }
	]);

	const openTopic = (index, evt) => {
		props.navigation.navigate('TestTopicList');
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
							<Text style={{ fontSize: 20, marginTop: 20, color: 'white' }}>Test</Text>
						</View>
						<View style={{ margin: 20, alignItems: 'center' }}>
							<Image source={require('../../../assets/quiz.png')} />
						</View>
					</LinearGradient>
				</View>
				<View style={{ margin: 20, alignItems: 'center' }}>
					<DropDownPicker
						zindex={10}
						items={[ { label: 'All', value: 0 }, { label: 'SSC', value: 1 }, { label: 'RAS', value: 2 } ]}
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
						}}
					/>
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
												{l.count > 1 ? l.count + ' Topics' : l.count + ' Topic'}
											</Text>
										</TouchableOpacity>
									</View>
								</View>
							);
						})}
					</View>
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

export default TestHome;
