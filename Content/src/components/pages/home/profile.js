import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import ContainerList from '../../../widgets/List/containerList';

const Profile = props => {
  return (
    <ContainerList
      title="My Profile"
      onPress={() => props.navigation.navigate('HomeTab')}>
      <View style={styles.container}>
        <Text>Profile Screen</Text>
        <Button title="Click Here" onPress={() => alert('Button Clicked!')} />
      </View>
    </ContainerList>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Profile;
