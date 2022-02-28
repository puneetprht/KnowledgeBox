/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  Dimensions,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import ElevatedView from 'react-native-elevated-view';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Constants from '../../../constants/constants';
import PButton from '../../../widgets/Button/pButton';
import axios from '../../../services/axios';

const Home = (props) => {
  const [testList, setTestList] = useState([
    // {
      // id: 1,
      // value: 'test 1',
    // },
    // {
      // id: 2,
      // value: 'test 2',
    // },
    // {
      // id: 3,
      // value: 'test 3',
    // },
    // {
      // id: 4,
      // value: 'test 4',
    // },
    // {
      // id: 5,
      // value: 'test 3',
    // },
    // {
      // id: 6,
      // value: 'test 4',
    // },
  ]);

  const fetchListData = (index) => {
    //getdata for all/topic
  };

  let topic = [];
  if (global.selectedTopic && global.selectedTopic.length) {
    console.log('global.selectedTopic.length:', global.selectedTopic.length);
    if (global.selectedTopic.length !== 1) {
      topic = [{value: 0, label: 'All', isSelected: 1}];
    }
    global.selectedTopic.forEach((element) => {
      console.log('Topic.length:', topic.length);
      topic.push({
        value: element.id,
        label: element.name,
        isSelected: global.selectedTopic.length === 1 && !topic.length ? 1 : 0,
      });
    });
    fetchListData(0);
  }
  const [dropdownList, setDropdownList] = useState(topic);

  const [objectList, setObjectList] = useState([
    {
      id: 1,
      owner: 'Knowledge Box',
			objectType: 'text',
			objectUrl: '',
      objectContent: 'Latest SSC Test series/Video courses available from 1 April, 2021',
			timeAgo: '1d',
		},
    {
      id: 2,
      owner: 'Knowledge Box',
      objectType: 'image',
      objectUrl: 'https://kb2022.s3-ap-south-1.amazonaws.com/Images/test/image7.jpeg',
      objectContent: '',
			timeAgo: '2d',
		},
    {
      id: 3,
      owner: 'Knowledge Box',
      objectType: 'image',
      objectUrl: 'https://kb2022.s3-ap-south-1.amazonaws.com/Images/test/image8.jpeg',
      objectContent: '',
			timeAgo: '2d',
		},
    {
      id: 4,
      owner: 'Knowledge Box',
      objectType: 'image',
      objectUrl: 'https://kb2022.s3-ap-south-1.amazonaws.com/Images/test/image9.jpeg',
      objectContent: '',
			timeAgo: '2d',
		},
    {
      id: 5,
      owner: 'Knowledge Box',
      objectType: 'image',
      objectUrl: 'https://kb2022.s3-ap-south-1.amazonaws.com/Images/test/image10.jpeg',
      objectContent: '',
			timeAgo: '2d',
		},
    {
      id: 6,
      owner: 'Knowledge Box',
      objectType: 'image',
      objectUrl: 'https://kb2022.s3-ap-south-1.amazonaws.com/Images/test/image11.jpeg',
      objectContent: '',
			timeAgo: '2d',
		},
    {
      id: 7,
      owner: 'Knowledge Box',
      objectType: 'image',
      objectUrl: 'https://kb2022.s3-ap-south-1.amazonaws.com/Images/test/image12.jpeg',
      objectContent: '',
			timeAgo: '2d',
		},
    {
      id: 8,
      owner: 'Knowledge Box',
      objectType: 'image',
      objectUrl: 'https://kb2022.s3-ap-south-1.amazonaws.com/Images/test/images13.jpeg',
      objectContent: '',
			timeAgo: '2d',
		},
    {
      id: 9,
      owner: 'Knowledge Box',
      objectType: 'image',
      objectUrl: 'https://kb2022.s3-ap-south-1.amazonaws.com/Images/quiz/imag1.jpeg',
      objectContent: '',
			timeAgo: '2d',
		},
		{
      owner: 'Knowledge Box',
			objectType: 'image',
      objectContent: '',
      objectUrl: 'https://kb2022.s3-ap-south-1.amazonaws.com/Images/quiz/iamge2.jpeg',
      id: 10,
			timeAgo: '3d',
		},
		{
      owner: 'Knowledge Box',
			objectType: 'image',
      objectUrl: 'https://kb2022.s3-ap-south-1.amazonaws.com/Images/quiz/image3.jpeg',
      objectContent: '',
			id: 11,
			timeAgo: '4d',
    },
    {
      owner: 'Knowledge Box',
			objectType: 'image',
      objectUrl: 'https://kb2022.s3-ap-south-1.amazonaws.com/Images/quiz/image4.jpeg',
      objectContent: '',
			id: 12,
			timeAgo: '6d',
    },
    {
      owner: 'Knowledge Box',
			objectType: 'image',
      objectUrl: 'https://kb2022.s3-ap-south-1.amazonaws.com/Images/quiz/image5.jpeg',
      objectContent: '',
			id: 13,
			timeAgo: '7d',
    },
    {
      owner: 'Knowledge Box',
			objectType: 'image',
      objectUrl: 'https://kb2022.s3-ap-south-1.amazonaws.com/Images/quiz/image6.jpeg',
      objectContent: '',
			id: 14,
			timeAgo: '10d',
		},
  ]);

  const onTestPress = (test) => {
    Alert.alert('WIll reDirect to test.');
  };

  const openTopicList = () => {
    props.navigation.navigate('State', {
      screen: 'TopicList',
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
      <ScrollView style={{backgroundColor: '#ffffff', minHeight: '100%'}}>
        <View
          style={{
            height: Dimensions.get('window').height / 2,
            //alignItems: 'center',
            //paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
          }}>
          <Image
            style={{height: Dimensions.get('window').height / 2, width: '100%'}}
            //ImageResizeMode="stretch"
            source={require('../../../assets/homeHiRes.png')}
          />
          <View style={styles.topMenu} flexDirection="row">
            <TouchableOpacity
              style={{alignSelf: 'flex-start', marginRight: 10}}
              onPress={() => props.navigation.openDrawer()}>
              <Icon name="menu" size={30} style={{color: '#ffffff'}} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{flex: 1, alignSelf: 'flex-start', marginRight: 10}}
              onPress={() => openTopicList()}>
              <View
                style={{
                  borderWidth: 2,
                  borderRadius: 5,
                  padding: 2,
                  paddingLeft: 7,
                  borderColor: '#ffffff',
                  maxWidth: 150,
                }}
                flexDirection="row">
                <Text
                  style={{
                    flex: 10,
                    color: 'white',
                    textAlign: 'left',
                    textAlignVertical: 'center',
                    fontFamily: 'Roboto-Medium',
                    fontSize: 15,
                    fontWeight: 'bold',
                  }}>
                  Change category
                </Text>
                <Icon
                  name="arrow-drop-down"
                  size={25}
                  style={{flex: 2, alignSelf: 'flex-end', color: '#ffffff'}}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.topMenuText}>
            <Text
              style={{
                textAlign: 'left',
                fontFamily: 'Roboto-Light',
                fontSize: 24,
                color: 'white',
              }}>
                Learning is {'\n'}
                Fun with {'\n'}
              KnowledgeBox
            </Text>
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
                        <Icon
                          name="timer"
                          style={{color: Constants.textColor1}}
                          size={40}
                        />
                      </ElevatedView>
                    </TouchableOpacity>
                    <Text style={styles.textItem}>{test.value}</Text>
                  </View>
                );
              })
            ) : (
              <View />
            )}
          </ScrollView>
          {testList.length ? (
            <View />
          ) : (
            <View
              style={{
                width: '100%',
                height: 50,
                justifyContent: 'center',
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'Roboto-Medium',
                  fontSize: 18,
                  margin: 20,
                  color: Constants.textColor1,
                  justifyContent: 'center',
                  textAlign: 'center',
                  textAlignVertical: 'center',
                }}>
                Live Test coming soon!
              </Text>
            </View>
          )}
        </View>
        <View>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{
              marginTop: 10,
              height: 45,
              backgroundColor: Constants.gradientColor2,
            }}
            contentContainerStyle={{justifyContent: 'center'}}>
            {dropdownList.map((test) => {
              return (
                <View key={test.value} justifyContent="center">
                  <TouchableOpacity
                    onPress={changeSelection.bind(this, test)}
                    style={{
                      margin: 3,
                      marginHorizontal: 10,
                      padding: 3,
                      borderRadius: 5,
                      backgroundColor: test.isSelected
                        ? '#ff621c'
                        : Constants.gradientColor2,
                    }}>
                    <Text style={styles.textItemHorizontal}>
                      {test.label.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>
        <View style={{flex: 1,marginVertical: 20}}>
          {objectList.length ? (
            objectList.map((object) => {
              return (
                <View key={object.id}>
                  <ElevatedView elevation={7} style={styles.stayElevatedCard}>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                      <View>
                        <Image
                          source={require('../../../assets/icon2.png')}
                          style={{
                            height: 40,
                            width: 40,
                            borderRadius: 30,
                          }}
                        />
                      </View>
                      <View style={styles.textWrapper}>
                        <Text style={styles.textTitle}>
                          {object.owner}
                        </Text>
                        <Text style={styles.textTime}>{object.timeAgo}</Text>
                      </View>
                    </View>

                    <View>
                      {object.objectType == 'text'
                      ? (<Text style={styles.textObject}>{object.objectContent}</Text>)
                      : (<View style={{width: '100%'}}>
                          <Image
                          source={{uri: object.objectUrl}}
                          alignSelf="center"
                          ImageResizeMode="contain"
                          style={{
                            marginVertical: 10,
                            width: '100%',
                            height: Dimensions.get('window').width - 54,
                            //maxHeight: 400,
                          }}
                           />
                      </View>)}
                    </View>
                    {/* <View style={{margin: 20}}>
                      <PButton
                        title={object.object === 'video' ? 'Watch' : 'Attempt'}
                        onPress={() => setEditMode(true)}
                        viewStyle={{
                          width: '40%',
                          paddingVertical: 8,
                          paddingHorizontal: 15,
                          flexDirection: 'row',
                          justifyContent: 'center',
                        }}
                        elementStyle={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                        }}
                        textStyle={{
                          fontFamily: 'Roboto-Medium',
                          fontSize: 15,
                          textAlignVertical: 'center',
                        }}
                      />
                    </View> */}
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
                alignContent: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'Roboto-Medium',
                  fontSize: 18,
                  margin: 20,
                  color: Constants.textColor1,
                  justifyContent: 'center',
                  textAlign: 'center',
                  textAlignVertical: 'center',
                }}>
                No Latest Update.
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
    paddingHorizontal: 10,
  },
  textObject: {
    fontFamily: 'Roboto-Medium',
    fontSize: 18,
    color: 'black',
    textAlign: 'left',
  },
  textTitle: {
    fontWeight: 'bold',
    fontFamily: 'Roboto-Medium',
    fontSize: 18,
  },
  textTime: {
    color: 'gray',
    fontFamily: 'Roboto-Medium',
    fontSize: 12,
  },
  stayElevated: {
    margin: 12,
    marginBottom: 5,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stayElevatedCard: {
    margin: 12,
    marginBottom: 5,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  textItem: {
    textAlign: 'center',
    color: Constants.textColor1,
    fontFamily: 'Roboto-Medium',
    fontSize: 15,
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    flexWrap: 'wrap',
    maxWidth: 70,
  },
  textItemHorizontal: {
    textAlign: 'center',
    color: 'white',
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    justifyContent: 'center',
  },
  topMenu: {
    position: 'absolute',
    flex: 1,
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
    margin: 20,
  },
  topMenuText: {
    position: 'absolute',
    flex: 1,
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: Dimensions.get('window').height / 2 * 0.3,
    marginLeft: Dimensions.get('window').height / 2 * 0.1,
  },
});

export default Home;
