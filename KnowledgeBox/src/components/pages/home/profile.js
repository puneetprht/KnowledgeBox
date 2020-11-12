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

const Profile = (props) => {
  return (
    <ContainerList
      title="My Profile"
      onPress={() => props.navigation.navigate('HomeTab')}>
      <ScrollView style={{backgroundColor: 'white'}}>
        <View style={styles.container}>
          <Image
            source={require('../../../assets/avatar.jpg')}
            style={{
              alignSelf: 'center',
              width: 100,
              height: 100,
              marginTop: 10,
            }}
          />
        </View>
        <View style={styles.containerText}>
          <Text style={styles.textField}>First Name:</Text>
          <Text style={styles.textObject}>
            {global.user.firstName || global.user.firstname}
          </Text>
        </View>
        <View style={styles.containerText}>
          <Text style={styles.textField}>Last Name:</Text>
          <Text style={styles.textObject}>
            {global.user.lastName || global.user.lastname}
          </Text>
        </View>
        <View style={styles.containerText}>
          <Text style={styles.textField}>Email Id:</Text>
          <Text style={styles.textObject}>{global.user.email}</Text>
        </View>
        <View style={styles.containerText}>
          <Text style={styles.textField}>Phone Number:</Text>
          <Text style={styles.textObject}>
            {global.user.phone ||
              global.user.phoneNumber ||
              global.user.phonenumber}
          </Text>
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
  },
  textObject: {
    marginTop: 5,
    color: Constants.textColor1,
    fontFamily: 'Roboto-Medium',
    fontSize: 18,
  },
});

export default Profile;
