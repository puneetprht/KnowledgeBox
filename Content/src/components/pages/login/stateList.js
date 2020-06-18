/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import ContainerList from '../../../widgets/List/containerList';
import PButton from '../../../widgets/Button/pButton';

const StateList = () => {
  let states = [
    {id: 1, name: 'Rajasthan'},
    {id: 2, name: 'Kerela'},
    {id: 3, name: 'Bihar'},
    {id: 4, name: 'New Delhi'},
    {id: 5, name: 'India'},
    {id: 6, name: 'Maharashtra'},
    {id: 7, name: 'Gujarat'},
    {id: 8, name: 'Madhya Pradesh'},
    {id: 9, name: 'Karnataka'},
    {id: 10, name: 'Punjab'},
  ];
  return (
    <ContainerList title="Title">
      <ScrollView style={{marginBottom: 50}}>
        <View style={styles.container}>
          {states.map(state => {
            return (
              <View key={state.id} style={styles.boxSimple}>
                <Text>{state.name}</Text>
              </View>
            );
          })}
        </View>
        <PButton
          title="Continue"
          onPress={() => Alert.alert('Simple Button pressed')}
          viewStyle={{
            width: '75%',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
          elementStyle={{flexDirection: 'row', justifyContent: 'center'}}
        />
      </ScrollView>
    </ContainerList>
  );
};

const styles = StyleSheet.create({
  boxSimple: {
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#000',
    marginTop: 10,
    marginLeft: 10,
    height: Dimensions.get('window').width * 0.45,
    width: Dimensions.get('window').width * 0.45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    marginHorizontal: 10,
    marginBottom: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    //justifyContent: 'space-around',
  },
  block: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StateList;
