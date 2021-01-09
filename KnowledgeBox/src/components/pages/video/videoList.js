/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import _ from 'lodash';
import axios from '../../../services/axios';
import { Snackbar } from 'react-native-paper';
import RNUpiPayment from 'react-native-upi-payment';
import Icon from 'react-native-vector-icons/Feather';
import PButton from '../../../widgets/Button/pButton';
import Icon2 from 'react-native-vector-icons/AntDesign';
import CheckBox from '@react-native-community/checkbox';
import LinearGradient from 'react-native-linear-gradient';
import DropDownPicker from 'react-native-dropdown-picker';
import * as Constants from '../../../constants/constants';
import Icon3 from 'react-native-vector-icons/FontAwesome5';
import * as PaymentInfo from '../../../constants/paymentInfo';
import ContainerList from '../../../widgets/List/containerList';

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
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState("");
  const [txnId, setTxnId] = useState("");
  const [message, setMessage] = useState("");
  let GobjectId, Gamount = null;

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
          user: user,
        },
      })
      .then((response) => {
        //console.log(response.data);
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

  const updateFlags = (id,flag) => {
    const lists = JSON.parse(JSON.stringify(list));
    let index = lists.findIndex(l => l.id == id);
    
    if(flag && index >= 0){
      axios
        .post('/video/postIsPaid', {
          id: id,
          flag: !lists[index].isPaid,
          table: 'video',
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
          table: 'video',
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
      table: 'video',
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
  const unlockItem = (id,amount) => {
    if(user && user.id && parseInt(amount)){
      GobjectId = id;
      Gamount = amount;
      initiatePayment(parseInt(amount));
    } else{
      setVisible(true);
    }
  }

  const initiatePayment = (amount) => {
    RNUpiPayment.initializePayment({
        vpa: PaymentInfo.vpa,  		//your upi address like 12345464896@okhdfcbank
        payeeName: PaymentInfo.payeeName,   			// payee name 
        amount: amount,				//amount
        transactionNote:'KnowledgeBox Content',		//note of transaction
        transactionRef: 'aasf-332-aoei-fn'	//some refs to aknowledge the transaction
    },singleCallback,singleCallback);
  }

  const singleCallback = (data) => {
    console.log(data);
      if (data['Status']=="SUCCESS" || data['Status']=="Success" || data['Status']=="success" || data['status']=="SUCCESS" || data['status']=="Success" || data['status']=="success"){
          setStatus("SUCCESS");
          setTxnId(data['txnId']);
          setMessage("Succccessfull payment");
      }
      else if (data['Status']=="FAILURE" || data['status']=="FAILURE"){
          setStatus("FAILURE");
          setMessage(data['message']);
      }
      // in case of phonepe
      else if (data['Status']=="Failed" || data['status']=="Failed"){
          setStatus("FAILURE");
          setMessage('app closed without doing payment');
      }
      // in case of phonepe
      else if(data['Status']=="Submitted"){
          setStatus("PENDING");
          setTxnId(data['txnId']);
          setMessage('transaction done but pending');
      }
      // any other case than above mentioned
      else{
          setStatus("FAILURE");
          setMessage(data['message']);
      }
      axios.post('/video/postPaymentStatus', {
        status: status,
        txnId: txnId,
        message: message,
        userId: user.id,
        objectId: GobjectId,
        amount: Gamount,
        table: 'video'
      })
      .then((response) => {
        if(status == 'SUCCESS'){
          const lists = JSON.parse(JSON.stringify(list));
          let index = lists.findIndex(l => l.id == GobjectId);
          lists[index].isBought = true;
          setList(lists);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const allowOrNot = (l) => {
    if(((l.isPaid && l.amount && !l.isBought) ||
        (l.isParentPaid && l.parentAmount && !l.isParentBought) || 
        (l.isSuperParentPaid && l.superParentAmount && !l.isSuperParentBought)) && 
        (user && !user.isAdmin || !user))
        {
        return true;
    }
    else{
      return false;
    }
  }

  return (
    <ContainerList
      title={title + ' videos'}
      onPress={() => props.navigation.goBack()}>
      <KeyboardAvoidingView>
      <ScrollView
        style={{marginBottom: 30}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.Container}>
        {list.length ? (
              list.map((l) => {
                return (
                  <View key={l.id} style={styles.parentBox}>
                    {((user && !user.isAdmin || !user) && !l.isActive)? (<View/>):
                    (<View style={styles.parentBox}>
                      <View style={styles.boxSimple}>
                        <View style={styles.boxLeft}>
                          <Text style={styles.textLeft}>{l.value}</Text>
                        </View>
                        <View style={styles.boxRight}>
                          <PButton
                            title={ allowOrNot(l) ?"Locked":"Watch"}
                            disable={allowOrNot(l)  }
                            onPress={openDetail.bind(this, l)}
                            viewStyle={styles.button,{backgroundColor: allowOrNot(l) ? '#5aa0ff' : Constants.textColor1}}
                            textStyle={{fontFamily: 'Roboto-Medium', fontSize: 15}}
                            elementStyle={{
                              flexDirection: 'row',
                              justifyContent: 'center',
                            }}
                          />
                          {l.amount && l.isPaid && !l.isBought?(
                                  <View flexDirection='row' style={{paddingHorizontal: 20,marginTop: 5, paddingTop:3}}>
                                    <View style={{marginRight: 10 }}>
                                      <Text style={styles.amount}>
                                      {'\u20B9'}{l.amount}
                                    </Text>
                                    </View>
                                    <TouchableOpacity onPress={() => unlockItem(l.id, l.amount)}>
                                      <View  flexDirection='row'>
                                      <Text style={styles.amount,{color:Constants.textColor1, marginRight: 2, textAlignVertical: 'center'}}>
                                        Unlock
                                      </Text>
                                      <Icon3
                                      name="unlock-alt"
                                      style={{color: Constants.textColor1, paddingTop: 2}}
                                      size={15}/>
                                      </View>
                                    </TouchableOpacity>
                                  </View>):
                                  (<View/>)}
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
                  </View>);
        })) : 
        (<View>
            <Text>No Items for Now.</Text>
          </View>
        )}
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
      <Snackbar
            visible={visible}
            onDismiss={() => setVisible(false)}
            style={{backgroundColor:Constants.error}}
            action={{
              label: 'Sign-in',
              onPress: () => {
                setVisible(false);
                props.navigation.replace('Auth', {screen: 'AuthPage'});
              },
            }}
            >
            Please sign-in to unlock.
      </Snackbar>
      </KeyboardAvoidingView>
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
  parentBox:{ width: '100%',},
  boxComplex: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
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
  boxRightInner:{
    flexDirection:'row',
    justifyContent: 'center',
    alignContent: 'space-around',
  },
  boxRightOptions: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
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
    borderRadius: 5,
  },
  icon: {
    padding: 10,
    borderRadius: 100,
  },
  button: {
    paddingHorizontal: 10,
    borderRadius: 25,
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default VideoList;
