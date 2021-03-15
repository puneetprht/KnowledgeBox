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
  TouchableOpacityBase,
} from 'react-native';
import _ from 'lodash';
import Modal from 'react-native-modal';
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

const VideoHome = (props) => {
  const [category, setCategory] = useState(0);
  const [list, setList] = useState([]);
  const [dropdownList, setDropdownList] = useState([
    {value: 0, label: 'No categories'},
  ]);
  const [user, setUser] = useState(global.user);
  const [editMode, setEditMode] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [visible, setVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAmount, setModalAmount] = useState(null);
  
  const [objectId, setObjectId] = useState(null);
  const [coupon, setCoupon] = useState("");
  const [referral, setReferral] = useState("");
  const [couponValid, setCouponValid] = useState(0);
  const [referralValid, setReferralValid] = useState(0);
  const [couponAmount, setCouponAmount] = useState(0);
  const [referralAmount, setReferralAmount] = useState(0);
  const [couponError, setCouponError] = useState(false);
  const [referralError, setReferralError] = useState(false);
  let GobjectId, Gamount = null;

  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = () => {
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

  const unlockItem = (amount) => {
    if(user && user.id && parseInt(amount) > 0){
        Gamount = parseInt(amount);
        initiatePayment(parseInt(amount));
      } else if(user && user.id && parseInt(amount) == 0){
        axios.post('/video/postPaymentStatus', {
          status: 'SUCCESS',
          txnId: 0,
          message: 'Free because of offers.',
          userId: user.id,
          objectId: GobjectId || objectId,
          amount: 0,
          table: 'subject',
          referral: referralValid || 0,
          referralAmount: referralAmount || 0,
          coupon: couponValid || 0,
        })
        .then((response) => {
            const lists = JSON.parse(JSON.stringify(list));
            let index = lists.findIndex(l => l.id == GobjectId);
            lists[index].isBought = true;
            setList(lists);
            setModalVisible(false);
        })
        .catch((err) => {
          console.log(err);
          setModalVisible(false);
        });
      }
  }

  const openPaymentModal = (id,amount) => {
    if(global.user && global.user.id && parseInt(amount)){
      GobjectId = id;
      Gamount = parseInt(amount);
      setObjectId(id);
      setModalVisible(true);
      setModalAmount(parseInt(amount));
      setCoupon("");
      setReferral("");
      setCouponAmount(0);
      setReferralAmount(0);
      setCouponError(false);
      setReferralError(false);
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
      //console.log(data);
      var status = "";
      var txnId = "";
      var message = "";
      //setResp(data);
      if (data['Status']=="SUCCESS" || data['Status']=="Success" || data['Status']=="success" || data['status']=="SUCCESS" || data['status']=="Success" || data['status']=="success"){
          status = "SUCCESS";
          txnId = data['txnId'];
          message = "Succccessfull payment";
      }
      else if (data['Status']=="FAILURE" || data['status']=="FAILURE"){
          status = "FAILURE";
          txnId = data['txnId'] || '';
          message = data['message'];
      }
      else if (data['Status']=="Failed" || data['status']=="Failed"){
          status = "FAILURE";
          txnId = data['txnId'] || '';
          message = 'app closed without payment'; 
      }
      else if(data['Status']=="Submitted"){
          status = "PENDING";
          txnId = data['txnId'] || '';
          message = 'transaction done but pending';
      }
      // any other case than above mentioned
      else{
        status = "FAILURE";
        txnId = data['txnId'] || '';
        message = data['message'];
      }
      axios.post('/video/postPaymentStatus', {
        status: status,
        txnId: txnId,
        message: message,
        userId: user.id,
        objectId: GobjectId || objectId,
        amount: finalAmount(modalAmount, couponAmount),
        table: 'subject',
        referral: referralValid || 0,
        referralAmount: referralAmount || 0,
        coupon: couponValid || 0,
      })
      .then((response) => {
        //console.log("In success", response);
        if( response.data.status && response.data.status == 'SUCCESS'){
          const lists = JSON.parse(JSON.stringify(list));
          let index = lists.findIndex(l => l.id ==  GobjectId || objectId);
          lists[index].isBought = true;
          setList(lists);
        }
        setModalVisible(false);
      })
      .catch((err) => {
        console.log(err);
        setModalVisible(false);
      });
  };

  const verifyCode = (codeType, codeValue) => {
    if(codeType === 'referral'){
      setReferralValid(0);
    }else if(codeType === 'coupon'){
      setCouponValid(0);
      setCouponAmount(0);
    }
    if (codeValue && codeValue !== user.ref) {
      axios
        .get('/user/' + codeType, {
          params: {
            code: codeValue,
          },
        })
        .then((response) => {
          //console.log(response.data);
          if(response && response.data){
            if(response.data.type == 'referral'){
              setReferralValid(response.data.id);
              /*if(response.data.isPercent == 1){
                setReferralAmount(parseInt(modalAmount * response.data.percent / 100));
              } else {
                //console.log(parseInt(response.data.amount));
                setReferralAmount(parseInt(response.data.amount));
              }*/
            } else if(response.data.type == 'coupon') {
              setCouponValid(response.data.id);
              if(response.data.isPercent == 1){
                setCouponAmount(parseInt(modalAmount * response.data.percent / 100));
              } else {
                setCouponAmount(parseInt(response.data.amount));
              }
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const finalAmount = (amount, coupon) => {
    if(parseInt(amount) > parseInt(coupon)){
      return parseInt(amount) - parseInt(coupon);
    }
    return 0;
  }

  return (
    <KeyboardAvoidingView>
      <ScrollView
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
      <Modal
      isVisible={modalVisible}
      avoidKeyboard={true}
      onBackdropPress={()=>{setModalVisible(false)}}
      >
      <View style={styles.centeredView}>
          <View style={{marginVertical: 20,
            backgroundColor: "white",
            borderRadius: 20,
            paddingVertical:20, 
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5}}>
            <Text
              style={{
                textAlign: 'center',
                fontFamily: 'Roboto-Medium',
                fontSize: 18,
                color: Constants.textColor2,
                marginBottom: 15,
              }}>
                Checkout
            </Text>
            <TextInput
              label="Coupon Code"
              mode="outlined"
              maxLength={40}
              placeholder="Enter Coupon Code"
              value={coupon}
              style={styles.text}
              theme={{colors: {primary: 'blue'}}}
              onChangeText={(text) => {
                setCoupon(text);
              }}
            />
            {couponValid > 0 ? (<Text
                style={{
                textAlign: 'center',
                fontFamily: 'Roboto-Medium',
                fontSize: 15,
                color: Constants.success,
                }}>
                Coupon code applied, Discount of {'\u20B9'}{couponAmount}
                </Text>) : (<View/>)}
            <TouchableHighlight
              style={styles.openButton}
              onPress={() => {
                verifyCode("coupon", coupon);
              }}
            >
              <Text style={styles.textStyle}>Apply</Text>
            </TouchableHighlight>
            <TextInput
              label="Referral Code"
              mode="outlined"
              maxLength={40}
              placeholder="Enter Referral Code"
              value={referral}
              style={styles.text}
              theme={{colors: {primary: 'blue'}}}
              onChangeText={(text) => {
                setReferral(text);
              }}
            />
            {referralValid > 0 ? (<Text
                style={{
                textAlign: 'center',
                fontFamily: 'Roboto-Medium',
                fontSize: 15,
                color: Constants.success,
                }}>
                Referral code applied!
                </Text>) : (<View/>)}
            <TouchableHighlight
              style={styles.openButton}
              onPress={() => {
                verifyCode("referral", referral);
              }}
            >
              <Text style={styles.textStyle}>Apply</Text>
            </TouchableHighlight>
            <View>
                {modalAmount === finalAmount(modalAmount, couponAmount) ? (<Text
                style={{
                textAlign: 'center',
                fontFamily: 'Roboto-Medium',
                fontSize: 35,
                color: Constants.textColor2,
                marginBottom: 20,
                }}>
                {'\u20B9'}{modalAmount}
                </Text>) : (<View>
                  <Text
                style={{
                textAlign: 'center',
                fontFamily: 'Roboto-Medium',
                fontSize: 18,
                color: Constants.textColor2,
                textDecorationLine: 'line-through',
                textDecorationStyle: 'double',
                marginBottom: 5,
                }}>
                {'\u20B9'}{modalAmount}
                </Text>
                <Text
                style={{
                textAlign: 'center',
                fontFamily: 'Roboto-Medium',
                fontSize: 35,
                color: Constants.success,
                marginBottom: 20,
                }}>
                {'\u20B9'}{finalAmount(modalAmount, couponAmount)}
                </Text>
                </View>)
                }
                <PButton
                  title="Pay"
                  onPress={() => unlockItem(finalAmount(modalAmount, couponAmount))}
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
          </View>
        </View>
      </Modal>
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
  centeredView: {
    flex: 1,
    //width: Dimensions.get('window').width,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding:50,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "white",
    padding: 10,
  },
  textStyle: {
    color: Constants.textColor2,
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  text: {
    marginTop: 10,
    marginHorizontal:10,
    width: Dimensions.get('window').width * 0.8,
    color: Constants.textColor2,
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    borderWidth: 1,
    borderColor: Constants.textColor2,
    borderRadius: 5,
  }
});

export default VideoHome;
