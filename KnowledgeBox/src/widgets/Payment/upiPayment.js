import React, {useState} from 'react';
import {View,Text,Button} from 'react-native'; 
import RNUpiPayment from 'react-native-upi-payment';
import * as Constants from '../../constants/constants';

const upiPayment = (props) => {
    const [status, setStatus] = useState("");
    const [txnId, setTxnId] = useState("");
    const [message, setMessage] = useState("");
    
    const floo = () => {
        RNUpiPayment.initializePayment({
            //vpa: 'richapurohit468@okicici',  		//your upi address like 12345464896@okhdfcbank
            vpa: '9782309382@okbizaxis',  		//your upi address like 12345464896@okhdfcbank
            payeeName: 'knowledge box',   			// payee name 
            amount: '1',				//amount
            transactionNote:'KnowledgeBox Test',		//note of transaction
            transactionRef: 'aasf-332-aoei-fn'	//some refs to aknowledge the transaction
        },successCallback,failureCallback);
    }
    
    const successCallback = (data) => {
        console.log("Success:",data);
        setStatus("SUCCESS");
        setTxnId(data['txnId']);
        setMessage("Succccessfull payment");
    }

    
    const failureCallback = (data) => {
        console.log("Failure:",data);

        if (data['Status']=="SUCCESS" || data['Status']=="Success" || data['Status']=="success" || data['status']=="SUCCESS" || data['status']=="Success" || data['status']=="success"){
            setStatus("SUCCESS");
        setTxnId(data['txnId']);
        setMessage("Succccessfull payment");
        }
        else if (data['Status']=="FAILURE" || data['status']=="FAILURE"){
            setStatus("FAILURE");
            setMessage(data['message']);
        }
        // // in case of googlePay
        // else if (data['Status']=="FAILURE"){
        //     setStatus("FAILURE");
        //     setMessage('app closed without doing payment');
        // }
        // in case of phonepe
        else if (data['Status']=="Failed" || data['status']=="Failed"){
            setStatus("FAILURE");
            setMessage('app closed without doing payment');
        }
        // in case of phonepe
        else if(data['Status']=="Submitted"){
            setStatus("FAILURE");
            setTxnId(data['txnId']);
            setMessage('transaction done but pending');
        }
        // any other case than above mentioned
        else{
            setStatus("FAILURE");
            setMessage(data['message']);
        }
    }
  return (
    
    <View style={{alignItems:"center",justifyContent:"center",flex:1}}>
    <View style={{flexDirection:'row',padding:5}}>
        <Button
        title="Pay Now"
        onPress={() => {floo()}}
        />
    </View>

    <Text>{status+" "+txnId}</Text>
    <Text>{message}</Text>
    </View>
  );
};

export default upiPayment;