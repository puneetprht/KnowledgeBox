/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
} from 'react-native';
import Modal from 'react-native-modal';
import { Snackbar } from 'react-native-paper';
import RNUpiPayment from 'react-native-upi-payment';
import RazorpayCheckout from 'react-native-razorpay';

import axios from '../../services/axios';
import PButton from '../Button/pButton';
import * as Constants from '../../constants/constants';
import * as PaymentInfo from '../../constants/paymentInfo';

const UPIPayment = (props) => {
  const [user, setUser] = useState(global.user);

  const [modalAmount, setModalAmount] = useState(null);
  
  const [coupon, setCoupon] = useState("");
  const [couponValid, setCouponValid] = useState(0);
  const [couponAmount, setCouponAmount] = useState(0);
  const [couponChecked, setCouponChecked] = useState(false);
  
  const [referral, setReferral] = useState("");
  const [referralAmount, setReferralAmount] = useState(0);
  const [referralValid, setReferralValid] = useState(0);
  const [referralChecked, setReferralChecked] = useState(false);

  useEffect(() => {
      if(props.modalVisible){
        console.log('Wallet balance:', user)
        setModalAmount(props.amount);

        setCoupon("");
        setCouponValid(0);
        setCouponAmount(0);
        setCouponChecked(false);

        setReferral("");
        setReferralValid(0);
        setReferralAmount(0);
        setReferralChecked(false);
      }
      return () => {
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.modalVisible]);

  const unlockItem = (amount) => {
    if(user && user.id && amount > 0){
        initiatePayment(amount);
    } else if(user && user.id && amount == 0){
        postPayment('SUCCESS',0,'Free because of offers.',0)
    }
  }

  const initiatePayment = (amount) => {
    // RNUpiPayment.initializePayment({
    //     vpa: PaymentInfo.vpa,  		//your upi address like 12345464896@okhdfcbank
    //     payeeName: PaymentInfo.payeeName,   			// payee name 
    //     amount: amount,				//amount
    //     transactionNote:'KnowledgeBox Course.',		//note of transaction
    //     transactionRef: 'aasf-332-aoei-fn'	//some refs to aknowledge the transaction
    // },paymentCallback,paymentCallback);
    if (amount >= 1) {
      var options = {
        description: 'Knowledge Box course',
        image: 'https://kb2022.s3-ap-south-1.amazonaws.com/Images/quiz/maybeLast.png',
        currency: 'INR',
        key: PaymentInfo.razorId, // Your api key
        amount: amount * 100,
        name: 'Knowledge Box',
        prefill: {
          email: user.email,
          contact: user.phone,
          name: user.firstname + ' ' + user.lastname,
        },
        // prefill: {
        //   email: user.email,
        //   contact: user.phone,
        //   name: user.firstname + ' ' + user.lastname,
        // }
        theme: {color: Constants.textColor1},
      };
  
      RazorpayCheckout.open(options).then((data) => {
        //console.log("Success: ", data);
        postPayment("SUCCESS", data.razorpay_payment_id, "All Good Razor.", finalAmount(modalAmount, couponAmount))
      }).catch((error) => {
        postPayment("FAILURE", error.code, error.description, finalAmount(modalAmount, couponAmount));
        //alert(`Error: ${error.code} | ${error.description}`);
      });
    } else {
      postPayment("SUCCESS", 'AutoPay', 'AutoApprove', 0);
    }
  }
  
  const paymentCallback = (data) => {
    var status = "";
    var txnId = "";
    var message = "";
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
    else{
      status = "FAILURE";
      txnId = data['txnId'] || '';
      message = data['message'];
    }
    postPayment(status, txnId, message, finalAmount(modalAmount, couponAmount))
  }

  const postPayment = (objStatus, objTxnId, objMessage, objAmount) => {
    axios.post(props.callRouteUrl, {
      status: objStatus,
      txnId: objTxnId,
      message: objMessage,
      userId: user.id,
      objectId: props.objectId,
      amount: objAmount,
      table: props.callRouteTable,
      referral: referralValid || 0,
      referralAmount: referralAmount || 0,
      coupon: couponValid || 0,
    })
    .then((response) => {
      console.log("statue: ", objStatus);
        props.callback(objStatus == "SUCCESS" ? true : false);
        props.setModalVisible(false);
    })
    .catch((err) => {
      console.log(err);
      props.setModalVisible(false);
    });
  }

  const verifyCode = (codeType, codeValue) => {
    if(codeType === 'referral'){
      setReferralValid(0);
    }else if(codeType === 'coupon'){
      setCouponValid(0);
      setCouponAmount(0);
    }
    if (codeValue && codeValue !== user.ref) {
      axios.get('/user/' + codeType, {
        params: {
          code: codeValue,
        },
      })
      .then((response) => {
        if(response && response.data){
          if(response.data.type == 'referral'){
            setReferralValid(response.data.id);
            setReferralChecked(true);
          } 
          else if(response.data.type == 'coupon') {
            setReferralChecked(true);
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
    <View>
		<Modal
		isVisible={props.modalVisible}
		avoidKeyboard={true}
		onBackdropPress={()=>{props.setModalVisible(false)}}
		>
		    <View style={styles.centeredView}>
		        <View style={styles.modalView}>
		            <Text style={styles.modalHeader}>
		                Checkout
		            </Text>
		            <TextInput
		                label="Coupon Code"
		                mode="outlined"
		                maxLength={40}
		                placeholder="Enter Coupon Code"
		                value={coupon}
		                style={styles.textInput}
		                theme={{colors: {primary: 'blue'}}}
		                onChangeText={(text) => {
		                      setCoupon(text);
		                }}
		            />
		            {couponValid > 0 ? (
		                <Text
		                    style={{
		                    textAlign: 'center',
		                    fontFamily: 'Roboto-Medium',
		                    fontSize: 15,
		                    color: Constants.success,
		                    }}>
		                    Coupon code applied, Discount of {'\u20B9'}{couponAmount}
		                </Text>
		                ) : (<View/>)
		            }
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
		                style={styles.textInput}
		                theme={{colors: {primary: 'blue'}}}
		                onChangeText={(text) => {
		                    setReferral(text);
		                }}
		            />
		            {referralValid > 0 ? (
		            	<Text
		            		style={{
		            		textAlign: 'center',
		            		fontFamily: 'Roboto-Medium',
		            		fontSize: 15,
		            		color: Constants.success,
		            		}}>
		            			Referral code applied!
		            	</Text>) : (<View/>)
					}
					<TouchableHighlight
					  style={styles.openButton}
					  onPress={() => {
					    verifyCode("referral", referral);
					  }}
					>
						<Text style={styles.textStyle}>Apply</Text>
					</TouchableHighlight>
				  	<View>
				  	  	{modalAmount === finalAmount(modalAmount, couponAmount) ? (
				  	  	  	<Text style={styles.beforeDiscount}>
				  	  	  	    {'\u20B9'}{modalAmount}
				  	  	  	</Text>
				  	  	) : (
				  	  	<View>
				  	  	  	<Text style={styles.discountAmount}>
				  	  	  		{'\u20B9'}{modalAmount}
				  	  	  	</Text>
				  	  	  	<Text style={styles.amountAfterDiscount}>
				  	  	  		{'\u20B9'}{finalAmount(modalAmount, couponAmount)}
				  	  	  	</Text>
				  	  	</View>
				  	  	)}
				  	  	<PButton
				  	  	  title="Pay"
				  	  	  onPress={() => unlockItem(finalAmount(modalAmount, couponAmount))}
				  	  	  viewStyle={styles.payButton}
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
		      visible={props.visible}
		      onDismiss={() => props.setVisible(false)}
		      style={{backgroundColor: Constants.error}}
		      action={{
		        label: 'Sign-in',
		        onPress: () => {
		          props.setVisible(false);
		          props.replace('Auth', {screen: 'AuthPage'});
		        },
		      }}
		      >
		      Please sign-in to unlock.
		</Snackbar>
	</View>
  );
};


const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 20
    },
    modalView: {
        marginVertical: 20,
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
        elevation: 5
    },
    modalHeader:{
        textAlign: 'center',
        fontFamily: 'Roboto-Medium',
        fontSize: 18,
        color: Constants.textColor2,
        marginBottom: 15,
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
    textInput: {
        marginTop: 10,
        marginHorizontal:10,
        width: Dimensions.get('window').width * 0.8,
        color: Constants.textColor2,
        fontFamily: 'Roboto-Medium',
        fontSize: 14,
        borderWidth: 1,
        borderColor: Constants.textColor2,
        borderRadius: 5,
    },
    payButton: {
        width: '65%',
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    beforeDiscount: {
        textAlign: 'center',
        fontFamily: 'Roboto-Medium',
        fontSize: 35,
        color: Constants.textColor2,
        marginBottom: 20,
    },
    discountAmount: {
        textAlign: 'center',
        fontFamily: 'Roboto-Medium',
        fontSize: 18,
        color: Constants.textColor2,
        textDecorationLine: 'line-through',
        textDecorationStyle: 'double',
        marginBottom: 5,
    },
    amountAfterDiscount: {
        textAlign: 'center',
        fontFamily: 'Roboto-Medium',
        fontSize: 35,
        color: Constants.success,
        marginBottom: 20,
    }
  });
  
  export default UPIPayment;