import React from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import ContainerList from '../../../widgets/List/containerList';
import * as Constants from '../../../constants/constants';

const Referral = (props) => {
  return (
    <ContainerList
      title="Referrals"
      onPress={() => props.navigation.navigate('HomeTab')}>
      <ScrollView style={{backgroundColor: 'white'}}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={styles.textField}>Coming very soon.</Text>
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
    fontSize: 14,
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
