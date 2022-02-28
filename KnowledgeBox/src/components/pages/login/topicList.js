/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import axios from '../../../services/axios';
import Icon from 'react-native-vector-icons/Entypo';
import PButton from '../../../widgets/Button/pButton';
import Icon3 from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import * as Constants from '../../../constants/constants';
import * as AsyncStorage from '../../../services/asyncStorage';
import ContainerList from '../../../widgets/List/containerList';

const TopicList = (props) => {
  const [Topics, setTopics] = useState([]);
  const [user, setUser] = useState(global.user);
  const [editMode, setEditMode] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [inRequest, setInRequest] = useState(false);
  const [navBarheight] = useState(Dimensions.get('screen').height - Dimensions.get('window').height);

  const fetchAllTopics = () => {
    axios
      .get('/common/getCategoryList')
      .then((response) => {
        console.log('Working');
        if (response.data) {
          setTopics(response.data);
        } else {
          setTopics([]);
        }
      })
      .catch((err) => {
        console.log('Not working');
        console.log(err);
      });
  };

  useEffect(() => {
    fetchAllTopics();
  }, []);

  const [selectedTopic, setSelectedTopic] = useState([]);

  const selectTopic = (index, evt) => {
    const topic = Array.from(selectedTopic);
    if (topic.includes(index.id)) {
      topic.splice(topic.indexOf(index.id), 1);
    } else {
      topic.push(index.id);
    }
    setSelectedTopic(topic);
  };

  const continueForm = async (index, evt) => {
    global.selectedTopic = Topics.filter((topic) => {
      return selectedTopic.includes(topic.id);
    });
    await AsyncStorage.setStorage('topics', global.selectedTopic);
    props.navigation.navigate('Tabs');
  };

  const saveCategory = (id) => {
    setInRequest(true);
    axios
      .post('/common/postCategory', {
        id: id,
        categoryName: newCategory,
      })
      .then((response) => {
        setInRequest(false);
        setAddMode(false);
        setNewCategory('');
        fetchAllTopics();
      })
      .catch((err) => {
        setNewCategory('');
        setInRequest(false);
        setAddMode(false);
        console.log(err);
      });
  };

  const deleteCategory = (id) => {
    setInRequest(true);
    axios
      .delete('/common/deleteCategory', {
        data: {
          id: id,
        },
      })
      .then((response) => {
        setInRequest(false);
        fetchAllTopics();
      })
      .catch((err) => {
        setInRequest(false);
        console.log(err);
      });
  };

  return (
    <ContainerList
      title="Exam Category(s)"
      onPress={() =>
        global.selectedTopic
          ? props.navigation.replace('Tabs', {screen: 'HOME'})
          : props.navigation.replace('Auth', {screen: 'AuthPage'})
      }>
      <ScrollView style={{marginBottom: navBarheight ? 24 : 60}}>
        <View style={styles.container}>
          {Topics.map((Topic) => {
            return (
              <View key={Topic.id}>
                <TouchableOpacity onPress={selectTopic.bind(this, Topic)}>
                  <View
                    style={{
                      ...styles.boxSimple,
                      marginLeft:
                        Topic.number % 2 == 0
                          ? Dimensions.get('window').width * 0.025
                          : 0,
                    }}>
                    <LinearGradient
                      colors={[
                        selectedTopic.includes(Topic.id)
                          ? Constants.gradientColor1
                          : 'white',
                        selectedTopic.includes(Topic.id)
                          ? Constants.gradientColor2
                          : 'white',
                      ]}
                      style={styles.gradientBox}>
                      <Icon
                        name="open-book"
                        style={{
                          color: selectedTopic.includes(Topic.id)
                            ? 'white'
                            : 'grey',
                          marginBottom: 10,
                        }}
                        size={70}
                      />
                      {editMode === Topic.id ? (
                        <TextInput
                          textAlign="center"
                          style={styles.text}
                          placeholder="Enter Category"
                          onChangeText={(val) => setNewCategory(val)}
                          value={Topic.name}
                        />
                      ) : (
                        <Text
                          style={{
                            ...styles.text,
                            color: selectedTopic.includes(Topic.id)
                              ? 'white'
                              : Constants.textColor1,
                          }}>
                          {Topic.name}
                        </Text>
                      )}
                      {user && user.isAdmin ? (
                        <TouchableOpacity
                          onPress={deleteCategory.bind(this, Topic.id)}
                          disabled={inRequest}
                          style={{
                            ...styles.icon,
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
                    </LinearGradient>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
          {user && user.isAdmin ? (
            <View
              style={{
                ...styles.boxSimple,
                marginLeft:
                  Topics.length % 2 == 1
                    ? Dimensions.get('window').width * 0.025
                    : 0,
              }}>
              {!addMode ? (
                <TouchableOpacity onPress={() => setAddMode(true)}>
                  <Icon
                    name="plus"
                    style={{
                      color: Constants.textColor1,
                      marginBottom: 10,
                      alignSelf: 'center',
                    }}
                    size={80}
                  />
                  <Text style={styles.text}>Add Category</Text>
                </TouchableOpacity>
              ) : (
                <View>
                  <TextInput
                    textAlign="center"
                    style={{
                      ...styles.text,
                      marginTop: 20,
                      borderWidth: 1,
                      borderRadius: 5,
                      borderColor: Constants.textColor1,
                      maxWidth: '90%',
                      minWidth: '90%',
                    }}
                    maxLength={20}
                    placeholder="Enter Category"
                    onChangeText={(val) => setNewCategory(val)}
                  />
                  <View flexDirection="row" style={styles.boxRightOptions}>
                    <TouchableOpacity
                      onPress={() => saveCategory()}
                      disabled={inRequest || !newCategory}
                      style={{
                        ...styles.icon,
                        backgroundColor:
                          inRequest || !newCategory ? '#6ae7b5' : '#1fc281',
                      }}>
                      <Icon3 name="check" style={{color: 'white'}} size={25} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setAddMode(false)}
                      style={{
                        ...styles.icon,
                        backgroundColor: '#de3500',
                      }}>
                      <Icon2 name="close" style={{color: 'white'}} size={25} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ) : (
            <View />
          )}
        </View>
        <PButton
          title="Continue"
          onPress={() => continueForm()}
          disable={selectedTopic.length === 0}
          viewStyle={{
            width: '75%',
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 5,
            backgroundColor:
              selectedTopic.length === 0 ? '#5aa0ff' : Constants.textColor1,
          }}
          elementStyle={{flexDirection: 'row', justifyContent: 'center'}}
        />
      </ScrollView>
    </ContainerList>
  );
};

const styles = StyleSheet.create({
  boxSimple: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Constants.textColor1,
    marginTop: 10,
    height: Dimensions.get('window').width * 0.45,
    width: Dimensions.get('window').width * 0.45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientBox: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
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
  text: {
    fontFamily: 'Roboto-Medium',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  boxRightOptions: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  icon: {
    padding: 10,
    borderRadius: 100,
  },
});

export default TopicList;
