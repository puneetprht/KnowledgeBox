/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import ContainerList from '../../../widgets/List/containerList';
import * as Constants from '../../../constants/constants';
import PButton from '../../../widgets/Button/pButton';
import axios from '../../../services/axios';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/Feather';

const VideoList = (props) => {
  const [list, setList] = useState([]);
  const {SubTopicId, title, user, catergoryId, subjectId} = props.route.params;
  /*const SubTopicId = 1;
	const title = 'RAS';
	const user = { id: 1, isAdmin: 1 };
	const categoryId = 1;
	const subjectId = 1;*/

  const [editMode, setEditMode] = useState(false);
  const [videoName, setVideoName] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = () => {
    fetchAllTopics();
  };

  const fetchAllTopics = () => {
    axios
      .get('/video/getVideoList', {
        params: {
          id: SubTopicId,
        },
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

  const openDetail = (index, evt) => {
    props.navigation.navigate('VideoPlayback', {
      videoId: index.urlVideoId,
      title: index.value,
      user: user,
      catergoryId: catergoryId,
    });
  };

  const deleteVideo = (id) => {
    if (id) {
      axios
        .delete('/video/deleteVideo', {
          data: {
            id: id,
          },
        })
        .then((response) => {
          fetchAllTopics();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const postVideo = () => {
    if (!videoName) {
      Alert.alert('Please add a Video Name!');
      return;
    } else if (!videoUrl) {
      Alert.alert('Please add a Video URL!');
      return;
    }
    setEditMode(true);
    axios
      .post('/video/postVideo', {
        subTopicId: SubTopicId,
        subjectId: subjectId,
        categoryId: catergoryId,
        videoName: videoName,
        videoUrl: videoUrl,
      })
      .then((response) => {
        setEditMode(false);
        fetchAllTopics();
      })
      .catch((err) => {
        setEditMode(false);
        Alert.alert('No Video Id detected.');
      });
  };

  return (
    <ContainerList
      title={title + ' videos'}
      onPress={() => props.navigation.goBack()}>
      <ScrollView
        style={{marginBottom: 30}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.Container}>
          {list.map((l) => {
            return (
              <View key={l.id} style={styles.boxSimple}>
                <View style={styles.boxLeft}>
                  <Text style={styles.textLeft}>{l.value}</Text>
                </View>
                <View style={styles.boxRight}>
                  <PButton
                    title="Watch"
                    onPress={openDetail.bind(this, l)}
                    viewStyle={styles.button}
                    textStyle={{fontFamily: 'Roboto-Medium', fontSize: 16}}
                    elementStyle={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                    }}
                  />
                </View>
                {user && user.isAdmin ? (
                  <TouchableOpacity
                    onPress={deleteVideo.bind(this, l.id)}
                    style={{
                      ...styles.icon,
                      position: 'absolute',
                      backgroundColor: '#de3500',
                    }}>
                    <Icon name="delete" style={{color: 'white'}} size={15} />
                  </TouchableOpacity>
                ) : (
                  <View />
                )}
              </View>
            );
          })}
          {user && user.isAdmin ? (
            editMode ? (
              <View>
                <View
                  style={{
                    ...styles.boxLeft,
                    borderRightWidth: 0,
                    marginTop: 10,
                    marginHorizontal: 10,
                  }}>
                  <TextInput
                    textAlign="center"
                    style={{
                      ...styles.textArea,
                      width: '100%',
                    }}
                    placeholder="Enter Video URL"
                    onChangeText={(val) => setVideoUrl(val)}
                  />
                </View>
                <View style={styles.boxSimple}>
                  <View style={styles.boxLeft}>
                    <TextInput
                      textAlign="center"
                      style={styles.textArea}
                      placeholder="Enter Video Name"
                      onChangeText={(val) => setVideoName(val)}
                    />
                  </View>
                  <View flexDirection="row" style={styles.boxRightOptions}>
                    <TouchableOpacity
                      onPress={postVideo.bind(this)}
                      style={{...styles.icon, backgroundColor: '#1fc281'}}>
                      <Icon2 name="check" style={{color: 'white'}} size={25} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setEditMode(false);
                        setVideoName('');
                        setVideoUrl('');
                      }}
                      style={{
                        ...styles.icon,
                        backgroundColor: '#de3500',
                      }}>
                      <Icon name="close" style={{color: 'white'}} size={25} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ) : (
              <View style={{marginTop: 10}}>
                <PButton
                  title="Add Video"
                  onPress={() => setEditMode(true)}
                  viewStyle={{
                    width: '65%',
                    paddingHorizontal: 15,
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}
                  elementStyle={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}
                />
              </View>
            )
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
    marginHorizontal: 10,
  },
  boxSimple: {
    borderBottomWidth: 1,
    height: 70,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  boxLeft: {
    flex: 1,
    borderRightWidth: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxRight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxRightOptions: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  textLeft: {
    fontFamily: 'Roboto-Medium',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textRight: {
    color: Constants.textColor1,
    fontFamily: 'Roboto-Medium',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textArea: {
    borderWidth: 1,
    borderColor: Constants.textColor1,
    width: '90%',
    fontFamily: 'Roboto-Medium',
    fontSize: 18,
    borderRadius: 5,
  },
  icon: {
    padding: 10,
    borderRadius: 100,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 25,
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default VideoList;
