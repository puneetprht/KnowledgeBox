/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React from 'react';
import {View, Text, Dimensions, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
//import * as Constants from '../../../constants/constants';

const ContainerList = (props) => {
  return (
    <View style={{...props.style}}>
      <View
        style={{
          height: Dimensions.get('window').height * 0.07,
          backgroundColor: '#ffffff',
          borderBottomWidth: 1,
          borderBottomColor: '#000000',
        }}
        flexDirection="row">
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text
            style={{
              textAlign: 'center',
              textAlignVertical: 'center',
              flex: 1,
              fontFamily: 'Roboto-Medium',
              color: '#0d4255',
              paddingLeft: 30,
              fontSize: 18,
            }}>
            {props.title}
          </Text>
          <View style={{position: 'absolute', paddingLeft: 12}}>
            <TouchableOpacity onPress={props.onPress}>
              <Icon name="chevron-left" size={25} color={'#0d4255'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={{height: Dimensions.get('window').height * 0.93}}>
        {props.children}
      </View>
    </View>
  );
};

export default ContainerList;
