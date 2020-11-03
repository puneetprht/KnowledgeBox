/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Dimensions,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import ContainerList from '../../../widgets/List/containerList';
import axios from '../../../services/axios';

/*const fetchUserState = userId => {
  axios
    .get('https://3.7.66.184:3000/quiz/GetUserState?' + userId)
    .then(response => {
      return response.data;
    })
    .catch(error => {});
};*/

const StateList = (props) => {
  const user = global.user;
  let isGoBack = false;
  if (props.route.params && props.route.params.isGoBack) {
    isGoBack = props.route.params.isGoBack;
  }

  const [updatedStates, setUpdatedStates] = useState([]);
  const [states, setStates] = useState([
    {
      id: 1,
      count: 1,
      name: 'Rajasthan',
      acro: 'Raj.',
      image: require('../../../assets/states/rajasthan.jpg'),
      imagebnw: require('../../../assets/states/rajasthanbnw.jpg'),
      isActive: false,
    },
    {
      id: 7,
      count: 2,
      name: 'All India',
      acro: 'All India',
      image: require('../../../assets/states/india.jpg'),
      imagebnw: require('../../../assets/states/indiabnw.jpg'),
      isActive: false,
    },
    {
      id: 6,
      count: 3,
      name: 'New Delhi',
      acro: 'Delhi',
      image: require('../../../assets/states/delhi.jpg'),
      imagebnw: require('../../../assets/states/delhibnw.jpg'),
      isActive: false,
    },
    {
      id: 2,
      count: 4,
      name: 'Uttar Pradesh',
      acro: 'UP',
      image: require('../../../assets/states/UP.jpg'),
      imagebnw: require('../../../assets/states/UPbnw.jpg'),
      isActive: false,
    },
    {
      id: 4,
      count: 5,
      name: 'Bihar',
      acro: 'Bihar',
      image: require('../../../assets/states/bihar.jpg'),
      imagebnw: require('../../../assets/states/biharbnw.jpg'),
      isActive: false,
    },
    {
      id: 5,
      count: 6,
      name: 'Madhya Pradesh',
      acro: 'MP',
      image: require('../../../assets/states/MadhyaPradesh.jpg'),
      imagebnw: require('../../../assets/states/MadhyaPradeshbnw.jpg'),
      isActive: false,
    },
    {
      id: 3,
      count: 7,
      name: 'Maharashtra',
      acro: 'Mah.',
      image: require('../../../assets/states/maharashtra.jpg'),
      imagebnw: require('../../../assets/states/maharashtrabnw.jpg'),
      isActive: false,
    },
    {
      id: 8,
      count: 8,
      name: 'Punjab',
      acro: 'Punjab',
      image: require('../../../assets/states/Punjab.jpg'),
      imagebnw: require('../../../assets/states/Punjabbnw.jpg'),
      isActive: false,
    },
    {
      id: 9,
      count: 9,
      name: 'Gujarat',
      acro: 'Guj.',
      image: require('../../../assets/states/gujarat.jpg'),
      imagebnw: require('../../../assets/states/gujaratbnw.jpg'),
      isActive: false,
    },
    {
      id: 10,
      count: 10,
      name: 'Haryana',
      acro: 'Haryana',
      image: require('../../../assets/states/haryana.jpg'),
      imagebnw: require('../../../assets/states/haryanabnw.jpg'),
      isActive: false,
    },
    {
      id: 11,
      count: 11,
      name: 'Himachal Pradesh',
      acro: 'Himachal',
      image: require('../../../assets/states/HimachalPradesh.jpg'),
      imagebnw: require('../../../assets/states/HimachalPradeshbnw.jpg'),
      isActive: false,
    },
    {
      id: 12,
      count: 12,
      name: 'Uttarakhand',
      acro: 'UK',
      image: require('../../../assets/states/uttarakhand.jpg'),
      imagebnw: require('../../../assets/states/uttarakhandbnw.jpg'),
      isActive: false,
    },
    {
      id: 13,
      count: 13,
      name: 'West Bengal',
      acro: 'WB',
      image: require('../../../assets/states/westbengal.jpg'),
      imagebnw: require('../../../assets/states/westbengalbnw.jpg'),
      isActive: false,
    },
    {
      id: 14,
      count: 14,
      name: 'Chattisgarh',
      acro: 'CG',
      image: require('../../../assets/states/chattisgarh.jpg'),
      imagebnw: require('../../../assets/states/chattisgarhbnw.jpg'),
      isActive: false,
    },
  ]);

  const updateActive = (index, evt) => {
    const state = Array.from(states);
    if (!state[index.count - 1].isActive) {
      state.forEach((Element) => {
        Element.isActive = false;
      });
    }
    state[index.count - 1].isActive = !state[index.count - 1].isActive;
    setStates(state);
    setUpdatedStates([...updatedStates, index.id]);
    if (state[index.count - 1].isActive) {
      props.navigation.navigate('TopicList', {
        stateId: index.id,
        stateAcro: index.acro,
        title: index.name,
        user: user,
        isChange: true,
      });
    }
  };

  return (
    <ContainerList
      title="Select State(s)"
      onPress={() =>
        isGoBack
          ? props.navigation.replace('Tabs', {screen: 'HOME'})
          : props.navigation.replace('Auth', {screen: 'AuthPage'})
      }>
      <ScrollView style={{marginBottom: 50}}>
        <View style={styles.container}>
          {states.map((state) => {
            return (
              <View
                key={state.id}
                style={{
                  ...styles.boxSimple,
                  marginLeft:
                    state.count % 2 == 0
                      ? Dimensions.get('window').width * 0.025
                      : 0,
                }}>
                <TouchableOpacity onPress={updateActive.bind(this, state)}>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      width: '100%',
                      height: '100%',
                    }}>
                    <Text style={styles.text}>{state.name}</Text>
                    <Image
                      source={state.isActive ? state.image : state.imagebnw}
                      style={styles.backgroundImage}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
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
    height: Dimensions.get('window').width * 0.45,
    width: Dimensions.get('window').width * 0.45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    marginHorizontal: Dimensions.get('window').width * 0.035,
    marginBottom: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  block: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  text: {
    color: 'white',
    fontFamily: 'Roboto-Medium',
    fontSize: 22,
    fontWeight: 'bold',
    zIndex: 2,
    marginBottom: 10,
  },
  backgroundImage: {
    flex: 1,
    position: 'absolute',
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },
});

export default StateList;
