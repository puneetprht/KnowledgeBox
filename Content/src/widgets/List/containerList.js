import React from 'react';
import {View, Image, Text, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
//import * as Constants from '../../../constants/constants';

const ContainerList = props => {
  return (
    <View>
      <View
        style={{
          height: Dimensions.get('window').height * 0.08,
          backgroundColor: '#e6f7ea',
        }}
        flexDirection="row">
        <Icon
          name={'chevron-left'}
          size={30}
          style={{
            marginLeft: 10,
            justifyContent: 'center',
            position: 'absolute',
          }}
        />
        <Text
          style={{
            textAlign: 'center',
            textAlignVertical: 'center',
            flex: 1,
            fontSize: 30,
          }}>
          {props.title}
        </Text>
      </View>
      <View style={{height: Dimensions.get('window').height * 0.92}}>
        {props.children}
      </View>
    </View>
  );
};

export default ContainerList;
