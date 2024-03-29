/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Dimensions,
  TextInput,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import axios from '../../../services/axios';
import Icon from 'react-native-vector-icons/Feather';
import PButton from '../../../widgets/Button/pButton';
import Icon2 from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import DropDownPicker from 'react-native-dropdown-picker';
import * as Constants from '../../../constants/constants';
import * as AsyncStorage from '../../../services/asyncStorage';

const QuizHome = (props) => {
  const [category, setCategory] = useState(0);
  const [list, setList] = useState([]);
  const [dropdownList, setDropdownList] = useState([
    {value: 0, label: 'No categories'},
  ]);
  const [user, setUser] = useState(global.user);
  const [editMode, setEditMode] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [refreshing] = useState(false);
  const [navBarheight] = useState(Dimensions.get('screen').height - Dimensions.get('window').height);

  useEffect(() => {
    onRefresh();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = async () => {
    if(!user){
      let tempUser = await AsyncStorage.getStorage('user');
      setUser(tempUser);
    }
    var topic = [{value: 0, label: 'All'}];
    if (global.selectedTopic) {
      global.selectedTopic.forEach((element) => {
        topic.push({value: element.id, label: element.name});
      });
    }
    setDropdownList(topic);
    fetchAllSubjects();
  };

  const fetchAllSubjects = () => {
    if (global.selectedTopic) {
      console.log(JSON.stringify(global.selectedTopic));
      axios
        .get('/quiz/getAllSubjects', {
          params: {
            selectedCategory: JSON.stringify(global.selectedTopic),
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
    }
  };

  const fetchSubject = (categoryId) => {
    axios
      .get('/quiz/getSubject', {
        params: {
          id: categoryId,
        },
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
      fetchSubject(index);
    } else {
      fetchAllSubjects();
    }
  };

  const openTopic = (index, evt) => {
    props.navigation.navigate('QuizTopicList', {
      subjectId: index.id,
      title: index.subject,
      user: user,
      catergoryId: index.category,
    });
  };

  const addSubject = (value) => {
    if (value) {
      axios
        .post('/quiz/addSubject', {
          subjectName: value,
          categoryId: category,
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
        .delete('/quiz/deleteSubject', {
          data: {
            id: id,
          },
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
      <ScrollView style={{marginBottom: navBarheight ? 0 : 60}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={{height: Dimensions.get('window').width * 0.55}}>
          <LinearGradient
            colors={[Constants.gradientColor1, Constants.gradientColor2]}
            style={{height: '100%'}}>
            {/* <View style={{alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: 'Roboto-Medium',
                  fontSize: 18,
                  marginTop: 20,
                  color: 'white',
                }}>
                Quiz
              </Text>
            </View> */}
            <View style={{height: '80%', width: '80%',margin: 20, justifyContent:'center',alignSelf:'center', alignItems: 'center'}}>
              <Image
                ImageResizeMode="stretch"
                source={require('../../../assets/quiz.png')}
              />
            </View>
          </LinearGradient>
        </View>
        <View
          style={{
            margin: 20,
            alignItems: 'center',
            minHeight: dropdownList.length * 60,
          }}>
          <DropDownPicker
            zindex={10}
            arrowColor='white'
            items={dropdownList}
            defaultValue={category}
            containerStyle={{height: 50, width: '100%'}}
            searchableStyle={{fontFamily: 'Roboto-Medium', fontSize: 15}}
            style={{
              backgroundColor: Constants.textColor1,
              borderWidth: 2,
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
              borderBottomLeftRadius: 25,
              borderBottomRightRadius: 25,
            }}
            labelStyle={{
              fontFamily: 'Roboto-Medium',
              fontSize: 16,
              textAlign: 'left',
              color: 'white',
            }}
            dropDownStyle={{backgroundColor: Constants.textColor1, zindex: 10}}
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
                          {l.count > 1
                            ? l.count + ' Topics'
                            : l.count + ' Topic'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {user && user.isAdmin ? (
                      <TouchableOpacity
                        onPress={deleteSubject.bind(this, l.id)}
                        style={{
                          ...styles.icon,
                          position: 'absolute',
                          //justifyContent: 'flex-end',
                          backgroundColor: '#de3500',
                        }}>
                        <Icon2
                          name="delete"
                          style={{color: 'white'}}
                          size={15}
                        />
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
          {category > 0 && user && user.isAdmin ? (
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
                      onPress={addSubject.bind(this, newSubject)}
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
    marginTop: 10,
  },
  boxSimple: {
    borderBottomWidth: 1,
    height: 60,
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
    fontSize: 15,
    fontWeight: 'bold',
  },
  textRight: {
    color: Constants.textColor1,
    fontFamily: 'Roboto-Medium',
    fontSize: 15,
    fontWeight: 'bold',
  },
  textArea: {
    borderWidth: 1,
    borderColor: Constants.textColor1,
    width: '90%',
    fontFamily: 'Roboto-Medium',
    fontSize: 15,
  },
  icon: {
    padding: 10,
    borderRadius: 100,
  },
});

export default QuizHome;
