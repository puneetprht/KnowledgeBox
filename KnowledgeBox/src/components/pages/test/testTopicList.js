/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import ContainerList from '../../../widgets/List/containerList';
import * as Constants from '../../../constants/constants';
import PButton from '../../../widgets/Button/pButton';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/AntDesign';
import axios from '../../../services/axios';

const TestTopicList = (props) => {
  const [list, setList] = useState([]);
  const {subjectId, title, user, catergoryId} = props.route.params;
  const [editMode, setEditMode] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = () => {
    fetchAllTopics();
  };

  const fetchAllTopics = () => {
    axios
      .get('/test/getSubTopicList', {
        params: {
          id: subjectId,
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

  const openTopic = (index, evt) => {
    props.navigation.navigate('TestList', {
      SubTopicId: index.id,
      title: index.value,
      user: user,
      catergoryId: catergoryId,
      subjectId: subjectId,
      refresh: true,
    });
  };

  const saveSubject = (value) => {
    if (value) {
      axios
        .post('/common/addSubTopic', {
          SubTopicName: value,
          subjectId: subjectId,
          catergoryId: catergoryId,
        })
        .then((response) => {
          setNewSubject('');
          fetchAllTopics();
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
        .delete('/common/deleteSubTopic', {
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

  return (
    <ContainerList
      title={title + ' topics'}
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
                  <TouchableOpacity onPress={openTopic.bind(this, l)}>
                    <Text style={styles.textRight}>
                      {l.count > 1 ? l.count + ' Tests' : l.count + ' Test'}
                    </Text>
                  </TouchableOpacity>
                </View>
                {user && user.isAdmin ? (
                  <TouchableOpacity
                    onPress={deleteSubject.bind(this, l.id)}
                    style={{
                      ...styles.icon,
                      position: 'absolute',
                      backgroundColor: '#de3500',
                    }}>
                    <Icon2 name="delete" style={{color: 'white'}} size={15} />
                  </TouchableOpacity>
                ) : (
                  <View />
                )}
              </View>
            );
          })}
          {user && user.isAdmin ? (
            <View style={{padding: 5}}>
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
                      style={{...styles.icon, backgroundColor: '#1fc281'}}>
                      <Icon name="check" style={{color: 'white'}} size={25} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setEditMode(false)}
                      style={{
                        ...styles.icon,
                        backgroundColor: '#de3500',
                      }}>
                      <Icon2 name="close" style={{color: 'white'}} size={25} />
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
                    justifyContent: 'center',
                  }}
                  elementStyle={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}
                />
              )}
            </View>
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
  },
  icon: {
    padding: 10,
    borderRadius: 100,
  },
});

export default TestTopicList;
