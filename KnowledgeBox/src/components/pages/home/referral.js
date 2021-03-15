import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import axios from '../../../services/axios';
import * as Constants from '../../../constants/constants';
import Clipboard from '@react-native-community/clipboard';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ContainerList from '../../../widgets/List/containerList';

const Referral = (props) => {
  const [user, setUser] = useState(global.user);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = () => {
    if (user.id || user.hmy) {
      axios
        .get('/user/refreshUser', {
          params: {
            id: user.id || user.hmy, 
          },
        })
        .then((response) => {
          if (response.data) {
            setUser(response.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const copyToClipboard = () => {
    Clipboard.setString(user.referralCode);
  }

  return (
    <ContainerList
      title="Referrals"
      onPress={() => props.navigation.navigate('HomeTab')}>
      <ScrollView style={{backgroundColor: 'white'}}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{textAlign: 'center',
                fontFamily: 'Roboto-Medium',
                fontSize: 14,
                color: Constants.textColor1,
                marginVertical: 5,
                }}>Your referral code is:</Text>
          <View flexDirection='row'>
            <Text style={{textAlign: 'center',
                fontFamily: 'Roboto-Medium',
                fontSize: 18,
                color: Constants.textColor1,
                marginVertical: 5,
                }}>{user.referralCode}
            </Text>
            <TouchableOpacity onPress={() => copyToClipboard()}>
              <Icon
                              name="content-copy"
                              style={{color: Constants.textColor2, paddingTop: 2, marginHorizontal: 5,marginVertical: 10,}}
                              size={20}/>
            </TouchableOpacity>
            </View>
            <Text style={{textAlign: 'center',
                  fontFamily: 'Roboto-Medium',
                  fontSize: 14,
                  color: Constants.textColor1,
                  marginTop: 10,
                  marginVertical: 5,
                  }}>Your wallet balance is:</Text>
            <View flexDirection='row'>
              <Text style={{textAlign: 'center',
                  fontFamily: 'Roboto-Medium',
                  fontSize: 24,
                  color: Constants.success,
                  marginVertical: 5,
                  }}>{'\u20B9'}{user.walletAmount}
              </Text>
            </View>
          </View>
      </ScrollView>
    </ContainerList>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  containerText: {marginTop: 15, marginLeft: 15},
  textField: {
    color: Constants.textColor1,
    fontFamily: 'Roboto-Medium',
    fontSize: 13,
    textAlign: 'center',
  },
  textObject: {
    marginTop: 5,
    color: Constants.textColor1,
    fontFamily: 'Roboto-Medium',
    fontSize: 18,
  },
});

export default Referral;
