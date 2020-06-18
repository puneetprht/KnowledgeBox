/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React from 'react';
import {View, Text, Dimensions, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
//import * as Constants from '../../../constants/constants';

const ContainerList = props => {
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
              fontSize: 30,
            }}>
            {props.title}
          </Text>
          <View style={{position: 'absolute', paddingLeft: 15}}>
            <TouchableOpacity onPress={props.iconPress}>
              <Icon name="chevron-left" size={35} />
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
