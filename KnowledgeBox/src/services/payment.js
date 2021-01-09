import {useState} from 'react';
import RNUpiPayment from 'react-native-upi-payment';

export const upiPayment = (props) => {
    const [status, setStatus] = useState("");
    const [txnId, setTxnId] = useState("");
    const [message, setMessage] = useState("");
    
    const initiatePayment = () => {
        RNUpiPayment.initializePayment({
            vpa: '9782309382@okbizaxis',  		//your upi address like 12345464896@okhdfcbank
            payeeName: 'knowledge box',   			// payee name 
            amount: '1',				//amount
            transactionNote:'KnowledgeBox Test',		//note of transaction
            transactionRef: 'aasf-332-aoei-fn'	//some refs to aknowledge the transaction
        },singleCallback,singleCallback);
    }

    
    const singleCallback = (data) => {
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
};

// export default upiPayment;