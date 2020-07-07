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
import LinearGradient from 'react-native-linear-gradient';
import DropDownPicker from 'react-native-dropdown-picker';
import * as Constants from '../../../constants/constants';
import axios from 'axios';

const QuizHome = props => {
  const [category, setCategory] = useState(0);
  const [list, setList] = useState([]);
  const [dropdownList, setDropdownList] = useState([
    {value: 0, label: 'No categories'},
  ]);
  const [user, setUser] = useState({id: 1, isAdmin: 1});
  const [state, setState] = useState(1);

  useEffect(() => {
    axios
      .get('http://10.0.2.2:3000/quiz/getDropdown', {
        params: {
          userId: user.id,
          stateId: state,
        },
      })
      .then(response => {
        //console.log(response);
        setDropdownList(response.data);
      })
      .catch(err => {
        console.log(err);
      });
    fetchAllSubjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, user]);

  const fetchAllSubjects = () => {
    axios
      .get('http://10.0.2.2:3000/quiz/getAllSubjectForUser', {
        params: {
          userId: user.id,
          stateId: state,
        },
      })
      .then(response => {
        //console.log(response);
        if (response.data) {
          setList(response.data);
        } else {
          setList([]);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const onDropdownChange = index => {
    if (index < 0) {
      fetchAllSubjects();
    } else {
      axios
        .get('http://10.0.2.2:3000/quiz/getSubjectList', {
          params: {
            id: index,
          },
        })
        .then(response => {
          //console.log(response);
          if (response.data) {
            setList(response.data);
          } else {
            setList([]);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  const openTopic = (index, evt) => {
    props.navigation.navigate('QuizTopicList', {
      subjectId: index.id,
      title: index.subject,
      user: user,
      stateId: state,
    });
  };

  return (
    <View>
      <ScrollView>
        <View style={{height: Dimensions.get('window').width * 0.55}}>
          <LinearGradient
            colors={[Constants.gradientColor1, Constants.gradientColor2]}
            style={{height: '100%'}}>
            <View style={{alignItems: 'center'}}>
              <Text style={{fontSize: 20, marginTop: 20, color: 'white'}}>
                Quiz
              </Text>
            </View>
            <View style={{margin: 20, alignItems: 'center'}}>
              <Image source={require('../../../assets/quiz.png')} />
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
            items={dropdownList}
            defaultValue={category}
            containerStyle={{height: 50, width: '100%'}}
            searchableStyle={{fontSize: 15}}
            style={{
              backgroundColor: Constants.textColor1,
              borderWidth: 2,
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
              borderBottomLeftRadius: 25,
              borderBottomRightRadius: 25,
            }}
            labelStyle={{
              fontSize: 17,
              textAlign: 'left',
              color: 'white',
            }}
            dropDownStyle={{backgroundColor: Constants.textColor1, zindex: 10}}
            onChangeItem={item => {
              onDropdownChange(item.value);
            }}
          />
          <View style={styles.Container}>
            {list.length ? (
              list.map(l => {
                return (
                  <View key={l.id} style={styles.boxSimple}>
                    <View style={styles.boxLeft}>
                      <Text style={styles.textLeft}>{l.subject}</Text>
                    </View>
                    <View style={styles.boxRight}>
                      <TouchableOpacity onPress={openTopic.bind(this, l)}>
                        <Text style={styles.textRight}>
                          {l.count > 1
                            ? l.count + ' Topics'
                            : l.count + ' Topic'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            ) : (
              <View>
                <Text>No Items for Now.</Text>
              </View>
            )}
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
  textLeft: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textRight: {
    color: Constants.textColor1,
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default QuizHome;
