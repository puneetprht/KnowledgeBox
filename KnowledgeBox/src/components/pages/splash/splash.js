import { View, Image, ActivityIndicator} from 'react-native';
import React,{useEffect,useState} from 'react';
import PButton from '../../../widgets/Button/pButton';
import * as Constants from '../../../constants/constants';
import * as AsyncStorage from '../../../services/asyncStorage';
import ContainerGradient from '../../../widgets/Theme/containerGradient';

const logo = require('../../../assets/iconInverted.png');
const Splash = (props) => {
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
	  setIsLoading(true);
	  fetchData().then(setIsLoading(false));	
	  return () => {
		  setIsLoading(false);
	  }
	},[fetchData, setIsLoading]);

	const fetchData = async () => {
		// console.log("Fetching data");
		global.user = await AsyncStorage.getStorage('user');
		// console.log("Fetching user data",global.user);
		global.selectedTopic = await AsyncStorage.getStorage('topics');
		// console.log("Fetching topics data",global.selectedTopic);
		
  	}

	const navigate = () => {
		// console.log("Navigate user:",global.user);
		// console.log("Navigate topics:",global.selectedTopic);
		if(global.user && global.user.stateId && global.selectedTopic){
			props.navigation.navigate('Tabs');
		}
		else if(global.user && global.user.stateId){
			props.navigation.navigate('State', {
				screen: 'TopicList',
			  });
		}else if(global.user){
			props.navigation.navigate('State');
		}
		else{
			props.navigation.navigate('AuthPage')
		}
	};
	
	return (
		<ContainerGradient>
			<View
				style={{
					flex: 3,
					justifyContent: 'center',
					alignItems: 'center'
				}}
			>
				<Image
					source={logo}
					style={{
						width: '60%'
					}}
					resizeMode="contain"
				/>
			</View>		
			<View style={{ flex: 2, justifyContent: 'center' }}>
			{isLoading ? (
        		<View style={{justifyContent:'flex-end', alignItems: 'center',marginBottom:20}}>
          			<ActivityIndicator size="large" color="#ffffff" />
        		</View>
      		) : (<View style={{justifyContent:'flex-end', alignItems: 'center',marginBottom:20}}/>)}
				<PButton
					title="Let's Start"
					disabled={isLoading}
					onPress={() => navigate()
					}
					viewStyle={{
						backgroundColor: '#ffffff',
						width: '75%',
						flexDirection: 'row',
						justifyContent: 'center'
					}}
					textStyle={{ color: Constants.textColor1, fontFamily: 'Roboto' }}
					elementStyle={{ flexDirection: 'row', justifyContent: 'center' }}
				/>
			</View>
		</ContainerGradient>
	);
};

export default Splash;
