/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  StyleSheet,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
  TouchableHighlight,
  KeyboardAvoidingView,
} from 'react-native';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/AntDesign';
import CheckBox from '@react-native-community/checkbox';
import LinearGradient from 'react-native-linear-gradient';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon3 from 'react-native-vector-icons/FontAwesome5';
import * as AsyncStorage from '../../../services/asyncStorage';

import axios from '../../../services/axios';
import PButton from '../../../widgets/Button/pButton';
import * as Constants from '../../../constants/constants';
import UPIPayment from '../../../widgets/Payment/upiPayment';

const VideoHome = (props) => {
  const [list, setList] = useState([]);
  const [category, setCategory] = useState(0);
  const [dropdownList, setDropdownList] = useState([
    {value: 0, label: 'No categories'},
  ]);

  const [user, setUser] = useState(global.user);
  const [editMode, setEditMode] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  const [visible, setVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [objectId, setObjectId] = useState(0);
  const [amount, setAmount] = useState(0);
  const [navBarheight, setNavBarheight] = useState(Dimensions.get('screen').height - Dimensions.get('window').height);

  useEffect(() => {
    onRefresh();
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
      axios
        .get('/video/getAllSubjects', {
          params: {
            selectedCategory: JSON.stringify(global.selectedTopic),
            user: user,
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

  const fetchSubjectList = (categoryId) => {
    axios
      .get('/video/getSubject', {
        params: {
          id: categoryId,
          user: user,
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

  const onDropdownChange = (index) => {
    if (index > 0) {
      fetchSubjectList(index);
    } else {
      fetchAllSubjects();
    }
  };

  const openTopic = (index, evt) => {
    props.navigation.navigate('VideoTopicList', {
      subjectId: index.id,
      title: index.subject,
      user: user,
      catergoryId: index.category,
    });
  };

  const addSubject = (value) => {
    if (value) {
      axios
        .post('/video/addSubject', {
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

  const updateFlags = (id,flag) => {
    const lists = JSON.parse(JSON.stringify(list));
    let index = lists.findIndex(l => l.id == id);
    
    if(flag && index >= 0){
      axios
        .post('/video/postIsPaid', {
          id: id,
          flag: !lists[index].isPaid,
          table: 'subject',
        })
        .then((response) => {
          lists[index].isPaid = !lists[index].isPaid;
          setList(lists);
        })
        .catch((err) => {
          console.log(err);
        });
    }else if( index >= 0){
      axios
        .post('/video/postIsActive', {
          id: id,
          flag: !lists[index].isActive,
          table: 'subject',
        })
        .then((response) => {
          lists[index].isActive = !lists[index].isActive;
          setList(lists);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
   
  const postAmount = useRef(_.debounce((id,amount) => updateAmount(id,amount), 2000)).current;

  const updateAmount = (id,amount) => {
    axios
    .post('/video/postAmount', {
      id: id,
      amount: amount,
      table: 'subject',
    })
    .then((response) => {
    })
    .catch((err) => {
      console.log(err);
    });
  }

  const updateAmountList = (id,amount) => {
      const lists = JSON.parse(JSON.stringify(list));
      let index = lists.findIndex(l => l.id == id);
      lists[index].amount = parseInt(amount);
      setList(lists);
  }

  const deleteSubject = (id) => {
    if (id) {
      axios
        .delete('/video/deleteSubject', {
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

  const openPaymentModal = (id,amount) => {
    if(global.user && global.user.id && parseInt(amount)){
      setObjectId(id);
      setAmount(parseInt(amount));
      setModalVisible(true);
    } else{
      setVisible(true);
    }
  }

  const UPICallback = (flag) => {
    if (flag){
      const lists = JSON.parse(JSON.stringify(list));
      let index = lists.findIndex(l => l.id == objectId);
      lists[index].isBought = flag;
      setList(lists);
    }
  };

  return (
    <KeyboardAvoidingView>
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
                Video
              </Text>
            </View> */}
            <View style={{margin: 20,height: '80%', width: '80%', justifyContent:'center', alignSelf:'center', alignItems: 'center'}}>
              <Image
                ImageResizeMode="stretch"
                source={require('../../../assets/video.png')}
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
                  <View key={l.id} style={styles.parentBox}>
                    {((user && !user.isAdmin || !user) && !l.isActive)? (<View/>):
                    (<View style={styles.parentBox}>
                      <View style={styles.boxSimple}>
                        <View style={styles.boxLeft}>
                          <Text style={styles.textLeft}>{l.subject}</Text>
                        </View>
                        <View style={styles.boxRight} >
                          <TouchableOpacity onPress={openTopic.bind(this, l)}>
                            <Text style={styles.textRight}>
                              {l.count > 1
                                ? l.count + ' Topics'
                                : l.count + ' Topic'}
                            </Text>
                          </TouchableOpacity>
                          {l.amount && l.isPaid && !l.isBought?(
                          <View flexDirection='row' style={{paddingHorizontal: 20,marginTop: 5}}>
                            <View style={{marginRight: 10 }}>
                              <Text style={styles.amount}>
                              {'\u20B9'}{l.amount}
                            </Text>
                            </View>
                            <TouchableOpacity onPress={() => openPaymentModal(l.id, l.amount)}>
                              <View  flexDirection='row'>
                              <Text style={styles.amount,{color:Constants.textColor1, marginRight: 2, textAlignVertical: 'center'}}>
                                Unlock
                              </Text>
                              <Icon
                              name="unlock"
                              style={{color: Constants.textColor1, paddingTop: 2}}
                              size={15}/>
                              </View>
                            </TouchableOpacity>
                          </View>):
                          (<View/>)}
                        </View>
                        {user && user.isAdmin ? (
                          <TouchableOpacity
                            onPress={deleteSubject.bind(this, l.id)}
                            style={{
                              ...styles.icon,
                              position: 'absolute',
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
                      {user && user.isAdmin ? (
                      <View style={styles.boxComplex}> 
                        <View flexDirection='row' alignItems='center'>
                          <CheckBox
                          value={Boolean(l.isActive)}
                            onValueChange={()=>{updateFlags(l.id,false)}}
                          />
                          <Text>Active</Text>
                        </View>
                        <View flexDirection='row' alignItems='center'>
                          <CheckBox
                            value ={Boolean(l.isPaid)}
                            onValueChange={()=>{updateFlags(l.id,true)}}
                          />
                          <Text>Paid</Text>
                          <TextInput
                          textAlign="center"
                          placeholder="Price"
                          onChangeText={val => {updateAmountList(l.id, val); postAmount(l.id,val);}}
                          value = {String(l.amount || 0)}
                          keyboardType='number-pad'
                          style={{
                            borderWidth: 1,
                            borderRadius:5,
                            margin:5,
                            height:40,
                            width:60,
                            fontFamily: 'Roboto-Medium',
                            fontSize: 13,
                          }}
                          />
                          </View>
                      </View> ) : (
                          <View />
                        )}
                      </View>
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
      <UPIPayment modalVisible={modalVisible} objectId={objectId} amount={amount}
      navigation={props.navigation}
      visible={visible} setModalVisible={setModalVisible} setVisible={setVisible}
      callback={UPICallback} callRouteUrl='/video/postPaymentStatus' callRouteTable='subject'
      />
    </KeyboardAvoidingView>
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
    marginTop: 10,
  },
  parentBox:{ width: '100%',},
  boxComplex: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
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
  boxRightInner:{
    flexDirection:'row',
    justifyContent: 'center',
    alignContent: 'space-around',
  },
  boxRightOptions: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  amount:{
    fontSize: 15,
    color:'#14b502',
    fontFamily: 'Roboto-Medium',
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

export default VideoHome;
