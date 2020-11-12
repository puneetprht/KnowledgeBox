/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
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
    //   id: 1,
    //   value: 'test 1',
    // },
    // {
    //   id: 2,
    //   value: 'test 2',
    // },
    // {
    //   id: 3,
    //   value: 'test 3',
    // },
    // {
    //   id: 4,
    //   value: 'test 4',
    // },
    // {
    //   id: 5,
    //   value: 'test 3',
    // },
    // {
    //   id: 6,
    //   value: 'test 4',
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
    /*{
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
		}*/
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
            height: 400,
            alignItems: 'center',
            //paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
          }}>
          <Image
            style={{height: '100%', width: '100%'}}
            ImageResizeMode="stretch"
            source={require('../../../assets/home.png')}
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
                  maxWidth: 180,
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
        <View style={{marginVertical: 20}}>
          {objectList.length ? (
            objectList.map((object) => {
              return (
                <View key={object.count}>
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
                          {object.subject} {object.object}
                        </Text>
                        <Text style={styles.textTime}>{object.timeAgo}</Text>
                      </View>
                    </View>
                    <View>
                      <Text style={styles.textObject}>{object.objectName}</Text>
                    </View>
                    <View style={{margin: 20}}>
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
    fontSize: 27,
    color: Constants.textColor1,
    textAlign: 'center',
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
    padding: 20,
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
});

export default Home;
