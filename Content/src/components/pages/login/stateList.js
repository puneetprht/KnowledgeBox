/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, Dimensions, Alert, Image, TouchableOpacity } from 'react-native';
import ContainerList from '../../../widgets/List/containerList';
import PButton from '../../../widgets/Button/pButton';
//import states from '../../../constants/states';

const StateList = (props) => {
	//var listState = JSON.stringify(JSON.parse(states));
	/*states.forEach(element => {
    element.display = require('../../../' + element.image;
  });*/
	const [ updatedStates, setUpdatedStates ] = useState([]);
	const [ states, setStates ] = useState([
		{
			id: 1,
			name: 'Rajasthan',
			image: require('../../../assets/states/rajasthan.jpg'),
			imagebnw: require('../../../assets/states/rajasthanbnw.jpg'),
			isActive: false
		},
		{
			id: 2,
			name: 'Uttar Pradesh',
			image: require('../../../assets/states/UP.jpg'),
			imagebnw: require('../../../assets/states/UPbnw.jpg'),
			isActive: false
		},
		{
			id: 3,
			name: 'Maharashtra',
			image: require('../../../assets/states/maharashtra.jpg'),
			imagebnw: require('../../../assets/states/maharashtrabnw.jpg'),
			isActive: false
		},
		{
			id: 4,
			name: 'Bihar',
			image: require('../../../assets/states/bihar.jpg'),
			imagebnw: require('../../../assets/states/biharbnw.jpg'),
			isActive: false
		},
		{
			id: 5,
			name: 'Madhya Pradesh',
			image: require('../../../assets/states/MadhyaPradesh.jpg'),
			imagebnw: require('../../../assets/states/MadhyaPradeshbnw.jpg'),
			isActive: false
		},
		{
			id: 6,
			name: 'New Delhi',
			image: require('../../../assets/states/delhi.jpg'),
			imagebnw: require('../../../assets/states/delhibnw.jpg'),
			isActive: false
		},
		{
			id: 7,
			name: 'All India',
			image: require('../../../assets/states/india.jpg'),
			imagebnw: require('../../../assets/states/indiabnw.jpg'),
			isActive: false
		},
		{
			id: 8,
			name: 'Punjab',
			image: require('../../../assets/states/Punjab.jpg'),
			imagebnw: require('../../../assets/states/Punjabbnw.jpg'),
			isActive: false
		},
		{
			id: 9,
			name: 'Gujarat',
			image: require('../../../assets/states/gujarat.jpg'),
			imagebnw: require('../../../assets/states/gujaratbnw.jpg'),
			isActive: false
		},
		{
			id: 10,
			name: 'Haryana',
			image: require('../../../assets/states/haryana.jpg'),
			imagebnw: require('../../../assets/states/haryanabnw.jpg'),
			isActive: false
		},
		{
			id: 11,
			name: 'Himachal Pradesh',
			image: require('../../../assets/states/HimachalPradesh.jpg'),
			imagebnw: require('../../../assets/states/HimachalPradeshbnw.jpg'),
			isActive: false
		},
		{
			id: 12,
			name: 'Uttarakhand',
			image: require('../../../assets/states/uttarakhand.jpg'),
			imagebnw: require('../../../assets/states/uttarakhandbnw.jpg'),
			isActive: false
		},
		{
			id: 13,
			name: 'West Bengal',
			image: require('../../../assets/states/westbengal.jpg'),
			imagebnw: require('../../../assets/states/westbengalbnw.jpg'),
			isActive: false
		},
		{
			id: 14,
			name: 'Chattisgarh',
			image: require('../../../assets/states/chattisgarh.jpg'),
			imagebnw: require('../../../assets/states/chattisgarhbnw.jpg'),
			isActive: false
		}
	]);

	const updateActive = (index, evt) => {
		const state = Array.from(states);
		state[index - 1].isActive = !state[index - 1].isActive;
		setStates(state);
		setUpdatedStates([ ...updatedStates, index ]);
		props.navigation.navigate('TopicList');
	};

	return (
		<ContainerList title="Select State(s)">
			<ScrollView style={{ marginBottom: 50 }}>
				<View style={styles.container}>
					{states.map((state) => {
						return (
							<View key={state.id} style={styles.boxSimple}>
								<TouchableOpacity onPress={updateActive.bind(this, state.id)}>
									<View
										style={{
											alignItems: 'center',
											justifyContent: 'flex-end',
											width: '100%',
											height: '100%'
										}}
									>
										<Text style={styles.text}>{state.name}</Text>
										<Image
											source={state.isActive ? state.image : state.imagebnw}
											style={styles.backgroundImage}
										/>
									</View>
									{/*<ImageBackground
                    source={require(require('../../../assets/states/rajasthan.jpg'))}
                    resizeMode="cover"
                    imageStyle={{height: '100%', width: '100%'}}
                    style={styles.image}>
                    <Text style={styles.text}>{state.name}</Text>
                  </ImageBackground>*/}
								</TouchableOpacity>
							</View>
						);
					})}
				</View>
				{/*<PButton
          title="Continue"
          onPress={() => Alert.alert('Simple Button pressed')}
          viewStyle={{
            width: '75%',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
          elementStyle={{flexDirection: 'row', justifyContent: 'center'}}
        />*/}
			</ScrollView>
		</ContainerList>
	);
};

const styles = StyleSheet.create({
	boxSimple: {
		backgroundColor: '#fff',
		borderRadius: 7,
		borderWidth: 0.5,
		borderColor: '#000',
		marginTop: 10,
		marginLeft: 10,
		height: Dimensions.get('window').width * 0.45,
		width: Dimensions.get('window').width * 0.45,
		justifyContent: 'center',
		alignItems: 'center'
	},
	container: {
		marginHorizontal: 10,
		marginBottom: 20,
		flexDirection: 'row',
		flexWrap: 'wrap'
		//justifyContent: 'space-around',
	},
	block: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	image: {
		flex: 1,
		justifyContent: 'flex-end'
	},
	text: {
		color: 'white',
		fontSize: 23,
		fontWeight: 'bold',
		zIndex: 2,
		marginBottom: 10
	},
	backgroundImage: {
		flex: 1,
		position: 'absolute',
		resizeMode: 'contain',
		width: '100%',
		height: '100%',
		backgroundColor: 'transparent',
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default StateList;
